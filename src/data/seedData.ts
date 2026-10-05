import {
  Product,
  Order,
  Reservation,
  Payment,
  SystemEvent,
  ServiceHealth,
  AuditLog,
  DLQMessage,
  OrderTimelineStep,
} from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'WH-1007',
    name: 'AcousticPro ANC Wireless Headphones',
    category: 'Audio',
    price: 8999,
    totalStock: 120,
    availableStock: 76,
    reservedStock: 24,
    soldStock: 20,
    status: 'AVAILABLE',
    description: 'Ultra-low latency studio wireless headphones with adaptive hybrid active noise cancellation.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    rating: 4.8,
    tags: ['Flagship', 'Wireless', 'ANC'],
  },
  {
    id: 'prod-2',
    sku: 'SW-2041',
    name: 'Vortex Titanium Smartwatch Gen 4',
    category: 'Wearables',
    price: 14999,
    totalStock: 80,
    availableStock: 18,
    reservedStock: 42,
    soldStock: 20,
    status: 'RESERVATION_PRESSURE',
    description: 'Titanium chassis with ECG sensor, dual-frequency GPS, and always-on 2000-nit AMOLED display.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
    rating: 4.9,
    tags: ['Titanium', 'Health', 'AMOLED'],
  },
  {
    id: 'prod-3',
    sku: 'KB-3105',
    name: 'Apex Pro Magnetic Switch Keyboard',
    category: 'Peripherals',
    price: 6499,
    totalStock: 150,
    availableStock: 110,
    reservedStock: 15,
    soldStock: 25,
    status: 'AVAILABLE',
    description: 'Rapid trigger analog magnetic switches with per-key actuation adjustability from 0.1mm to 4.0mm.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60',
    rating: 4.7,
    tags: ['Mechanical', 'Rapid Trigger', 'RGB'],
  },
  {
    id: 'prod-4',
    sku: 'MO-4089',
    name: 'Precision Wireless Gaming Mouse',
    category: 'Peripherals',
    price: 4299,
    totalStock: 90,
    availableStock: 6,
    reservedStock: 8,
    soldStock: 76,
    status: 'LOW_STOCK',
    description: '49-gram ultralight honeycomb shell with 30,000 DPI optical sensor and 4000Hz polling rate.',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60',
    rating: 4.6,
    tags: ['Ultralight', '4K Polling'],
  },
  {
    id: 'prod-5',
    sku: 'MN-5501',
    name: 'Ultravue 34" Curved QD-OLED Monitor',
    category: 'Displays',
    price: 64999,
    totalStock: 25,
    availableStock: 0,
    reservedStock: 0,
    soldStock: 25,
    status: 'OUT_OF_STOCK',
    description: '0.03ms GtG response time, 175Hz refresh rate, HDR True Black 400, and 99.3% DCI-P3 color gamut.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60',
    rating: 4.9,
    tags: ['QD-OLED', '175Hz', 'Curved'],
  },
  {
    id: 'prod-6',
    sku: 'LP-6210',
    name: 'Nebula Pro M3 Developer Workstation',
    category: 'Computing',
    price: 189999,
    totalStock: 40,
    availableStock: 22,
    reservedStock: 8,
    soldStock: 10,
    status: 'AVAILABLE',
    description: '16-core CPU, 40-core GPU, 64GB Unified RAM, 2TB PCIe 4.0 NVMe SSD, liquid crystal Retina XDR display.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60',
    rating: 5.0,
    tags: ['Flagship', 'Developer', '64GB'],
  },
  {
    id: 'prod-7',
    sku: 'AU-7120',
    name: 'StudioMaster Spatial Soundbar + Sub',
    category: 'Audio',
    price: 24999,
    totalStock: 60,
    availableStock: 35,
    reservedStock: 10,
    soldStock: 15,
    status: 'AVAILABLE',
    description: 'Dolby Atmos 7.1.4 virtual spatial audio with 10-inch wireless down-firing subwoofer.',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=60',
    rating: 4.5,
    tags: ['Dolby Atmos', 'Spatial Audio'],
  },
  {
    id: 'prod-8',
    sku: 'CM-8902',
    name: 'OptiStream 4K AI Tracking Webcam',
    category: 'Peripherals',
    price: 11999,
    totalStock: 75,
    availableStock: 50,
    reservedStock: 12,
    soldStock: 13,
    status: 'AVAILABLE',
    description: '1/1.28" CMOS sensor, HDR video streaming at 4K/60fps, dual noise-cancelling mics, and AI framing.',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=500&auto=format&fit=crop&q=60',
    rating: 4.6,
    tags: ['4K60', 'AI Tracking'],
  },
  {
    id: 'prod-9',
    sku: 'TB-9110',
    name: 'Graphite Pad 13 Ultra Tablet',
    category: 'Computing',
    price: 52999,
    totalStock: 50,
    availableStock: 12,
    reservedStock: 28,
    soldStock: 10,
    status: 'RESERVATION_PRESSURE',
    description: '13-inch tandem OLED display, haptic stylus included, 5G standalone connectivity.',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60',
    rating: 4.7,
    tags: ['OLED', '5G', 'Stylus'],
  },
  {
    id: 'prod-10',
    sku: 'CH-1002',
    name: 'GaN Matrix 140W Multi-Port Charger',
    category: 'Accessories',
    price: 3499,
    totalStock: 200,
    availableStock: 155,
    reservedStock: 20,
    soldStock: 25,
    status: 'AVAILABLE',
    description: 'Gallium Nitride fast charger with 3x USB-C PD 3.1 and 1x USB-A QC 4.0 outputs.',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=60',
    rating: 4.8,
    tags: ['GaN', '140W PD'],
  },
  {
    id: 'prod-11',
    sku: 'VR-2200',
    name: 'Holosphere XR Spatial Headset',
    category: 'Wearables',
    price: 89999,
    totalStock: 30,
    availableStock: 4,
    reservedStock: 6,
    soldStock: 20,
    status: 'LOW_STOCK',
    description: 'Next-gen micro-OLED 4K per-eye spatial computing headset with real-time room mesh LiDAR.',
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=500&auto=format&fit=crop&q=60',
    rating: 4.9,
    tags: ['XR', 'Spatial', 'Micro-OLED'],
  },
  {
    id: 'prod-12',
    sku: 'DR-3301',
    name: 'AeroGlide 4K Gimbal Drone',
    category: 'Electronics',
    price: 45999,
    totalStock: 40,
    availableStock: 28,
    reservedStock: 5,
    soldStock: 7,
    status: 'AVAILABLE',
    description: 'Omnidirectional obstacle sensing, 46-minute flight endurance, and 15km O4 video transmission.',
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=500&auto=format&fit=crop&q=60',
    rating: 4.7,
    tags: ['4K Video', 'Drone', 'LiDAR'],
  },
  {
    id: 'prod-13',
    sku: 'SP-4412',
    name: 'SubZero MagSafe Magnetic Powerbank',
    category: 'Accessories',
    price: 2799,
    totalStock: 180,
    availableStock: 140,
    reservedStock: 15,
    soldStock: 25,
    status: 'AVAILABLE',
    description: '10,000mAh active Peltier thermoelectric cooled wireless magnetic fast charger.',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&auto=format&fit=crop&q=60',
    rating: 4.4,
    tags: ['MagSafe', 'Peltier Cooled'],
  },
  {
    id: 'prod-14',
    sku: 'MC-5520',
    name: 'Broadcast XLR Dynamic Microphone',
    category: 'Audio',
    price: 16999,
    totalStock: 65,
    availableStock: 42,
    reservedStock: 8,
    soldStock: 15,
    status: 'AVAILABLE',
    description: 'Cardioid studio dynamic vocal microphone with built-in pneumatic shock suspension.',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&auto=format&fit=crop&q=60',
    rating: 4.9,
    tags: ['Broadcast', 'XLR', 'Studio'],
  },
  {
    id: 'prod-15',
    sku: 'SS-6615',
    name: 'Quantum NVMe 4TB Gen5 SSD',
    category: 'Storage',
    price: 28999,
    totalStock: 85,
    availableStock: 60,
    reservedStock: 10,
    soldStock: 15,
    status: 'AVAILABLE',
    description: 'Blistering 14,000 MB/s sequential read and 12,000 MB/s write with integrated graphene heat spreader.',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&auto=format&fit=crop&q=60',
    rating: 4.8,
    tags: ['PCIe 5.0', '14GB/s', 'NVMe'],
  },
  {
    id: 'prod-16',
    sku: 'RT-7730',
    name: 'Tri-Band Wi-Fi 7 Enterprise Router',
    category: 'Networking',
    price: 31999,
    totalStock: 45,
    availableStock: 30,
    reservedStock: 7,
    soldStock: 8,
    status: 'AVAILABLE',
    description: '320MHz channel bandwidth, 4K-QAM, Multi-Link Operation (MLO), and dual 10Gbps SFP+ ports.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=60',
    rating: 4.6,
    tags: ['Wi-Fi 7', '10G SFP+', 'Mesh'],
  },
  {
    id: 'prod-17',
    sku: 'DK-8840',
    name: 'Thunderbolt 4 Triple-Display Dock',
    category: 'Accessories',
    price: 19999,
    totalStock: 70,
    availableStock: 48,
    reservedStock: 10,
    soldStock: 12,
    status: 'AVAILABLE',
    description: '18-in-1 enterprise dock with 100W Power Delivery, SD 4.0, dual DisplayPort 1.4, and 2.5GbE.',
    image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=500&auto=format&fit=crop&q=60',
    rating: 4.7,
    tags: ['Thunderbolt 4', 'Triple 4K', '100W PD'],
  },
  {
    id: 'prod-18',
    sku: 'CS-9950',
    name: 'Titanium Thermal Travel Tumbler',
    category: 'Accessories',
    price: 2199,
    totalStock: 250,
    availableStock: 200,
    reservedStock: 25,
    soldStock: 25,
    status: 'AVAILABLE',
    description: 'Double-walled vacuum insulated grade-5 titanium with laser-etched capacitive temperature gauge.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60',
    rating: 4.5,
    tags: ['Titanium', 'Vacuum Insulated'],
  },
  {
    id: 'prod-19',
    sku: 'EG-1109',
    name: 'ErgoDynamic Carbon Fiber Task Chair',
    category: 'Furniture',
    price: 49999,
    totalStock: 35,
    availableStock: 2,
    reservedStock: 3,
    soldStock: 30,
    status: 'LOW_STOCK',
    description: 'Active dynamic lumbar matrix, 4D magnetic armrests, and aerospace carbon fiber recline chassis.',
    image: 'https://images.unsplash.com/photo-1580481077195-c328865db779?w=500&auto=format&fit=crop&q=60',
    rating: 4.9,
    tags: ['Ergonomic', 'Carbon Fiber'],
  },
  {
    id: 'prod-20',
    sku: 'LP-2218',
    name: 'CyberBook Air 15 Lightweight Laptop',
    category: 'Computing',
    price: 114999,
    totalStock: 50,
    availableStock: 34,
    reservedStock: 6,
    soldStock: 10,
    status: 'AVAILABLE',
    description: 'Magnesium alloy ultrabook weighing 1.1kg, 22-hour battery life, and 120Hz Liquid Retina display.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60',
    rating: 4.8,
    tags: ['Ultrabook', '1.1kg', '22h Battery'],
  },
];

