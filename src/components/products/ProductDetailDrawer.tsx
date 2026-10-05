import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Lock,
  Unlock,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  History,
  Boxes,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { getStatusBadge } from '../common/Badge';

export const ProductDetailDrawer: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    reservations,
    orders,
    reserveInventory,
    releaseReservation,
    setCheckoutProduct,
    setIsCheckoutOpen,
    theme,
    addToast,
  } = useApp();

  const [reserveQty, setReserveQty] = useState<number>(1);
  const [isReserving, setIsReserving] = useState<boolean>(false);

  if (!selectedProduct) return null;

  const product = selectedProduct;
  const isDark = theme === 'dark';

  // Find related reservations and orders for this SKU
  const productReservations = reservations
    .filter((r) => r.sku === product.sku)
    .slice(0, 5);

  const productOrders = orders
    .filter((o) => o.items.some((item) => item.sku === product.sku))
    .slice(0, 5);

  // Mock inventory trend chart data for this product
  const inventoryHistory = [
    { period: '00:00', available: product.availableStock + 12, reserved: 4 },
    { period: '04:00', available: product.availableStock + 8, reserved: 8 },
    { period: '08:00', available: product.availableStock + 2, reserved: 14 },
    { period: '12:00', available: product.availableStock, reserved: product.reservedStock },
  ];

  const handleReserveStock = async () => {
    setIsReserving(true);
    await reserveInventory(product.id, reserveQty, 600);
    setIsReserving(false);
  };

  const handleSimulatePurchase = () => {
    setCheckoutProduct(product);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleReleaseActiveReservation = () => {
    const active = productReservations.find((r) => r.status === 'ACTIVE');
    if (active) {
      releaseReservation(active.id);
    } else {
      addToast('info', 'No Active Reservation', 'No active TTL reservation found for this product.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedProduct(null)}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
      />

      {/* Drawer Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl h-full overflow-y-auto z-10 flex flex-col justify-between"
      >
        {/* Drawer Header */}
        <div>
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-10">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-indigo-500 font-bold">{product.sku}</span>
              <span className="text-slate-400">/</span>
              <span className="text-xs text-slate-500 uppercase font-semibold">{product.category}</span>
            </div>
            <button
              onClick={() => setSelectedProduct(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Top Product Banner */}
            <div className="flex gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-28 h-28 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-amber-500 font-bold">★ {product.rating} Rating</div>
                  {getStatusBadge(product.status)}
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mt-1">
                  {product.name}
                </h3>
                <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-2">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>

            {/* Inventory Breakdown Cards */}
            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 font-bold mb-3 flex items-center gap-1.5">
                <Boxes className="w-4 h-4 text-indigo-500" />
                Live Inventory Pool Breakdown
              </h4>
              <div className="grid grid-cols-4 gap-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Total</span>
                  <p className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                    {product.totalStock}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <span className="text-[10px] font-mono uppercase text-emerald-500">Available</span>
                  <p className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {product.availableStock}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                  <span className="text-[10px] font-mono uppercase text-amber-500">Reserved</span>
                  <p className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
                    {product.reservedStock}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Sold</span>
                  <p className="text-lg font-bold font-mono text-slate-500">
                    {product.soldStock}
                  </p>
                </div>
              </div>
            </div>

            {/* Inventory History Chart */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                Inventory Velocity (Available vs Reserved)
              </h4>
              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={inventoryHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                    <XAxis dataKey="period" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} />
                    <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#e2e8f0',
                        fontSize: '11px',
                        borderRadius: '6px',
                      }}
                    />
                    <Bar dataKey="available" name="Available" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="reserved" name="Reserved" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Reservations for this SKU */}
            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 font-bold mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Active & Recent Reservations
              </h4>
              <div className="space-y-1.5">
                {productReservations.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No reservation records for this SKU.</p>
                ) : (
                  productReservations.map((res) => (
                    <div
                      key={res.id}
                      className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono"
                    >
                      <div>
                        <span className="font-bold text-indigo-500">{res.id}</span>
                        <span className="text-slate-400 ml-2">({res.quantity} unit)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {res.status === 'ACTIVE' && (
                          <span className="text-amber-500 font-bold">
                            {res.remainingSeconds}s remaining
                          </span>
                        )}
                        {getStatusBadge(res.status)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions: RESERVE STOCK, RELEASE STOCK, SIMULATE PURCHASE */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setReserveQty((q) => Math.max(1, q - 1))}
              className="w-7 h-7 rounded bg-slate-200 dark:bg-slate-800 font-bold text-xs"
            >
              -
            </button>
            <span className="font-mono font-bold text-xs w-4 text-center">{reserveQty}</span>
            <button
              onClick={() => setReserveQty((q) => Math.min(product.availableStock, q + 1))}
              className="w-7 h-7 rounded bg-slate-200 dark:bg-slate-800 font-bold text-xs"
            >
              +
            </button>

            <button
              onClick={handleReserveStock}
              disabled={isReserving || product.availableStock < reserveQty}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>RESERVE STOCK</span>
            </button>

            <button
              onClick={handleReleaseActiveReservation}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              title="Release active TTL lock"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>RELEASE</span>
            </button>
          </div>

          <button
            onClick={handleSimulatePurchase}
            disabled={product.availableStock <= 0}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>SIMULATE PURCHASE</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
