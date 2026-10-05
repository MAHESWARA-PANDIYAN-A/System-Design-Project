import React from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardCheck,
  PackageCheck,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const KPICards: React.FC = () => {
  const { orders, products, reservations, payments, requestHistory, loadSim } = useApp();

  // Calculate live values from central application state
  const activeOrdersCount = orders.filter((o) =>
    ['CREATED', 'RESERVED', 'PAYMENT_PENDING', 'CONFIRMED'].includes(o.status)
  ).length;

  const totalAvailableInventory = products.reduce((acc, p) => acc + p.availableStock, 0);
  const totalReservedInventory = products.reduce((acc, p) => acc + p.reservedStock, 0);

  const successfulPaymentsCount = payments.filter((p) => p.status === 'CAPTURED' || p.status === 'AUTHORIZED').length;
  const failedTransactionsCount = payments.filter((p) => p.status === 'FAILED').length;

  const latestRps = loadSim.isRunning
    ? loadSim.metrics.currentRps
    : requestHistory.length > 0
    ? requestHistory[requestHistory.length - 1].rps
    : 2400;

  const kpis = [
    {
      id: 'active_orders',
      title: 'Active Orders',
      value: activeOrdersCount.toLocaleString(),
      change: '+14.2%',
      isPositive: true,
      desc: 'In pipeline & fulfilled',
      icon: ClipboardCheck,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      id: 'available_inventory',
      title: 'Available Inventory',
      value: totalAvailableInventory.toLocaleString(),
      change: '-2.4%',
      isPositive: false,
      desc: 'Ready for reservation',
      icon: PackageCheck,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'reserved_inventory',
      title: 'Reserved Inventory',
      value: totalReservedInventory.toLocaleString(),
      change: '+18.6%',
      isPositive: true,
      desc: 'Active TTL locks active',
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      id: 'successful_payments',
      title: 'Successful Payments',
      value: successfulPaymentsCount.toLocaleString(),
      change: '+99.8%',
      isPositive: true,
      desc: 'Authorized & captured',
      icon: CheckCircle,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'failed_transactions',
      title: 'Failed Transactions',
      value: failedTransactionsCount.toLocaleString(),
      change: failedTransactionsCount > 0 ? '+1 retry' : '0.0%',
      isPositive: failedTransactionsCount === 0,
      desc: 'Routed to retry / DLQ',
      icon: XCircle,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
    },
    {
      id: 'requests_sec',
      title: 'Requests / sec',
      value: latestRps.toLocaleString(),
      change: loadSim.isRunning ? '+18,400%' : '+4.8%',
      isPositive: true,
      desc: loadSim.isRunning ? 'High traffic burst mode' : 'Gateway cluster ingress',
      icon: Activity,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide">{kpi.title}</span>
              <div className={`p-2 rounded-lg border ${kpi.bgColor}`}>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
            </div>

            <div className="mt-3">
              <motion.div
                key={kpi.value}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold font-mono text-slate-900 dark:text-white tracking-tight"
              >
                {kpi.value}
              </motion.div>

              <div className="flex items-center justify-between mt-1 text-[11px]">
                <span className="text-slate-600 dark:text-slate-300 truncate">{kpi.desc}</span>
                <span
                  className={`flex items-center font-mono font-medium ${
                    kpi.isPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                  }`}
                >
                  {kpi.isPositive ? (
                    <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                  )}
                  {kpi.change}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
