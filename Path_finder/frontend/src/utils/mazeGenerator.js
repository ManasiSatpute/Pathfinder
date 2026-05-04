export function generateMaze(grid, startRow, startCol, endRow, endCol) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      grid[row][col].isWall = false
    }
  }
  
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (row === 0 || row === grid.length - 1 || col === 0 || col === grid[0].length - 1) {
        const isNearStart = Math.abs(row - startRow) <= 1 && Math.abs(col - startCol) <= 1
        const isNearEnd = Math.abs(row - endRow) <= 1 && Math.abs(col - endCol) <= 1
        if (!isNearStart && !isNearEnd) {
          grid[row][col].isWall = true
        }
      }
    }
  }

  divide(grid, 1, grid.length - 2, 1, grid[0].length - 2, 'horizontal', false)
  
  ensurePath(grid, startRow, startCol, endRow, endCol)
}

function divide(grid, rowStart, rowEnd, colStart, colEnd, orientation) {
  if (rowEnd <= rowStart || colEnd <= colStart) return

  const isHorizontal = orientation === 'horizontal'

  if (isHorizontal) {
    if (rowEnd - rowStart < 2) return

    const wallRow = Math.floor(randomNumber(rowStart + 1, rowEnd - 1) / 2) * 2
    const passageCol = Math.floor(randomNumber(colStart, colEnd) / 2) * 2 + 1

    for (let col = colStart; col <= colEnd; col++) {
      if (col !== passageCol && !grid[wallRow][col].isStart && !grid[wallRow][col].isEnd) {
        grid[wallRow][col].isWall = true
      }
    }

    divide(grid, rowStart, wallRow - 1, colStart, colEnd, 'vertical')
    divide(grid, wallRow + 1, rowEnd, colStart, colEnd, 'vertical')
  } else { // vertical
    if (colEnd - colStart < 2) return

    const wallCol = Math.floor(randomNumber(colStart + 1, colEnd - 1) / 2) * 2
    const passageRow = Math.floor(randomNumber(rowStart, rowEnd) / 2) * 2 + 1

    for (let row = rowStart; row <= rowEnd; row++) {
      if (row !== passageRow && !grid[row][wallCol].isStart && !grid[row][wallCol].isEnd) {
        grid[row][wallCol].isWall = true
      }
    }

    divide(grid, rowStart, rowEnd, colStart, wallCol - 1, 'horizontal')
    divide(grid, rowStart, rowEnd, wallCol + 1, colEnd, 'horizontal')
  }
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}


function ensurePath(grid, startRow, startCol, endRow, endCol) {
  
  if (hasPath(grid, startRow, startCol, endRow, endCol)) {
    return
  }
  

  const minRow = Math.min(startRow, endRow)
  const maxRow = Math.max(startRow, endRow)
  const minCol = Math.min(startCol, endCol)
  const maxCol = Math.max(startCol, endCol)
  

  for (let col = minCol; col <= maxCol; col++) {
    if (grid[minRow][col]) {
      grid[minRow][col].isWall = false
    }
  }
  

  if (minRow !== maxRow) {
    for (let row = minRow; row <= maxRow; row++) {
      if (grid[row][minCol]) {
        grid[row][minCol].isWall = false
      }
    }
  }
}


function hasPath(grid, startRow, startCol, endRow, endCol) {
  const visited = new Set()
  const queue = [[startRow, startCol]]
  visited.add(`${startRow},${startCol}`)
  
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
  
  while (queue.length > 0) {
    const [row, col] = queue.shift()
    
    if (row === endRow && col === endCol) {
      return true
    }
    
    for (const [dr, dc] of directions) {
      const newRow = row + dr
      const newCol = col + dc
      
      if (newRow >= 0 && newRow < grid.length && 
          newCol >= 0 && newCol < grid[0].length &&
          !visited.has(`${newRow},${newCol}`) &&
          !grid[newRow][newCol].isWall) {
        visited.add(`${newRow},${newCol}`)
        queue.push([newRow, newCol])
      }
    }
  }
  
  return false
}