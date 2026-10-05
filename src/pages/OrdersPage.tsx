import React, { useState } from 'react';
import { ClipboardList, Search, Filter, Eye, ArrowUpRight, Plus, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getStatusBadge } from '../components/common/Badge';

export const OrdersPage: React.FC = () => {
  const { orders, setSelectedOrder, setIsCheckoutOpen, products, setCheckoutProduct } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.paymentId && o.paymentId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStartNewOrder = () => {
    setCheckoutProduct(products[0]);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter and Actions Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative min-w-[260px] flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Order ID, customer, payment ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-xs focus:outline-none"
          >
            <option value="ALL">Status: All</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PAID">PAID</option>
            <option value="RESERVED">RESERVED</option>
            <option value="PAYMENT_PENDING">PAYMENT_PENDING</option>
            <option value="FAILED">FAILED</option>
            <option value="EXPIRED">EXPIRED</option>
          </select>

          <button
            onClick={handleStartNewOrder}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Simulate Order</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono uppercase text-slate-500">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Line Items</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment Ref</th>
                <th className="py-3 px-4">Reservation Ref</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created At</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {filteredOrders.map((ord) => (
                <tr
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 font-bold text-indigo-500">{ord.id}</td>
                  <td className="py-3 px-4 font-sans font-medium text-slate-900 dark:text-white">
                    <div>{ord.customerName}</div>
                    <span className="text-[11px] text-slate-400">{ord.customerEmail}</span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-700 dark:text-slate-300">
                    {ord.items.map((i) => `${i.quantity}x ${i.sku}`).join(', ')}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    ₹{ord.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-emerald-500">
                    {ord.paymentId || <span className="text-slate-400 font-sans italic">Pending</span>}
                  </td>
                  <td className="py-3 px-4 text-amber-500">
                    {ord.reservationId || <span className="text-slate-400 font-sans italic">None</span>}
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(ord.status)}</td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {new Date(ord.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-300 font-sans font-semibold text-[11px] transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Timeline</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
