import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Play, Pause, Flame, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RequestGraph: React.FC = () => {
  const {
    requestHistory,
    isTrafficPaused,
    setIsTrafficPaused,
    loadSim,
    startLoadSimulation,
    stopLoadSimulation,
    theme,
  } = useApp();

  const currentRps =
    requestHistory.length > 0 ? requestHistory[requestHistory.length - 1].rps : 2400;
  const avgLatency =
    requestHistory.length > 0 ? requestHistory[requestHistory.length - 1].latency : 38;

  const isDark = theme === 'dark';

  return (
    <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm flex flex-col justify-between">
      {/* Header with Title and Interactive Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" />
              Real-Time Request Throughput
            </h3>
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono ${
                loadSim.isRunning
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  loadSim.isRunning ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'
                }`}
              />
              {loadSim.isRunning ? 'BURST LOAD' : 'NORMAL INGRESS'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Distributed edge proxy telemetry across 6 ingress gateway nodes
          </p>
        </div>

        {/* Action Controls: LIVE, PAUSE, SIMULATE LOAD */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTrafficPaused(false)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
              !isTrafficPaused
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Play className="w-3 h-3 fill-current" />
            <span>LIVE</span>
          </button>

          <button
            onClick={() => setIsTrafficPaused(true)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
              isTrafficPaused
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Pause className="w-3 h-3 fill-current" />
            <span>PAUSE</span>
          </button>

          <button
            onClick={() => {
              if (loadSim.isRunning) {
                stopLoadSimulation();
              } else {
                startLoadSimulation(10000, 500000, 60);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              loadSim.isRunning
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-500/20 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-rose-500/50'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${loadSim.isRunning ? 'text-white' : 'text-rose-500'}`} />
            <span>{loadSim.isRunning ? 'STOP LOAD' : 'SIMULATE LOAD'}</span>
          </button>
        </div>
      </div>

      {/* Numerical readouts */}
      <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-400">Current Load</span>
          <p className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
            {currentRps.toLocaleString()} <span className="text-xs font-normal text-slate-500">RPS</span>
          </p>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-400">Avg Gateway Latency</span>
          <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {avgLatency} <span className="text-xs font-normal text-slate-500">ms</span>
          </p>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-400">Success Rate</span>
          <p className="text-xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
            {loadSim.isRunning ? '99.97%' : '99.99%'}
          </p>
        </div>
      </div>

      {/* Recharts Area Graph */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={requestHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="rpsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={loadSim.isRunning ? '#f43f5e' : '#FCA311'} stopOpacity={0.4} />
                <stop offset="95%" stopColor={loadSim.isRunning ? '#f43f5e' : '#FCA311'} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)'}
            />
            <XAxis
              dataKey="time"
              stroke={isDark ? '#64748b' : '#94a3b8'}
              fontSize={10}
              tickLine={false}
            />
            <YAxis
              stroke={isDark ? '#64748b' : '#94a3b8'}
              fontSize={10}
              tickLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                borderColor: isDark ? '#334155' : '#e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
                color: isDark ? '#f8fafc' : '#0f172a',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
              }}
              formatter={(val: any) => [`${Number(val || 0).toLocaleString()} req/s`, 'Throughput']}
            />
            <Area
              type="monotone"
              dataKey="rps"
              stroke={loadSim.isRunning ? '#f43f5e' : '#FCA311'}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#rpsGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
