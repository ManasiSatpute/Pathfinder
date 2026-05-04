/**
 * Dijkstra's Algorithm implementation using a Binary Heap.
 * 
 * @param {Object} graph - Adjacency list representation: { nodeId: [{ target: String, weight: Number }] }
 * @param {String} sourceId - ID of starting node
 * @param {String} destId - ID of destination node
 * @returns {Object} { path, distance, time, stats }
 */
function runDijkstraBinary(graph, sourceId, destId) {
    const startTime = performance.now();
    const pq = new BinaryHeap();
    const distances = new Map();
    const previous = new Map();

    sourceId = String(sourceId);
    destId = String(destId);

    // Initialization
    for (const nodeId in graph) {
        distances.set(nodeId, Infinity);
        previous.set(nodeId, null);
        
        if (nodeId === sourceId) {
            pq.insert(nodeId, 0);
            distances.set(nodeId, 0);
        } else {
            pq.insert(nodeId, Infinity);
        }
    }

    // Main loop
    while (!pq.isEmpty()) {
        const minNode = pq.extractMin();
        
        // If the heap is empty or the smallest distance is unreachable, break
        if (!minNode || minNode.dist === Infinity) break;
        
        const u = minNode.id;
        
        // Early exit if destination found
        if (u === destId) break;

        const neighbors = graph[u] || [];
        for (const edge of neighbors) {
            const v = String(edge.target);
            const alt = distances.get(u) + edge.weight;
            
            if (alt < distances.get(v)) {
                distances.set(v, alt);
                previous.set(v, u);
                pq.decreaseKey(v, alt);
            }
        }
    }

    const endTime = performance.now();
    
    // Reconstruct path
    const path = [];
    let current = destId;
    if (previous.get(current) !== null || current === sourceId) {
        while (current !== null) {
            path.unshift(current);
            current = previous.get(current);
        }
    }

    return {
        path: path.length > 1 ? path : (path[0] === sourceId && path.length === 1 ? path : []),
        distance: distances.get(destId),
        time: endTime - startTime,
        stats: pq.stats
    };
}
