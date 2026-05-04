// import { createHeap } from "../utils/heapFactory";

// export const dijkstra = (grid, startNode, finishNode, heapType) => {
//   const heap = createHeap(heapType)
//   const visitedNodesInOrder = []
//   const operationCounts = {
//     insert: 0,
//     extractMin: 0,
//     decreaseKey: 0,
//   }
//   const startTime = performance.now()

//   startNode.distance = 0
//   heap.insert(startNode, 0)
//   operationCounts.insert += 1

//   while (!heap.isEmpty()) {
//     const minItem = heap.extractMin()
//     operationCounts.extractMin += 1
//     if (!minItem) break

//     const { node } = minItem
//     if (node.isVisited || node.isWall) continue
//     if (node.distance === Infinity) break

//     node.isVisited = true
//     visitedNodesInOrder.push(node)

//     if (node === finishNode) break

//     const neighbors = getUnvisitedNeighbors(node, grid)
//     for (const neighbor of neighbors) {
//       if (neighbor.isWall) continue

//       const weight = neighbor.isWeight ? neighbor.weight : 1
//       const newDistance = node.distance + weight

//       if (newDistance < neighbor.distance) {
//         neighbor.distance = newDistance
//         neighbor.previousNode = node
//         heap.decreaseKey(neighbor, newDistance)
//         operationCounts.decreaseKey += 1
//       }
//     }
//   }

//   const endTime = performance.now()
//   return {
//     visitedNodesInOrder,
//     metrics: {
//       heapType,
//       executionTime: endTime - startTime,
//       operations: operationCounts.insert + operationCounts.extractMin + operationCounts.decreaseKey,
//       operationCounts,
//     },
//   }
// };

// function getUnvisitedNeighbors(node, grid) {
//   const neighbors = []
//   const { row, col } = node

//   if (row > 0) neighbors.push(grid[row - 1][col])
//   if (row < grid.length - 1) neighbors.push(grid[row + 1][col])
//   if (col > 0) neighbors.push(grid[row][col - 1])
//   if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1])

//   return neighbors.filter((neighbor) => !neighbor.isVisited)
// }

// export function getNodesInShortestPathOrder(finishNode) {
//   const nodesInShortestPathOrder = []
//   let currentNode = finishNode

//   while (currentNode !== null) {
//     nodesInShortestPathOrder.unshift(currentNode)
//     currentNode = currentNode.previousNode
//   }
//   return nodesInShortestPathOrder
// }



/**
 * Dijkstra's Algorithm Implementation
 * Optimized for Comparative Analysis (Binary vs. Binomial vs. Fibonacci Heaps)
 */
import { createHeap } from "../utils/heapFactory";

export const dijkstra = (grid, startNode, finishNode, heapType) => {
  // 1. Initialize the specific heap based on user selection
  const heap = createHeap(heapType);
  const visitedNodesInOrder = [];
  
  // 2. Metrics Tracking (Essential for your project report)
  const operationCounts = {
    insert: 0,
    extractMin: 0,
    decreaseKey: 0,
  };
  const startTime = performance.now();

  // 3. Initial Setup
  startNode.distance = 0;
  heap.insert(startNode, 0);
  operationCounts.insert += 1;

  while (!heap.isEmpty()) {
    // Extract the node with the smallest distance
    const minItem = heap.extractMin();
    operationCounts.extractMin += 1
    
    if (!minItem) break;
    const { node } = minItem;

    // Standard Dijkstra Guards
    if (node.isVisited || node.isWall) continue;
    if (node.distance === Infinity) break;

    node.isVisited = true;
    visitedNodesInOrder.push(node);

    // Target Reached optimization
    if (node === finishNode) break;

    // 4. Neighbor Relaxation
    const neighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of neighbors) {
      if (neighbor.isWall) continue;

      // Handle weighted nodes (e.g., mud or difficult terrain)
      const weight = neighbor.isWeight ? neighbor.weight : 1;
      const newDistance = node.distance + weight;

      // If a shorter path to the neighbor is found
      if (newDistance < neighbor.distance) {
        neighbor.distance = newDistance;
        neighbor.previousNode = node;

        /**
         * The Core Analysis Point:
         * Fibonacci Heaps perform decreaseKey in O(1) amortized.
         * Binary Heaps perform this in O(log n).
         */
        heap.decreaseKey(neighbor, newDistance);
        operationCounts.decreaseKey += 1;
      }
    }
  }

  const endTime = performance.now();

  return {
    visitedNodesInOrder,
    metrics: {
      heapType,
      executionTime: endTime - startTime,
      operations: operationCounts.insert + operationCounts.extractMin + operationCounts.decreaseKey,
      operationCounts,
    },
  };
};

/**
 * Helper: Finds all valid, unvisited neighbors (Up, Down, Left, Right)
 */
function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;

  // Check boundaries and add neighbors
  if (row > 0) neighbors.push(grid[row - 1][col]); // Up
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // Down
  if (col > 0) neighbors.push(grid[row][col - 1]); // Left
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // Right

  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

/**
 * Helper: Backtracks from the finishNode to the startNode using the 'previousNode' pointers
 * to determine the actual shortest path after Dijkstra has finished.
 */
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;

  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  
  // If start is unreachable, this will return just the finishNode.
  // We check for that in the UI.
  return nodesInShortestPathOrder;
}