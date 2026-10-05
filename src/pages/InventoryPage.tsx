import React, { useState } from 'react';
import { Boxes, Lock, Unlock, Search, Filter, RefreshCw, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getStatusBadge } from '../components/common/Badge';

export const InventoryPage: React.FC = () => {
  const { products, setSelectedProduct, reserveInventory, expireReservationNow, reservations, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalStock = products.reduce((acc, p) => acc + p.totalStock, 0);
  const totalAvailable = products.reduce((acc, p) => acc + p.availableStock, 0);
  const totalReserved = products.reduce((acc, p) => acc + p.reservedStock, 0);
  const totalSold = products.reduce((acc, p) => acc + p.soldStock, 0);

  const handleQuickReserve = async (productId: string, sku: string) => {
    await reserveInventory(productId, 1, 600);
  };

  const handleExpireSKU = (sku: string) => {
    const activeRes = reservations.find((r) => r.sku === sku && r.status === 'ACTIVE');
    if (activeRes) {
      expireReservationNow(activeRes.id);
    } else {
      addToast('info', 'No Active Reservation', `No active TTL lock found for ${sku}.`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Inventory Pool Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm">
          <span className="text-xs font-mono uppercase text-slate-400">Total Catalog Stock</span>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {totalStock.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500">Across 20 warehouse SKUs</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm">
          <span className="text-xs font-mono uppercase text-emerald-500 font-semibold">Available Pool</span>
          <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {totalAvailable.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500">Unreserved & purchasable</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm">
          <span className="text-xs font-mono uppercase text-amber-500 font-semibold">Reserved Pool</span>
          <p className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
            {totalReserved.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500">Under active 10m TTL locks</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm">
          <span className="text-xs font-mono uppercase text-slate-400">Sold & Fulfilled</span>
          <p className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
            {totalSold.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500">Settled orders</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative min-w-[260px] flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by SKU or product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-xs focus:outline-none"
        >
          <option value="ALL">Status: All</option>
          <option value="AVAILABLE">Available</option>
          <option value="LOW_STOCK">Low Stock</option>
          <option value="RESERVATION_PRESSURE">Reservation Pressure</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono uppercase text-slate-500">
              <tr>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Available</th>
                <th className="py-3 px-4">Reserved</th>
                <th className="py-3 px-4">Sold</th>
                <th className="py-3 px-4">Stock Allocation</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {filteredProducts.map((p) => {
                const availPct = Math.round((p.availableStock / (p.totalStock || 1)) * 100);
                const resPct = Math.round((p.reservedStock / (p.totalStock || 1)) * 100);

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-indigo-500">{p.sku}</td>
                    <td className="py-3 px-4 font-sans font-medium text-slate-900 dark:text-white max-w-[200px] truncate">
                      {p.name}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                      {p.totalStock}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {p.availableStock}
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-600 dark:text-amber-400">
                      {p.reservedStock}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{p.soldStock}</td>
                    <td className="py-3 px-4 w-44">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                          <div
                            className="bg-emerald-500 h-full"
                            style={{ width: `${availPct}%` }}
                            title={`Available: ${availPct}%`}
                          />
                          <div
                            className="bg-amber-500 h-full"
                            style={{ width: `${resPct}%` }}
                            title={`Reserved: ${resPct}%`}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 w-8">{availPct}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(p.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleQuickReserve(p.id, p.sku)}
                          disabled={p.availableStock <= 0}
                          className="p-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 disabled:opacity-30"
                          title="Reserve 1 unit"
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleExpireSKU(p.sku)}
                          className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                          title="Force expire active reservation"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setSelectedProduct(p)}
                          className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-semibold text-[11px]"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
