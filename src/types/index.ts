export type ProductStatus = 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'RESERVATION_PRESSURE';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  totalStock: number;
  availableStock: number;
  reservedStock: number;
  soldStock: number;
  status: ProductStatus;
  description: string;
  image: string;
  rating: number;
  tags: string[];
}

export type ReservationStatus = 'ACTIVE' | 'EXPIRED' | 'CONFIRMED' | 'RELEASED';

export interface Reservation {
  id: string;
  orderId?: string;
  productId: string;
  sku: string;
  productName: string;
  quantity: number;
  status: ReservationStatus;
  expiresAt: number; // timestamp ms
  createdAt: number; // timestamp ms
  durationSeconds: number;
  remainingSeconds: number;
}

export type OrderStatus =
  | 'CREATED'
  | 'RESERVED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'CONFIRMED'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED';

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderTimelineStep {
  stage: string;
  title: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  timestamp: string;
  service: string;
  eventId?: string;
  details?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  paymentId?: string;
  reservationId?: string;
  status: OrderStatus;
  createdAt: number;
  timeline: OrderTimelineStep[];
  idempotencyKey?: string;
}

export type PaymentStatus = 'PROCESSING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'RETRYING';
export type PaymentMethod = 'credit_card' | 'upi' | 'wallet';

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  idempotencyKey: string;
  attempts: number;
  failureReason?: string;
  createdAt: number;
  cardLast4?: string;
  upiVpa?: string;
}

export type EventStatus = 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO';

export interface SystemEvent {
  id: string;
  eventType:
    | 'OrderCreated'
    | 'InventoryReserved'
    | 'PaymentInitiated'
    | 'PaymentAuthorized'
    | 'PaymentFailed'
    | 'PaymentCaptured'
    | 'OrderConfirmed'
    | 'ReservationExpired'
    | 'StockReleased'
    | 'PaymentRetryInitiated'
    | 'CircuitBreakerOpened'
    | 'CircuitBreakerClosed'
    | 'IdempotentDuplicateIgnored'
    | 'DLQMessageEnqueued';
  source: 'OrderService' | 'InventoryService' | 'PaymentService' | 'EventBus' | 'APIGateway' | 'SystemMonitor';
  status: EventStatus;
  message: string;
  payload: Record<string, any>;
  timestamp: number; // ms
}

export type ServiceHealthStatus = 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'RECOVERING';
export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface ServiceHealth {
  id: string;
  name: string;
  type: 'GATEWAY' | 'CORE' | 'DATA' | 'MESSAGING';
  status: ServiceHealthStatus;
  latencyMs: number;
  rps: number;
  errorRatePercent: number;
  cpuPercent: number;
  memoryPercent: number;
  circuitBreaker: CircuitBreakerState;
  instances: number;
  version: string;
  lastFailureReason?: string;
}

export interface AuditLog {
  id: string;
  timestamp: number;
  user: string;
  role: string;
  action: string;
  entity: 'Order' | 'Inventory' | 'Reservation' | 'Payment' | 'System' | 'Security';
  entityId: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILURE';
  ipAddress: string;
  details: string;
}

export interface DLQMessage {
  id: string;
  originalEventId: string;
  eventType: string;
  source: string;
  payload: Record<string, any>;
  errorReason: string;
  retryCount: number;
  enqueuedAt: number;
  status: 'PENDING' | 'RETRYING' | 'DISCARDED' | 'RESOLVED';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: number;
}

export interface LoadSimulationConfig {
  isRunning: boolean;
  concurrentUsers: number;
  targetRps: number;
  durationSeconds: number;
  elapsedSeconds: number;
  metrics: {
    activeUsers: number;
    currentRps: number;
    successRate: number;
    avgLatencyMs: number;
    queueDepth: number;
    cpuUtilization: number;
  };
}
