import React, { useState } from 'react';
import { CreditCard, ShieldCheck, RefreshCw, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getStatusBadge } from '../components/common/Badge';
import { IdempotencyDemo } from '../components/payments/IdempotencyDemo';

export const PaymentsPage: React.FC = () => {
  const { payments, retryPayment } = useApp();
  const [activeTab, setActiveTab] = useState<'TRANSACTIONS' | 'IDEMPOTENCY' | 'FAILURE_DEMO'>('TRANSACTIONS');
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const handleRetry = async (paymentId: string, forceSuccess: boolean) => {
    setRetryingId(paymentId);
    await retryPayment(paymentId, forceSuccess);
    setRetryingId(null);
  };

  const totalCaptured = payments
    .filter((p) => p.status === 'CAPTURED')
    .reduce((acc, p) => acc + p.amount, 0);

  const failedCount = payments.filter((p) => p.status === 'FAILED').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Tab Switcher: Transactions, Idempotency Playground, Failure Simulator */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('TRANSACTIONS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'TRANSACTIONS'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Settled Transactions ({payments.length})
          </button>

          <button
            onClick={() => setActiveTab('IDEMPOTENCY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'IDEMPOTENCY'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Idempotency Guard Demo</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-500">Captured Volume:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
            ₹{totalCaptured.toLocaleString('en-IN')}
          </span>
          {failedCount > 0 && (
            <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 font-bold">
              {failedCount} FAILED (DLQ)
            </span>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'TRANSACTIONS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono uppercase text-slate-500">
                <tr>
                  <th className="py-3 px-4">Payment ID</th>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Idempotency Key</th>
                  <th className="py-3 px-4">Attempts</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Retry Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {payments.map((p) => {
                  const isFailed = p.status === 'FAILED';

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                        isFailed ? 'bg-rose-500/5' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-emerald-500">{p.id}</td>
                      <td className="py-3 px-4 font-bold text-indigo-500">{p.orderId}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        ₹{p.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 uppercase text-slate-600 dark:text-slate-300">
                        {p.method.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-400 max-w-[160px] truncate" title={p.idempotencyKey}>
                        {p.idempotencyKey}
                      </td>
                      <td className="py-3 px-4 text-slate-400">{p.attempts}</td>
                      <td className="py-3 px-4">{getStatusBadge(p.status)}</td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {new Date(p.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isFailed ? (
                          <div className="flex items-center justify-end gap-1.5 font-sans">
                            <button
                              onClick={() => handleRetry(p.id, true)}
                              disabled={retryingId === p.id}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors shadow-sm"
                            >
                              {retryingId === p.id ? 'Retrying...' : 'RETRY SUCCESS'}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-sans">Settled ✓</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'IDEMPOTENCY' && <IdempotencyDemo />}
    </div>
  );
};
