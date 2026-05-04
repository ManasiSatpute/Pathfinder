import React, { useState } from 'react';

const ResearchController = ({ grid, onAutomatedTest }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState([]);

  const runStressTest = async () => {
    setIsRunning(true);
    const heapTypes = ['binary', 'fibonacci'];
    const iterations = 5; // To get a stable average
    let report = [];

    for (let type of heapTypes) {
      let totalTime = 0;
      let times = [];
      
      // Warm-up run (to trigger JIT optimization)
      onAutomatedTest(type, true); 

      for (let i = 0; i < iterations; i++) {
        const startTime = performance.now();
        const metrics = onAutomatedTest(type, false);
        const endTime = performance.now();
        
        const execTime = metrics?.executionTime || (endTime - startTime);
        times.push(Number(execTime));
        totalTime += Number(execTime);
      }

      const avg = totalTime / iterations;
      const stdDev = Math.sqrt(times.map(x => Math.pow(x - avg, 2)).reduce((a, b) => a + b) / iterations);

      report.push({
        heap: type,
        avgTime: avg.toFixed(4),
        stdDev: stdDev.toFixed(4),
        density: "Current Grid Config"
      });
    }

    setResults(report);
    setIsRunning(false);
  };

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-2xl mt-10 border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2">
          <span>🧪</span> Automated Research Lab
        </h3>
        <button 
          onClick={runStressTest}
          disabled={isRunning}
          className={`${isRunning ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-500'} px-6 py-2 rounded-lg font-bold transition-all`}
        >
          {isRunning ? 'Analyzing CPU Cycles...' : 'Start Automated Stress Test'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((res, i) => (
          <div key={i} className="bg-slate-800 p-4 rounded-xl border border-slate-600">
            <h4 className="uppercase text-xs font-black tracking-widest text-slate-400 mb-2">{res.heap} Heap</h4>
            <div className="text-3xl font-mono text-green-400">{res.avgTime}ms</div>
            <div className="text-xs text-slate-500 mt-1">Std Deviation: ±{res.stdDev}ms</div>
          </div>
        ))}
      </div>

      {results.length > 0 && (
        <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-800/50">
          <p className="text-sm text-blue-200 italic">
            **Research Note:** These averages account for JIT "warm-up" and background OS noise. 
            Use these values for your **Table 1: Performance Metrics** in the paper.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResearchController;