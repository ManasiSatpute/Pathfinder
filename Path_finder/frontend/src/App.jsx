

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Grid from './components/Grid.jsx'
import ComparisonTable from './components/ComparisonTable.jsx' 
import ComparisonGraph from './components/ComparisonGraph.jsx'
import { dijkstra, getNodesInShortestPathOrder } from './algorithms/dijkstra'
import { bfs } from './algorithms/bfs'
import { dfs } from './algorithms/dfs'
import { generateMaze } from './utils/mazeGenerator'
import { useLogistics } from './useLogistics.js'

const ROWS = 20
const COLS = 40
const START_NODE_ROW = 10
const START_NODE_COL = 5
const END_NODE_ROW = 10
const END_NODE_COL = 35

function createNode(row, col) {
  return {
    row, col,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isEnd: row === END_NODE_ROW && col === END_NODE_COL,
    distance: Infinity, isVisited: false, isWall: false, isWeight: false,
    weight: 1, previousNode: null,
  }
}

function getInitialGrid() {
  const grid = []
  for (let row = 0; row < ROWS; row++) {
    const currentRow = []
    for (let col = 0; col < COLS; col++) {
      currentRow.push(createNode(row, col))
    }
    grid.push(currentRow)
  }
  return grid
}

function App() {
  const [grid, setGrid] = useState(getInitialGrid)
  const [isMultiStopMode, setIsMultiStopMode] = useState(false);
  const [algorithm, setAlgorithm] = useState('dijkstra')
  const [heapType, setHeapType] = useState('binary')
  const [isVisualizing, setIsVisualizing] = useState(false)
  const [speed, setSpeed] = useState(10)
  const [stats, setStats] = useState(null)
  const [history, setHistory] = useState([]) 
  const [mouseIsPressed, setMouseIsPressed] = useState(false)
  const [dragging, setDragging] = useState(null) 
  const [timeoutIds, setTimeoutIds] = useState([])
  const [waypoints, setWaypoints] = useState([]);
  const { runLogistics } = useLogistics(grid, setGrid, waypoints, heapType, speed);

  
  // Filter history to ONLY include Dijkstra for Table and Graph
  const dijkstraHistory = useMemo(() => 
    history.filter(run => run.algorithm === 'dijkstra'), 
  [history]);

  // Calculate verdict based only on Dijkstra runs
  const finalVerdict = useMemo(() => {
    if (dijkstraHistory.length < 2) return null;
    const fastest = [...dijkstraHistory].sort((a, b) => a.executionTime - b.executionTime)[0];
    return {
      winner: fastest.heapType,
      time: fastest.executionTime,
      insight: fastest.heapType === 'binary' 
        ? "Binary Heap is currently faster due to low overhead on this grid." 
        : "Fibonacci Heap is showing its theoretical O(1) advantage!"
    };
  }, [dijkstraHistory]);

  // --- GRID HANDLERS ---

  const generateNewMaze = useCallback(() => {
    let startRow = START_NODE_ROW, startCol = START_NODE_COL;
    let endRow = END_NODE_ROW, endCol = END_NODE_COL;
    grid.forEach(row => row.forEach(node => {
      if (node.isStart) { startRow = node.row; startCol = node.col; }
      if (node.isEnd) { endRow = node.row; endCol = node.col; }
    }));
    const newGrid = getInitialGrid();
    newGrid[startRow][startCol].isStart = true;
    newGrid[endRow][endCol].isEnd = true;
    generateMaze(newGrid, startRow, startCol, endRow, endCol);
    setGrid(newGrid);
    setStats(null);
  }, [grid]);

  const handleMouseDown = useCallback((row, col) => {
    if (isVisualizing) return
    const node = grid[row][col]
    if (node.isStart) { setDragging('start'); }
    else if (node.isEnd) { setDragging('end'); }
    else { setGrid(prev => getNewGridWithWallToggled(prev, row, col)); }
    setMouseIsPressed(true)
  }, [isVisualizing, grid])

  const handleMouseEnter = useCallback((row, col) => {
    if (!mouseIsPressed && !dragging) return
    if (dragging) {
      setGrid(prevGrid => {
        const node = prevGrid[row][col]
        if (node.isWall) return prevGrid
        return prevGrid.map(r => r.map(n => ({ 
            ...n, 
            isStart: dragging === 'start' ? (n.row === row && n.col === col) : n.isStart, 
            isEnd: dragging === 'end' ? (n.row === row && n.col === col) : n.isEnd 
        })));
      })
    } else if (mouseIsPressed && !isVisualizing) {
      setGrid(prevGrid => getNewGridWithWallToggled(prevGrid, row, col))
    }
  }, [isVisualizing, mouseIsPressed, dragging])

  const handleMouseUp = () => { setMouseIsPressed(false); setDragging(null); }

  const addWeight = (row, col) => {
    if (isVisualizing) return
    setGrid(prevGrid => prevGrid.map(r => r.map(n => {
      if (n.row === row && n.col === col && !n.isStart && !n.isEnd && !n.isWall) {
        return { ...n, isWeight: !n.isWeight, weight: !n.isWeight ? 5 : 1 };
      }
      return n;
    })));
  }

  function getNewGridWithWallToggled(grid, row, col) {
    return grid.map(r => r.map(n => {
      if (n.row === row && n.col === col && !n.isStart && !n.isEnd && !n.isWeight) {
        return { ...n, isWall: !n.isWall };
      }
      return n;
    }));
  }

  // --- VISUALIZATION ---

  const cancelVisualization = useCallback(() => {
    timeoutIds.forEach(id => clearTimeout(id))
    setTimeoutIds([])
    setIsVisualizing(false)
  }, [timeoutIds])

  const visualizeAlgorithm = useCallback(async () => {
    if (isVisualizing) return
    timeoutIds.forEach(id => clearTimeout(id))
    setIsVisualizing(true)

    const gridCopy = grid.map(row => row.map(node => ({
        ...node, isVisited: false, isShortestPath: false, distance: Infinity, previousNode: null,
    })))

    let startNode, endNode;
    gridCopy.forEach(row => row.forEach(n => {
      if (n.isStart) startNode = n;
      if (n.isEnd) endNode = n;
    }))

    let visitedNodesInOrder = [];
    let metrics = null;
    const startTime = performance.now();

    if (algorithm === 'dijkstra') {
      const res = dijkstra(gridCopy, startNode, endNode, heapType);
      visitedNodesInOrder = res.visitedNodesInOrder;
      metrics = res.metrics;
    } else if (algorithm === 'bfs') { visitedNodesInOrder = bfs(gridCopy, startNode, endNode); }
    else if (algorithm === 'dfs') { visitedNodesInOrder = dfs(gridCopy, startNode, endNode); }

    const executionTime = performance.now() - startTime;
    const delay = Math.max(1, 50 - speed);
    const newTimeoutIds = [];

    visitedNodesInOrder.forEach((node, i) => {
      newTimeoutIds.push(setTimeout(() => {
        setGrid(prev => {
          const next = prev.map(r => r.map(n => ({...n})));
          next[node.row][node.col].isVisited = true;
          return next;
        });
      }, delay * i));
    });

    newTimeoutIds.push(setTimeout(() => {
      const path = getNodesInShortestPathOrder(endNode);
      path.forEach((node, j) => {
        newTimeoutIds.push(setTimeout(() => {
          setGrid(prev => {
            const next = prev.map(r => r.map(n => ({...n})));
            next[node.row][node.col].isShortestPath = true;
            return next;
          });
        }, delay * j));
      });

      newTimeoutIds.push(setTimeout(() => {
        const runStats = {
          algorithm, // IMPORTANT: added this so filter works
          heapType: algorithm === 'dijkstra' ? heapType : 'N/A',
          visitedNodes: visitedNodesInOrder.length,
          executionTime: (metrics?.executionTime ?? executionTime).toFixed(2),
          operations: metrics?.operations ?? 'N/A',
          decreaseKey: metrics?.operationCounts?.decreaseKey ?? 0,
        };
        setStats(runStats);
        setHistory(prev => [runStats, ...prev].slice(0, 10));
        setIsVisualizing(false);
      }, delay * path.length));
    }, delay * visitedNodesInOrder.length));

    setTimeoutIds(newTimeoutIds);
  }, [algorithm, grid, heapType, isVisualizing, speed]);

  const clearGrid = () => { setGrid(getInitialGrid()); setStats(null); }
  const clearPath = () => {
    setGrid(prev => prev.map(row => row.map(n => ({...n, isVisited: false, isShortestPath: false, distance: Infinity, previousNode: null}))));
    setStats(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar
        algorithm={algorithm} setAlgorithm={setAlgorithm}
        heapType={heapType} setHeapType={setHeapType}
        onVisualize={visualizeAlgorithm} onCancel={cancelVisualization}
        onClearGrid={clearGrid} onClearPath={clearPath}
        onGenerateMaze={generateNewMaze} speed={speed} setSpeed={setSpeed}
        isVisualizing={isVisualizing} stats={stats}
      />

      <div className="container mx-auto px-4 py-8">
        <Grid 
          grid={grid} 
          onMouseDown={handleMouseDown} 
          onMouseEnter={handleMouseEnter} 
          onMouseUp={handleMouseUp} 
          onAddWeight={addWeight} 
        />

        {/* Research & Analysis Section (Visible only when Dijkstra data exists) */}
        {dijkstraHistory.length > 0 && (
          <div className="mt-12 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
              Dijkstra Heap Efficiency Analysis
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <ComparisonTable history={dijkstraHistory} onClearHistory={() => setHistory([])} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <ComparisonGraph history={dijkstraHistory} />
              </div>
            </div>

            {finalVerdict && (
              <div className="mt-8 p-6 bg-blue-50 border-l-8 border-blue-500 rounded-r-xl shadow-md">
                <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                  <span>🔬</span> Research Insight
                </h3>
                <p className="text-blue-800 mt-2 leading-relaxed">
                  Comparing <strong>{dijkstraHistory.length}</strong> trials: The 
                  <span className="font-extrabold uppercase mx-1">{finalVerdict.winner} Heap</span> 
                  is currently leading with an execution time of <strong>{finalVerdict.time}ms</strong>.
                  <br />
                  <span className="text-sm italic opacity-80">{finalVerdict.insight}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App

