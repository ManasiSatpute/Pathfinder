import React from 'react'

const Node = ({
  row,
  col,
  isStart,
  isEnd,
  isWall,
  isWeight,
  isVisited,
  isShortestPath,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  onAddWeight,
}) => {
  
  const extraClass = isStart
    ? 'bg-green-500 hover:bg-green-600'
    : isEnd
    ? 'bg-red-500 hover:bg-red-600'
    : isWall
    ? 'bg-gray-800'
    : isWeight
    ? 'bg-purple-400'
    : isShortestPath
    ? 'bg-yellow-300 node-shortest-path'
    : isVisited
    ? 'bg-blue-300 node-visited'
    : 'bg-white hover:bg-gray-100'

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node w-6 h-6 border border-gray-300 ${extraClass} transition-all duration-200 ease-in-out cursor-pointer`}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseUp={onMouseUp}
      onContextMenu={(e) => {
        e.preventDefault()
        onAddWeight()
      }}
      title={`Row: ${row}, Col: ${col}${isStart ? ' (Start)' : isEnd ? ' (End)' : ''}`}
    >
      {isWeight && !isStart && !isEnd && !isWall && (
        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-purple-900">
          {5}
        </div>
      )}
    </div>
  )
}

export default Node