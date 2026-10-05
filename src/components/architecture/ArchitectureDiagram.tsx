import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  ShieldCheck,
  Server,
  Layers,
  CreditCard,
  Database,
  Radio,
  Bell,
  Cpu,
  FileText,
  ArrowRight,
  Info,
  X,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface ArchComponent {
  id: string;
  name: string;
  category: 'EDGE' | 'CORE' | 'STORAGE' | 'STREAM' | 'OBSERVABILITY';
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  responsibility: string;
  dependencies: string[];
  apis: string[];
  events: string[];
  failureHandling: string;
}

export const ARCH_COMPONENTS: ArchComponent[] = [
  {
    id: 'user_client',
    name: 'Customer Web / Mobile Client',
    category: 'EDGE',
    icon: User,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    responsibility: 'Renders reactive checkout interface, client-side validation, idempotency key generation, and WebSocket order updates.',
    dependencies: ['API Gateway'],
    apis: ['HTTPS REST / GraphQL', 'WSS (WebSocket)'],
    events: ['UserCheckoutInitiated', 'CartUpdated'],
    failureHandling: 'Client retry with exponential backoff and offline draft storage.',
  },
  {
    id: 'api_gateway',
    name: 'API Gateway (Envoy / Kong)',
    category: 'EDGE',
    icon: ShieldCheck,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    responsibility: 'Edge routing, JWT token verification, token-bucket rate limiting (quota 5000 req/min), CORS policy, and mTLS termination.',
    dependencies: ['Order Service', 'Inventory Service', 'Redis Cache'],
    apis: ['POST /api/v1/orders', 'POST /api/v1/reservations', 'POST /api/v1/payments'],
    events: ['RateLimitExceeded', 'InvalidAuthToken'],
    failureHandling: 'Active circuit breaker trips to half-open upon 5% 5xx errors; fallback responses served from CDN cache.',
  },
  {
    id: 'order_service',
    name: 'Order Orchestration Service',
    category: 'CORE',
    icon: Server,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    responsibility: 'Executes distributed Saga orchestration across inventory reservation, payment charging, order state machines, and final confirmation.',
    dependencies: ['Inventory Service', 'Payment Service', 'Message Broker', 'PostgreSQL DB'],
    apis: ['POST /orders', 'GET /orders/{id}', 'PUT /orders/{id}/cancel'],
    events: ['OrderCreated', 'OrderConfirmed', 'OrderCancelled', 'OrderFailed'],
    failureHandling: 'Compensating transactions execute reverse inventory release if payment fails.',
  },
  {
    id: 'inventory_service',
    name: 'Inventory & Reservation Service',
    category: 'CORE',
    icon: Layers,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    responsibility: 'High-speed stock decrementing, dynamic TTL reservation locks (10 min duration), race condition prevention, and automatic expiration sweepers.',
    dependencies: ['Redis Cluster', 'Message Broker', 'PostgreSQL DB'],
    apis: ['POST /reservations', 'DELETE /reservations/{id}', 'GET /inventory/{sku}'],
    events: ['InventoryReserved', 'ReservationExpired', 'StockReleased', 'StockDepleted'],
    failureHandling: 'Atomic Redis Lua scripts guarantee zero overselling under 500,000 simulated RPS.',
  },
  {
    id: 'payment_service',
    name: 'Payment Service & Gateway Integrator',
    category: 'CORE',
    icon: CreditCard,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    responsibility: 'Tokenized card and UPI payment processing, strict idempotency key deduplication, 3DS authentication, and automated retry policies.',
    dependencies: ['Bank Acquiring Rails', 'Redis Cache', 'Message Broker', 'DLQ'],
    apis: ['POST /payments', 'POST /payments/{id}/retry', 'GET /payments/{id}'],
    events: ['PaymentInitiated', 'PaymentAuthorized', 'PaymentCaptured', 'PaymentFailed'],
    failureHandling: 'Exponential backoff with jitter on gateway timeouts; terminal failures routed to Dead Letter Queue.',
  },
  {
    id: 'redis_cache',
    name: 'Distributed Cache (Redis Cluster)',
    category: 'STORAGE',
    icon: Zap,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    responsibility: 'Sub-millisecond inventory counters, TTL reservation expirations, and idempotency key lookup table.',
    dependencies: [],
    apis: ['EVALSHA (Atomic Lua)', 'SET key val EX 600 NX', 'GET / HGET'],
    events: ['KeyExpiredTrigger (Keyspace notifications)'],
    failureHandling: 'Sentinel automated failover with 3-node master-replica quorum.',
  },
  {
    id: 'postgresql_db',
    name: 'Primary Database (PostgreSQL Sharded)',
    category: 'STORAGE',
    icon: Database,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    responsibility: 'ACID persistent source of truth for settled orders, double-entry financial ledger entries, and audit compliance trails.',
    dependencies: [],
    apis: ['SQL via PgBouncer Connection Pooler'],
    events: ['WAL Change Data Capture (Debezium)'],
    failureHandling: 'Multi-AZ synchronous replication with automated replica promotion.',
  },
  {
    id: 'message_broker',
    name: 'Event Bus (Apache Kafka / RabbitMQ)',
    category: 'STREAM',
    icon: Radio,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    responsibility: 'High-throughput event streaming backbone connecting microservices with consumer groups and Dead Letter Queues.',
    dependencies: [],
    apis: ['Kafka Protocol / AMQP'],
    events: ['Partition Rebalance', 'ConsumerLagWarning'],
    failureHandling: 'Replica fetcher threads and in-sync replicas (ISR min=2) prevent event drop.',
  },
  {
    id: 'notification_service',
    name: 'Notification Service',
    category: 'CORE',
    icon: Bell,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    responsibility: 'Dispatches real-time order confirmation SMS, email invoices, and push notifications upon OrderConfirmed events.',
    dependencies: ['Message Broker', 'External SMS/Email Gateways'],
    apis: ['POST /notifications/send'],
    events: ['NotificationDispatched', 'NotificationDeliveryFailed'],
    failureHandling: 'Poisonous payloads routed to DLQ without stalling the event stream.',
  },
  {
    id: 'observability_system',
    name: 'Observability & Monitoring (Prometheus/Grafana)',
    category: 'OBSERVABILITY',
    icon: Cpu,
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/30',
    responsibility: 'Distributed trace collection (OpenTelemetry), RED metrics (Rate, Errors, Duration), and circuit breaker health telemetry.',
    dependencies: ['All microservices via OTel agents'],
    apis: ['GET /metrics (Prometheus scrape format)'],
    events: ['AlertFired (HighLatency, DegradedService)'],
    failureHandling: 'Independent monitoring cluster with 15-day retention buffer.',
  },
];

