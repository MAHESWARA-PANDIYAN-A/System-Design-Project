import React, { useState } from 'react';
import {
  Bell,
  Search,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Shield,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const {
    activeTab,
    demoMode,
    setDemoMode,
    searchQuery,
    setSearchQuery,
    setIsEndToEndDemoOpen,
    setIsCheckoutOpen,
    events,
    products,
    setCheckoutProduct,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return { title: 'SalesStorm Control Center', desc: 'Real-time commerce, inventory and transaction monitoring' };
      case 'products':
        return { title: 'Product Catalog & Availability', desc: 'Real-time SKU availability and dynamic inventory reservation' };
      case 'inventory':
        return { title: 'Inventory Management', desc: 'Warehouse pools, lock allocations, and reservation pressure telemetry' };
      case 'orders':
        return { title: 'Order Orchestration', desc: 'Order state transitions, transaction timeline, and audit references' };
      case 'payments':
        return { title: 'Payment Processing & Idempotency', desc: 'Authorized transactions, failure handling, and replay guard verification' };
      case 'reservations':
        return { title: 'Inventory Reservations', desc: 'Time-to-Live locks, active countdown timers, and automatic compensation release' };
      case 'events':
        return { title: 'Event Bus & Message Queue', desc: 'Simulated Kafka stream, consumer group processing, and Dead Letter Queue (DLQ)' };
      case 'architecture':
        return { title: 'Interactive System Architecture', desc: 'Microservices topology, circuit breakers, and event-driven data flow' };
      case 'monitoring':
        return { title: 'System Monitor & Service Health', desc: 'Telemetry, latency distributions, CPU/Memory metrics, and fault injection' };
      case 'statemachine':
        return { title: 'Order & Payment State Machine', desc: 'Deterministic state transition diagrams, guard conditions, and compensation edges' };
      case 'apiconsole':
        return { title: 'API Sandbox & Swagger Explorer', desc: 'Live REST API testing console with interactive JSON payloads and status codes' };
      case 'auditlogs':
        return { title: 'Audit Trail & Compliance Log', desc: 'Immutable operational history, security events, and user activity records' };
      case 'security':
        return { title: 'Security Posture & Rate Limiting', desc: 'Token bucket rate limiters, mTLS encryption, and RBAC policies' };
      case 'analytics':
        return { title: 'Commerce Analytics & SLA Telemetry', desc: 'Historical throughput, p99 latency, and checkout conversion metrics' };
      default:
        return { title: 'SalesStorm Platform', desc: 'Real-time commerce transaction orchestration' };
    }
  };

  const { title, desc } = getPageTitle(activeTab);
  const recentEvents = events.slice(0, 8);

  const handleStartPurchase = () => {
    const defaultProd = products.find((p) => p.sku === 'WH-1007') || products[0];
    setCheckoutProduct(defaultProd);
    setIsCheckoutOpen(true);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-6 py-3.5 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Title & Breadcrumbs */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-slate-600 dark:text-slate-300">
            <span>SalesStorm</span>
            <span>/</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{activeTab}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5 truncate">
            {title}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 hidden sm:block truncate mt-0.5 font-normal">
            {desc}
          </p>
        </div>

        {/* Right: Search, Demo Mode, Action Buttons, Notifications */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Global Search Input */}
          <div className="relative hidden lg:block w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search SKUs, orders, keys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Demo Mode Toggle */}
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              demoMode
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-300'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
            title="Toggle Demo Mode interactive top bar"
          >
            {demoMode ? (
              <ToggleRight className="w-4 h-4 text-indigo-500" />
            ) : (
              <ToggleLeft className="w-4 h-4 text-slate-500" />
            )}
            <span className="hidden sm:inline font-mono">DEMO MODE</span>
          </button>

          {/* Quick Buy wizard */}
          <button
            onClick={handleStartPurchase}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-sm transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Simulate Order</span>
          </button>

          {/* Run Centerpiece Demo Animation */}
          <button
            onClick={() => setIsEndToEndDemoOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-md shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>RUN PURCHASE DEMO</span>
          </button>

          {/* Notifications Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 transition-colors relative"
              aria-label="View system notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">Live System Events</span>
                  <span className="text-[10px] font-mono text-slate-400">{events.length} logged</span>
                </div>
                <div className="mt-2 space-y-2 max-h-72 overflow-y-auto">
                  {recentEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/40 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-900 dark:text-slate-200 text-[11px]">
                          {evt.eventType}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">{evt.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
