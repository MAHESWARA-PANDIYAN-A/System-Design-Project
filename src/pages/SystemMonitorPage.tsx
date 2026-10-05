import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Server,
  Activity,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Zap,
  Cpu,
  Layers,
  Clock,
  Radio,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getStatusBadge } from '../components/common/Badge';

interface ResilienceScenario {
  id: string;
  name: string;
  trigger: string;
  failure: string;
  detection: string;
  retry: string;
  compensation: string;
  recovery: string;
}

const RESILIENCE_SCENARIOS: ResilienceScenario[] = [
  {
    id: 'scen-1',
    name: 'Payment Gateway Timeout (504)',
    trigger: 'Simulate external acquiring network drop or latency spike > 3000ms',
    failure: 'Acquiring bank HTTP 504 Gateway Timeout during charge authorization',
    detection: 'Circuit breaker records 3 consecutive timeouts; marks service DEGRADED',
    retry: 'Exponential backoff retry with jitter (Attempt 1: 500ms, Attempt 2: 1500ms, Attempt 3: 3000ms)',
    compensation: 'If all retries fail, trigger compensating StockReleased event to restore reserved inventory',
    recovery: 'Webhook delivery queued to Dead Letter Queue (DLQ) for operator inspection or reconciliation',
  },
  {
    id: 'scen-2',
    name: 'Inventory Service Overload / Pod Crash',
    trigger: 'Simulate sudden flash sale spike causing memory exhaustion in Inventory pod',
    failure: 'Kubernetes OOMKilled signal on 2 out of 8 inventory service replicas',
    detection: 'Prometheus blackbox probe detects 503 Service Unavailable; Envoy redirects ingress',
    retry: 'Envoy client retries against healthy available replicas in availability zones B and C',
    compensation: 'Zero inventory oversell because state resides in distributed Redis Lua mutex',
    recovery: 'K8s HPA spins up 4 new replicas within 12 seconds; cluster recovers to HEALTHY',
  },
  {
    id: 'scen-3',
    name: 'Primary Database Shard Failover',
    trigger: 'Simulate PostgreSQL shard 1 hardware degradation or failover',
    failure: 'Write latency to primary shard exceeds 250ms SLA budget',
    detection: 'PgBouncer connection pool healthcheck flags replica lag > 100ms',
    retry: 'Read queries route to read-replica pools; write transactions paused for 1.2s',
    compensation: 'WAL write-ahead log replayed; zero lost committed transactions',
    recovery: 'Standby promoted to new primary within 1.8s; saga orchestrator completes pending transactions',
  },
  {
    id: 'scen-4',
    name: 'Kafka Message Queue Delay / Consumer Lag',
    trigger: 'Simulate notification service network partition',
    failure: 'Notification consumer group lag reaches 45,000 unread messages in topic',
    detection: 'Burrow / Kafka exporter alert: consumer lag > threshold (10,000)',
    retry: 'Consumer auto-scales instances from 4 to 12 pods; rebalances partition assignments',
    compensation: 'Transactional order processing is non-blocking and remains unaffected by notification lag',
    recovery: 'Lag drained at 15,000 msg/sec; SMS/Email dispatches resume in order',
  },
  {
    id: 'scen-5',
    name: 'Duplicate Payment Request (Double-Click)',
    trigger: 'User or script clicks "Pay Now" 5 times in 200 milliseconds',
    failure: 'Burst of 5 identical HTTP POST /api/v1/payments with identical Idempotency-Key',
    detection: 'Redis SET key val NX EX 86400 detects key already acquired; locks mutex',
    retry: 'Subsequent 4 requests pause in queue awaiting original response',
    compensation: 'Zero duplicate debit; card charged exactly once',
    recovery: 'Original transaction response (HTTP 200 OK) returned to all 4 duplicate callers',
  },
  {
    id: 'scen-6',
    name: 'Reservation TTL Expiry During Checkout',
    trigger: 'Customer places reservation lock but abandons checkout tab for > 10 minutes',
    failure: 'Customer completes 3D-Secure 15 minutes after initial stock lock',
    detection: 'Key-expiry daemon detects TTL reached 0s; triggers automatic sweep',
    retry: 'Order state transitions to EXPIRED; prompt customer to refresh availability',
    compensation: 'Reserved units decremented and returned to public Available pool automatically',
    recovery: 'Inventory discrepancy avoided; other customers immediately able to buy the item',
  },
];

