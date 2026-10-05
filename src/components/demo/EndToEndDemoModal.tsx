import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Server,
  Layers,
  ShieldCheck,
  CreditCard,
  User,
  ArrowRight,
  Database,
  Radio,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

interface StepDetail {
  id: number;
  service: string;
  action: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  badge: string;
  log: string;
}

const DEMO_STEPS: StepDetail[] = [
  {
    id: 1,
    service: 'Customer Client',
    action: 'Click "Place Order"',
    desc: 'Customer selects AcousticPro Headphones (WH-1007) and submits checkout intent',
    icon: User,
    color: 'text-indigo-400',
    badge: 'CLIENT_INGRESS',
    log: 'POST /api/v1/orders HTTP/2.0 — Origin: Chrome/124.0.0 — Idempotency-Key: IDEMP-DEMO-ORD-10901',
  },
  {
    id: 2,
    service: 'API Gateway (Envoy)',
    action: 'Token Bucket & mTLS Auth',
    desc: 'Gateway validates JWT signature, rate limits (quota 2,340/5,000), and injects TraceContext',
    icon: ShieldCheck,
    color: 'text-cyan-400',
    badge: 'GATEWAY_ROUTED',
    log: '200 OK Token verified. Injected X-Correlation-ID: 7f8a9b2c. Route -> OrderService cluster',
  },
  {
    id: 3,
    service: 'Order Service',
    action: 'Create Pending Order',
    desc: 'Registers initial order in CREATED state and triggers distributed saga orchestrator',
    icon: Server,
    color: 'text-indigo-400',
    badge: 'ORDER_PENDING',
    log: 'Order ORD-10901 allocated. Saga step #1: requesting inventory lock from InventoryService',
  },
  {
    id: 4,
    service: 'Inventory Service',
    action: 'Atomic Redis Reservation Lock',
    desc: 'Executes Lua script to decrement available stock and increment reserved stock with 10m TTL',
    icon: Layers,
    color: 'text-amber-400',
    badge: 'STOCK_LOCKED',
    log: 'EVALSHA redis_reserve_stock.lua: SKU-WH-1007 qty=1. Status: OK. Set TTL=600s key=res:RES-78990',
  },
  {
    id: 5,
    service: 'Reservation Created',
    action: 'TTL Timer Initiated',
    desc: 'Reservation RES-78990 bound to order. Auto-compensation timer registered with Kafka delay queue',
    icon: Clock,
    color: 'text-purple-400',
    badge: 'TTL_ACTIVE',
    log: 'ReservationCreated event emitted to Kafka topic "inventory.reservations" (partition 3, offset 9821)',
  },
  {
    id: 6,
    service: 'Payment Service',
    action: 'Acquiring Bank Authorization',
    desc: 'Dispatches idempotent transaction to acquiring gateway with TLS 1.3 encryption',
    icon: CreditCard,
    color: 'text-emerald-400',
    badge: 'PAYMENT_AUTH',
    log: 'POST /v1/charges 200 OK — AuthCode: AUTH_994182 — Payment PAY-78990 AUTHORIZED',
  },
  {
    id: 7,
    service: 'Payment Captured',
    action: 'Settlement & DLQ Clearance',
    desc: 'Payment captured, ledger transaction committed to PostgreSQL sharded partition',
    icon: Database,
    color: 'text-emerald-400',
    badge: 'FUNDS_CAPTURED',
    log: 'Ledger TX #994812 written to Shard 2. Emitted PaymentCaptured event. Clearing idempotency guard.',
  },
  {
    id: 8,
    service: 'Order Service',
    action: 'Order Confirmed & Finalized',
    desc: 'Inventory lock converted to SOLD, SMS/Email notification queued, order confirmed!',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    badge: 'ORDER_CONFIRMED',
    log: 'Order ORD-10901 transitioned to CONFIRMED. Saga completed successfully in 84ms total latency.',
  },
];

