import React from 'react';
import { Play, AlertTriangle, Flame, Clock, RefreshCw, Copy, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DemoBanner: React.FC = () => {
  const {
    demoMode,
    setIsEndToEndDemoOpen,
    setIsCheckoutOpen,
    setCheckoutProduct,
    products,
    reservations,
    expireReservationNow,
    payments,
    retryPayment,
    startLoadSimulation,
    simulateServiceFailure,
    services,
    addToast,
    checkIdempotency,
  } = useApp();

  if (!demoMode) return null;

  const handleSimulateFailure = () => {
    const paymentSrv = services.find((s) => s.name.includes('Payment'));
    if (paymentSrv) {
      simulateServiceFailure(paymentSrv.id);
    }
  };

  const handleExpireFirstActive = () => {
    const active = reservations.find((r) => r.status === 'ACTIVE');
    if (active) {
      expireReservationNow(active.id);
    } else {
      addToast('info', 'No Active Reservation', 'Reserve stock first to test real-time TTL expiry.');
    }
  };

  const handleRetryPayment = () => {
    const failed = payments.find((p) => p.status === 'FAILED');
    if (failed) {
      retryPayment(failed.id, true);
    } else {
      addToast('info', 'No Failed Payment Found', 'Simulate a payment failure first, or click [Simulate Payment Failure].');
    }
  };

  const handleQuickPurchase = () => {
    const headphone = products.find((p) => p.sku === 'WH-1007') || products[0];
    setCheckoutProduct(headphone);
    setIsCheckoutOpen(true);
  };

  const handleDuplicateRequest = () => {
    const dummyKey = 'DEMO-IDEMP-KEY-999';
    const res = checkIdempotency(dummyKey, {});
    addToast(
      'info',
      'Idempotency Verification',
      res.isDuplicate
        ? `Duplicate key detected (${dummyKey})! Cache returned without duplicate payment.`
        : `First call with ${dummyKey} recorded in cache. Press again to see rejection of duplicate!`
    );
  };

  return (
    <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-500/30 px-4 py-2 text-xs text-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-sm select-none">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        <span className="font-mono font-bold text-indigo-400 tracking-wider uppercase text-[11px]">
          Demo / Simulation Mode Active
        </span>
        <span className="hidden md:inline text-slate-400 text-[11px]">— Quick scenario triggers for presenters:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setIsEndToEndDemoOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-md shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Run Purchase Demo</span>
        </button>

        <button
          onClick={handleQuickPurchase}
          className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md transition-colors"
        >
          <Play className="w-3 h-3 text-emerald-400" />
          <span>Interactive Buy</span>
        </button>

        <button
          onClick={handleSimulateFailure}
          className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md transition-colors"
        >
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span>Simulate Service Failure</span>
        </button>

        <button
          onClick={() => startLoadSimulation(10000, 500000, 45)}
          className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md transition-colors"
        >
          <Flame className="w-3 h-3 text-rose-400" />
          <span>Simulate 500k RPS</span>
        </button>

        <button
          onClick={handleExpireFirstActive}
          className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md transition-colors"
        >
          <Clock className="w-3 h-3 text-purple-400" />
          <span>Expire Reservation</span>
        </button>

        <button
          onClick={handleRetryPayment}
          className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md transition-colors"
        >
          <RefreshCw className="w-3 h-3 text-cyan-400" />
          <span>Retry Payment</span>
        </button>

        <button
          onClick={handleDuplicateRequest}
          className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md transition-colors"
        >
          <Copy className="w-3 h-3 text-amber-400" />
          <span>Test Idempotency</span>
        </button>
      </div>
    </div>
  );
};
