import React from 'react';
import { ArchitectureDiagram } from '../components/architecture/ArchitectureDiagram';
import { ShieldCheck, Zap, Database, Layers, Radio, Lock } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* Interactive Topology Diagram */}
      <ArchitectureDiagram />

      {/* Architecture Principles & Non-Functional Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-indigo-500 font-bold">
            <Zap className="w-4 h-4" />
            <span>High-Throughput Concurrency</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
            Stock decrements execute as atomic Lua scripts in the Redis cluster, guaranteeing zero race conditions, deadlocks, or overselling even under 500,000 requests/second.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-emerald-500 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Distributed Saga & Idempotency</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
            Every checkout request uses a deterministic Idempotency-Key. If payment gateway times out, compensatory rollback events automatically release held inventory without manual intervention.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-amber-500 font-bold">
            <Radio className="w-4 h-4" />
            <span>Eventual Consistency & DLQ</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
            Kafka event streaming decouples analytical and notification consumers from the transactional path. Stalled or poison-pill events route immediately to the Dead Letter Queue for isolation.
          </p>
        </div>
      </div>
    </div>
  );
};
