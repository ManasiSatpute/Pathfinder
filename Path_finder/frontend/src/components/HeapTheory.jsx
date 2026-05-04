import React from 'react';

const HeapTheory = () => {
  const heapData = [
    {
      name: "Binary Heap",
      working: "A complete binary tree stored in an array. It uses simple parent-child index math ($2i + 1$).",
      bestFor: "Small to medium graphs with few edges (Sparse Graphs).",
      complexity: "ExtractMin: $O(\log n)$ | DecreaseKey: $O(\log n)$"
    },
    {
      name: "Binomial Heap",
      working: "A collection of Binomial Trees. It is designed to make merging two heaps very efficient.",
      bestFor: "Applications where merging multiple priority queues is frequent.",
      complexity: "ExtractMin: $O(\log n)$ | DecreaseKey: $O(\log n)$"
    },
    {
      name: "Fibonacci Heap",
      working: "A forest of trees with a loose structure. It delays consolidation of trees until ExtractMin is called.",
      bestFor: "Dense graphs and Dijkstra's algorithm where DecreaseKey happens constantly.",
      complexity: "ExtractMin: $O(\log n)$ amortized | DecreaseKey: $O(1)$ amortized"
    }
  ];

  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      {heapData.map((heap) => (
        <div key={heap.name} className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-blue-500">
          <h3 className="text-xl font-bold mb-2">{heap.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{heap.working}</p>
          <div className="text-xs font-mono bg-gray-100 p-2 rounded">
            {heap.complexity}
          </div>
          <p className="mt-4 text-xs font-semibold text-blue-700">Best for: {heap.bestFor}</p>
        </div>
      ))}
    </div>
  );
};

export default HeapTheory;