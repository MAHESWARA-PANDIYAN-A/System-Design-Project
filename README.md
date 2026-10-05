# SalesStorm — Scalable Commerce Transaction & Inventory Orchestration Platform

> **High-Performance Distributed Commerce Prototype** demonstrating real-time order sagas, dynamic TTL inventory reservations, Redis-backed idempotency guards, circuit-breaker fault tolerance, and live transaction observability.

---

## 1. Executive Summary

SalesStorm is an enterprise-grade full-stack commerce transaction prototype designed for high-concurrency flash sales and mission-critical payment workflows. It demonstrates how distributed systems solve the **Double Charge Problem**, **Inventory Overselling**, **Network Partitions**, and **Cascading Service Failures** using deterministic sagas, atomic Redis reservation locks, and event-driven message architectures.

---

## 2. Key Architecture Concepts Demonstrated

```
[ Customer Client / Web ]
           │
           ▼
[ API Gateway (Envoy/Kong) ] ── (Token-Bucket Rate Limiter 5k/min, mTLS Auth)
           │
           ▼
[ Order Orchestration Service ] ── (Distributed 2PC / Saga Coordinator)
     │                     │
     ▼                     ▼
[ Inventory Service ]   [ Payment Service ] ── (Acquiring Network Gateway)
     │                     │
     ├─► [ Redis Cluster ] ├─► [ Idempotency Store (RFC 7386) ]
     │   (Atomic Lua TTL)  │
     │                     ▼
     └─► [ Kafka Broker ] ──► [ Dead Letter Queue (DLQ) ]
              │
              ├─► [ PostgreSQL Sharded DB (Ledger) ]
              ├─► [ Notification Service (SMS/Email) ]
              └─► [ OpenTelemetry & System Monitor ]
```

1. **Atomic Inventory Reservation with TTL Locks**:
   - Every checkout reserves stock with a real-time countdown timer (e.g., 10 minutes TTL).
   - If payment is not completed before the countdown hits `00:00`, the reservation **automatically expires**, triggering compensatory events that instantly restore stock to the available pool.
   - Built to simulate zero overselling and eliminate race conditions under high concurrency.

2. **Idempotency Guard & Double-Charge Prevention**:
   - Implements RFC 7386 compliant `Idempotency-Key` headers on all POST endpoints.
   - First call charges customer and records response in memory/cache.
   - Subsequent duplicate requests (e.g. repeated user clicks or network timeouts) immediately return the cached receipt with status `DUPLICATE_REQUEST_DETECTED` with **zero duplicate billing**.

3. **Distributed Sagas & Compensating Transactions**:
   - Order lifecycle: `CREATED` ➔ `RESERVED` ➔ `PAYMENT_PENDING` ➔ `PAID` ➔ `CONFIRMED`.
   - Alternative recovery branches: `FAILED` ➔ `RETRY (Exponential Backoff)` ➔ `EXPIRED / CANCELLED`.
   - Complete audit trail of stage transitions with Correlation IDs.

4. **Service Mesh Health & Circuit Breakers**:
   - 8 simulated microservices: API Gateway, Order Service, Inventory Service, Payment Service, Notification Service, Database, Message Queue, and Cache.
   - Interactive fault injection: simulate upstream degradation to watch the circuit breaker shift from `CLOSED` ➔ `HALF_OPEN` ➔ `OPEN` ➔ `RECOVERING`.

5. **Message Bus & Dead Letter Queue (DLQ)**:
   - Kafka-partitioned event streams with consumer lag telemetry.
   - Poison-pill message isolation with interactive **INSPECT**, **RETRY**, and **DISCARD** actions.

6. **High-Concurrency Load Simulation**:
   - Simulated traffic surges up to **10,000 Concurrent Users** and **500,000 Requests/sec**.
   - Real-time Recharts throughput graphs with LIVE, PAUSE, and BURST LOAD modes.

---