export const ArchitectureDiagram: React.FC = () => {
  const [selectedComp, setSelectedComp] = useState<ArchComponent | null>(ARCH_COMPONENTS[1]);

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Event-Driven Microservices Architecture Diagram
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
              Interactive Topology
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Click any component node to inspect its responsibility, APIs, emitted events, and failure compensation
          </p>
        </div>
      </div>

      {/* Interactive Topology Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Map (2 cols) */}
        <div className="lg:col-span-2 p-5 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
          {/* Animated background data flow line */}
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>Primary Distributed Ingress & Core Topology</span>
            <span className="text-indigo-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Data Flow Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {ARCH_COMPONENTS.map((comp) => {
              const Icon = comp.icon;
              const isSelected = selectedComp?.id === comp.id;

              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedComp(comp)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 relative ${
                    isSelected
                      ? 'bg-indigo-500/10 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                      : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-indigo-400/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${comp.bgColor} ${comp.borderColor} border`}>
                        <Icon className={`w-4 h-4 ${comp.color}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                          {comp.name}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400">{comp.category}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {comp.responsibility}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Component Inspector Panel (1 col) */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          {selectedComp ? (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${selectedComp.bgColor} border ${selectedComp.borderColor}`}>
                    <selectedComp.icon className={`w-5 h-5 ${selectedComp.color}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {selectedComp.name}
                    </h4>
                    <span className="text-[10px] font-mono uppercase text-indigo-400">
                      {selectedComp.category} NODE
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                  Primary Responsibility
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedComp.responsibility}
                </p>
              </div>

              {selectedComp.dependencies.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                    Upstream Dependencies
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedComp.dependencies.map((dep, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                  Exposed API Surface
                </span>
                <div className="space-y-1">
                  {selectedComp.apis.map((api, i) => (
                    <div
                      key={i}
                      className="px-2 py-1 rounded bg-slate-950 text-indigo-300 font-mono text-[10px] border border-slate-800"
                    >
                      {api}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                  Emitted Event Topics
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedComp.events.map((evt, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-semibold"
                    >
                      {evt}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                <span className="font-bold text-amber-500 block mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Failure & Compensation Handling:
                </span>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {selectedComp.failureHandling}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Select a component to inspect its architecture specifications.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
