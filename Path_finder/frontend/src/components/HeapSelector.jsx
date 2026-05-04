export default function HeapSelector({ selected, setSelected, disabled = false }) {
  return (
    <select
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      disabled={disabled}
      className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
    >
      <option value="binary">Binary Heap</option>
      <option value="binomial">Binomial Heap</option>
      <option value="fibonacci">Fibonacci Heap</option>
    </select>
  );
}