export const SystemMonitorPage: React.FC = () => {
  const { services, simulateServiceFailure, recoverService } = useApp();
  const [selectedScenario, setSelectedScenario] = useState<ResilienceScenario>(RESILIENCE_SCENARIOS[0]);

  const handleSimulatePaymentService = () => {
    const pay = services.find((s) => s.name.includes('Payment'));
    if (pay) simulateServiceFailure(pay.id);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Controls Banner */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Cluster Service Mesh & Circuit Breaker Health
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry, pod replica counts, latency percentiles, and circuit breaker trip triggers
          </p>
        </div>

        <button
          onClick={handleSimulatePaymentService}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg shadow-md shadow-rose-600/20 transition-all flex items-center gap-2"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Simulate Payment Service Failure</span>
        </button>
      </div>

      {/* Services Grid (Prompt Section 25) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((srv) => {
          const isHealthy = srv.status === 'HEALTHY';
          const isDegraded = srv.status === 'DEGRADED';
          const isDown = srv.status === 'DOWN';
          const isRecovering = srv.status === 'RECOVERING';

          return (
            <div
              key={srv.id}
              className={`p-4 rounded-xl border transition-all ${
                isDown
                  ? 'bg-rose-500/10 border-rose-500 shadow-md ring-1 ring-rose-500/50'
                  : isDegraded
                  ? 'bg-amber-500/10 border-amber-500'
                  : isRecovering
                  ? 'bg-indigo-500/10 border-indigo-500'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {srv.name}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    {srv.version} · {srv.instances} Replicas
                  </span>
                </div>
                {getStatusBadge(srv.status)}
              </div>

              {/* Circuit Breaker Pill */}
              <div className="flex items-center justify-between text-[11px] font-mono py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 my-2.5">
                <span className="text-slate-500">Circuit Breaker:</span>
                <span
                  className={`font-bold ${
                    srv.circuitBreaker === 'CLOSED'
                      ? 'text-emerald-500'
                      : srv.circuitBreaker === 'HALF_OPEN'
                      ? 'text-amber-500'
                      : 'text-rose-500 animate-pulse'
                  }`}
                >
                  {srv.circuitBreaker}
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">LATENCY</span>
                  <span className="font-bold text-slate-900 dark:text-white">{srv.latencyMs}ms</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">THROUGHPUT</span>
                  <span className="font-bold text-indigo-500">{srv.rps.toLocaleString()} RPS</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ERROR RATE</span>
                  <span
                    className={`font-bold ${
                      srv.errorRatePercent > 5 ? 'text-rose-500' : 'text-emerald-500'
                    }`}
                  >
                    {srv.errorRatePercent}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">CPU / MEM</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {srv.cpuPercent}% / {srv.memoryPercent}%
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex justify-between gap-1 text-[11px]">
                {isHealthy ? (
                  <button
                    onClick={() => simulateServiceFailure(srv.id)}
                    className="w-full py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 hover:text-rose-500 text-slate-600 dark:text-slate-300 text-[10px] font-mono transition-colors"
                  >
                    Inject Fault
                  </button>
                ) : (
                  <button
                    onClick={() => recoverService(srv.id)}
                    className="w-full py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-mono font-bold transition-colors"
                  >
                    Force Recover
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Resilience Scenarios Walkthrough (Prompt Section 26) */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm space-y-4">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Fault Injection & Distributed Resilience Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Select an enterprise failure scenario to examine detection, automatic retry, and compensatory rollback mechanisms
          </p>
        </div>

        {/* Scenario Chips */}
        <div className="flex flex-wrap gap-2">
          {RESILIENCE_SCENARIOS.map((scen) => (
            <button
              key={scen.id}
              onClick={() => setSelectedScenario(scen)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedScenario.id === scen.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {scen.name}
            </button>
          ))}
        </div>

        {/* Selected Scenario Stepper Workflow */}
        <div className="p-5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Scenario: {selectedScenario.name}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <span className="font-mono text-[10px] text-rose-500 font-bold uppercase block mb-1">
                1. Failure Trigger
              </span>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedScenario.failure}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <span className="font-mono text-[10px] text-amber-500 font-bold uppercase block mb-1">
                2. Detection
              </span>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedScenario.detection}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <span className="font-mono text-[10px] text-indigo-500 font-bold uppercase block mb-1">
                3. Retry Policy
              </span>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedScenario.retry}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <span className="font-mono text-[10px] text-purple-400 font-bold uppercase block mb-1">
                4. Compensation
              </span>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedScenario.compensation}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="font-mono text-[10px] text-emerald-500 font-bold uppercase block mb-1">
                5. Self-Healing
              </span>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedScenario.recovery}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
