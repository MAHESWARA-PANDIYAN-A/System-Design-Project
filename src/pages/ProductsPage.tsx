import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, Boxes, ShoppingBag, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/products/ProductCard';
import { Product } from '../types';

export const ProductsPage: React.FC = () => {
  const {
    products,
    setSelectedProduct,
    setCheckoutProduct,
    setIsCheckoutOpen,
    reserveInventory,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'price_asc' | 'price_desc' | 'stock'>('stock');

  // Extract categories
  const categories = ['ALL', ...Array.from(new Set(products.map((p) => p.category)))];

  // Filtering & Sorting
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'stock') return b.availableStock - a.availableStock;
    return 0;
  });

  const handleQuickBuy = (product: Product) => {
    setCheckoutProduct(product);
    setIsCheckoutOpen(true);
  };

  const handleQuickReserve = async (product: Product) => {
    await reserveInventory(product.id, 1, 600);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Controls Bar: Search, Category Filters, Status Filter, Sort */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative min-w-[240px] flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by SKU (e.g. WH-1007), title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-1.5 px-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-xs focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-xs focus:outline-none"
          >
            <option value="ALL">Status: All</option>
            <option value="AVAILABLE">Available</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="RESERVATION_PRESSURE">Reservation Pressure</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-xs focus:outline-none"
            >
              <option value="stock">Sort: Available Stock (High)</option>
              <option value="price_asc">Sort: Price (Low to High)</option>
              <option value="price_desc">Sort: Price (High to Low)</option>
              <option value="name">Sort: Product Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredProducts.map((prod) => (
          <ProductCard
            key={prod.id}
            product={prod}
            onSelect={(p) => setSelectedProduct(p)}
            onQuickBuy={handleQuickBuy}
            onQuickReserve={handleQuickReserve}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
          <Boxes className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">No products found</h4>
          <p className="text-xs text-slate-500 mt-1">Try resetting the search query or category filters.</p>
        </div>
      )}
    </div>
  );
};
