import React from 'react';
import { motion } from 'framer-motion';
import { Radio, ArrowRight, Layers, Cpu, Server, CheckCircle2, AlertOctagon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MessageQueueVisualizer: React.FC = () => {
  const { events, dlqMessages } = useApp();

  const totalEvents = events.length;
  const dlqCount = dlqMessages.filter((m) => m.status === 'PENDING').length;
  const recentEvents = events.slice(0, 4);

  return (
    <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-indigo-500 animate-pulse" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Kafka Distributed Event Stream & Consumer Groups
            </h3>
            <p className="text-xs text-slate-500">
              Low-latency log partitioning with at-least-once delivery guarantees
            </p>
          </div>
        </div>

        {/* Real-time Queue Telemetry */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400">Queue Depth:</span>{' '}
            <span className="font-bold text-indigo-500">42 msgs</span>
          </div>
          <div>
            <span className="text-slate-400">Rate:</span>{' '}
            <span className="font-bold text-emerald-500">7,200 msg/s</span>
          </div>
          <div>
            <span className="text-slate-400">DLQ Backlog:</span>{' '}
            <span className="font-bold text-rose-500">{dlqCount}</span>
          </div>
        </div>
      </div>

      {/* Animated Producer -> Topic Partitions -> Consumer Diagram */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 overflow-x-auto">
        {/* Producer Cluster */}
        <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-center min-w-[140px] shadow-sm">
          <Server className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
          <span className="font-bold text-xs text-slate-900 dark:text-white block">Microservice</span>
          <span className="text-[10px] text-slate-400 font-mono">Producers</span>
        </div>

        {/* Animated Packets Moving to Queue */}
        <div className="flex items-center gap-1 text-indigo-400">
          <motion.div
            animate={{ x: [0, 20, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-2.5 h-2.5 rounded-full bg-indigo-500"
          />
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Kafka Broker Topic & Partitions */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border-2 border-indigo-500/30 min-w-[280px] shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-indigo-500 mb-2">
            <span>TOPIC: commerce.transactions</span>
            <span>4 Partitions</span>
          </div>

          <div className="space-y-1.5">
            {[0, 1, 2, 3].map((partition) => (
              <div
                key={partition}
                className="p-1.5 rounded bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-mono"
              >
                <span className="text-slate-500">P-{partition}</span>
                <span className="text-emerald-500 font-semibold">Offset: {14200 + partition * 450}</span>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Animated Packets Moving to Consumer */}
        <div className="flex items-center gap-1 text-emerald-400">
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <motion.div
            animate={{ x: [0, 20, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-2.5 h-2.5 rounded-full bg-emerald-500"
          />
        </div>

        {/* Consumer Group */}
        <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-center min-w-[140px] shadow-sm">
          <Cpu className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
          <span className="font-bold text-xs text-slate-900 dark:text-white block">Consumer Group</span>
          <span className="text-[10px] text-emerald-400 font-mono">Lag: 0 ms</span>
        </div>
      </div>
    </div>
  );
};
