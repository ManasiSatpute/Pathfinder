class MapHandler {
    constructor(containerId) {
        // Pune coordinates
        this.map = L.map(containerId).setView([18.5204, 73.8567], 13);
        
        // CartoDB Positron base layer for cleaner background (good for highlighting paths)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap © CartoDB'
        }).addTo(this.map);

        this.graph = {}; // Adjacency list
        this.nodes = new Map(); // id -> { lat, lng }
        this.edgesLayer = L.layerGroup().addTo(this.map);
        this.nodesLayer = L.layerGroup().addTo(this.map);
        this.pathsLayer = L.layerGroup().addTo(this.map);
        this.markersLayer = L.layerGroup().addTo(this.map);

        this.sourceNode = null;
        this.destNode = null;
        
        this.onPointsSelected = null; // Callback for UI
        
        this.map.on('click', (e) => this._handleMapClick(e));
        
        // Delay graph generation slightly so map renders first
        this.map.whenReady(() => {
            setTimeout(() => this.generateGraph(5000), 100); // 5000 nodes for dense enough graph
        });
    }

    generateGraph(numNodes) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.classList.remove('hidden');
        
        // Non-blocking timeout to allow UI paint
        setTimeout(() => {
            const bounds = this.map.getBounds();
            const minLat = bounds.getSouthWest().lat;
            const maxLat = bounds.getNorthEast().lat;
            const minLng = bounds.getSouthWest().lng;
            const maxLng = bounds.getNorthEast().lng;

            this.nodes.clear();
            this.graph = {};
            this.edgesLayer.clearLayers();
            this.nodesLayer.clearLayers();
            this.pathsLayer.clearLayers();

            const nodeArray = [];
            for (let i = 0; i < numNodes; i++) {
                const lat = minLat + Math.random() * (maxLat - minLat);
                const lng = minLng + Math.random() * (maxLng - minLng);
                const id = `node_${i}`;
                const node = { id, lat, lng };
                
                this.nodes.set(id, node);
                nodeArray.push(node);
                this.graph[id] = [];
            }

            // Connect nodes geographically
            // In a dense grid, we link to a few nearest nodes to simulate roads
            const maxConnectionDist = 0.015; // Rough filter (degrees)
            
            for (let i = 0; i < nodeArray.length; i++) {
                const n1 = nodeArray[i];
                const distances = [];
                for (let j = 0; j < nodeArray.length; j++) {
                    if (i === j) continue;
                    const n2 = nodeArray[j];
                    
                    // Simple euclidean diff for fast filtering
                    const dLat = n1.lat - n2.lat;
                    const dLng = n1.lng - n2.lng;
                    if (Math.abs(dLat) < maxConnectionDist && Math.abs(dLng) < maxConnectionDist) {
                        const d = Math.sqrt(dLat*dLat + dLng*dLng);
                        distances.push({ target: n2.id, _d: d, weight: d * 111000 }); // rough meters
                    }
                }
                
                // Sort by distance and connect to top K nearest
                distances.sort((a,b) => a._d - b._d);
                const connections = distances.slice(0, 8); // Try max 8 edges = relatively dense
                
                for (const conn of connections) {
                    this.graph[n1.id].push({ target: conn.target, weight: conn.weight });
                }
            }
            
            this._drawGraphSample(nodeArray);
            
            if (overlay) overlay.classList.add('hidden');
        }, 50);
    }

    _drawGraphSample(nodeArray) {
        // Draw a light sample of nodes so user knows it's a generated grid
        const sampleSize = Math.min(nodeArray.length, 1000);
        for(let i=0; i < sampleSize; i++) {
            L.circle([nodeArray[i].lat, nodeArray[i].lng], {
                radius: 12,
                color: '#666',
                weight: 0,
                fillOpacity: 0.15
            }).addTo(this.nodesLayer);
        }
    }

    _handleMapClick(e) {
        if (!this.nodes.size) return;

        // Find closest node to click
        let closestId = null;
        let minD = Infinity;
        for (const [id, node] of this.nodes.entries()) {
            const d = Math.pow(node.lat - e.latlng.lat, 2) + Math.pow(node.lng - e.latlng.lng, 2);
            if (d < minD) {
                minD = d;
                closestId = id;
            }
        }

        if (!this.sourceNode) {
            this.sourceNode = closestId;
            this._updateMarkers();
            document.getElementById('sourceStatus').innerText = 'Selected';
        } else if (!this.destNode && closestId !== this.sourceNode) {
            this.destNode = closestId;
            this._updateMarkers();
            document.getElementById('destStatus').innerText = 'Selected';
            
            if (this.onPointsSelected) {
                this.onPointsSelected(this.sourceNode, this.destNode, this.graph);
            }
        }
    }

    _updateMarkers() {
        this.markersLayer.clearLayers();
        if (this.sourceNode) {
            const n = this.nodes.get(this.sourceNode);
            L.circleMarker([n.lat, n.lng], { radius: 9, color: '#f59e0b', fillOpacity: 0.8, weight: 2 }).addTo(this.markersLayer)
                .bindPopup('Source Node').openPopup();
        }
        if (this.destNode) {
            const n = this.nodes.get(this.destNode);
            L.circleMarker([n.lat, n.lng], { radius: 9, color: '#8b5cf6', fillOpacity: 0.8, weight: 2 }).addTo(this.markersLayer)
                .bindPopup('Destination Node').openPopup();
        }
    }

    clearPaths() {
        this.pathsLayer.clearLayers();
    }

    clearSelection() {
        this.sourceNode = null;
        this.destNode = null;
        this.markersLayer.clearLayers();
        this.clearPaths();
        document.getElementById('sourceStatus').innerText = 'Not selected';
        document.getElementById('destStatus').innerText = 'Not selected';
    }

    drawPath(pathIds, color, weightOffset = 0, opacity = 0.8) {
        if (!pathIds || pathIds.length < 2) return;
        
        const latlngs = pathIds.map(id => {
            const n = this.nodes.get(id);
            return [n.lat, n.lng];
        });

        const polyline = L.polyline(latlngs, {
            color: color,
            weight: 8 - weightOffset, // Base weight minus offset to stack them visibly
            opacity: opacity,
            lineJoin: 'round',
            lineCap: 'round'
        }).addTo(this.pathsLayer);
        
        this.map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    }
}
