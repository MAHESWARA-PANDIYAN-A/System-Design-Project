import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieIcon, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalyticsPage: React.FC = () => {
  const { theme, orders, payments, products } = useApp();
  const [timeRange, setTimeRange] = useState<'24H' | '7D' | '30D'>('7D');

  const isDark = theme === 'dark';

  // Orders over time data
  const ordersOverTime = [
    { period: 'Mon', orders: 420, revenue: 384000 },
    { period: 'Tue', orders: 580, revenue: 512000 },
    { period: 'Wed', orders: 890, revenue: 840000 },
    { period: 'Thu', orders: 740, revenue: 690000 },
    { period: 'Fri', orders: 1240, revenue: 1180000 },
    { period: 'Sat', orders: 1560, revenue: 1420000 },
    { period: 'Sun', orders: 1100, revenue: 990000 },
  ];

  // Latency & Error Rate data
  const latencyData = [
    { time: '00:00', p95: 42, p99: 84, errorRate: 0.02 },
    { time: '04:00', p95: 38, p99: 76, errorRate: 0.01 },
    { time: '08:00', p95: 64, p99: 112, errorRate: 0.04 },
    { time: '12:00', p95: 88, p99: 145, errorRate: 0.08 },
    { time: '16:00', p95: 72, p99: 120, errorRate: 0.03 },
    { time: '20:00', p95: 54, p99: 98, errorRate: 0.02 },
  ];

  // Payment Breakdown
  const paymentBreakdown = [
    { name: 'Captured (Success)', value: 92, color: '#10b981' },
    { name: 'Gateway Timeout (Retried)', value: 6, color: '#f59e0b' },
    { name: 'Terminal Decline', value: 2, color: '#ef4444' },
  ];

  // Reservation Expiry trends
  const expiryTrends = [
    { day: 'Day 1', converted: 84, expired: 16 },
    { day: 'Day 2', converted: 88, expired: 12 },
    { day: 'Day 3', converted: 91, expired: 9 },
    { day: 'Day 4', converted: 86, expired: 14 },
    { day: 'Day 5', converted: 93, expired: 7 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header with Time Filters */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            Commerce SLA & Transaction Analytics
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Conversion funnels, p95/p99 latency distributions, and inventory velocity telemetry
          </p>
        </div>

        {/* 24H, 7D, 30D Filters (Prompt Section 30) */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          {(['24H', '7D', '30D'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                timeRange === r
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Orders & Revenue Over Time */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Orders Fulfilled & Ingress Throughput ({timeRange})
          </h4>
          <p className="text-xs text-slate-400 mb-4 font-mono">Daily volume processed</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="period" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} />
                <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    fontSize: '11px',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="orders" name="Order Volume" fill="#FCA311" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Latency Percentiles (p95 & p99) */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-500" />
            End-to-End Latency Percentiles (ms)
          </h4>
          <p className="text-xs text-slate-400 mb-4 font-mono">p95 & p99 SLA budget (&lt;100ms)</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="time" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} />
                <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    fontSize: '11px',
                    borderRadius: '8px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="p95" name="p95 Latency (ms)" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="p99" name="p99 Latency (ms)" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Payment Distribution Breakdown */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-purple-500" />
            Payment Authorization Distribution
          </h4>
          <p className="text-xs text-slate-400 mb-4 font-mono">92% 1st-try success, 6% backoff retry</p>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    fontSize: '11px',
                    borderRadius: '8px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Reservation TTL Conversion vs Expiry */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            Reservation TTL Conversion vs Release Ratio
          </h4>
          <p className="text-xs text-slate-400 mb-4 font-mono">Completed checkouts vs abandoned cart releases</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={expiryTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="day" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} />
                <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    fontSize: '11px',
                    borderRadius: '8px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="converted" name="Converted to Order (%)" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                <Area type="monotone" dataKey="expired" name="TTL Expired / Released (%)" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
