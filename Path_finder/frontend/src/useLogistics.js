import { useCallback } from 'react';
import { dijkstra, getNodesInShortestPathOrder } from './algorithms/dijkstra';

export const useLogistics = (grid, setGrid, waypoints, heapType, speed) => {
  const runLogistics = useCallback(async (onComplete) => {
    let startNode, endNode;
    grid.forEach(row => row.forEach(n => {
      if (n.isStart) startNode = n;
      if (n.isEnd) endNode = n;
    }));

    // Start -> Stop 1 -> Stop 2 -> End
    const stops = [startNode, ...waypoints, endNode];
    let fullVisitedNodes = [];
    let fullPath = [];
    
    // We work on a virtual grid first to calculate everything
    let currentGridState = grid.map(r => r.map(n => ({ 
      ...n, distance: Infinity, isVisited: false, previousNode: null 
    })));

    const startTime = performance.now();

    for (let i = 0; i < stops.length - 1; i++) {
      const { visitedNodesInOrder } = dijkstra(
        currentGridState, 
        currentGridState[stops[i].row][stops[i].col], 
        currentGridState[stops[i+1].row][stops[i+1].col], 
        heapType
      );
      const path = getNodesInShortestPathOrder(currentGridState[stops[i+1].row][stops[i+1].col]);
      
      fullVisitedNodes.push(...visitedNodesInOrder);
      fullPath.push(...path);

      // Reset for next leg
      currentGridState = currentGridState.map(r => r.map(n => ({ 
        ...n, distance: Infinity, isVisited: false, previousNode: null 
      })));
    }

    const executionTime = performance.now() - startTime;
    onComplete(fullVisitedNodes, fullPath, executionTime);
  }, [grid, waypoints, heapType]);

  return { runLogistics };
};