export const INITIAL_SERVICES: ServiceHealth[] = [
  {
    id: 'srv-1',
    name: 'API Gateway (Envoy/Kong)',
    type: 'GATEWAY',
    status: 'HEALTHY',
    latencyMs: 12,
    rps: 3420,
    errorRatePercent: 0.02,
    cpuPercent: 42,
    memoryPercent: 55,
    circuitBreaker: 'CLOSED',
    instances: 6,
    version: 'v3.2.1',
  },
  {
    id: 'srv-2',
    name: 'Order Service',
    type: 'CORE',
    status: 'HEALTHY',
    latencyMs: 38,
    rps: 1240,
    errorRatePercent: 0.05,
    cpuPercent: 54,
    memoryPercent: 62,
    circuitBreaker: 'CLOSED',
    instances: 8,
    version: 'v4.1.0',
  },
  {
    id: 'srv-3',
    name: 'Inventory Service',
    type: 'CORE',
    status: 'HEALTHY',
    latencyMs: 24,
    rps: 2150,
    errorRatePercent: 0.01,
    cpuPercent: 48,
    memoryPercent: 58,
    circuitBreaker: 'CLOSED',
    instances: 10,
    version: 'v4.0.8',
  },
  {
    id: 'srv-4',
    name: 'Payment Service',
    type: 'CORE',
    status: 'HEALTHY',
    latencyMs: 64,
    rps: 820,
    errorRatePercent: 0.12,
    cpuPercent: 61,
    memoryPercent: 67,
    circuitBreaker: 'CLOSED',
    instances: 6,
    version: 'v3.9.4',
  },
  {
    id: 'srv-5',
    name: 'Notification Service',
    type: 'MESSAGING',
    status: 'HEALTHY',
    latencyMs: 18,
    rps: 650,
    errorRatePercent: 0.03,
    cpuPercent: 32,
    memoryPercent: 41,
    circuitBreaker: 'CLOSED',
    instances: 4,
    version: 'v2.8.0',
  },
  {
    id: 'srv-6',
    name: 'Primary Database (PostgreSQL Sharded)',
    type: 'DATA',
    status: 'HEALTHY',
    latencyMs: 14,
    rps: 4800,
    errorRatePercent: 0.00,
    cpuPercent: 58,
    memoryPercent: 74,
    circuitBreaker: 'CLOSED',
    instances: 4,
    version: 'v16.2',
  },
  {
    id: 'srv-7',
    name: 'Message Broker (Apache Kafka/EventBus)',
    type: 'MESSAGING',
    status: 'HEALTHY',
    latencyMs: 8,
    rps: 7200,
    errorRatePercent: 0.01,
    cpuPercent: 39,
    memoryPercent: 68,
    circuitBreaker: 'CLOSED',
    instances: 5,
    version: 'v3.7.0',
  },
  {
    id: 'srv-8',
    name: 'Distributed Cache (Redis Cluster)',
    type: 'DATA',
    status: 'HEALTHY',
    latencyMs: 3,
    rps: 12500,
    errorRatePercent: 0.00,
    cpuPercent: 45,
    memoryPercent: 51,
    circuitBreaker: 'CLOSED',
    instances: 6,
    version: 'v7.2.4',
  },
];

