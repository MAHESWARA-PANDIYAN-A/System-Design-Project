import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Boxes,
  ClipboardList,
  CreditCard,
  Clock,
  Activity,
  Network,
  Server,
  Workflow,
  Terminal,
  FileText,
  Lock,
  BarChart3,
  Moon,
  Sun,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    reservations,
    dlqMessages,
    resetAllData,
  } = useApp();

  const activeReservationsCount = reservations.filter((r) => r.status === 'ACTIVE').length;
  const dlqCount = dlqMessages.filter((m) => m.status === 'PENDING').length;

  const mainNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    {
      id: 'reservations',
      label: 'Reservations',
      icon: Clock,
      badge: activeReservationsCount > 0 ? activeReservationsCount : undefined,
    },
    {
      id: 'events',
      label: 'Events & DLQ',
      icon: Activity,
      badge: dlqCount > 0 ? `${dlqCount} DLQ` : undefined,
    },
    { id: 'architecture', label: 'Architecture', icon: Network },
    { id: 'monitoring', label: 'System Monitor', icon: Server },
    { id: 'statemachine', label: 'State Machine', icon: Workflow },
    { id: 'apiconsole', label: 'API Console', icon: Terminal },
    { id: 'auditlogs', label: 'Audit Logs', icon: FileText },
    { id: 'security', label: 'Security & Limits', icon: Lock },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen select-none shrink-0 sticky top-0 text-slate-300">
      {/* Top Header Logo */}
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-base tracking-tight">SALESSTORM</span>
                <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-400 px-1 py-0.2 rounded border border-indigo-500/30">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Enterprise Transaction Core</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-slate-300 tracking-wider">
            Platform Services
          </div>
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.id === 'events'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-indigo-500/20 text-indigo-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Sidebar status & profile */}
      <div className="p-4 border-t border-slate-800/90 space-y-3 bg-slate-950/40">
        {/* System Health Status Indicator */}
        <div className="flex items-center justify-between px-2 py-1.5 bg-slate-800/60 rounded-lg border border-slate-700/50">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-medium text-slate-300">Cluster 99.98%</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">OPERATIONAL</span>
        </div>

        {/* Quick controls: theme toggle & reset seed */}
        <div className="flex items-center justify-between gap-2 px-1">
          <button
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs bg-slate-800/60 hover:bg-slate-700/70 text-slate-300 transition-colors"
            title="Toggle Light / Dark mode"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px]">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[11px]">Dark</span>
              </>
            )}
          </button>

          <button
            onClick={resetAllData}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs bg-slate-800/60 hover:bg-slate-700/70 text-slate-300 hover:text-white transition-colors"
            title="Reset to deterministic mock seed data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px]">Reset Data</span>
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pt-2 border-t border-slate-800/60">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs text-white shadow">
            MS
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">Mahesh</p>
            <p className="text-[10px] text-slate-400 truncate">Principal Architect</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
