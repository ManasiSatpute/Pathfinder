import React from 'react';

const ComparisonTable = ({ history, onClearHistory }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Comparative Analysis Results</h3>
        <button 
          onClick={onClearHistory}
          className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition"
        >
          Clear History
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 border-b">Heap Type</th>
              <th className="px-4 py-3 border-b">Time (ms)</th>
              <th className="px-4 py-3 border-b">Total Ops</th>
              <th className="px-4 py-3 border-b">DecreaseKey</th>
              <th className="px-4 py-3 border-b">Nodes Visited</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {history.map((run, idx) => (
              <tr key={idx} className="border-b hover:bg-blue-50 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-blue-600 uppercase">
                  {run.heapType}
                </td>
                <td className="px-4 py-3 font-medium">{run.executionTime}</td>
                <td className="px-4 py-3">{run.operations}</td>
                <td className="px-4 py-3 text-purple-600 font-semibold">{run.decreaseKey}</td>
                <td className="px-4 py-3">{run.visitedNodes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-800">
        <strong>Insight:</strong> Fibonacci Heaps achieve 
        <span className="font-bold"> O(1) amortized </span> for <strong>DecreaseKey</strong>, 
        making them superior for dense graphs compared to Binary Heaps (O(\log n)).
      </div>
    </div>
  );
};

export default ComparisonTable;