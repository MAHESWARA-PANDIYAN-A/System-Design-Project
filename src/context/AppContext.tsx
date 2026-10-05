import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Product,
  Order,
  Reservation,
  Payment,
  SystemEvent,
  ServiceHealth,
  AuditLog,
  DLQMessage,
  ToastMessage,
  LoadSimulationConfig,
  PaymentMethod,
  OrderItem,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_SERVICES,
  INITIAL_DLQ_MESSAGES,
  generateSeedOrders,
  generateSeedReservations,
  generateSeedPayments,
  generateSeedEvents,
  generateSeedAuditLogs,
} from '../data/seedData';

export interface RequestDataPoint {
  time: string;
  rps: number;
  latency: number;
  successRate: number;
}

interface AppContextType {
  // Navigation & UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Modals & Drawers
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (o: Order | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  checkoutProduct: Product | null;
  setCheckoutProduct: (p: Product | null) => void;
  isEndToEndDemoOpen: boolean;
  setIsEndToEndDemoOpen: (open: boolean) => void;

  // Domain Entities
  products: Product[];
  orders: Order[];
  reservations: Reservation[];
  payments: Payment[];
  events: SystemEvent[];
  services: ServiceHealth[];
  auditLogs: AuditLog[];
  dlqMessages: DLQMessage[];
  toasts: ToastMessage[];

  // Real-time Traffic Graph
  requestHistory: RequestDataPoint[];
  isTrafficPaused: boolean;
  setIsTrafficPaused: (paused: boolean) => void;

  // Load Simulation
  loadSim: LoadSimulationConfig;
  startLoadSimulation: (users?: number, rps?: number, duration?: number) => void;
  stopLoadSimulation: () => void;
  resetLoadSimulation: () => void;

  // Business Workflow Operations
  reserveInventory: (
    productId: string,
    quantity: number,
    customTtlSecs?: number
  ) => Promise<{ success: boolean; reservation?: Reservation; error?: string }>;
  expireReservationNow: (reservationId: string) => void;
  releaseReservation: (reservationId: string) => void;
  createOrderWithReservation: (
    customerName: string,
    customerEmail: string,
    items: OrderItem[],
    reservationId?: string
  ) => Promise<Order>;
  processPayment: (
    orderId: string,
    method: PaymentMethod,
    idempotencyKey: string,
    options?: { simulateFailure?: boolean; forceSuccess?: boolean }
  ) => Promise<{ success: boolean; payment: Payment; error?: string }>;
  retryPayment: (paymentId: string, forceSuccess?: boolean) => Promise<{ success: boolean; payment: Payment }>;
  checkIdempotency: (key: string, payload: any) => { isDuplicate: boolean; cachedResponse?: any; timestamp?: number };
  simulateServiceFailure: (serviceId: string) => void;
  recoverService: (serviceId: string) => void;
  replayDLQMessage: (dlqId: string) => void;
  discardDLQMessage: (dlqId: string) => void;

  // Utilities
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Shell
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('salesstorm_theme_v2') as 'dark' | 'light') || 'light';
  });
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [isEndToEndDemoOpen, setIsEndToEndDemoOpen] = useState<boolean>(false);

  // Entities
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(() => generateSeedOrders());
  const [reservations, setReservations] = useState<Reservation[]>(() => generateSeedReservations());
  const [payments, setPayments] = useState<Payment[]>(() => generateSeedPayments());
  const [events, setEvents] = useState<SystemEvent[]>(() => generateSeedEvents());
  const [services, setServices] = useState<ServiceHealth[]>(INITIAL_SERVICES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => generateSeedAuditLogs());
  const [dlqMessages, setDlqMessages] = useState<DLQMessage[]>(INITIAL_DLQ_MESSAGES);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Idempotency Store cache: key -> { response, timestamp }
  const idempotencyStoreRef = useRef<Map<string, { response: any; timestamp: number }>>(new Map());

  // Realtime Traffic Data
  const [isTrafficPaused, setIsTrafficPaused] = useState<boolean>(false);
  const [requestHistory, setRequestHistory] = useState<RequestDataPoint[]>(() => {
    const points: RequestDataPoint[] = [];
    const now = Date.now();
    for (let i = 20; i >= 0; i--) {
      const d = new Date(now - i * 3000);
      points.push({
        time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        rps: 1800 + Math.floor(Math.sin(i) * 600) + Math.floor(Math.random() * 300),
        latency: 42 + Math.floor(Math.random() * 18),
        successRate: 99.98,
      });
    }
    return points;
  });

  // Load Simulation state
  const [loadSim, setLoadSim] = useState<LoadSimulationConfig>({
    isRunning: false,
    concurrentUsers: 10000,
    targetRps: 500000,
    durationSeconds: 60,
    elapsedSeconds: 0,
    metrics: {
      activeUsers: 240,
      currentRps: 2840,
      successRate: 99.98,
      avgLatencyMs: 38,
      queueDepth: 42,
      cpuUtilization: 34,
    },
  });

  // Apply dark theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('salesstorm_theme_v2', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Toast Helpers
  const addToast = useCallback((type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, type, title, message, timestamp: Date.now() };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));

    // Auto dismiss after 5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // System Event Logger
  const logSystemEvent = useCallback(
    (
      eventType: SystemEvent['eventType'],
      source: SystemEvent['source'],
      status: SystemEvent['status'],
      message: string,
      payload: Record<string, any> = {}
    ) => {
      const evt: SystemEvent = {
        id: `EVT-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 6)}`,
        eventType,
        source,
        status,
        message,
        payload,
        timestamp: Date.now(),
      };
      setEvents((prev) => [evt, ...prev]);
      return evt;
    },
    []
  );

  // Audit Logger
  const logAudit = useCallback(
    (
      user: string,
      role: string,
      action: string,
      entity: AuditLog['entity'],
      entityId: string,
      status: AuditLog['status'],
      details: string
    ) => {
      const entry: AuditLog = {
        id: `AUD-${Date.now().toString().slice(-5)}`,
        timestamp: Date.now(),
        user,
        role,
        action,
        entity,
        entityId,
        status,
        ipAddress: '10.240.4.12',
        details,
      };
      setAuditLogs((prev) => [entry, ...prev]);
    },
    []
  );

  // 1-second interval ticker for active reservation countdowns & load simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Tick reservations countdown
      setReservations((prevRes) => {
        let changed = false;
        const updated = prevRes.map((r) => {
          if (r.status === 'ACTIVE') {
            const nextRemaining = r.remainingSeconds - 1;
            if (nextRemaining <= 0) {
              changed = true;
              // Reservation expired! Trigger inventory release
              setProducts((prevProds) =>
                prevProds.map((p) => {
                  if (p.id === r.productId) {
                    const nextReserved = Math.max(0, p.reservedStock - r.quantity);
                    const nextAvailable = p.availableStock + r.quantity;
                    const nextStatus = nextAvailable > 10 ? 'AVAILABLE' : nextAvailable > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK';
                    return {
                      ...p,
                      reservedStock: nextReserved,
                      availableStock: nextAvailable,
                      status: nextStatus,
                    };
                  }
                  return p;
                })
              );

              // Update related order if in RESERVED or PAYMENT_PENDING state
              if (r.orderId) {
                setOrders((prevOrders) =>
                  prevOrders.map((o) => {
                    if (o.id === r.orderId && ['CREATED', 'RESERVED', 'PAYMENT_PENDING'].includes(o.status)) {
                      return {
                        ...o,
                        status: 'EXPIRED',
                        timeline: [
                          ...o.timeline,
                          {
                            stage: 'EXPIRED',
                            title: 'Reservation Expired — Order Voided',
                            status: 'FAILED',
                            timestamp: new Date().toLocaleTimeString(),
                            service: 'InventoryService',
                            eventId: `EVT-EXP-${Date.now().toString().slice(-4)}`,
                            details: 'Reservation TTL elapsed before payment authorization',
                          },
                        ],
                      };
                    }
                    return o;
                  })
                );
              }

              // Log event and audit
              logSystemEvent(
                'ReservationExpired',
                'InventoryService',
                'WARNING',
                `Reservation ${r.id} for ${r.productName} expired (TTL 0s) — ${r.quantity} units released`,
                { reservationId: r.id, sku: r.sku, quantity: r.quantity }
              );

              logAudit(
                'system_daemon',
                'AutoWorker',
                'Reservation Expired',
                'Reservation',
                r.id,
                'WARNING',
                `TTL expired for ${r.sku}; restored ${r.quantity} units to available pool`
              );

              addToast(
                'warning',
                'Reservation Expired',
                `Reservation ${r.id} expired. ${r.quantity} units returned to available stock.`
              );

              return {
                ...r,
                status: 'EXPIRED' as const,
                remainingSeconds: 0,
              };
            }
            return {
              ...r,
              remainingSeconds: nextRemaining,
            };
          }
          return r;
        });

        return updated;
      });

      // 2. Real-time traffic graph ticker
      if (!isTrafficPaused) {
        setRequestHistory((prev) => {
          const now = new Date();
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          let baseRps = 2400 + Math.floor(Math.sin(Date.now() / 5000) * 800) + Math.floor(Math.random() * 400);
          let latency = 38 + Math.floor(Math.random() * 15);
          let successRate = 99.98;

          if (loadSim.isRunning) {
            baseRps = 480000 + Math.floor(Math.random() * 35000);
            latency = 84 + Math.floor(Math.random() * 22);
            successRate = 99.94;
          }

          const newPoint: RequestDataPoint = {
            time: timeStr,
            rps: baseRps,
            latency,
            successRate,
          };
          return [...prev.slice(-24), newPoint];
        });
      }

      // 3. Load Simulation Progression
      setLoadSim((prev) => {
        if (!prev.isRunning) return prev;
        const nextElapsed = prev.elapsedSeconds + 1;
        if (nextElapsed >= prev.durationSeconds) {
          addToast('info', 'Load Simulation Completed', `Simulated ${prev.concurrentUsers.toLocaleString()} concurrent users successfully.`);
          return {
            ...prev,
            isRunning: false,
            elapsedSeconds: prev.durationSeconds,
            metrics: {
              activeUsers: 240,
              currentRps: 2840,
              successRate: 99.98,
              avgLatencyMs: 38,
              queueDepth: 42,
              cpuUtilization: 34,
            },
          };
        }

        return {
          ...prev,
          elapsedSeconds: nextElapsed,
          metrics: {
            activeUsers: prev.concurrentUsers,
            currentRps: prev.targetRps - Math.floor(Math.random() * 15000),
            successRate: 99.97,
            avgLatencyMs: 84 + Math.floor(Math.random() * 12),
            queueDepth: 1248 + Math.floor(Math.random() * 120),
            cpuUtilization: 72 + Math.floor(Math.random() * 6),
          },
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTrafficPaused, loadSim.isRunning, logSystemEvent, logAudit, addToast]);

  // BUSINESS WORKFLOW: Reserve Inventory
  const reserveInventory = useCallback(
    async (productId: string, quantity: number, customTtlSecs: number = 600) => {
      const prod = products.find((p) => p.id === productId);
      if (!prod) {
        return { success: false, error: 'Product not found' };
      }

      if (prod.availableStock < quantity) {
        logSystemEvent(
          'InventoryReserved',
          'InventoryService',
          'ERROR',
          `Reservation failed: Insufficient stock for ${prod.sku}. Requested ${quantity}, available ${prod.availableStock}`,
          { productId, sku: prod.sku, requested: quantity, available: prod.availableStock }
        );
        addToast('error', 'Reservation Failed', `Insufficient stock for ${prod.name}. Available: ${prod.availableStock}`);
        return { success: false, error: 'Insufficient inventory available' };
      }

      // Deduct available, add to reserved
      const updatedAvailable = prod.availableStock - quantity;
      const updatedReserved = prod.reservedStock + quantity;
      const updatedStatus =
        updatedAvailable === 0
          ? 'OUT_OF_STOCK'
          : updatedReserved > updatedAvailable * 1.5
          ? 'RESERVATION_PRESSURE'
          : updatedAvailable < 10
          ? 'LOW_STOCK'
          : 'AVAILABLE';

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, availableStock: updatedAvailable, reservedStock: updatedReserved, status: updatedStatus }
            : p
        )
      );

      const reservationId = `RES-${Math.floor(10000 + Math.random() * 90000)}`;
      const now = Date.now();
      const newReservation: Reservation = {
        id: reservationId,
        productId,
        sku: prod.sku,
        productName: prod.name,
        quantity,
        status: 'ACTIVE',
        createdAt: now,
        expiresAt: now + customTtlSecs * 1000,
        durationSeconds: customTtlSecs,
        remainingSeconds: customTtlSecs,
      };

      setReservations((prev) => [newReservation, ...prev]);

      logSystemEvent(
        'InventoryReserved',
        'InventoryService',
        'SUCCESS',
        `Held ${quantity} units of ${prod.sku} (${prod.name}). TTL: ${customTtlSecs}s`,
        { reservationId, sku: prod.sku, quantity, ttl: customTtlSecs }
      );

      logAudit(
        'checkout_gateway',
        'API Client',
        'Reserve Inventory',
        'Inventory',
        prod.sku,
        'SUCCESS',
        `Reserved ${quantity} units for ${customTtlSecs}s. Reservation: ${reservationId}`
      );

      addToast(
        'success',
        'Inventory Reserved',
        `Locked ${quantity} unit(s) of ${prod.sku} for ${Math.floor(customTtlSecs / 60)} min.`
      );

      return { success: true, reservation: newReservation };
    },
    [products, logSystemEvent, logAudit, addToast]
  );

  // Manual immediate reservation expiry demonstration
  const expireReservationNow = useCallback(
    (reservationId: string) => {
      const res = reservations.find((r) => r.id === reservationId);
      if (!res || res.status !== 'ACTIVE') return;

      setReservations((prev) =>
        prev.map((r) => (r.id === reservationId ? { ...r, status: 'EXPIRED', remainingSeconds: 0 } : r))
      );

      // Restore product stock
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === res.productId) {
            const nextReserved = Math.max(0, p.reservedStock - res.quantity);
            const nextAvailable = p.availableStock + res.quantity;
            return {
              ...p,
              reservedStock: nextReserved,
              availableStock: nextAvailable,
              status: nextAvailable > 10 ? 'AVAILABLE' : nextAvailable > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK',
            };
          }
          return p;
        })
      );

      logSystemEvent(
        'ReservationExpired',
        'InventoryService',
        'WARNING',
        `Force expired reservation ${reservationId} — returned ${res.quantity} units of ${res.sku} to pool`,
        { reservationId, sku: res.sku }
      );

      logAudit(
        'admin_demo',
        'Presenter',
        'Force Expire Reservation',
        'Reservation',
        reservationId,
        'WARNING',
        'Manual trigger of reservation TTL expiry to demonstrate compensation logic'
      );

      addToast('warning', 'Reservation Expired Manually', `Inventory released for ${res.productName}.`);
    },
    [reservations, logSystemEvent, logAudit, addToast]
  );

  // Release reservation manually
  const releaseReservation = useCallback(
    (reservationId: string) => {
      const res = reservations.find((r) => r.id === reservationId);
      if (!res) return;

      setReservations((prev) =>
        prev.map((r) => (r.id === reservationId ? { ...r, status: 'RELEASED', remainingSeconds: 0 } : r))
      );

      if (res.status === 'ACTIVE') {
        setProducts((prev) =>
          prev.map((p) => {
            if (p.id === res.productId) {
              return {
                ...p,
                reservedStock: Math.max(0, p.reservedStock - res.quantity),
                availableStock: p.availableStock + res.quantity,
              };
            }
            return p;
          })
        );
      }

      logSystemEvent('StockReleased', 'InventoryService', 'INFO', `Reservation ${reservationId} released gracefully`, {
        reservationId,
      });
      addToast('info', 'Stock Released', `Reservation ${reservationId} was released.`);
    },
    [reservations, logSystemEvent, addToast]
  );

  // Create Order with linked reservation
  const createOrderWithReservation = useCallback(
    async (
      customerName: string,
      customerEmail: string,
      items: OrderItem[],
      reservationId?: string
    ): Promise<Order> => {
      const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const orderId = `ORD-10${Math.floor(250 + Math.random() * 800)}`;
      const now = Date.now();

      const timeline: Order['timeline'] = [
        {
          stage: 'CREATED',
          title: 'Order Created',
          status: 'COMPLETED',
          timestamp: new Date().toLocaleTimeString(),
          service: 'OrderService',
          eventId: `EVT-ORD-${orderId}`,
          details: `Order registered for ${customerName} (${items.length} items)`,
        },
      ];

      if (reservationId) {
        timeline.push({
          stage: 'RESERVED',
          title: 'Inventory Reserved',
          status: 'COMPLETED',
          timestamp: new Date().toLocaleTimeString(),
          service: 'InventoryService',
          eventId: `EVT-INV-${reservationId}`,
          details: `Bound reservation ${reservationId} with active TTL lock`,
        });
      }

      const newOrder: Order = {
        id: orderId,
        customerName,
        customerEmail,
        items,
        totalAmount,
        reservationId,
        status: reservationId ? 'RESERVED' : 'CREATED',
        createdAt: now,
        timeline,
        idempotencyKey: `IDEMP-${orderId}-V1`,
      };

      setOrders((prev) => [newOrder, ...prev]);

      logSystemEvent(
        'OrderCreated',
        'OrderService',
        'SUCCESS',
        `New order ${orderId} placed for ₹${totalAmount.toLocaleString('en-IN')}`,
        { orderId, itemsCount: items.length, totalAmount, reservationId }
      );

      logAudit('shopper', 'Customer', 'Create Order', 'Order', orderId, 'SUCCESS', `Total amount ₹${totalAmount}`);

      return newOrder;
    },
    [logSystemEvent, logAudit]
  );

  // Check Idempotency Key
  const checkIdempotency = useCallback((key: string, payload: any) => {
    if (!key) return { isDuplicate: false };
    const cached = idempotencyStoreRef.current.get(key);
    if (cached) {
      return { isDuplicate: true, cachedResponse: cached.response, timestamp: cached.timestamp };
    }
    return { isDuplicate: false };
  }, []);

  // Process Payment with idempotency & failure simulation
  const processPayment = useCallback(
    async (
      orderId: string,
      method: PaymentMethod,
      idempotencyKey: string,
      options: { simulateFailure?: boolean; forceSuccess?: boolean } = {}
    ): Promise<{ success: boolean; payment: Payment; error?: string }> => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) {
        return {
          success: false,
          payment: null as any,
          error: 'Order not found',
        };
      }

      // Check Idempotency Key first!
      const idempCheck = checkIdempotency(idempotencyKey, { orderId, method });
      if (idempCheck.isDuplicate) {
        logSystemEvent(
          'IdempotentDuplicateIgnored',
          'APIGateway',
          'INFO',
          `Idempotency-Key [${idempotencyKey}] already processed! Returning cached response without duplicate billing.`,
          { idempotencyKey, orderId }
        );
        addToast(
          'info',
          'Idempotency Guard Triggered',
          `Duplicate request for key ${idempotencyKey.slice(0, 16)}... returned cached receipt.`
        );
        return {
          success: true,
          payment: idempCheck.cachedResponse,
        };
      }

      const paymentId = `PAY-78${Math.floor(350 + Math.random() * 800)}`;
      const now = Date.now();

      // Log PaymentInitiated
      logSystemEvent(
        'PaymentInitiated',
        'PaymentService',
        'INFO',
        `Initiating payment for ${orderId} (₹${order.totalAmount.toLocaleString('en-IN')}) via ${method}`,
        { paymentId, orderId, method, idempotencyKey }
      );

      // Simulate Failure Scenario
      if (options.simulateFailure && !options.forceSuccess) {
        const failedPayment: Payment = {
          id: paymentId,
          orderId,
          amount: order.totalAmount,
          method,
          status: 'FAILED',
          idempotencyKey,
          attempts: 1,
          failureReason: 'Payment Gateway Timeout (504): Third-party acquiring network unresponsive',
          createdAt: now,
        };

        setPayments((prev) => [failedPayment, ...prev]);

        // Update Order Timeline
        setOrders((prev) =>
          prev.map((o) => {
            if (o.id === orderId) {
              return {
                ...o,
                status: 'FAILED',
                paymentId,
                timeline: [
                  ...o.timeline,
                  {
                    stage: 'PAYMENT_INITIATED',
                    title: 'Payment Initiated',
                    status: 'COMPLETED',
                    timestamp: new Date().toLocaleTimeString(),
                    service: 'PaymentService',
                    eventId: `EVT-PAY-INIT-${paymentId}`,
                  },
                  {
                    stage: 'PAYMENT_FAILED',
                    title: 'Payment Gateway Timeout',
                    status: 'FAILED',
                    timestamp: new Date().toLocaleTimeString(),
                    service: 'PaymentGateway',
                    eventId: `EVT-PAY-FAIL-${paymentId}`,
                    details: 'External bank gateway timed out after 3000ms. Retry policy active.',
                  },
                ],
              };
            }
            return o;
          })
        );

        logSystemEvent(
          'PaymentFailed',
          'PaymentService',
          'ERROR',
          `Payment ${paymentId} failed for order ${orderId}: Gateway Timeout (504)`,
          { paymentId, orderId, reason: failedPayment.failureReason }
        );

        // Put into DLQ for recovery
        setDlqMessages((prev) => [
          {
            id: `DLQ-${Date.now().toString().slice(-4)}`,
            originalEventId: `EVT-PAY-FAIL-${paymentId}`,
            eventType: 'PaymentGatewayFailure',
            source: 'PaymentService',
            payload: { paymentId, orderId, amount: order.totalAmount, method },
            errorReason: 'Payment Gateway Timeout (504)',
            retryCount: 1,
            enqueuedAt: Date.now(),
            status: 'PENDING',
          },
          ...prev,
        ]);

        addToast('error', 'Payment Failed', 'Gateway timeout! You can retry or force success in demo controls.');

        return {
          success: false,
          payment: failedPayment,
          error: failedPayment.failureReason,
        };
      }

      // Success Path: Authorized -> Captured -> Confirmed
      const successfulPayment: Payment = {
        id: paymentId,
        orderId,
        amount: order.totalAmount,
        method,
        status: 'CAPTURED',
        idempotencyKey,
        attempts: 1,
        createdAt: now,
        cardLast4: method === 'credit_card' ? '4242' : undefined,
        upiVpa: method === 'upi' ? 'customer@upi' : undefined,
      };

      // Store in idempotency cache
      idempotencyStoreRef.current.set(idempotencyKey, {
        response: successfulPayment,
        timestamp: now,
      });

      setPayments((prev) => [successfulPayment, ...prev]);

      // Move reservation to CONFIRMED
      if (order.reservationId) {
        setReservations((prev) =>
          prev.map((r) => (r.id === order.reservationId ? { ...r, status: 'CONFIRMED', remainingSeconds: 0 } : r))
        );
      }

      // Finalize inventory: move from reservedStock to soldStock
      setProducts((prev) =>
        prev.map((p) => {
          const matchingItem = order.items.find((item) => item.productId === p.id);
          if (matchingItem) {
            return {
              ...p,
              reservedStock: Math.max(0, p.reservedStock - matchingItem.quantity),
              soldStock: p.soldStock + matchingItem.quantity,
            };
          }
          return p;
        })
      );

      // Update Order Status to CONFIRMED
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === orderId) {
            return {
              ...o,
              status: 'CONFIRMED',
              paymentId,
              timeline: [
                ...o.timeline,
                {
                  stage: 'PAYMENT_INITIATED',
                  title: 'Payment Initiated',
                  status: 'COMPLETED',
                  timestamp: new Date().toLocaleTimeString(),
                  service: 'PaymentService',
                  eventId: `EVT-PAY-INIT-${paymentId}`,
                },
                {
                  stage: 'PAYMENT_AUTHORIZED',
                  title: 'Payment Authorized',
                  status: 'COMPLETED',
                  timestamp: new Date().toLocaleTimeString(),
                  service: 'PaymentGateway',
                  eventId: `EVT-PAY-AUTH-${paymentId}`,
                  details: `Authorized via ${method.toUpperCase()} network`,
                },
                {
                  stage: 'CONFIRMED',
                  title: 'Order Confirmed & Finalized',
                  status: 'COMPLETED',
                  timestamp: new Date().toLocaleTimeString(),
                  service: 'OrderService',
                  eventId: `EVT-ORD-CONF-${orderId}`,
                  details: 'Inventory lock finalized, confirmation receipt dispatched',
                },
              ],
            };
          }
          return o;
        })
      );

      logSystemEvent(
        'PaymentAuthorized',
        'PaymentService',
        'SUCCESS',
        `Payment ${paymentId} authorized and captured for ₹${order.totalAmount.toLocaleString('en-IN')}`,
        { paymentId, orderId, idempotencyKey }
      );

      logSystemEvent(
        'OrderConfirmed',
        'OrderService',
        'SUCCESS',
        `Order ${orderId} confirmed and receipt generated`,
        { orderId, paymentId }
      );

      logAudit(
        'payment_processor',
        'System',
        'Capture Payment',
        'Payment',
        paymentId,
        'SUCCESS',
        `Captured ₹${order.totalAmount} for ${orderId}`
      );

      addToast(
        'success',
        'Order Confirmed!',
        `Order ${orderId} confirmed successfully with payment ${paymentId}.`
      );

      return {
        success: true,
        payment: successfulPayment,
      };
    },
    [orders, checkIdempotency, logSystemEvent, logAudit, addToast]
  );

  // Retry payment action
  const retryPayment = useCallback(
    async (paymentId: string, forceSuccess: boolean = true) => {
      const p = payments.find((pay) => pay.id === paymentId);
      if (!p) return { success: false, payment: null as any };

      logSystemEvent(
        'PaymentRetryInitiated',
        'PaymentService',
        'WARNING',
        `Retrying payment ${paymentId} (Attempt #${p.attempts + 1}) with exponential backoff`,
        { paymentId, attempt: p.attempts + 1 }
      );

      addToast('info', 'Retrying Payment', `Executing backoff retry attempt #${p.attempts + 1}...`);

      // 1.5s simulated retry delay
      await new Promise((r) => setTimeout(r, 1200));

      if (forceSuccess) {
        const resolved: Payment = {
          ...p,
          status: 'CAPTURED',
          attempts: p.attempts + 1,
          failureReason: undefined,
        };

        setPayments((prev) => prev.map((item) => (item.id === paymentId ? resolved : item)));

        // Update corresponding order
        setOrders((prev) =>
          prev.map((o) => {
            if (o.id === p.orderId) {
              return {
                ...o,
                status: 'CONFIRMED',
                timeline: [
                  ...o.timeline,
                  {
                    stage: 'RETRY_SUCCESS',
                    title: `Payment Retried & Captured (Attempt #${p.attempts + 1})`,
                    status: 'COMPLETED',
                    timestamp: new Date().toLocaleTimeString(),
                    service: 'PaymentService',
                    eventId: `EVT-RETRY-${paymentId}`,
                    details: 'Gateway connection recovered, transaction captured successfully',
                  },
                ],
              };
            }
            return o;
          })
        );

        // Update DLQ if present
        setDlqMessages((prev) =>
          prev.map((dlq) =>
            dlq.payload?.paymentId === paymentId ? { ...dlq, status: 'RESOLVED' as const } : dlq
          )
        );

        logSystemEvent(
          'PaymentAuthorized',
          'PaymentService',
          'SUCCESS',
          `Payment ${paymentId} succeeded on retry attempt #${p.attempts + 1}`,
          { paymentId }
        );

        addToast('success', 'Retry Succeeded', `Payment ${paymentId} captured! Order is now CONFIRMED.`);

        return { success: true, payment: resolved };
      } else {
        const stillFailed: Payment = {
          ...p,
          attempts: p.attempts + 1,
          status: 'FAILED',
        };
        setPayments((prev) => prev.map((item) => (item.id === paymentId ? stillFailed : item)));
        addToast('error', 'Retry Failed', `Attempt #${p.attempts + 1} timed out.`);
        return { success: false, payment: stillFailed };
      }
    },
    [payments, logSystemEvent, addToast]
  );

  // Microservice failure simulation
  const simulateServiceFailure = useCallback(
    (serviceId: string) => {
      const srv = services.find((s) => s.id === serviceId);
      if (!srv) return;

      // 1. Set to DEGRADED
      setServices((prev) =>
        prev.map((s) =>
          s.id === serviceId
            ? {
                ...s,
                status: 'DEGRADED',
                latencyMs: s.latencyMs * 4,
                errorRatePercent: 8.5,
                circuitBreaker: 'HALF_OPEN',
                lastFailureReason: 'Increased upstream latency threshold exceeded',
              }
            : s
        )
      );

      logSystemEvent(
        'CircuitBreakerOpened',
        'APIGateway',
        'WARNING',
        `Service [${srv.name}] degraded. Latency spiked to ${srv.latencyMs * 4}ms. Circuit breaker entering HALF_OPEN`,
        { serviceId, name: srv.name }
      );

      addToast('warning', `${srv.name} Degraded`, 'Circuit breaker switched to HALF_OPEN');

      // 2. After 3s set to DOWN / Circuit Breaker OPEN
      setTimeout(() => {
        setServices((prev) =>
          prev.map((s) =>
            s.id === serviceId
              ? {
                  ...s,
                  status: 'DOWN',
                  latencyMs: 999,
                  errorRatePercent: 99.0,
                  circuitBreaker: 'OPEN',
                  lastFailureReason: 'Healthcheck heartbeat timeout: Pod replica crashloop detected',
                }
              : s
          )
        );

        logSystemEvent(
          'CircuitBreakerOpened',
          'APIGateway',
          'ERROR',
          `CRITICAL: [${srv.name}] is DOWN. Circuit breaker OPEN. Fallback route active.`,
          { serviceId, name: srv.name }
        );

        addToast('error', `${srv.name} DOWN`, 'Circuit breaker is now OPEN. Requests shedding to fallback.');

        // 3. After 6s, self-healing RECOVERING -> HEALTHY
        setTimeout(() => {
          setServices((prev) =>
            prev.map((s) =>
              s.id === serviceId
                ? {
                    ...s,
                    status: 'RECOVERING',
                    latencyMs: Math.round(s.latencyMs * 1.5),
                    errorRatePercent: 1.2,
                    circuitBreaker: 'HALF_OPEN',
                    lastFailureReason: 'Pod restarted, running warm-up probes',
                  }
                : s
            )
          );

          setTimeout(() => {
            setServices((prev) =>
              prev.map((s) =>
                s.id === serviceId
                  ? {
                      ...s,
                      status: 'HEALTHY',
                      latencyMs: Math.max(12, Math.round(s.latencyMs / 4)),
                      errorRatePercent: 0.02,
                      circuitBreaker: 'CLOSED',
                      lastFailureReason: undefined,
                    }
                  : s
              )
            );

            logSystemEvent(
              'CircuitBreakerClosed',
              'APIGateway',
              'SUCCESS',
              `Service [${srv.name}] self-healed and verified healthy. Circuit breaker CLOSED.`,
              { serviceId, name: srv.name }
            );

            addToast('success', `${srv.name} Restored`, 'Service healthy. Normal traffic resumed.');
          }, 4000);
        }, 5000);
      }, 3000);
    },
    [services, logSystemEvent, addToast]
  );

  const recoverService = useCallback((serviceId: string) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === serviceId
          ? {
              ...s,
              status: 'HEALTHY',
              latencyMs: 25,
              errorRatePercent: 0.01,
              circuitBreaker: 'CLOSED',
              lastFailureReason: undefined,
            }
          : s
      )
    );
  }, []);

  // DLQ operations
  const replayDLQMessage = useCallback(
    (dlqId: string) => {
      setDlqMessages((prev) =>
        prev.map((m) =>
          m.id === dlqId
            ? { ...m, status: 'RESOLVED', retryCount: m.retryCount + 1 }
            : m
        )
      );
      logSystemEvent('PaymentRetryInitiated', 'EventBus', 'INFO', `Replayed DLQ message ${dlqId} to topic`, { dlqId });
      addToast('success', 'Message Replayed', `Message ${dlqId} re-injected into consumer queue.`);
    },
    [logSystemEvent, addToast]
  );

  const discardDLQMessage = useCallback(
    (dlqId: string) => {
      setDlqMessages((prev) =>
        prev.map((m) => (m.id === dlqId ? { ...m, status: 'DISCARDED' } : m))
      );
      addToast('info', 'Message Discarded', `DLQ item ${dlqId} discarded.`);
    },
    [addToast]
  );

  // Load Simulation
  const startLoadSimulation = useCallback(
    (users: number = 10000, rps: number = 500000, duration: number = 60) => {
      setLoadSim({
        isRunning: true,
        concurrentUsers: users,
        targetRps: rps,
        durationSeconds: duration,
        elapsedSeconds: 0,
        metrics: {
          activeUsers: users,
          currentRps: rps - 2400,
          successRate: 99.97,
          avgLatencyMs: 84,
          queueDepth: 1248,
          cpuUtilization: 72,
        },
      });

      logSystemEvent(
        'InventoryReserved',
        'SystemMonitor',
        'WARNING',
        `High Concurrency Load Simulation Started: ${users.toLocaleString()} users, ${rps.toLocaleString()} simulated RPS`,
        { users, rps, duration }
      );

      addToast(
        'info',
        'Load Simulation Active',
        `Simulating ${users.toLocaleString()} concurrent users (~${(rps / 1000).toFixed(0)}k RPS)`
      );
    },
    [logSystemEvent, addToast]
  );

  const stopLoadSimulation = useCallback(() => {
    setLoadSim((prev) => ({
      ...prev,
      isRunning: false,
      metrics: {
        activeUsers: 240,
        currentRps: 2840,
        successRate: 99.98,
        avgLatencyMs: 38,
        queueDepth: 42,
        cpuUtilization: 34,
      },
    }));
    addToast('info', 'Load Simulation Stopped', 'System traffic returned to baseline.');
  }, [addToast]);

  const resetLoadSimulation = useCallback(() => {
    setLoadSim({
      isRunning: false,
      concurrentUsers: 10000,
      targetRps: 500000,
      durationSeconds: 60,
      elapsedSeconds: 0,
      metrics: {
        activeUsers: 240,
        currentRps: 2840,
        successRate: 99.98,
        avgLatencyMs: 38,
        queueDepth: 42,
        cpuUtilization: 34,
      },
    });
  }, []);

  // Reset entire application data
  const resetAllData = useCallback(() => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(generateSeedOrders());
    setReservations(generateSeedReservations());
    setPayments(generateSeedPayments());
    setEvents(generateSeedEvents());
    setServices(INITIAL_SERVICES);
    setAuditLogs(generateSeedAuditLogs());
    setDlqMessages(INITIAL_DLQ_MESSAGES);
    idempotencyStoreRef.current.clear();
    resetLoadSimulation();
    addToast('success', 'State Reset', 'All seed data, stock balances, and queues restored.');
  }, [resetLoadSimulation, addToast]);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        demoMode,
        setDemoMode,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
        selectedOrder,
        setSelectedOrder,
        isCheckoutOpen,
        setIsCheckoutOpen,
        checkoutProduct,
        setCheckoutProduct,
        isEndToEndDemoOpen,
        setIsEndToEndDemoOpen,
        products,
        orders,
        reservations,
        payments,
        events,
        services,
        auditLogs,
        dlqMessages,
        toasts,
        requestHistory,
        isTrafficPaused,
        setIsTrafficPaused,
        loadSim,
        startLoadSimulation,
        stopLoadSimulation,
        resetLoadSimulation,
        reserveInventory,
        expireReservationNow,
        releaseReservation,
        createOrderWithReservation,
        processPayment,
        retryPayment,
        checkIdempotency,
        simulateServiceFailure,
        recoverService,
        replayDLQMessage,
        discardDLQMessage,
        addToast,
        removeToast,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