// Helper to generate seed orders deterministically
const CUSTOMER_NAMES = [
  'Aarav Sharma', 'Priya Iyer', 'Rohan Mehta', 'Sneha Patel', 'Ananya Gupta',
  'Vikram Malhotra', 'Deepak Verma', 'Neha Joshi', 'Rahul Reddy', 'Kavita Nair',
  'Aditya Rao', 'Meera Deshmukh', 'Karan Singhania', 'Rhea Kapoor', 'Sameer Bhatia',
  'Pooja Mukherjee', 'Arjun Nambiar', 'Shreya Bose', 'Gaurav Kulkarni', 'Tanvi Chawla'
];

export function generateSeedOrders(): Order[] {
  const orders: Order[] = [];
  const baseTime = Date.now() - 3600 * 1000 * 24; // last 24 hours

  for (let i = 1; i <= 52; i++) {
    const custIndex = i % CUSTOMER_NAMES.length;
    const prod = INITIAL_PRODUCTS[i % INITIAL_PRODUCTS.length];
    const qty = (i % 3) + 1;
    const totalAmount = prod.price * qty;
    const createdAt = baseTime + i * 1650000;
    const orderId = `ORD-10${200 + i}`;
    const paymentId = `PAY-78${300 + i}`;
    const reservationId = `RES-65${100 + i}`;
    
    // Status distribution: mostly confirmed, some reserved, some paid, some failed
    let status: Order['status'] = 'CONFIRMED';
    if (i === 1 || i === 2) status = 'RESERVED';
    else if (i === 3 || i === 4) status = 'PAYMENT_PENDING';
    else if (i === 5) status = 'FAILED';
    else if (i === 6) status = 'EXPIRED';
    else if (i % 8 === 0) status = 'PAID';

    const timeline = [
      {
        stage: 'CREATED',
        title: 'Order Created',
        status: 'COMPLETED' as const,
        timestamp: new Date(createdAt).toLocaleTimeString(),
        service: 'OrderService',
        eventId: `EVT-ORD-${i}01`,
        details: `Initial order created for ${qty}x ${prod.name}`
      },
      {
        stage: 'RESERVED',
        title: 'Inventory Reserved',
        status: 'COMPLETED' as const,
        timestamp: new Date(createdAt + 240).toLocaleTimeString(),
        service: 'InventoryService',
        eventId: `EVT-INV-${i}02`,
        details: `Held ${qty} units of ${prod.sku} for 10 min TTL`
      },
      {
        stage: 'PAYMENT_INITIATED',
        title: 'Payment Initiated',
        status: status === 'RESERVED' ? ('PENDING' as const) : ('COMPLETED' as const),
        timestamp: new Date(createdAt + 980).toLocaleTimeString(),
        service: 'PaymentService',
        eventId: `EVT-PAY-${i}03`,
        details: `Idempotent request key: PAY-KEY-${orderId}`
      },
      {
        stage: 'PAYMENT_AUTHORIZED',
        title: status === 'FAILED' ? 'Payment Failed' : 'Payment Authorized',
        status: (status === 'FAILED' ? 'FAILED' : (['RESERVED', 'PAYMENT_PENDING'].includes(status) ? 'PENDING' : 'COMPLETED')) as OrderTimelineStep['status'],
        timestamp: new Date(createdAt + 1850).toLocaleTimeString(),
        service: 'PaymentGateway',
        eventId: `EVT-PAY-${i}04`,
        details: status === 'FAILED' ? 'Gateway timeout (504) after 3 attempts' : `Authorized ₹${totalAmount.toLocaleString('en-IN')}`
      },
      {
        stage: 'CONFIRMED',
        title: status === 'EXPIRED' ? 'Reservation Expired' : 'Order Confirmed',
        status: (status === 'CONFIRMED' ? 'COMPLETED' : (status === 'EXPIRED' ? 'FAILED' : 'PENDING')) as OrderTimelineStep['status'],
        timestamp: new Date(createdAt + 2100).toLocaleTimeString(),
        service: 'OrderService',
        eventId: `EVT-ORD-${i}05`,
        details: status === 'CONFIRMED' ? 'Order confirmed and inventory finalized' : (status === 'EXPIRED' ? 'Stock returned to pool' : 'Awaiting confirmation')
      }
    ];

    orders.push({
      id: orderId,
      customerName: CUSTOMER_NAMES[custIndex],
      customerEmail: `${CUSTOMER_NAMES[custIndex].toLowerCase().replace(' ', '.')}@example.com`,
      items: [
        {
          productId: prod.id,
          sku: prod.sku,
          name: prod.name,
          quantity: qty,
          price: prod.price,
        }
      ],
      totalAmount,
      paymentId,
      reservationId,
      status,
      createdAt,
      timeline,
      idempotencyKey: `IDEMP-${orderId}-V1`,
    });
  }
  return orders;
}

