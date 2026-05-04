document.addEventListener('DOMContentLoaded', () => {
    // Ensure all data structures exist
    if (typeof BinaryHeap === 'undefined' || typeof BinomialHeap === 'undefined' || typeof FibonacciHeap === 'undefined') {
        console.error("Heaps not initialized properly. Make sure scripts are loading.");
    }

    const mapHandler = new MapHandler('map');
    
    const runBtn = document.getElementById('runBtn');
    const clearBtn = document.getElementById('clearBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // UI Elements
    const cbBinary = document.getElementById('enableBinary');
    const cbBinomial = document.getElementById('enableBinomial');
    const cbFibonacci = document.getElementById('enableFibonacci');

    // Colors matching CSS variables
    const colors = {
        binary: '#3b82f6', // blue
        binomial: '#ef4444', // red
        fibonacci: '#10b981' // green
    };

    mapHandler.onPointsSelected = (source, dest, graph) => {
        runBtn.disabled = false;
        runBtn.classList.add('pulse'); // Optionally add css pulse effect
    };

    clearBtn.addEventListener('click', () => {
        mapHandler.clearSelection();
        runBtn.disabled = true;
        runBtn.classList.remove('pulse');
        resetTable();
    });

    runBtn.addEventListener('click', () => {
        if (!mapHandler.sourceNode || !mapHandler.destNode) return;
        
        const source = mapHandler.sourceNode;
        const dest = mapHandler.destNode;
        const graph = mapHandler.graph;

        mapHandler.clearPaths();
        
        // Show loading spinner
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.remove('hidden');
        overlay.querySelector('p').innerText = "Computing Shortest Paths...";
        
        // Run calculations inside a small timeout to allow UI to paint the loading screen
        setTimeout(() => {
            try {
                if (cbBinary.checked) {
                    const res = runDijkstraBinary(graph, source, dest);
                    updateTable('Binary', res);
                    // Blue is base layer, thickest
                    mapHandler.drawPath(res.path, colors.binary, 0, 0.4); 
                } else {
                    hideRow('Binary');
                }

                if (cbBinomial.checked) {
                    const res = runDijkstraBinomial(graph, source, dest);
                    updateTable('Binomial', res);
                    // Red is mid layer
                    mapHandler.drawPath(res.path, colors.binomial, 3, 0.7); 
                } else {
                    hideRow('Binomial');
                }

                if (cbFibonacci.checked) {
                    const res = runDijkstraFibonacci(graph, source, dest);
                    updateTable('Fibonacci', res);
                    // Green is top layer, thinnest
                    mapHandler.drawPath(res.path, colors.fibonacci, 5, 1.0); 
                } else {
                    hideRow('Fibonacci');
                }
            } catch (err) {
                console.error("Error running algorithm:", err);
                alert("An error occurred during calculation. Check console for details.");
            }

            overlay.classList.add('hidden');
        }, 50);
    });

    darkModeToggle.addEventListener('click', () => {
        const body = document.body;
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            darkModeToggle.innerText = '🌙 Dark Mode';
        } else {
            body.setAttribute('data-theme', 'dark');
            darkModeToggle.innerText = '☀️ Light Mode';
        }
    });

    function updateTable(algo, res) {
        document.getElementById(`row${algo}`).classList.remove('hidden');
        
        // Time in ms
        document.getElementById(`time${algo}`).innerText = res.time.toFixed(2) + ' ms';
        
        // Calculate Distance in km (weight currently in meters)
        let distanceKm = 0;
        if (res.distance && res.distance !== Infinity) {
            distanceKm = (res.distance / 1000).toFixed(2);
        } else {
            distanceKm = "Unreachable";
        }
        
        const distEl = document.getElementById(`dist${algo}`);
        if(distEl) distEl.innerText = distanceKm !== "Unreachable" ? distanceKm : "-";
        
        const rideEl = document.getElementById(`ride${algo}`);
        if(rideEl) {
            if (distanceKm !== "Unreachable") {
                // assume 40km/h average speed in city
                const minutes = (distanceKm / 40) * 60;
                rideEl.innerText = Math.round(minutes) + ' mins';
            } else {
                rideEl.innerText = "-";
            }
        }
        
        // Update stats breakdown
        const prefix = algo === 'Binary' ? 'Bin' : algo === 'Binomial' ? 'Bino' : 'Fib';
        document.getElementById(`op${prefix}Insert`).innerText = res.stats.insert;
        document.getElementById(`op${prefix}Ext`).innerText = res.stats.extractMin;
        document.getElementById(`op${prefix}Dec`).innerText = res.stats.decreaseKey;
    }

    function hideRow(algo) {
        document.getElementById(`row${algo}`).classList.add('hidden');
        const prefix = algo === 'Binary' ? 'Bin' : algo === 'Binomial' ? 'Bino' : 'Fib';
        document.getElementById(`op${prefix}Insert`).innerText = '-';
        document.getElementById(`op${prefix}Ext`).innerText = '-';
        document.getElementById(`op${prefix}Dec`).innerText = '-';
    }

    function resetTable() {
        ['Binary', 'Binomial', 'Fibonacci'].forEach(hideRow);
    }
});
