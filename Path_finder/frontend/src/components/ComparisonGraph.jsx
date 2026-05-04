// import React from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Bar } from 'react-chartjs-2';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const ComparisonGraph = ({ history }) => {
//   if (history.length === 0) return null;

//   // Filter only Dijkstra runs for a fair comparison
//   const dijkstraRuns = [...history]
//     .filter(run => run.algorithm === 'dijkstra')
//     .reverse(); // Show oldest to newest

//   const data = {
//     labels: dijkstraRuns.map((run, index) => `Run ${index + 1} (${run.heapType})`),
//     datasets: [
//       {
//         label: 'Execution Time (ms)',
//         data: dijkstraRuns.map(run => run.executionTime),
//         backgroundColor: dijkstraRuns.map(run => 
//           run.heapType === 'fibonacci' ? 'rgba(147, 51, 234, 0.6)' : 
//           run.heapType === 'binomial' ? 'rgba(59, 130, 246, 0.6)' : 
//           'rgba(16, 185, 129, 0.6)'
//         ),
//         borderColor: dijkstraRuns.map(run => 
//           run.heapType === 'fibonacci' ? 'rgb(147, 51, 234)' : 
//           run.heapType === 'binomial' ? 'rgb(59, 130, 246)' : 
//           'rgb(16, 185, 129)'
//         ),
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top' },
//       title: {
//         display: true,
//         text: 'Algorithm Performance Scaling',
//         font: { size: 16 }
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: { display: true, text: 'Time in Milliseconds' }
//       }
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-8">
//       <Bar options={options} data={data} />
//       <p className="text-xs text-gray-500 mt-4 italic text-center">
//         Note: Fibonacci Heaps often show higher constant overhead on small grids but demonstrate O(1) amortized efficiency in dense graph operations.
//       </p>
//     </div>
//   );
// };

// export default ComparisonGraph;


import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ComparisonGraph = ({ history }) => {
  // If no data, show a friendly message instead of an empty chart
  if (!history || history.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-xl text-gray-400">
        Run an algorithm to see performance data...
      </div>
    );
  }

  // We reverse the history so the newest run is on the right side of the graph
  const chartData = [...history].reverse();

  const data = {
    labels: chartData.map((run, idx) => `Run ${idx + 1}: ${run.heapType}`),
    datasets: [
      {
        label: 'Execution Time (ms)',
        data: chartData.map(run => parseFloat(run.executionTime)),
        backgroundColor: chartData.map(run => {
          if (run.heapType.toLowerCase() === 'fibonacci') return 'rgba(147, 51, 234, 0.7)';
          if (run.heapType.toLowerCase() === 'binomial') return 'rgba(59, 130, 246, 0.7)';
          return 'rgba(16, 185, 129, 0.7)'; // Default for Binary
        }),
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Performance Comparison (Lower is Better)' },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Time (ms)' }
      }
    }
  };

  return (
    <div className="h-80 w-full">
      <Bar data={data} options={options} />
    </div>
  );
};

export default ComparisonGraph;