export function generateSeedReservations(): Reservation[] {
  const reservations: Reservation[] = [];
  const now = Date.now();

  for (let i = 1; i <= 32; i++) {
    const prod = INITIAL_PRODUCTS[i % INITIAL_PRODUCTS.length];
    const qty = (i % 2) + 1;
    const id = `RES-78${320 + i}`;
    
    // Make 8 reservations ACTIVE with live countdowns, some EXPIRED, some CONFIRMED
    let status: Reservation['status'] = 'CONFIRMED';
    let durationSec = 600;
    let remainingSec = 0;
    let createdAt = now - 3600 * 1000 * (i * 0.5);

    if (i <= 8) {
      status = 'ACTIVE';
      createdAt = now - (i * 45) * 1000;
      // Stagger remaining seconds between 120s and 580s
      remainingSec = 600 - (i * 45);
      durationSec = 600;
    } else if (i <= 14) {
      status = 'EXPIRED';
      createdAt = now - (800 + i * 60) * 1000;
      remainingSec = 0;
    }

    reservations.push({
      id,
      orderId: `ORD-10${200 + i}`,
      productId: prod.id,
      sku: prod.sku,
      productName: prod.name,
      quantity: qty,
      status,
      durationSeconds: durationSec,
      createdAt,
      expiresAt: createdAt + durationSec * 1000,
      remainingSeconds: remainingSec,
    });
  }
  return reservations;
}

