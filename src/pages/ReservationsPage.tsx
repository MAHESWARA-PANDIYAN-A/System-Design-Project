import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Lock, Unlock, Play, AlertTriangle, CheckCircle2, RotateCcw, Plus, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getStatusBadge } from '../components/common/Badge';

export const ReservationsPage: React.FC = () => {
  const {
    reservations,
    products,
    reserveInventory,
    expireReservationNow,
    releaseReservation,
    addToast,
  } = useApp();

  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [qty, setQty] = useState<number>(1);
  const [ttlChoice, setTtlChoice] = useState<number>(600); // 600s = 10m, or 15s for quick test!
  const [isReserving, setIsReserving] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const handleCreateReservation = async () => {
    if (!selectedProduct) return;
    setIsReserving(true);
    await reserveInventory(selectedProduct.id, qty, ttlChoice);
    setIsReserving(false);
  };

  const filteredReservations = reservations.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Reservation Creator & Live Workflow Demonstration Card */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500 animate-spin-slow" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Inventory Reservation & Auto-Expiry Controller
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Time-to-Live (TTL) locks reserve stock during checkout. If customer abandons cart, stock automatically restores to available pool.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
              {reservations.filter((r) => r.status === 'ACTIVE').length} ACTIVE LOCKS
            </span>
          </div>
        </div>

        {/* Interactive Reservation Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 items-end">
          {/* 1. Product Select */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Select Product:
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full p-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.sku} — {p.name} ({p.availableStock} avail)
                </option>
              ))}
            </select>
          </div>

          {/* 2. Quantity */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Quantity to Lock:
            </label>
            <input
              type="number"
              min={1}
              max={selectedProduct?.availableStock || 1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="w-full p-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          {/* 3. TTL Choice (Standard 10m vs Quick 15s for Presentation) */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Lock TTL Duration:
            </label>
            <select
              value={ttlChoice}
              onChange={(e) => setTtlChoice(Number(e.target.value))}
              className="w-full p-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
            >
              <option value={600}>10 Minutes (600s) — Standard</option>
              <option value={15}>15 Seconds (⚡ Quick Expiry Demo)</option>
              <option value={30}>30 Seconds</option>
              <option value={120}>2 Minutes (120s)</option>
            </select>
          </div>

          {/* 4. Action Button */}
          <div>
            <button
              onClick={handleCreateReservation}
              disabled={isReserving || (selectedProduct?.availableStock || 0) < qty}
              className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isReserving ? 'Locking Stock...' : 'RESERVE INVENTORY'}</span>
            </button>
          </div>
        </div>

        {/* Workflow Diagram Callout */}
        <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 flex flex-wrap items-center justify-between text-xs font-mono text-indigo-700 dark:text-indigo-300 gap-2">
          <span>WORKFLOW:</span>
          <span>REQUEST</span>
          <span>➜</span>
          <span>INVENTORY CHECK</span>
          <span>➜</span>
          <span>STOCK RESERVED</span>
          <span>➜</span>
          <span>RESERVATION CREATED</span>
          <span>➜</span>
          <span className="text-amber-500 font-bold">EXPIRY TIMER ACTIVE</span>
        </div>
      </div>

      {/* Active & Historical Reservations Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Live Reservation Registry ({filteredReservations.length})
          </h4>

          <div className="flex items-center gap-1 text-xs">
            {['ALL', 'ACTIVE', 'EXPIRED', 'CONFIRMED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                  filterStatus === st
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono uppercase text-slate-500">
              <tr>
                <th className="py-3 px-4">Reservation ID</th>
                <th className="py-3 px-4">SKU / Product</th>
                <th className="py-3 px-4">Units</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Countdown Timer</th>
                <th className="py-3 px-4">Created At</th>
                <th className="py-3 px-4 text-right">Presenter Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {filteredReservations.map((r) => {
                const isActive = r.status === 'ACTIVE';

                return (
                  <tr
                    key={r.id}
                    className={`transition-colors ${
                      isActive
                        ? 'bg-amber-500/5 hover:bg-amber-500/10'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-indigo-500">{r.id}</td>
                    <td className="py-3 px-4 font-sans font-medium text-slate-900 dark:text-white">
                      <span className="font-mono text-xs text-indigo-400 mr-1.5">{r.sku}</span>
                      {r.productName}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                      {r.quantity}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(r.status)}</td>
                    <td className="py-3 px-4">
                      {isActive ? (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-500 text-sm">
                            {formatTimer(r.remainingSeconds)}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({r.remainingSeconds}s)
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">00:00 (Elapsed)</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(r.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isActive ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => expireReservationNow(r.id)}
                            className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 text-[11px] font-sans font-bold transition-colors"
                            title="Simulate immediate TTL expiration to trigger compensation"
                          >
                            FORCE EXPIRE NOW
                          </button>
                          <button
                            onClick={() => releaseReservation(r.id)}
                            className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-sans font-semibold transition-colors"
                          >
                            Release
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-sans">
                          {r.status === 'CONFIRMED' ? 'Sold & Committed' : 'Stock Restored'}
                        </span>
                      )}
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
