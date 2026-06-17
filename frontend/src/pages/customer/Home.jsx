import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/customer/ProductCard';
import Spinner from '../../components/ui/Spinner';
import { useProducts } from '../../hooks/useProducts';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Beauty'];

const CAT_ICONS = {
  All: '🛍️', Electronics: '⚡', Clothing: '👕', Books: '📚',
  'Home & Garden': '🏡', Sports: '🏃', Toys: '🎮', Beauty: '✨',
};

const SORT_OPTIONS = [
  { value: 'default',   label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'name_asc',  label: 'Name: A–Z' },
  { value: 'stock_desc', label: 'In Stock First' },
];

export default function Home() {
  const [searchParams] = useSearchParams();
  const { data: products = [], isLoading: loading, error, refetch } = useProducts();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('default');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setSearch(searchParams.get('q') || '');
  }, [searchParams]);

  const errorMessage = error ? 'Failed to load products. Please try again.' : '';

  const filtered = products
    .filter((p) => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
      const matchCat = !category || p.category === category;
      const matchPrice = !maxPrice || p.price <= Number(maxPrice);
      const matchStock = !inStockOnly || p.stock > 0;
      return matchSearch && matchCat && matchPrice && matchStock;
    })
    .sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price;
      if (sort === 'price_desc') return b.price - a.price;
      if (sort === 'name_asc') return a.name.localeCompare(b.name);
      if (sort === 'stock_desc') return b.stock - a.stock;
      return 0;
    });

  const clearAll = () => {
    setCategory('');
    setSort('default');
    setInStockOnly(false);
    setMaxPrice('');
  };
  const hasFilters = category || sort !== 'default' || inStockOnly || maxPrice;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-purple-600/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/25 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-blue-200 text-sm font-medium">New arrivals every week</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
            Shop <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Smarter</span>,
            <br className="hidden sm:block" />
            {' '}Live <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Better</span>
          </h1>
          <p className="text-blue-200/75 text-lg sm:text-xl max-w-xl mx-auto mb-8">
            Premium products across 8 categories. Fast delivery across Egypt.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#products"
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all hover:shadow-xl hover:shadow-blue-500/30 active:scale-95"
            >
              Explore Products
            </a>
            <div className="flex items-center gap-5 text-blue-300/80 text-sm font-medium">
              <span>{products.length || 72}+ Products</span>
              <span className="w-1 h-1 rounded-full bg-blue-500/50" />
              <span>8 Categories</span>
              <span className="w-1 h-1 rounded-full bg-blue-500/50" />
              <span>Free Delivery</span>
            </div>
          </div>

          {/* Category quick-links */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {CATEGORIES.slice(1).map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-xl transition-all"
              >
                <span className="text-base">{CAT_ICONS[cat]}</span>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Section ── */}
      <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Top filter bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
              {CATEGORIES.map((cat) => {
                const active = (cat === 'All' && !category) || cat === category;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat === 'All' ? '' : cat)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                      active
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <span>{CAT_ICONS[cat]}</span>
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                  showFilters || hasFilters
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-0.5" />}
              </button>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-xs border border-gray-200 rounded-xl px-3 py-1.5 text-gray-700 font-medium outline-none focus:border-blue-400 bg-white"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Expandable filter row */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-gray-600 whitespace-nowrap">Max Price:</label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">EGP</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="No limit"
                    className="w-28 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-400"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className={`w-8 h-4.5 relative rounded-full transition-colors ${inStockOnly ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${inStockOnly ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-xs font-semibold text-gray-600">In Stock Only</span>
              </label>
              {hasFilters && (
                <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-600 font-semibold hover:underline">
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>

        {/* Result count + search label */}
        <div className="flex items-center justify-between mb-5">
          <div>
            {search ? (
              <p className="text-sm text-gray-600">
                Results for <span className="font-bold text-gray-900">"{search}"</span>
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                {loading ? 'Loading...' : (
                  <><span className="font-bold text-gray-900">{filtered.length}</span> products</>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-2.5 bg-gray-200 rounded w-1/3" />
                  <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-5 bg-gray-200 rounded w-1/3 mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : errorMessage ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-gray-800 font-semibold">{errorMessage}</p>
            <button onClick={() => refetch()} className="text-sm text-blue-600 font-medium hover:underline">Try again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <div className="text-5xl">🔍</div>
            <p className="text-gray-700 font-semibold text-lg">No products found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
            <button onClick={clearAll} className="mt-2 text-sm text-blue-600 font-semibold hover:underline">Clear all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