export function generateSeedPayments(): Payment[] {
  const payments: Payment[] = [];
  const baseTime = Date.now() - 3600 * 1000 * 24;

  for (let i = 1; i <= 52; i++) {
    const prod = INITIAL_PRODUCTS[i % INITIAL_PRODUCTS.length];
    const qty = (i % 3) + 1;
    const amount = prod.price * qty;
    const method: Payment['method'] = i % 3 === 0 ? 'upi' : i % 3 === 1 ? 'credit_card' : 'wallet';
    
    let status: Payment['status'] = 'CAPTURED';
    let failureReason: string | undefined = undefined;
    let attempts = 1;

    if (i === 5) {
      status = 'FAILED';
      failureReason = 'Payment Gateway Timeout (HTTP 504)';
      attempts = 3;
    } else if (i === 3 || i === 4) {
      status = 'PROCESSING';
    } else if (i === 12) {
      status = 'AUTHORIZED';
    }

    payments.push({
      id: `PAY-78${230 + i}`,
      orderId: `ORD-10${200 + i}`,
      amount,
      method,
      status,
      idempotencyKey: `PAY-IDEMP-${78230 + i}`,
      attempts,
      failureReason,
      createdAt: baseTime + i * 1650000,
      cardLast4: method === 'credit_card' ? `${4000 + (i % 9999)}`.padStart(4, '0') : undefined,
      upiVpa: method === 'upi' ? `user${i}@okhdfcbank` : undefined,
    });
  }
  return payments;
}