## 3. Technology Stack

- **Frontend Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v3, Custom Design System, Glassmorphic Dashboard Overlays
- **Animations**: Framer Motion (subtle micro-animations, packet tracking, node pulses), Canvas Confetti
- **Telemetry & Charts**: Recharts (Throughput Area, SLA Percentiles, Conversion Funnels)
- **Icons**: Lucide React
- **Architecture State**: Unified Central Reactive Context with continuous real-time tickers

---

## 4. Quick Start & Installation

The application runs immediately with zero external database dependencies:

```bash
# 1. Clone repository & navigate to directory
cd d:/SD

# 2. Install dependencies (if not already installed)
npm install

# 3. Start local development server
npm run dev

# 4. Open in browser:
http://localhost:5173/
```

To build production bundle:
```bash
npm run build
```

---

## 5. 3–5 Minute Judge Presentation Demo Flow

Follow this exact walkthrough during presentations:

| Step | Action | What Judges See |
|:---|:---|:---|
| **1** | Open **Dashboard** | Executive KPI cards (`1,284 Active Orders`, `Requests/sec`), live Recharts graph, and auto-scrolling Kafka event stream. |
| **2** | Click **RUN PURCHASE DEMO** | High-impact guided animation tracing request packets: Client ➔ Gateway ➔ Order Service ➔ Inventory Lock ➔ Payment ➔ Order Confirmed. |
| **3** | Open **Products** | 20 rich catalog items. Click product to inspect inventory breakdown (Available vs Reserved vs Sold) and history charts. |
| **4** | Click **Simulate Purchase** | 4-step wizard: Step 1 Select quantity ➔ Step 2 Watch live countdown timer lock ➔ Step 3 Choose Payment (Card/UPI/Wallet) ➔ Step 4 Confirmed celebration. |
| **5** | Test **Payment Failure & Retry** | In Checkout Step 3, check *Simulate Payment Gateway Failure*. Observe 504 Timeout, DLQ enlistment, and click **FORCE SUCCESS (RETRY)**. |
| **6** | Open **Payments ➔ Idempotency Demo** | Click *Send Initial Request* (201 Created). Click *Send Identical Request* again to witness cached response and double-charge prevention. |
| **7** | Open **Reservations** | View active countdown timers. Click **FORCE EXPIRE NOW** to see stock immediately restored to available pool. |
| **8** | Open **Architecture** | Click on interactive microservice nodes to inspect API surfaces, emitted events, and failure compensation logic. |
| **9** | Open **System Monitor** | Click *Simulate Payment Service Failure* to observe live health change: `HEALTHY` ➔ `DEGRADED` ➔ `DOWN (Circuit Breaker OPEN)` ➔ `RECOVERING`. |
| **10** | Run **500k RPS High Traffic** | Move Concurrent Users slider to 10k and start load simulation. Observe graph spike and telemetry response. |

---

## 6. Available Simulation Scenarios

1. **Payment Gateway Timeout (504)**: Retries with exponential backoff; compensatory stock release on final failure.
2. **Inventory Pod Crash**: Redirection to healthy cluster replicas without overselling.
3. **Database Shard Failover**: Read-replica rerouting and WAL write-ahead log replay.
4. **Kafka Message Queue Delay**: Consumer group scaling from 4 to 12 pods.
5. **Duplicate Payment Request**: Token-bucket idempotency deduplication.
6. **Reservation TTL Expiry**: Automatic daemon sweep restores held stock.

---

## 7. Assumptions & Prototype Design Decisions

- **In-Memory & Deterministic State**: State is centralized across all pages in React Context with localStorage persistence.
- **Deterministic Seed Data**: Initialized with 20 realistic electronic/computing SKUs, 52 orders, 32 reservations, 52 payments, and 104 Kafka events.
- **Realistic Telemetry**: Telemetry graphs animate realistically; 500k RPS mode is explicitly labeled as a prototype simulation engine.
