const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Beauty'];

export default function Sidebar({ filters, onChange }) {
  const { category, minPrice, maxPrice, inStock } = filters;

  const handleCategoryChange = (cat) => {
    onChange({ ...filters, category: cat });
  };

  return (
    <aside className="w-full space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Category</h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat === 'All' ? '' : cat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                (cat === 'All' && !category) || category === cat
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => onChange({ ...filters, inStock: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900">In Stock Only</span>
        </label>
      </div>

      <button
        onClick={() => onChange({ category: '', minPrice: '', maxPrice: '', inStock: false })}
        className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Clear Filters
      </button>
    </aside>
  );
}