export function generateSeedEvents(): SystemEvent[] {
  const events: SystemEvent[] = [];
  const now = Date.now();

  const eventTemplates = [
    { type: 'OrderCreated', source: 'OrderService', status: 'SUCCESS', msg: 'Order created in CREATED state' },
    { type: 'InventoryReserved', source: 'InventoryService', status: 'SUCCESS', msg: 'Inventory reserved with 10m TTL' },
    { type: 'PaymentInitiated', source: 'PaymentService', status: 'INFO', msg: 'Idempotent payment transaction initiated' },
    { type: 'PaymentAuthorized', source: 'PaymentService', status: 'SUCCESS', msg: 'Payment authorized via primary gateway' },
    { type: 'PaymentCaptured', source: 'PaymentService', status: 'SUCCESS', msg: 'Payment captured and funds locked' },
    { type: 'OrderConfirmed', source: 'OrderService', status: 'SUCCESS', msg: 'Order confirmed and notification triggered' },
    { type: 'ReservationExpired', source: 'InventoryService', status: 'WARNING', msg: 'TTL reached zero — inventory released to available pool' },
    { type: 'StockReleased', source: 'InventoryService', status: 'INFO', msg: 'Reserved inventory reverted to available pool' },
    { type: 'PaymentRetryInitiated', source: 'PaymentService', status: 'WARNING', msg: 'Exponential backoff retry attempt #2 queued' },
    { type: 'PaymentFailed', source: 'PaymentService', status: 'ERROR', msg: 'Gateway timeout reached max retries' },
    { type: 'CircuitBreakerOpened', source: 'APIGateway', status: 'ERROR', msg: 'Circuit breaker tripped for PaymentGateway endpoint' },
    { type: 'IdempotentDuplicateIgnored', source: 'APIGateway', status: 'INFO', msg: 'Duplicate request detected with identical Idempotency-Key' },
  ];

  for (let i = 1; i <= 104; i++) {
    const tmpl = eventTemplates[i % eventTemplates.length];
    const timestamp = now - (104 - i) * 180000;
    events.push({
      id: `EVT-${90000 + i}`,
      eventType: tmpl.type as any,
      source: tmpl.source as any,
      status: tmpl.status as any,
      message: `${tmpl.msg} (Ref #REF-${1000 + (i % 50)})`,
      payload: {
        eventId: `EVT-${90000 + i}`,
        sequence: i,
        correlationId: `CORR-${Math.floor(i / 4) + 1}`,
        clusterNode: `node-us-east-${(i % 4) + 1}`,
      },
      timestamp,
    });
  }
  return events;
}

