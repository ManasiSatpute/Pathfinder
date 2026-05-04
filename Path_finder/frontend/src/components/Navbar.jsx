import React from 'react'
import HeapSelector from './HeapSelector'

const Navbar = ({
  algorithm,
  setAlgorithm,
  heapType,
  setHeapType,
  onVisualize,
  onCancel,
  onClearGrid,
  onClearPath,
  onGenerateMaze,
  speed,
  setSpeed,
  isVisualizing,
  stats,
}) => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-800">
              Pathfinding Visualizer
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Algorithm Selector */}
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              disabled={isVisualizing}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            >
              <option value="dijkstra">Dijkstra's Algorithm</option>
              <option value="bfs">Breadth-First Search</option>
              <option value="dfs">Depth-First Search</option>
            </select>

            {algorithm === 'dijkstra' && (
              <HeapSelector
                selected={heapType}
                setSelected={setHeapType}
                disabled={isVisualizing}
              />
            )}

            {/* Speed Control */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Speed:</span>
              <input
                type="range"
                min="1"
                max="20"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                disabled={isVisualizing}
                className="w-24"
              />
            </div>

            {/* Action Buttons */}
            <button
              onClick={isVisualizing ? onCancel : onVisualize}
              className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                isVisualizing 
                  ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500' 
                  : 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
              }`}
            >
              {isVisualizing ? 'Cancel' : 'Visualize'}
            </button>

            <button
              onClick={onClearPath}
              disabled={isVisualizing}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Clear Path
            </button>
          
{/* <button 
  onClick={() => setIsMultiStopMode(!isMultiStopMode)}
  style={{ backgroundColor: isMultiStopMode ? '#ff9800' : '#e0e0e0' }}
  className="btn-stop"
>
  {isMultiStopMode ? "Stop Mode: ON" : "Add Stop"}
</button> */}

            <button
              onClick={onClearGrid}
              disabled={isVisualizing}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Clear Grid
            </button>

            <button
              onClick={onGenerateMaze}
              disabled={isVisualizing}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Generate Maze
            </button>
          </div>
        </div>
        {stats && (
          <div className="bg-blue-50 border-t border-blue-200 py-3">
            <div className="flex justify-center space-x-8 text-sm text-gray-700">
              <div>
                <span className="font-semibold">Visited Nodes:</span>{' '}
                {stats.visitedNodes}
              </div>
              <div>
                <span className="font-semibold">Path Length:</span>{' '}
                {stats.pathLength}
              </div>
              <div>
                <span className="font-semibold">Execution Time:</span>{' '}
                {stats.executionTime}ms
              </div>
              {stats.heapType && (
                <div>
                  <span className="font-semibold">Heap:</span>{' '}
                  {stats.heapType}
                </div>
              )}
              {stats.operations !== null && (
                <div>
                  <span className="font-semibold">Heap Ops:</span>{' '}
                  {stats.operations}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-gray-50 border-t border-gray-200 py-2">
          <div className="flex justify-center space-x-6 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-green-500 border border-gray-300"></div>
              <span>Start Node</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-red-500 border border-gray-300"></div>
              <span>End Node</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-gray-800 border border-gray-300"></div>
              <span>Wall</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-purple-400 border border-gray-300"></div>
              <span>Weight</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-blue-300 border border-gray-300"></div>
              <span>Visited</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-yellow-300 border border-gray-300"></div>
              <span>Shortest Path</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar