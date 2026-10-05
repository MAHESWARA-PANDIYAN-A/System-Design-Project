import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Workflow, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Clock, RefreshCw } from 'lucide-react';

interface StateNode {
  id: string;
  name: string;
  category: 'PRIMARY' | 'TERMINAL' | 'RETRY' | 'ABORTED';
  color: string;
  borderColor: string;
  bgColor: string;
  description: string;
  allowedTransitions: string[];
  guardConditions: string[];
  emittedEvents: string[];
  x: number; // visual layout percentage
  y: number;
}

const STATE_NODES: StateNode[] = [
  {
    id: 'CREATED',
    name: 'CREATED',
    category: 'PRIMARY',
    color: 'text-indigo-400',
    borderColor: 'border-indigo-500',
    bgColor: 'bg-indigo-500/10',
    description: 'Initial order intent registered in database. Customer cart validated and saga orchestrator initialized.',
    allowedTransitions: ['RESERVED', 'CANCELLED'],
    guardConditions: ['All SKUs exist and are active in catalog', 'Customer authentication token valid'],
    emittedEvents: ['OrderCreated'],
    x: 10,
    y: 25,
  },
  {
    id: 'RESERVED',
    name: 'RESERVED',
    category: 'PRIMARY',
    color: 'text-amber-400',
    borderColor: 'border-amber-500',
    bgColor: 'bg-amber-500/10',
    description: 'Stock locked via atomic Lua script in Redis with active 10-minute countdown TTL. Prevents race conditions and overselling.',
    allowedTransitions: ['PAYMENT_PENDING', 'EXPIRED'],
    guardConditions: ['Available inventory >= requested quantity', 'Redis mutex lock successfully acquired'],
    emittedEvents: ['InventoryReserved'],
    x: 32,
    y: 25,
  },
  {
    id: 'PAYMENT_PENDING',
    name: 'PAYMENT_PENDING',
    category: 'PRIMARY',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500',
    bgColor: 'bg-cyan-500/10',
    description: 'Charge request submitted with Idempotency-Key. Waiting for bank acquiring network response (3DS/UPI).',
    allowedTransitions: ['PAID', 'FAILED'],
    guardConditions: ['Reservation TTL has not expired (remainingSeconds > 0)', 'Idempotency key uniqueness verified'],
    emittedEvents: ['PaymentInitiated'],
    x: 54,
    y: 25,
  },
  {
    id: 'PAID',
    name: 'PAID',
    category: 'PRIMARY',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500',
    bgColor: 'bg-emerald-500/10',
    description: 'Funds authorized and captured by payment gateway. Transaction authorization code logged.',
    allowedTransitions: ['CONFIRMED'],
    guardConditions: ['Acquiring gateway responded HTTP 200/201 with valid authorization signature'],
    emittedEvents: ['PaymentAuthorized', 'PaymentCaptured'],
    x: 76,
    y: 25,
  },
  {
    id: 'CONFIRMED',
    name: 'CONFIRMED',
    category: 'TERMINAL',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500',
    bgColor: 'bg-emerald-500/20',
    description: 'Terminal success state! Reserved stock permanently transferred to sold pool. Invoice dispatched and fulfillment notified.',
    allowedTransitions: ['None (Terminal State)'],
    guardConditions: ['Ledger entry written to PostgreSQL', 'Inventory reservation marked confirmed'],
    emittedEvents: ['OrderConfirmed', 'NotificationDispatched'],
    x: 92,
    y: 25,
  },
  {
    id: 'EXPIRED',
    name: 'EXPIRED',
    category: 'ABORTED',
    color: 'text-rose-400',
    borderColor: 'border-rose-500',
    bgColor: 'bg-rose-500/10',
    description: 'Reservation TTL timer elapsed before customer completed payment. Compensating event automatically released stock back to available pool.',
    allowedTransitions: ['None (Terminal State)'],
    guardConditions: ['Countdown timer reached 0 seconds without PaymentAuthorized event'],
    emittedEvents: ['ReservationExpired', 'StockReleased'],
    x: 32,
    y: 75,
  },
  {
    id: 'FAILED',
    name: 'FAILED',
    category: 'RETRY',
    color: 'text-rose-400',
    borderColor: 'border-rose-500',
    bgColor: 'bg-rose-500/10',
    description: 'Payment authorization failed due to bank timeout, card decline, or network glitch.',
    allowedTransitions: ['RETRY', 'CANCELLED'],
    guardConditions: ['Gateway response != 200 or connection timeout after 3000ms'],
    emittedEvents: ['PaymentFailed', 'DLQMessageEnqueued'],
    x: 54,
    y: 75,
  },
  {
    id: 'RETRY',
    name: 'RETRY',
    category: 'RETRY',
    color: 'text-amber-400',
    borderColor: 'border-amber-500',
    bgColor: 'bg-amber-500/10',
    description: 'Automated exponential backoff retry in progress (max 3 attempts). Preserves existing reservation lock.',
    allowedTransitions: ['PAID', 'FAILED', 'CANCELLED'],
    guardConditions: ['Retry attempt count <= 3', 'Reservation lock still active in Redis'],
    emittedEvents: ['PaymentRetryInitiated'],
    x: 76,
    y: 75,
  },
  {
    id: 'CANCELLED',
    name: 'CANCELLED',
    category: 'ABORTED',
    color: 'text-slate-400',
    borderColor: 'border-slate-500',
    bgColor: 'bg-slate-500/10',
    description: 'Order cancelled by user or max retry threshold exhausted. Saga completed compensatory cleanup.',
    allowedTransitions: ['None (Terminal State)'],
    guardConditions: ['User cancellation intent or terminal retry exhaustion'],
    emittedEvents: ['OrderCancelled', 'StockReleased'],
    x: 92,
    y: 75,
  },
];