export function generateSeedAuditLogs(): AuditLog[] {
  return [
    {
      id: 'AUD-001',
      timestamp: Date.now() - 3600000 * 2,
      user: 'admin@salesstorm.internal',
      role: 'DevOps Lead',
      action: 'Circuit Breaker Reset',
      entity: 'System',
      entityId: 'PaymentService',
      status: 'SUCCESS',
      ipAddress: '10.240.0.14',
      details: 'Manual reset of PaymentService circuit breaker after health check verified'
    },
    {
      id: 'AUD-002',
      timestamp: Date.now() - 3600000 * 4,
      user: 'system_daemon',
      role: 'Worker',
      action: 'Batch Expiry Sweep',
      entity: 'Reservation',
      entityId: 'RES-BATCH-09',
      status: 'SUCCESS',
      ipAddress: '127.0.0.1',
      details: 'Automatic sweep expired 6 stale reservations and released 14 units'
    },
    {
      id: 'AUD-003',
      timestamp: Date.now() - 3600000 * 5,
      user: 'mahesh@salesstorm.internal',
      role: 'Principal Architect',
      action: 'Stock Allocation Override',
      entity: 'Inventory',
      entityId: 'SKU-WH-1007',
      status: 'SUCCESS',
      ipAddress: '192.168.1.102',
      details: 'Added +50 units to WH-1007 available buffer for flash sale prep'
    },
    {
      id: 'AUD-004',
      timestamp: Date.now() - 3600000 * 8,
      user: 'gateway_security',
      role: 'Security Engine',
      action: 'Rate Limit Block',
      entity: 'Security',
      entityId: 'IP-45.132.89.2',
      status: 'WARNING',
      ipAddress: '45.132.89.2',
      details: 'Throttled 240 requests within 500ms exceeding 100 RPS IP quota'
    },
    {
      id: 'AUD-005',
      timestamp: Date.now() - 3600000 * 12,
      user: 'checkout_worker_3',
      role: 'Service Account',
      action: 'Idempotency Replay Prevented',
      entity: 'Payment',
      entityId: 'PAY-KEY-ORD-10204',
      status: 'SUCCESS',
      ipAddress: '10.240.1.25',
      details: 'Detected duplicate POST payload; returned existing 200 OK authorization response'
    },
    {
      id: 'AUD-006',
      timestamp: Date.now() - 3600000 * 15,
      user: 'compliance_auditor',
      role: 'Auditor',
      action: 'Export Ledger Snapshot',
      entity: 'Order',
      entityId: 'LEDGER-2026-Q1',
      status: 'SUCCESS',
      ipAddress: '172.16.4.12',
      details: 'Read-only financial reconciliation export generated (50 orders)'
    },
    {
      id: 'AUD-007',
      timestamp: Date.now() - 3600000 * 18,
      user: 'dlq_processor',
      role: 'DLQ Consumer',
      action: 'Message Replay',
      entity: 'System',
      entityId: 'DLQ-MSG-101',
      status: 'SUCCESS',
      ipAddress: '10.240.2.11',
      details: 'Re-injected failed payment webhook into active event bus topic'
    },
    {
      id: 'AUD-008',
      timestamp: Date.now() - 3600000 * 21,
      user: 'admin@salesstorm.internal',
      role: 'Admin',
      action: 'Configuration Update',
      entity: 'System',
      entityId: 'CONFIG-RESERVATION-TTL',
      status: 'SUCCESS',
      ipAddress: '10.240.0.14',
      details: 'Default reservation TTL adjusted from 15m to 10m'
    },
    {
      id: 'AUD-009',
      timestamp: Date.now() - 3600000 * 23,
      user: 'api_gateway',
      role: 'System',
      action: 'mTLS Certificate Rotated',
      entity: 'Security',
      entityId: 'CERT-EDGE-2026',
      status: 'SUCCESS',
      ipAddress: '10.240.0.1',
      details: 'Automatic rotation of edge ingress wildcard TLS certificates'
    },
    {
      id: 'AUD-010',
      timestamp: Date.now() - 3600000 * 26,
      user: 'system_daemon',
      role: 'Worker',
      action: 'Database Snapshot Completed',
      entity: 'System',
      entityId: 'PG-SNAP-9941',
      status: 'SUCCESS',
      ipAddress: '10.240.3.5',
      details: 'Point-in-time recovery snapshot created across shards 1-4'
    }
  ];
}