export const EndToEndDemoModal: React.FC = () => {
  const { isEndToEndDemoOpen, setIsEndToEndDemoOpen, reserveInventory, processPayment, createOrderWithReservation, products } =
    useApp();

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [demoOrderInfo, setDemoOrderInfo] = useState<{
    orderId: string;
    paymentId: string;
    reservationId: string;
  }>({
    orderId: 'ORD-10901',
    paymentId: 'PAY-78990',
    reservationId: 'RES-78990',
  });

  // Auto-play steps
  useEffect(() => {
    if (!isEndToEndDemoOpen) {
      setCurrentStepIndex(0);
      setLogs([]);
      return;
    }

    if (!isPlaying) return;

    if (currentStepIndex < DEMO_STEPS.length - 1) {
      const timer = setTimeout(() => {
        const nextIdx = currentStepIndex + 1;
        setCurrentStepIndex(nextIdx);
        setLogs((prev) => [...prev, DEMO_STEPS[nextIdx].log]);

        if (nextIdx === DEMO_STEPS.length - 1) {
          try {
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
          } catch (e) {}

          // Actually commit this purchase to real app state so it's visible in tables!
          const prod = products[0];
          reserveInventory(prod.id, 1, 600).then((resRes) => {
            if (resRes.reservation) {
              createOrderWithReservation('Executive Judge', 'judge@hackathon.dev', [
                { productId: prod.id, sku: prod.sku, name: prod.name, quantity: 1, price: prod.price },
              ], resRes.reservation.id).then((ord) => {
                processPayment(ord.id, 'credit_card', `IDEMP-${ord.id}`, { simulateFailure: false });
                setDemoOrderInfo({
                  orderId: ord.id,
                  paymentId: `PAY-${ord.id.slice(4)}`,
                  reservationId: resRes.reservation!.id,
                });
              });
            }
          });
        }
      }, 1600);

      return () => clearTimeout(timer);
    }
  }, [isEndToEndDemoOpen, isPlaying, currentStepIndex]);

  if (!isEndToEndDemoOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIndex];
  const isFinished = currentStepIndex === DEMO_STEPS.length - 1;

  const handleReset = () => {
    setCurrentStepIndex(0);
    setLogs([DEMO_STEPS[0].log]);
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsEndToEndDemoOpen(false)}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
      />

      {/* Main Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-slate-900 border border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden z-10 my-8 text-slate-100 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  End-to-End Distributed Transaction Walkthrough
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  CENTERPIECE DEMO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Visualizing the complete event-driven order saga across microservices in real time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title={isPlaying ? 'Pause simulation' : 'Resume simulation'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Restart from Step 1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsEndToEndDemoOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Architecture Flow Chart */}
        <div className="p-6 bg-slate-950/40 border-b border-slate-800 overflow-x-auto">
          <div className="min-w-[700px] flex items-center justify-between relative py-4">
            {/* Connecting Track Line */}
            <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-800 -z-0 rounded" />
            <div
              className="absolute top-1/2 left-6 -translate-y-1/2 h-1 bg-indigo-500 -z-0 rounded transition-all duration-700"
              style={{
                width: `${(currentStepIndex / (DEMO_STEPS.length - 1)) * 92}%`,
              }}
            />

            {/* Steps Nodes */}
            {DEMO_STEPS.map((s, idx) => {
              const Icon = s.icon;
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;

              return (
                <div key={s.id} className="relative z-10 flex flex-col items-center group">
                  <motion.div
                    animate={
                      isActive
                        ? { scale: [1, 1.15, 1], boxShadow: '0 0 20px rgba(99, 102, 241, 0.8)' }
                        : {}
                    }
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border-2 transition-all ${
                      isActive
                        ? 'bg-indigo-600 border-white text-white shadow-xl'
                        : isPast
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                        : 'bg-slate-900 border-slate-700 text-slate-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>

                  <span
                    className={`text-[10px] font-mono mt-2 text-center max-w-[80px] font-semibold leading-tight ${
                      isActive ? 'text-indigo-400' : isPast ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {s.service}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle Stage: Current Step Highlighting & Explanation */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-y-auto">
          {/* Active Node Detail Card */}
          <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  STEP {currentStep.id} OF {DEMO_STEPS.length}
                </span>
                <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  {currentStep.badge}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2.5 rounded-lg bg-indigo-950 border border-indigo-500/40 text-indigo-400`}>
                  <currentStep.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{currentStep.service}</h4>
                  <p className="text-xs text-indigo-300 font-semibold">{currentStep.action}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mt-3">{currentStep.desc}</p>
            </div>

            {/* If finished: Show Success Card with IDs */}
            {isFinished ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs space-y-1.5"
              >
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>✓ PURCHASE SUCCESSFUL & COMMITTED!</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Order ID:</span>
                  <span className="text-white font-bold">{demoOrderInfo.orderId}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Payment ID:</span>
                  <span className="text-white font-bold">{demoOrderInfo.paymentId}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Reservation ID:</span>
                  <span className="text-white font-bold">{demoOrderInfo.reservationId}</span>
                </div>
              </motion.div>
            ) : (
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-700/60 font-mono">
                <span>Latency overhead: ~12ms</span>
                <span>Circuit Breaker: CLOSED</span>
              </div>
            )}
          </div>

          {/* Real-time Event Log Terminal */}
          <div className="p-4 rounded-xl bg-black border border-slate-800 flex flex-col font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-500 ml-1">saga-orchestrator.log</span>
              </div>
              <span className="text-indigo-400">stdout</span>
            </div>

            <div className="flex-1 mt-2.5 overflow-y-auto space-y-2 text-[11px] max-h-56 pr-1">
              {logs.map((line, i) => (
                <div key={i} className="text-slate-300 leading-relaxed flex items-start gap-2">
                  <span className="text-emerald-500 shrink-0">➜</span>
                  <span className="break-all">{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Next / Prev controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Saga Orchestrator:</span>
            <span className="font-mono text-emerald-400 font-semibold">DISTRIBUTED 2PC (NON-BLOCKING)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStepIndex((i) => Math.max(0, i - 1))}
              disabled={currentStepIndex === 0}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 font-semibold"
            >
              Previous
            </button>
            <button
              onClick={() => {
                if (currentStepIndex < DEMO_STEPS.length - 1) {
                  setCurrentStepIndex((i) => i + 1);
                  setLogs((prev) => [...prev, DEMO_STEPS[currentStepIndex + 1].log]);
                }
              }}
              disabled={currentStepIndex === DEMO_STEPS.length - 1}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold flex items-center gap-1.5"
            >
              <span>Next Stage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
