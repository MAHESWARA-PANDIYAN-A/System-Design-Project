import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Activity } from 'lucide-react';
import { KPICards } from '../components/dashboard/KPICards';
import { RequestGraph } from '../components/dashboard/RequestGraph';
import { LiveActivityStream } from '../components/dashboard/LiveActivityStream';
import { TrafficSimulationPanel } from '../components/dashboard/TrafficSimulationPanel';
import { useApp } from '../context/AppContext';

export const DashboardPage: React.FC = () => {
  const { setIsEndToEndDemoOpen, setIsCheckoutOpen, products, setCheckoutProduct } = useApp();

  const handleStartDemo = () => {
    setIsEndToEndDemoOpen(true);
  };

  const handleQuickBuy = () => {
    setCheckoutProduct(products[0]);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Welcome Banner (Prompt Section 44) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-semibold">
                HIGH-THROUGHPUT ENGINE
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-xs text-slate-300 font-mono">Distributed 2PC / Saga Orchestration</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              SALESSTORM
            </h2>
            <p className="text-sm md:text-base text-indigo-200/90 font-medium mt-1">
              Scalable commerce transaction, dynamic inventory reservation & idempotency platform
            </p>

            {/* 4 Hero Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-indigo-500/20">
              <div>
                <span className="text-[11px] font-mono uppercase text-indigo-300/80">Concurrent Scale</span>
                <p className="text-xl md:text-2xl font-bold font-mono text-white mt-0.5">10,000+</p>
                <span className="text-[10px] text-indigo-300/60">Simulated users</span>
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase text-indigo-300/80">Throughput Target</span>
                <p className="text-xl md:text-2xl font-bold font-mono text-cyan-400 mt-0.5">500K RPS</p>
                <span className="text-[10px] text-indigo-300/60">Burst simulation</span>
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase text-indigo-300/80">SLA Success Rate</span>
                <p className="text-xl md:text-2xl font-bold font-mono text-emerald-400 mt-0.5">99.97%</p>
                <span className="text-[10px] text-indigo-300/60">Zero double-charge</span>
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase text-indigo-300/80">Edge Latency</span>
                <p className="text-xl md:text-2xl font-bold font-mono text-amber-400 mt-0.5">&lt;100ms</p>
                <span className="text-[10px] text-indigo-300/60">p99 target</span>
              </div>
            </div>
          </div>

          {/* Action Hero CTAs */}
          <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={handleStartDemo}
              className="px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>RUN LIVE DEMO</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleQuickBuy}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 backdrop-blur-sm transition-colors text-center"
            >
              Simulate Instant Order (4-Step)
            </button>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Top 6 KPI Cards */}
      <KPICards />

      {/* Charts & Live Activity Stream Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RequestGraph />
        </div>
        <div className="lg:col-span-1">
          <LiveActivityStream />
        </div>
      </div>

      {/* Load Simulation Engine Panel */}
      <TrafficSimulationPanel />
    </div>
  );
};
