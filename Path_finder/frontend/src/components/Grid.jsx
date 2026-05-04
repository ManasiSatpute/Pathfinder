import React from 'react'
import Node from './Node.jsx'

const Grid = ({
  grid,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  onAddWeight,
}) => {
  return (
    <div className="flex justify-center">
      <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${grid[0].length}, 1fr)` }}>
        {grid.map((row) => {
          return row.map((node) => {
            const { row, col, isStart, isEnd, isWall, isWeight, isVisited, isShortestPath } = node
            return (
              <Node
                key={`node-${row}-${col}`}
                row={row}
                col={col}
                isStart={isStart}
                isEnd={isEnd}
                isWall={isWall}
                isWeight={isWeight}
                isVisited={isVisited}
                isShortestPath={isShortestPath}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
                onMouseUp={onMouseUp}
                onAddWeight={() => onAddWeight(row, col)}
              />
            )
          })
        })}
      </div>
    </div>
  )
}

export default Grid
