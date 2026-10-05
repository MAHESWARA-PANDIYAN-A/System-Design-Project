import React from 'react';
import { motion } from 'framer-motion';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  CreditCard,
  Package,
  Layers,
  FileText,
  User,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getStatusBadge } from '../common/Badge';

export const OrderDetailDrawer: React.FC = () => {
  const { selectedOrder, setSelectedOrder } = useApp();

  if (!selectedOrder) return null;

  const order = selectedOrder;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedOrder(null)}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl h-full overflow-y-auto z-10 flex flex-col justify-between"
      >
        <div>
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                  {order.id}
                </span>
                {getStatusBadge(order.status)}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Created: {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Customer & Payment Meta Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 flex items-center gap-1 font-semibold mb-1">
                  <User className="w-3.5 h-3.5 text-indigo-500" /> Customer
                </span>
                <p className="font-bold text-slate-900 dark:text-white">{order.customerName}</p>
                <p className="text-slate-400 truncate">{order.customerEmail}</p>
              </div>

              <div>
                <span className="text-slate-400 flex items-center gap-1 font-semibold mb-1">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-500" /> Payment & Key
                </span>
                <p className="font-mono font-bold text-slate-900 dark:text-white">
                  {order.paymentId || 'Pending'}
                </p>
                <p className="font-mono text-[10px] text-slate-400 truncate" title={order.idempotencyKey}>
                  {order.idempotencyKey || 'None'}
                </p>
              </div>

              <div>
                <span className="text-slate-400 flex items-center gap-1 font-semibold mb-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> Reservation Lock
                </span>
                <p className="font-mono font-bold text-slate-900 dark:text-white">
                  {order.reservationId || 'Direct Finalized'}
                </p>
              </div>

              <div>
                <span className="text-slate-400 flex items-center gap-1 font-semibold mb-1">
                  <Package className="w-3.5 h-3.5 text-cyan-500" /> Order Total
                </span>
                <p className="font-mono font-bold text-base text-indigo-600 dark:text-indigo-400">
                  ₹{order.totalAmount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 font-bold mb-2">Order Line Items</h4>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-indigo-500">{item.sku}</span>
                      <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{item.name}</p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-slate-400">{item.quantity}x ₹{item.price.toLocaleString('en-IN')}</span>
                      <p className="font-bold text-slate-900 dark:text-white">
                        ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Animated Transaction Timeline */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  Distributed Transaction Saga Timeline
                </h4>
                <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                  AUDITED SAGA
                </span>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {order.timeline.map((step, idx) => {
                  const isDone = step.status === 'COMPLETED';
                  const isFail = step.status === 'FAILED';

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.08 }}
                      className="relative text-xs"
                    >
                      {/* Step Marker Dot */}
                      <span
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-bold ${
                          isDone
                            ? 'bg-emerald-500 text-white border-emerald-400'
                            : isFail
                            ? 'bg-rose-500 text-white border-rose-400'
                            : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-400'
                        }`}
                      >
                        {isDone ? '✓' : isFail ? '✕' : idx + 1}
                      </span>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {step.title}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {step.timestamp}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-mono mb-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            {step.service}
                          </span>
                          {step.eventId && (
                            <span className="text-slate-400">Ref: {step.eventId}</span>
                          )}
                        </div>

                        {step.details && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                            {step.details}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={() => setSelectedOrder(null)}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Close Drawer
          </button>
        </div>
      </motion.div>
    </div>
  );
};