export const INITIAL_DLQ_MESSAGES: DLQMessage[] = [
  {
    id: 'DLQ-001',
    originalEventId: 'EVT-90088',
    eventType: 'PaymentWebhookDeliveryFailed',
    source: 'PaymentService',
    payload: { paymentId: 'PAY-78235', orderId: 'ORD-10205', error: 'Target webhook endpoint responded 504 Gateway Timeout' },
    errorReason: 'HTTP 504 Gateway Timeout from merchant webhook receiver',
    retryCount: 3,
    enqueuedAt: Date.now() - 3600000 * 3,
    status: 'PENDING',
  },
  {
    id: 'DLQ-002',
    originalEventId: 'EVT-90042',
    eventType: 'OrderConfirmationSMSFailed',
    source: 'NotificationService',
    payload: { orderId: 'ORD-10214', recipient: '+919876543210', gateway: 'Twilio' },
    errorReason: 'SMS provider quota exhausted or invalid E.164 country routing',
    retryCount: 2,
    enqueuedAt: Date.now() - 3600000 * 6,
    status: 'PENDING',
  },
  {
    id: 'DLQ-003',
    originalEventId: 'EVT-90029',
    eventType: 'InventoryRollbackSyncFailure',
    source: 'InventoryService',
    payload: { sku: 'SW-2041', releasedQuantity: 2, reason: 'Redis replication lag' },
    errorReason: 'Transient distributed lock acquisition timeout in secondary replica',
    retryCount: 4,
    enqueuedAt: Date.now() - 3600000 * 9,
    status: 'PENDING',
  }
];
