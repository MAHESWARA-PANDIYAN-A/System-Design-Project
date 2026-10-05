import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, Radio, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LiveActivityStream: React.FC = () => {
  const { events, setActiveTab } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'SUCCESS' | 'WARNING' | 'ERROR'>('ALL');

  const filteredEvents = events.filter((e) => {
    if (filter === 'ALL') return true;
    return e.status === filter;
  }).slice(0, 16);

  // Helper for humanized timestamps: Just now, 2 sec ago, 8 sec ago
  const formatRelativeTime = (timestamp: number) => {
    const diffSec = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSec < 2) return 'Just now';
    if (diffSec < 60) return `${diffSec} sec ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHours = Math.floor(diffMin / 60);
    return `${diffHours}h ago`;
  };

  return (
    <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live System Activity</h3>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
            KAFKA STREAM
          </span>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1">
          {(['ALL', 'SUCCESS', 'WARNING', 'ERROR'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                filter === f
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div className="mt-3 flex-1 overflow-y-auto space-y-2.5 max-h-[360px] pr-1">
        {filteredEvents.map((evt, idx) => {
          const isSuccess = evt.status === 'SUCCESS';
          const isWarning = evt.status === 'WARNING';
          const isError = evt.status === 'ERROR';

          return (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.02 }}
              className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex items-start gap-2.5 text-xs"
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                {isWarning && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                {isError && <XCircle className="w-4 h-4 text-rose-500" />}
                {!isSuccess && !isWarning && !isError && <Info className="w-4 h-4 text-indigo-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                      {evt.eventType}
                    </span>
                    <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                      {evt.source}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {formatRelativeTime(evt.timestamp)}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed truncate">
                  {evt.message}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-2 text-center">
        <button
          onClick={() => setActiveTab('events')}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View Full Event Bus & Message Queue →
        </button>
      </div>
    </div>
  );
};