export const StateMachinePage: React.FC = () => {
  const [selectedState, setSelectedState] = useState<StateNode>(STATE_NODES[1]); // Default RESERVED

  return (
    <div className="space-y-6 pb-12">
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm">
        <div className="flex items-center gap-2">
          <Workflow className="w-5 h-5 text-indigo-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Order & Inventory Distributed State Machine DAG
          </h3>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Click any state node to examine valid inbound/outbound transitions, deterministic guard conditions, and emitted event payloads
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Graph Diagram (2 cols) */}
        <div className="lg:col-span-2 p-6 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl relative min-h-[480px] flex flex-col justify-between overflow-x-auto">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-6">
            <span>CORE SAGA TRANSITIONS</span>
            <span className="text-indigo-400">Click node for inspection</span>
          </div>

          {/* Primary Happy Path Row */}
          <div>
            <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-wider block mb-3">
              Happy Path: Instant Checkout Flow
            </span>
            <div className="flex items-center justify-between gap-2 overflow-x-auto py-2">
              {STATE_NODES.slice(0, 5).map((node, i) => {
                const isSelected = selectedState.id === node.id;
                return (
                  <React.Fragment key={node.id}>
                    <motion.div
                      onClick={() => setSelectedState(node)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-xl border-2 cursor-pointer text-center min-w-[110px] shadow-sm transition-all ${
                        isSelected
                          ? `${node.bgColor} ${node.borderColor} ring-2 ring-indigo-500 shadow-lg`
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                      }`}
                    >
                      <span className={`font-mono font-bold text-xs ${node.color} block`}>
                        {node.name}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 uppercase">
                        {node.category}
                      </span>
                    </motion.div>
                    {i < 4 && (
                      <div className="text-slate-400 flex items-center shrink-0">
                        <ArrowRight className="w-4 h-4 text-emerald-500 animate-pulse" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Compensatory & Failure Branches Row */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-mono text-rose-500 font-bold uppercase tracking-wider block mb-3">
              Alternative Branches: Expiry, Failure & Retries
            </span>
            <div className="flex items-center justify-between gap-2 overflow-x-auto py-2">
              {STATE_NODES.slice(5).map((node, i) => {
                const isSelected = selectedState.id === node.id;
                return (
                  <React.Fragment key={node.id}>
                    <motion.div
                      onClick={() => setSelectedState(node)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-xl border-2 cursor-pointer text-center min-w-[110px] shadow-sm transition-all ${
                        isSelected
                          ? `${node.bgColor} ${node.borderColor} ring-2 ring-indigo-500 shadow-lg`
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-400'
                      }`}
                    >
                      <span className={`font-mono font-bold text-xs ${node.color} block`}>
                        {node.name}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 uppercase">
                        {node.category}
                      </span>
                    </motion.div>
                    {i < 3 && (
                      <div className="text-slate-400 flex items-center shrink-0">
                        <ArrowRight className="w-4 h-4 text-rose-500" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected State Inspector Panel (1 col) */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className={`font-mono text-lg font-bold ${selectedState.color}`}>
                  {selectedState.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 uppercase">
                  {selectedState.category}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {selectedState.description}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1.5">
                Allowed Outbound Transitions
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedState.allowedTransitions.map((t, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono text-xs font-semibold"
                  >
                    → {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1.5">
                Deterministic Guard Conditions
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {selectedState.guardConditions.map((g, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-[11px]">{g}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1.5">
                Emitted Domain Events
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedState.emittedEvents.map((e, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono text-[11px]"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-400">
            Audit Guarantee: All state transitions committed with distributed tracing correlation ID
          </div>
        </div>
      </div>
    </div>
  );
};
