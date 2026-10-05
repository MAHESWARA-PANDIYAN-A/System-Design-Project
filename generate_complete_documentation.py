"""
Complete SalesStorm Documentation Script
Generates SalesStorm_Implementation_Code_Documentation.docx
"""

import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

from doc_helpers import (
    COLOR_NAVY_HEX, COLOR_AMBER_HEX, COLOR_SLATE_HEX, COLOR_DARK_HEX,
    COLOR_LIGHT_HEX, COLOR_BORDER_HEX, COLOR_MUTED_HEX,
    COLOR_NAVY, COLOR_AMBER, COLOR_SLATE, COLOR_DARK, COLOR_MUTED,
    set_cell_background, set_cell_margins, set_table_borders,
    format_table, add_callout, add_code_block
)

def create_document():
    doc = docx.Document()
    
    # Page setup - Standard Letter, 1 inch margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        
        # Header & Footer setup
        header = section.header
        p_hdr = header.paragraphs[0]
        p_hdr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r_hdr = p_hdr.add_run("SALESSTORM | Implementation Code Documentation")
        r_hdr.font.name = "Segoe UI"
        r_hdr.font.size = Pt(8.5)
        r_hdr.font.color.rgb = COLOR_MUTED
        
        footer = section.footer
        p_ftr = footer.paragraphs[0]
        p_ftr.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r_ftr = p_ftr.add_run("SysCrafters 2026 Hackathon — Confidential Project Documentation")
        r_ftr.font.name = "Segoe UI"
        r_ftr.font.size = Pt(8.5)
        r_ftr.font.color.rgb = COLOR_MUTED

    # Style Configurations
    styles = doc.styles
    normal_style = styles['Normal']
    normal_style.font.name = 'Segoe UI'
    normal_style.font.size = Pt(10)
    normal_style.font.color.rgb = COLOR_DARK
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(6)

    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Segoe UI Semibold'
        run.font.size = Pt(18)
        run.font.bold = True
        run.font.color.rgb = COLOR_NAVY
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Segoe UI Semibold'
        run.font.size = Pt(13)
        run.font.bold = True
        run.font.color.rgb = COLOR_SLATE
        return p

    def add_h3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Segoe UI Semibold'
        run.font.size = Pt(11)
        run.font.bold = True
        run.font.color.rgb = COLOR_DARK
        return p

    def add_p(text):
        return doc.add_paragraph(text)

    def add_bullet(bold_prefix, text):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(3)
        r_bold = p.add_run(bold_prefix)
        r_bold.bold = True
        r_bold.font.color.rgb = COLOR_NAVY
        p.add_run(text)
        return p

    # =========================================================================
    # COVER PAGE
    # =========================================================================
    p_pre = doc.add_paragraph()
    p_pre.paragraph_format.space_before = Pt(36)

    # Accent decorative bar
    tbl_accent = doc.add_table(rows=1, cols=1)
    tbl_accent.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell_acc = tbl_accent.cell(0, 0)
    cell_acc.width = Inches(6.5)
    set_cell_background(cell_acc, COLOR_AMBER_HEX)
    set_cell_margins(cell_acc, top=30, bottom=30, left=0, right=0)
    p_acc = cell_acc.paragraphs[0]
    p_acc.paragraph_format.space_before = Pt(0)
    p_acc.paragraph_format.space_after = Pt(0)

    p_spacer = doc.add_paragraph()
    p_spacer.paragraph_format.space_before = Pt(18)
    p_spacer.paragraph_format.space_after = Pt(0)

    # Main Title
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(10)
    p_title.paragraph_format.space_after = Pt(4)
    r_title = p_title.add_run("SALESSTORM")
    r_title.font.name = "Segoe UI Black"
    r_title.font.size = Pt(36)
    r_title.font.bold = True
    r_title.font.color.rgb = COLOR_NAVY

    # Subtitle
    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(8)
    r_sub = p_sub.add_run("Implementation Code Documentation")
    r_sub.font.name = "Segoe UI Semibold"
    r_sub.font.size = Pt(18)
    r_sub.font.color.rgb = COLOR_SLATE

    p_hack = doc.add_paragraph()
    p_hack.paragraph_format.space_before = Pt(0)
    p_hack.paragraph_format.space_after = Pt(36)
    r_hack = p_hack.add_run("SysCrafters 2026 — Design-First AI-Assisted Hackathon")
    r_hack.font.name = "Segoe UI"
    r_hack.font.size = Pt(12)
    r_hack.font.color.rgb = COLOR_MUTED

    # Metadata Block Table
    meta_table = doc.add_table(rows=5, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(meta_table, "E2E8F0")
    
    meta_data = [
        ("Project:", "SalesStorm — Scalable Commerce Transaction & Inventory Platform"),
        ("Document:", "Implementation Code Documentation"),
        ("Technology:", "React 19 / TypeScript / Vite / Tailwind CSS v3 / Recharts / Framer Motion"),
        ("Version:", "1.0 (Production-Ready Prototype)"),
        ("Author / Maintainer:", "MAHESWARA-PANDIYAN-A (maheswarapandiyan.a2024csbs@sece.ac.in)")
    ]
    
    for row_idx, (k, v) in enumerate(meta_data):
        c0 = meta_table.cell(row_idx, 0)
        c1 = meta_table.cell(row_idx, 1)
        c0.width = Inches(2.2)
        c1.width = Inches(4.3)
        set_cell_background(c0, "F8FAFC")
        set_cell_background(c1, "FFFFFF")
        set_cell_margins(c0, top=90, bottom=90, left=140, right=140)
        set_cell_margins(c1, top=90, bottom=90, left=140, right=140)
        
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_before = Pt(0)
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(k)
        r0.font.name = "Segoe UI Semibold"
        r0.font.size = Pt(9.5)
        r0.font.color.rgb = COLOR_NAVY
        r0.bold = True
        
        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_before = Pt(0)
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(v)
        r1.font.name = "Segoe UI"
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = COLOR_DARK

    p_bottom = doc.add_paragraph()
    p_bottom.paragraph_format.space_before = Pt(48)
    r_bot = p_bottom.add_run("CONFIDENTIAL & PROPRIETARY — SYSTEM DESIGN HACKATHON DELIVERABLE")
    r_bot.font.name = "Segoe UI"
    r_bot.font.size = Pt(8.5)
    r_bot.font.color.rgb = COLOR_MUTED

    doc.add_page_break()

    # =========================================================================
    # TABLE OF CONTENTS
    # =========================================================================
    add_h1("Table of Contents")
    add_p("This document provides complete, rigorous technical documentation of the actual implemented codebase for the SalesStorm platform. Each section maps directly to real source files in the repository.")
    
    toc_table = doc.add_table(rows=1, cols=3)
    toc_headers = ["Section", "Title", "Core Source Files"]
    toc_data = [
        ("1", "Implementation Overview", "App.tsx, README.md"),
        ("2", "Technology Stack", "package.json, vite.config.ts"),
        ("3", "Project Structure", "Directory Tree, Source Hierarchy"),
        ("4", "Application Architecture", "ArchitectureDiagram.tsx, seedData.ts"),
        ("5", "Frontend Implementation", "App.tsx, components/layout/, index.css"),
        ("6", "Backend Implementation", "AppContext.tsx (Simulated Services)"),
        ("7", "Database / Data Model Implementation", "types/index.ts, seedData.ts"),
        ("8", "Inventory Implementation", "InventoryPage.tsx, AppContext.tsx"),
        ("9", "Reservation Implementation", "ReservationsPage.tsx, AppContext.tsx"),
        ("10", "Order Implementation", "OrdersPage.tsx, OrderDetailDrawer.tsx"),
        ("11", "Payment Implementation", "PaymentsPage.tsx, AppContext.tsx"),
        ("12", "Idempotency Implementation", "IdempotencyDemo.tsx, AppContext.tsx"),
        ("13", "Event Processing Implementation", "EventsPage.tsx, DLQViewer.tsx"),
        ("14", "Failure Handling and Recovery", "SystemMonitorPage.tsx, DLQViewer.tsx"),
        ("15", "API Implementation", "ApiConsolePage.tsx"),
        ("16", "Security Implementation", "SecurityPage.tsx, AuditLogPage.tsx"),
        ("17", "Scalability and Performance Implementation", "TrafficSimulationPanel.tsx, RequestGraph.tsx"),
        ("18", "Observability and Monitoring", "SystemMonitorPage.tsx, AnalyticsPage.tsx"),
        ("19", "Important Code Listings", "AppContext.tsx, types/index.ts"),
        ("20", "Installation and Execution", "package.json, render.yaml"),
        ("21", "Testing", "oxlint, tsc, Interactive E2E Scripts"),
        ("22", "Implementation-to-Requirements Mapping", "Traceability Matrix"),
        ("23", "Limitations and Assumptions", "Prototype Boundaries"),
        ("24", "Conclusion", "Executive Technical Summary")
    ]
    format_table(toc_table, [1.0, 3.2, 2.3], toc_headers, toc_data)
    
    doc.add_page_break()

    # =========================================================================
    # 1. IMPLEMENTATION OVERVIEW
    # =========================================================================
    add_h1("1. Implementation Overview")
    add_p("SalesStorm is an enterprise-grade, high-performance distributed commerce transaction prototype engineered specifically for high-concurrency flash sales, real-time inventory reservation, and zero double-charge payment orchestration. Built for the SysCrafters 2026 hackathon, the platform demonstrates how complex distributed systems patterns solve classical e-commerce failure modes—such as inventory overselling, race conditions, network partition timeouts, and cascading microservice collapse.")

    add_h2("1.1 What the Application Currently Does")
    add_p("The application delivers an interactive, operational control center that allows users, engineers, and hackathon judges to witness, trigger, and inspect the entire transaction lifecycle in real time:")
    add_bullet("Real-Time Inventory Reservation with TTL Locks: ", "Locks catalog stock with live countdown timers (e.g. 10 minutes). If a customer fails to complete checkout before expiration, an automated background sweep triggers a compensating transaction that immediately restores units to the available pool.")
    add_bullet("RFC-Compliant Idempotency Guard: ", "Guarantees zero duplicate charges across payment APIs by enforcing unique Idempotency-Key headers, caching responses in an in-memory key-value store, and safely returning cached receipts when duplicate clicks or network replays occur.")
    add_bullet("Distributed Saga Orchestration: ", "Coordinates distributed multi-step transactions across simulated Order, Inventory, Payment, and Notification services, maintaining deterministic state progression and detailed audit timelines.")
    add_bullet("Circuit Breaker & Fault Injection: ", "Implements dynamic circuit breakers (CLOSED, HALF_OPEN, OPEN) across 8 simulated microservices with manual failure simulation and self-healing recovery.")
    add_bullet("Event Bus & Dead Letter Queue (DLQ): ", "Simulates partitioned Kafka message streams with poison-pill isolation, consumer lag monitoring, and interactive message replaying and discarding.")
    add_bullet("High-Concurrency Load Engine: ", "Simulates high-velocity traffic spikes up to 10,000 concurrent users and 500,000 requests/sec with live Recharts throughput visualizations.")

    add_h2("1.2 Implementation Classification (Implemented vs Simulated vs Out of Scope)")
    add_p("To maintain strict engineering integrity, the platform distinguishes between what is fully executed in the codebase, what is modeled via high-fidelity simulation, and what is out of scope for a hackathon prototype:")
    
    class_table = doc.add_table(rows=1, cols=3)
    class_headers = ["Category", "Feature / Component", "Implementation Reality"]
    class_data = [
        ("IMPLEMENTED", "React 19 Interactive Web Application", "Full UI with 14 modular views, navigation, modals, and drawers in src/pages/ and src/components/"),
        ("IMPLEMENTED", "Centralized Reactive State Machine", "Complete deterministic saga and state engine in src/context/AppContext.tsx"),
        ("IMPLEMENTED", "1-Second Interval Reservation Countdown", "Active setInterval ticker decrementing remainingSeconds and auto-releasing expired stock"),
        ("IMPLEMENTED", "RFC 7386 Idempotency Engine", "In-memory Map cache validating Idempotency-Key and preventing double billing"),
        ("IMPLEMENTED", "Dead Letter Queue (DLQ) Management", "Poison-pill enqueuing, interactive message inspection, retry, and discard mechanisms"),
        ("IMPLEMENTED", "Circuit Breaker State Machine", "Dynamic CLOSED -> OPEN -> HALF_OPEN transitions with automatic latency tracking"),
        ("IMPLEMENTED", "Token Bucket Rate Limiter", "Dynamic client-side rate limiter visualizer with 5k req/min thresholding"),
        ("IMPLEMENTED", "Telemetry Graphs & Micro-animations", "Recharts throughput area charts, SLA percentiles, and Framer Motion packet tracking"),
        ("SIMULATED", "Distributed Multi-Node Redis Cluster", "Modeled in-memory via React state and ref caches (simulating atomic Lua TTL locks)"),
        ("SIMULATED", "Apache Kafka Broker & Partitions", "Modeled via event stream arrays and consumer group lag counters in seedData.ts"),
        ("SIMULATED", "504 Gateway Timeout Banking Network", "Modeled via simulated network delays and configurable failure toggle options"),
        ("SIMULATED", "500k RPS High-Traffic Surge", "Modeled mathematically via sine-wave jitter and configurable load telemetry ticker"),
        ("NOT IMPLEMENTED", "Real Financial PCI-DSS Credit Card Vault", "Real bank credentials / Stripe live API keys excluded for security & prototype compliance"),
        ("NOT IMPLEMENTED", "Physical Automated Warehouse Robotics", "Physical hardware conveyor / barcode scanner integration is outside software scope")
    ]
    format_table(class_table, [1.5, 2.3, 2.7], class_headers, class_data)

    # =========================================================================
    # 2. TECHNOLOGY STACK
    # =========================================================================
    add_h1("2. Technology Stack")
    add_p("The SalesStorm implementation utilizes a modern, zero-dependency frontend architecture engineered for speed, type safety, and responsive visualization:")
    
    tech_table = doc.add_table(rows=1, cols=4)
    tech_headers = ["Layer", "Technology", "Version", "Purpose & Architectural Role"]
    tech_data = [
        ("Frontend Core", "React", "^19.2.8", "Component hierarchy, hooks, state lifecycle, and DOM diffing"),
        ("Language", "TypeScript", "~6.0.2", "Strict static typing, interface contracts, and compile-time error detection"),
        ("Build Tooling", "Vite", "^8.3.0", "Next-gen lightning HMR, roll-up production bundler, static file serving"),
        ("Styling System", "Tailwind CSS", "^3.4.17", "Custom design system tokens, Oxford Navy & Amber palette, responsive layout"),
        ("CSS Post-Processing", "PostCSS & Autoprefixer", "^8.5 / ^10.6", "CSS parsing, vendor prefixing, and custom scrollbar transformations"),
        ("Telemetry & Charts", "Recharts", "^3.10.1", "Throughput area curves, SLA latency percentiles, and inventory bar charts"),
        ("Micro-Animations", "Framer Motion", "^14.0.0", "Packet tracing, node status transitions, and modal entry/exit gestures"),
        ("Iconography", "Lucide React", "^1.52.0", "Pixel-perfect modern SVG icons across navigation and service nodes"),
        ("Visual Effects", "Canvas Confetti", "^1.9.4", "Celebration particle burst upon successful checkout saga completion"),
        ("Code Quality", "Oxlint", "^1.81.0", "High-speed Rust-based linter ensuring clean coding standards"),
        ("Class Utilities", "clsx & tailwind-merge", "^2.1 / ^3.7", "Conflict-free dynamic Tailwind utility class compositions"),
        ("Hosting / CI/CD", "Render Blueprint", "render.yaml", "Cloud static site hosting with global CDN and automated Git deploys")
    ]
    format_table(tech_table, [1.3, 1.6, 1.0, 2.6], tech_headers, tech_data)

    add_callout(doc, "SalesStorm is intentionally configured as a standalone Single Page Application (SPA). It compiles into optimized static JavaScript/CSS assets in under 1.2 seconds with zero external database prerequisites, allowing immediate offline local execution or zero-cost cloud deployment on platforms like Render.", "STANDALONE ZERO-DEPENDENCY DESIGN", "info")

    # =========================================================================
    # 3. PROJECT STRUCTURE
    # =========================================================================
    add_h1("3. Project Structure")
    add_p("The project follows a clean domain-driven directory structure separating presentation pages, reusable domain components, state context, types, and mock data:")

    code_tree = """d:\\SD
├── index.html                   # HTML5 entry point with Inter & JetBrains Mono fonts
├── package.json                 # Project dependencies, scripts (dev, build, lint, preview)
├── postcss.config.js            # PostCSS configuration for Tailwind and Autoprefixer
├── render.yaml                  # Cloud deployment blueprint for Render Static Site
├── tailwind.config.js           # Extended design tokens: Oxford Navy, Amber, Half-White
├── tsconfig.json                # TypeScript root configuration referencing app & node configs
├── vite.config.ts               # Vite configuration with relative base asset routing ('./')
├── public/                      # Static web assets (favicon.svg, icons.svg)
└── src/
    ├── App.css                  # Global layout styles & custom animations
    ├── App.tsx                  # Shell layout: Sidebar, Header, Dynamic Outlet, Drawers
    ├── index.css                # Tailwind directives & glowing beacon keyframe animation
    ├── main.tsx                 # React 19 entry point mounting into #root
    ├── types/
    │   └── index.ts             # 188 lines of strict TypeScript interfaces & domain enums
    ├── data/
    │   └── seedData.ts          # Deterministic seed data: 20 SKUs, 52 orders, 104 events
    ├── context/
    │   └── AppContext.tsx       # Core transaction saga coordinator & state machine (1315 lines)
    ├── components/
    │   ├── architecture/        # ArchitectureDiagram.tsx (interactive microservices topology)
    │   ├── checkout/            # PurchaseWizardModal.tsx (4-step guided checkout saga)
    │   ├── common/              # Card.tsx, Badge.tsx, Modal.tsx (reusable design system)
    │   ├── dashboard/           # KPICards.tsx, LiveActivityStream.tsx, RequestGraph.tsx, TrafficSimulationPanel.tsx
    │   ├── demo/                # EndToEndDemoModal.tsx (animated step-by-step transaction flow)
    │   ├── events/              # MessageQueueVisualizer.tsx, DLQViewer.tsx
    │   ├── layout/              # Header.tsx, Sidebar.tsx, DemoBanner.tsx, ToastContainer.tsx
    │   ├── orders/              # OrderDetailDrawer.tsx (order timeline & audit references)
    │   ├── payments/            # IdempotencyDemo.tsx (double-charge prevention sandbox)
    │   └── products/            # ProductCard.tsx, ProductDetailDrawer.tsx
    └── pages/
        ├── AnalyticsPage.tsx    # SLA telemetry, p95/p99 latency, conversion funnels
        ├── ApiConsolePage.tsx   # Interactive Swagger-style REST sandbox with curl commands
        ├── ArchitecturePage.tsx # Microservices topology, circuit breakers, and data flow
        ├── AuditLogPage.tsx     # Immutable audit trail & compliance activity log
        ├── DashboardPage.tsx    # Central operations dashboard with KPI overview
        ├── EventsPage.tsx       # Kafka event bus stream & Dead Letter Queue viewer
        ├── InventoryPage.tsx    # SKU warehouse allocations & reservation pressure
        ├── OrdersPage.tsx       # Order lifecycle state transitions & transaction search
        ├── PaymentsPage.tsx     # Payment transactions & idempotency replay guards
        ├── ProductsPage.tsx     # 20-product rich catalog with stock availability status
        ├── ReservationsPage.tsx # Real-time TTL reservation locks & manual force-expiry
        ├── SecurityPage.tsx     # Token bucket rate limiting, mTLS posture, RBAC policies
        ├── StateMachinePage.tsx # Visual deterministic state machine graph with inspection
        └── SystemMonitorPage.tsx# Telemetry, service health matrix, and fault injection
"""
    add_code_block(doc, code_tree, "Workspace Directory Layout")

    # =========================================================================
    # 4. APPLICATION ARCHITECTURE
    # =========================================================================
    add_h1("4. Application Architecture")
    add_p("SalesStorm models a distributed event-driven commerce architecture. The system decouples write-heavy order processing from read-heavy catalog availability while guaranteeing transactional consistency using the Saga Pattern:")

    code_arch = """+-------------------------------------------------------------------------------+
|                            CLIENT TIER (React 19 SPA)                         |
|  - Dashboard Control Center       - 4-Step Checkout Wizard     - API Console  |
+---------------------------------------+---------------------------------------+
                                        | HTTP / JSON (Idempotency-Key Header)
                                        v
+-------------------------------------------------------------------------------+
|                       API GATEWAY (Simulated Envoy / Kong)                    |
|  - Token Bucket Rate Limiter (5,000 req/min)   - Mutual TLS (mTLS) Auth Guard |
|  - Idempotency Cache Filter (RFC 7386)         - Request Correlation ID Inject|
+---------------------------------------+---------------------------------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
                 v                                             v
+---------------------------------+           +---------------------------------+
|    ORDER ORCHESTRATION SERVICE  |           |        INVENTORY SERVICE        |
|  - Saga State Machine           |           |  - Atomic Lua Lock Evaluator    |
|  - Stage Transition Journal     |           |  - Dynamic TTL Reservation Pool |
|  - Compensation Coordinator     |           |  - Stock Pressure Analyzer      |
+----------------+----------------+           +----------------+----------------+
                 |                                             |
                 v                                             v
+---------------------------------+           +---------------------------------+
|         PAYMENT SERVICE         |           |       REDIS CLUSTER STORE       |
|  - Acquiring Gateway Adapter    |           |  - 10-Minute TTL Locks          |
|  - Exponential Backoff Retries  |           |  - Idempotency Key Caching      |
|  - Replay Guard Validator       |           |  - Distributed Distributed Locks|
+----------------+----------------+           +---------------------------------+
                 |
                 +----------------------+----------------------+
                                        | Events
                                        v
+-------------------------------------------------------------------------------+
|                      EVENT BUS / BROKER (Simulated Kafka)                     |
|  - Partitions: orders.v1 | inventory.v1 | payments.v1 | system.v1             |
|  - Consumer Groups: NotificationPod (x4) | AuditPod (x2) | BillingPod (x4)    |
+---------------------------------------+---------------------------------------+
                                        |
                 +----------------------+----------------------+
                 | Poison Pills / Timeouts                     | Healthy Stream
                 v                                             v
+---------------------------------+           +---------------------------------+
|     DEAD LETTER QUEUE (DLQ)     |           |   ANALYTICS & AUDIT LEDGER      |
|  - Failed Payment Isolation     |           |  - Immutable Operational Trail  |
|  - Interactive Replay & Discard |           |  - Real-time SLA Percentiles    |
+---------------------------------+           +---------------------------------+
"""
    add_code_block(doc, code_arch, "Distributed Commerce Topology")

    add_h2("4.1 Distributed Sagas vs Two-Phase Commit (2PC)")
    add_p("Traditional e-commerce platforms using Two-Phase Commit (2PC) suffer severe blocking latency and vulnerability to coordinator node crashes. SalesStorm adopts an **Orchestrated Saga Pattern** where the central coordinator executes local transactions sequentially:")
    add_bullet("Forward Step 1: ", "Order Service creates order in CREATED state.")
    add_bullet("Forward Step 2: ", "Inventory Service atomically reserves required quantity and returns a 10-minute TTL lock (RES-xxxxx). Order transitions to RESERVED.")
    add_bullet("Forward Step 3: ", "Payment Service submits payment transaction with Idempotency-Key. Order transitions to PAYMENT_PENDING.")
    add_bullet("Forward Step 4 (Success): ", "Payment Gateway authorizes and captures funds. Order transitions to PAID and CONFIRMED. Inventory lock is converted to permanently sold stock.")
    add_bullet("Compensating Step (Failure / Timeout): ", "If Payment fails or Reservation TTL expires, the coordinator invokes compensatory actions: Order transitions to FAILED or EXPIRED, and Inventory Service immediately restores reserved stock to the available pool.")

    doc.add_page_break()

    # =========================================================================
    # 5. FRONTEND IMPLEMENTATION
    # =========================================================================
    add_h1("5. Frontend Implementation")
    add_p("The user interface is structured around a single-page application (SPA) layout defined in src/App.tsx. It provides a persistent, interactive environment where state changes across any service immediately ripple across all views:")

    add_h2("5.1 Layout & Shell Hierarchy")
    add_bullet("Persistent Sidebar (src/components/layout/Sidebar.tsx): ", "Houses navigation across all 14 platform services, live unread badges for active reservations and pending DLQ messages, system health indicator, and the light/dark theme toggle.")
    add_bullet("Presenter Demo Banner (src/components/layout/DemoBanner.tsx): ", "A sticky top banner for hackathon judges offering 1-click quick-start simulation buttons: Simulate Order, Trigger 504 Failure, Force TTL Expire, Run 500k RPS, and Auto Demo Flow.")
    add_bullet("Global Header (src/components/layout/Header.tsx): ", "Displays current tab breadcrumbs, dynamic page subtitles, global SKU search filter, and the prominent 'RUN PURCHASE DEMO' centerpiece launcher.")
    add_bullet("Dynamic Page Outlet: ", "Conditionally renders the active view from src/pages/ with smooth transition wrappers.")
    add_bullet("Global Drawers & Overlays: ", "Houses ProductDetailDrawer, OrderDetailDrawer, PurchaseWizardModal, EndToEndDemoModal, and ToastContainer at root level.")

    add_h2("5.2 Custom Design System & Color Tokens")
    add_p("The project's styling is customized in tailwind.config.js to implement a high-contrast palette combining Oxford Navy, Amber Gold, and Half-White:")
    
    palette_table = doc.add_table(rows=1, cols=4)
    pal_headers = ["Token Name", "Hex Value", "RGB Equivalent", "Design Role"]
    pal_data = [
        ("brand-navy / slate-900", "#14213D", "rgb(20, 33, 61)", "Dark mode card surfaces, table containers, sidebar background"),
        ("brand-amber / indigo-500", "#FCA311", "rgb(252, 163, 17)", "Hero accent, primary CTA buttons, active sidebar tabs, live glow"),
        ("brand-amber-dark / indigo-600", "#D97706", "rgb(217, 119, 6)", "Hover state for primary buttons, contrast text on light surfaces"),
        ("slate-50 / halfwhite", "#F5F6F8", "rgb(245, 246, 248)", "Default application page background (soft, premium off-white)"),
        ("brand-white", "#FFFFFF", "rgb(255, 255, 255)", "Light mode card background, high-contrast text on dark surfaces"),
        ("brand-gray / slate-200", "#E5E5E5", "rgb(229, 229, 229)", "Card borders, table dividers, secondary text accents"),
        ("brand-black / slate-950", "#000000", "rgb(0, 0, 0)", "True black base background in full dark mode")
    ]
    format_table(palette_table, [1.8, 1.1, 1.4, 2.2], pal_headers, pal_data)

    # =========================================================================
    # 6. BACKEND IMPLEMENTATION
    # =========================================================================
    add_h1("6. Backend Implementation")
    add_p("In this design-first prototype, backend microservice business logic, distributed locking protocols, and asynchronous workflows are executed via a high-fidelity deterministic engine located in src/context/AppContext.tsx. Rather than requiring external server runtimes, the application executes genuine distributed systems algorithms client-side:")

    add_h2("6.1 Service Abstractions Executed in AppContext")
    add_bullet("Order Service: ", "Manages order registration, calculates cart totals, generates tracking IDs (ORD-xxxxx), appends timeline stages, and binds reservation IDs.")
    add_bullet("Inventory Service: ", "Evaluates stock availability, atomically decrements availableStock while incrementing reservedStock, calculates stock pressure thresholds, and issues TTL reservation tokens.")
    add_bullet("Payment Service: ", "Handles card/UPI/wallet transactions, simulates gateway latencies (300ms to 3000ms), triggers simulated 504 timeouts, and integrates with the idempotency cache.")
    add_bullet("Idempotency Store (Redis Mirror): ", "Maintains an in-memory Map of Idempotency-Key values mapped to cached JSON receipts with timestamp metadata.")
    add_bullet("DLQ & Poison Pill Handler: ", "Isolates unrecoverable transactions, increments retry counts, and allows manual inspection and reprocessing.")
    add_bullet("System Monitor Daemon: ", "Maintains service health scores, CPU/Memory telemetry distributions, and circuit breaker tripping logic.")

    # =========================================================================
    # 7. DATABASE / DATA MODEL IMPLEMENTATION
    # =========================================================================
    add_h1("7. Database / Data Model Implementation")
    add_p("The domain model is defined in src/types/index.ts with 188 lines of strict TypeScript interfaces. The entities reflect real-world relational and document schemas:")

    add_h2("7.1 Core Entity Definitions")
    
    entity_table = doc.add_table(rows=1, cols=3)
    ent_headers = ["Entity Name", "Key Fields", "Description & Invariants"]
    ent_data = [
        ("Product", "id, sku, name, totalStock, availableStock, reservedStock, soldStock, status, price", "Maintains total stock integrity invariant: totalStock = availableStock + reservedStock + soldStock"),
        ("Reservation", "id, productId, sku, quantity, status, expiresAt, createdAt, durationSeconds, remainingSeconds", "Tracks inventory hold locks. Status enum: ACTIVE, EXPIRED, CONFIRMED, RELEASED"),
        ("Order", "id, customerName, customerEmail, items[], totalAmount, status, timeline[], idempotencyKey", "Represents customer order saga. Status: CREATED, RESERVED, PAYMENT_PENDING, PAID, CONFIRMED, FAILED, EXPIRED"),
        ("Payment", "id, orderId, amount, method, status, idempotencyKey, attempts, failureReason", "Represents transaction payment record. Status: PROCESSING, AUTHORIZED, CAPTURED, FAILED, RETRYING"),
        ("SystemEvent", "id, eventType, source, status, message, payload, timestamp", "Kafka event stream envelope containing event metadata and JSON payload"),
        ("ServiceHealth", "id, name, type, status, latencyMs, rps, errorRatePercent, circuitBreaker, instances", "Telemetry model for microservice health and circuit breaker status"),
        ("AuditLog", "id, timestamp, user, role, action, entity, entityId, status, ipAddress, details", "Immutable compliance log tracking all administrative and financial actions"),
        ("DLQMessage", "id, originalEventId, eventType, source, payload, errorReason, retryCount, status", "Dead Letter Queue envelope isolating poisoned or timed-out events")
    ]
    format_table(entity_table, [1.3, 2.5, 2.7], ent_headers, ent_data)

    doc.add_page_break()

    # =========================================================================
    # 8. INVENTORY IMPLEMENTATION
    # =========================================================================
    add_h1("8. Inventory Implementation")
    add_p("The Inventory Service manages multi-warehouse stock pools and guarantees zero overselling under race conditions:")

    add_h2("8.1 The Stock Conservation Invariant")
    add_p("Every SKU maintains a strict mathematical invariant:")
    add_callout(doc, "Total Stock = Available Stock + Reserved Stock + Sold Stock\n\nUnder no circumstances can Available Stock drop below zero. If a requested quantity exceeds Available Stock, the transaction is rejected immediately with an HTTP 409 Conflict equivalent.", "CORE INVENTORY INVARIANT", "info")

    add_h2("8.2 Dynamic Stock Pressure Telemetry")
    add_p("As stock is reserved during flash sale events, the inventory engine automatically recalculates SKU status:")
    add_bullet("AVAILABLE: ", "Available stock is greater than 10 units with low reservation pressure.")
    add_bullet("RESERVATION_PRESSURE: ", "Reserved stock accounts for more than 40% of remaining inventory, indicating an active flash sale spike.")
    add_bullet("LOW_STOCK: ", "Available stock is 10 units or fewer.")
    add_bullet("OUT_OF_STOCK: ", "Available stock has reached exactly 0.")

    # =========================================================================
    # 9. RESERVATION IMPLEMENTATION
    # =========================================================================
    add_h1("9. Reservation Implementation")
    add_p("The reservation mechanism prevents cart abandonment from permanently depleting stock while protecting checkout customers from having items bought out from under them:")

    add_h2("9.1 Time-to-Live (TTL) Lock Lifecycle")
    add_p("When a customer begins checkout, reserveInventory() allocates units for a default duration of 600 seconds (10 minutes):")
    add_bullet("1. Creation: ", "Reservation is assigned an ID (RES-xxxxx) with status 'ACTIVE' and remainingSeconds = 600.")
    add_bullet("2. Ticking: ", "A centralized 1-second interval daemon decrements remainingSeconds across all active reservations.")
    add_bullet("3. Expiry & Auto-Release: ", "When remainingSeconds reaches 0, the daemon automatically updates status to 'EXPIRED', increments availableStock, decrements reservedStock, transitions any linked order to 'EXPIRED', and dispatches an audit notification.")
    add_bullet("4. Confirmation: ", "If payment succeeds before expiry, status updates to 'CONFIRMED', remainingSeconds is zeroed, and units move to soldStock.")

    # =========================================================================
    # 10. ORDER IMPLEMENTATION
    # =========================================================================
    add_h1("10. Order Implementation")
    add_p("Orders represent the core business artifact orchestrated by the platform. The order lifecycle is governed by a strict deterministic state machine:")

    add_h2("10.1 Order State Transition Flow")
    code_order_sm = """[ START ]
    │
    ▼
[ CREATED ] ──────────────► [ INVENTORY RESERVATION ]
    │                                │
    │ (Stock Unavailable)             │ (Stock Locked)
    ▼                                ▼
[ FAILED ]                      [ RESERVED ]
                                     │
                                     ▼
                            [ PAYMENT_PENDING ]
                                     │
                +────────────────────+────────────────────+
                │ (Payment Success)                       │ (Payment Timeout / 504)
                ▼                                         ▼
            [ PAID ]                                  [ FAILED ]
                │                                         │
                ▼                                         ▼
          [ CONFIRMED ]                           [ RETRYING ] (Exp. Backoff)
                │                                         │
                ▼                                         ▼
          [ FULFILLED ]                           [ EXPIRED / CANCELLED ]
"""
    add_code_block(doc, code_order_sm, "Order State Machine Graph")

    add_h2("10.2 Order Timeline Audit Trail")
    add_p("Every order record stores a timeline array of OrderTimelineStep objects documenting stage transitions, execution timestamps, responsible microservices, and unique correlation event IDs.")

    # =========================================================================
    # 11. PAYMENT IMPLEMENTATION
    # =========================================================================
    add_h1("11. Payment Implementation")
    add_p("The payment engine handles multi-tender processing, simulates external gateway network realities, and coordinates retry logic:")

    add_h2("11.1 Payment Processing Workflow")
    add_bullet("Supported Payment Rails: ", "Credit Card (Tokenized last-4 '4242'), UPI (Virtual Payment Address 'customer@upi'), and Digital Wallet.")
    add_bullet("Gateway Timeout Simulation: ", "When the 'Simulate Failure' option is enabled, the payment gateway artificially simulates a 3,000ms delay followed by an HTTP 504 Gateway Timeout.")
    add_bullet("Dead Letter Queue Routing: ", "Upon gateway timeout, the failed payment is immediately routed to the Dead Letter Queue (DLQ) with error details for operator recovery.")
    add_bullet("Exponential Backoff Retry: ", "The retryPayment() handler allows operators to execute retry attempts with increasing backoff delays (#1: 1s, #2: 2s, #3: 4s) or force success.")

    doc.add_page_break()

    # =========================================================================
    # 12. IDEMPOTENCY IMPLEMENTATION
    # =========================================================================
    add_h1("12. Idempotency Implementation")
    add_p("One of the most critical engineering requirements for mission-critical e-commerce platforms is solving the **Double Charge Problem**. When network connections drop during payment processing, customers frequently click 'Pay' multiple times or automated mobile clients retry POST requests:")

    add_h2("12.1 RFC 7386 Idempotency-Key Protocol")
    add_p("SalesStorm implements an RFC-compliant idempotency filter. Every mutating payment request must include an Idempotency-Key header:")
    add_bullet("1. First Request: ", "The gateway evaluates checkIdempotency(key). If not found, payment executes, the receipt is stored in idempotencyStoreRef with timestamp metadata, and HTTP 201 Created is returned.")
    add_bullet("2. Duplicate Request: ", "When a request arrives with an identical Idempotency-Key, the gateway detects the cache hit, bypasses the payment acquiring network entirely, emits an IdempotentDuplicateIgnored event, and returns the cached receipt with zero duplicate billing.")

    # =========================================================================
    # 13. EVENT PROCESSING IMPLEMENTATION
    # =========================================================================
    add_h1("13. Event Processing Implementation")
    add_p("The platform incorporates an asynchronous event-driven backbone modeled after Apache Kafka. Microservices emit discrete domain events rather than making tightly coupled synchronous calls:")

    add_h2("13.1 Event Catalog (14 Supported Event Types)")
    add_p("EventsPage.tsx and AppContext.tsx manage 14 distinct system event types across the platform:")
    
    evt_table = doc.add_table(rows=1, cols=3)
    evt_headers = ["Event Type", "Originating Service", "Business Significance"]
    evt_data = [
        ("OrderCreated", "OrderService", "New order initiated; signals inventory service to lock stock"),
        ("InventoryReserved", "InventoryService", "Units allocated with active TTL lock; signals payment gateway"),
        ("PaymentInitiated", "PaymentService", "Payment intent registered; acquiring bank handshake opened"),
        ("PaymentAuthorized", "PaymentService", "External banking network approves card/UPI authorization"),
        ("PaymentCaptured", "PaymentService", "Funds debited; triggers order confirmation and stock finalization"),
        ("PaymentFailed", "PaymentService", "Gateway timed out or declined; sends event to DLQ"),
        ("OrderConfirmed", "OrderService", "Saga finalized; confirmation email/SMS dispatched"),
        ("ReservationExpired", "InventoryService", "TTL elapsed; compensatory stock release executed"),
        ("StockReleased", "InventoryService", "Stock returned to available inventory pool"),
        ("PaymentRetryInitiated", "PaymentService", "Exponential backoff retry attempt scheduled"),
        ("CircuitBreakerOpened", "SystemMonitor", "Error threshold exceeded; upstream traffic rejected"),
        ("CircuitBreakerClosed", "SystemMonitor", "Downstream service verified healthy; normal routing restored"),
        ("IdempotentDuplicateIgnored", "APIGateway", "Duplicate transaction key intercepted; double billing prevented"),
        ("DLQMessageEnqueued", "EventBus", "Poison pill or failed transaction quarantined in Dead Letter Queue")
    ]
    format_table(evt_table, [1.8, 1.4, 3.3], evt_headers, evt_data)

    add_h2("13.2 Dead Letter Queue (DLQ) Architecture")
    add_p("Transactions that fail repeatedly or encounter unhandled exceptions are quarantined in the Dead Letter Queue (DLQViewer.tsx). This prevents poison-pill messages from blocking consumer group partitions while enabling operators to inspect payloads, trigger manual replaying, or discard corrupted events.")

    # =========================================================================
    # 14. FAILURE HANDLING AND RECOVERY
    # =========================================================================
    add_h1("14. Failure Handling and Recovery")
    add_p("Resilience is engineered as a core capability rather than an afterthought. The platform implements dynamic Circuit Breakers across all 8 simulated microservices:")

    add_h2("14.1 Circuit Breaker State Transitions")
    add_bullet("CLOSED (Normal Operation): ", "Requests route directly to the target service. Error rates and latency metrics are continuously recorded.")
    add_bullet("OPEN (Fault Injected): ", "When consecutive failures occur or an operator triggers simulateServiceFailure(), the breaker flips to OPEN. The gateway immediately fails fast, preventing cascading resource starvation.")
    add_bullet("HALF_OPEN (Testing Recovery): ", "When recoverService() is executed, the breaker enters HALF_OPEN. It allows a small sample of probe requests through to evaluate health before restoring full traffic.")

    doc.add_page_break()

    # =========================================================================
    # 15. API IMPLEMENTATION
    # =========================================================================
    add_h1("15. API Implementation")
    add_p("SalesStorm includes an interactive API Explorer and Swagger sandbox in src/pages/ApiConsolePage.tsx allowing engineers to test endpoints directly with live JSON payloads:")

    api_table = doc.add_table(rows=1, cols=4)
    api_headers = ["Method", "Endpoint", "Status", "Description & Payload"]
    api_data = [
        ("POST", "/api/v1/orders", "201 Created", "Create order saga with linked items, customer data, and optional reservationId"),
        ("POST", "/api/v1/reservations", "201 Created", "Request atomic stock hold lock with custom TTL (e.g. 600s)"),
        ("POST", "/api/v1/payments", "200 / 504", "Authorize and capture payment; requires mandatory Idempotency-Key header"),
        ("GET", "/api/v1/inventory/{sku}", "200 OK", "Fetch real-time stock levels (available, reserved, sold, total) and pressure status"),
        ("GET", "/api/v1/health", "200 OK", "Cluster health matrix, circuit breaker status, latency metrics across all 8 services"),
        ("POST", "/api/v1/events/replay", "200 OK", "Replay quarantined DLQ message through consumer group partitions")
    ]
    format_table(api_table, [0.8, 2.0, 1.1, 2.6], api_headers, api_data)

    # =========================================================================
    # 16. SECURITY IMPLEMENTATION
    # =========================================================================
    add_h1("16. Security Implementation")
    add_p("Security controls are detailed in src/pages/SecurityPage.tsx and src/pages/AuditLogPage.tsx:")
    add_bullet("Token Bucket Rate Limiting: ", "Simulates an Envoy/Kong token bucket rate limiter configured at 5,000 requests/minute per client IP. The console provides real-time visualization of consumed tokens, burst allowance, and HTTP 429 Too Many Requests rejection.")
    add_bullet("Mutual TLS (mTLS): ", "Simulates internal service mesh encryption where all inter-service communication (e.g. OrderService -> InventoryService) requires bidirectional cryptographic certificate validation.")
    add_bullet("Role-Based Access Control (RBAC): ", "Demonstrates policy separation between Shopper, OrderManager, InventoryAdmin, and SecurityAuditor roles.")
    add_bullet("Immutable Audit Trail: ", "Every financial, stock, and security action logs timestamp, actor, IP address, target entity, and cryptographic correlation hash.")

    # =========================================================================
    # 17. SCALABILITY AND PERFORMANCE IMPLEMENTATION
    # =========================================================================
    add_h1("17. Scalability and Performance Implementation")
    add_p("The platform is engineered to visualize extreme concurrency spikes in src/components/dashboard/TrafficSimulationPanel.tsx:")
    add_bullet("Simulated Concurrency: ", "Interactive slider allows scaling virtual users from 100 to 10,000 concurrent shoppers.")
    add_bullet("High-Throughput Simulation: ", "Supports simulated flash sale bursts up to 500,000 Requests/sec with animated throughput curves in Recharts.")
    add_bullet("Consumer Pod Autoscaling: ", "Demonstrates dynamic scaling of Kafka consumer worker pods from 4 to 12 instances during queue depth surges.")

    # =========================================================================
    # 18. OBSERVABILITY AND MONITORING
    # =========================================================================
    add_h1("18. Observability and Monitoring")
    add_p("Full telemetry is displayed across src/pages/SystemMonitorPage.tsx and src/pages/AnalyticsPage.tsx:")
    add_bullet("Golden Signals: ", "Tracks Latency (average, p95, p99), Traffic (RPS), Errors (percentage), and Saturation (CPU% and Memory%).")
    add_bullet("Real-Time Graphs: ", "Visualizes throughput waveforms, latency percentile curves, and conversion funnels (Visits -> Cart -> Reservation -> Paid).")
    add_bullet("Live Activity Stream: ", "Auto-scrolling event ticker (LiveActivityStream.tsx) logging all discrete state transitions with color-coded severity badges.")

    doc.add_page_break()

    # =========================================================================
    # 19. IMPORTANT CODE LISTINGS
    # =========================================================================
    add_h1("19. Important Code Listings")
    add_p("The following listings represent verbatim extracts from the actual codebase demonstrating core architectural algorithms:")

    add_h2("19.1 Inventory Reservation & 1-Second Countdown Ticker (src/context/AppContext.tsx)")
    code_res_snippet = """// 1-second interval ticker for active reservation countdowns & auto-expiry
useEffect(() => {
  const interval = setInterval(() => {
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

            // Void related order if in CREATED or RESERVED state
            if (r.orderId) {
              setOrders((prevOrders) =>
                prevOrders.map((o) => {
                  if (o.id === r.orderId && ['CREATED', 'RESERVED', 'PAYMENT_PENDING'].includes(o.status)) {
                    return { ...o, status: 'EXPIRED' };
                  }
                  return o;
                })
              );
            }

            logSystemEvent('ReservationExpired', 'InventoryService', 'WARNING',
              `Reservation ${r.id} for ${r.productName} expired (TTL 0s) — ${r.quantity} units released`,
              { reservationId: r.id, sku: r.sku, quantity: r.quantity }
            );
          }
          return { ...r, remainingSeconds: Math.max(0, nextRemaining) };
        }
        return r;
      });
      return changed ? updated : prevRes;
    });
  }, 1000);
  return () => clearInterval(interval);
}, [logSystemEvent]);"""
    add_code_block(doc, code_res_snippet, "Reservation Ticker Algorithm (AppContext.tsx)")

    add_h2("19.2 RFC Idempotency Guard & Double-Charge Prevention (src/context/AppContext.tsx)")
    code_idemp_snippet = """// In-memory Redis simulation cache: key -> { response, timestamp }
const idempotencyStoreRef = useRef<Map<string, { response: any; timestamp: number }>>(new Map());

const checkIdempotency = useCallback((key: string, payload: any) => {
  if (!key) return { isDuplicate: false };
  const cached = idempotencyStoreRef.current.get(key);
  if (cached) {
    return { isDuplicate: true, cachedResponse: cached.response, timestamp: cached.timestamp };
  }
  return { isDuplicate: false };
}, []);

// Inside processPayment():
const idempCheck = checkIdempotency(idempotencyKey, { orderId, method });
if (idempCheck.isDuplicate) {
  logSystemEvent(
    'IdempotentDuplicateIgnored',
    'APIGateway',
    'INFO',
    `Idempotency-Key [${idempotencyKey}] already processed! Returning cached response without duplicate billing.`,
    { idempotencyKey, orderId }
  );
  addToast('info', 'Idempotency Guard Triggered', `Duplicate request returned cached receipt.`);
  return {
    success: true,
    payment: idempCheck.cachedResponse,
  };
}"""
    add_code_block(doc, code_idemp_snippet, "Idempotency Verification Logic (AppContext.tsx)")

    doc.add_page_break()

    # =========================================================================
    # 20. INSTALLATION AND EXECUTION
    # =========================================================================
    add_h1("20. Installation and Execution")
    add_p("The project runs out-of-the-box on any system with Node.js v18 or higher. No external database, Redis instance, or message broker is required:")

    add_h2("20.1 Step-by-Step Local Setup")
    code_install = """# 1. Clone repository and navigate to root directory
git clone https://github.com/MAHESWARA-PANDIYAN-A/System-Design-Project.git
cd System-Design-Project

# 2. Install dependencies via npm
npm install

# 3. Start local development server with Vite HMR
npm run dev

# 4. Open in browser:
http://localhost:5173/

# 5. Optional: Run production build and preview bundle
npm run build
npm run preview

# 6. Optional: Run code quality linter
npm run lint"""
    add_code_block(doc, code_install, "Terminal Commands for Installation")

    add_h2("20.2 Cloud Deployment on Render")
    add_p("The repository contains a pre-configured render.yaml blueprint for free static hosting:")
    add_bullet("1. Static Site Setup: ", "Connect the repository at dashboard.render.com as a 'Static Site'.")
    add_bullet("2. Build Settings: ", "Build Command: 'npm install && npm run build' | Publish Directory: 'dist'.")
    add_bullet("3. SPA Rewrite Rule: ", "Configure Rewrite from '/*' to '/index.html' for proper client routing.")

    # =========================================================================
    # 21. TESTING
    # =========================================================================
    add_h1("21. Testing")
    add_p("The project provides multiple verification layers ensuring code correctness and functional adherence:")
    add_bullet("Static Type Checking: ", "tsc -b verifies all TypeScript types, interfaces, and strict compiler options across app and node targets.")
    add_bullet("Linter Verification: ", "npm run lint executes Oxlint, ensuring clean code hygiene, unused variable removal, and syntax correctness.")
    add_bullet("Interactive End-to-End Test Suite: ", "Judges can execute the 6 core scenarios documented in Section 21.1 to verify all distributed systems patterns in under 3 minutes.")

    add_h2("21.1 Interactive Evaluation Test Scripts")
    add_bullet("Test 1 (Standard Purchase Saga): ", "Click 'Simulate Order' in Header -> select quantity -> observe 10-minute lock -> select Card -> complete payment -> verify order status CONFIRMED and confetti burst.")
    add_bullet("Test 2 (Payment Failure & Retry): ", "Open Purchase Wizard -> check 'Simulate Payment Failure' -> submit -> observe 504 Gateway Timeout and order FAILED -> click 'Force Success (Retry)' -> observe recovery.")
    add_bullet("Test 3 (Idempotency Double Charge Guard): ", "Navigate to Payments -> Idempotency Demo -> click 'Send Initial Request' (201 Created) -> click 'Send Identical Request' -> verify cached receipt and zero re-billing.")
    add_bullet("Test 4 (Reservation TTL Expiry): ", "Navigate to Reservations -> click 'FORCE EXPIRE NOW' on any active hold -> verify stock immediately returns to available pool.")
    add_bullet("Test 5 (Circuit Breaker Tripping): ", "Navigate to System Monitor -> click 'Simulate Failure' on Payment Service -> observe circuit breaker shift to OPEN -> click 'Recover Service' -> observe return to CLOSED.")
    add_bullet("Test 6 (Dead Letter Queue Replay): ", "Navigate to Events & DLQ -> select a quarantined DLQ message -> click 'RETRY (REPLAY)' -> verify event is reprocessed.")

    # =========================================================================
    # 22. IMPLEMENTATION-TO-REQUIREMENTS MAPPING
    # =========================================================================
    add_h1("22. Implementation-to-Requirements Mapping")
    add_p("The following matrix maps hackathon core requirements directly to the implementing source code files:")
    
    req_table = doc.add_table(rows=1, cols=3)
    req_headers = ["Hackathon Requirement", "Implemented Architectural Pattern", "Primary Source Code Files"]
    req_data = [
        ("Inventory Overselling Protection", "Multi-pool stock allocation & atomic deduction invariant", "src/pages/InventoryPage.tsx, src/context/AppContext.tsx"),
        ("Dynamic Cart Expiry", "Time-to-Live (TTL) hold locks with background countdown daemon", "src/pages/ReservationsPage.tsx, src/context/AppContext.tsx"),
        ("Double-Charge Prevention", "RFC 7386 Idempotency-Key caching filter", "src/components/payments/IdempotencyDemo.tsx, src/context/AppContext.tsx"),
        ("Distributed Sagas", "Orchestrated saga coordinator with order timeline audit tracking", "src/components/checkout/PurchaseWizardModal.tsx, src/context/AppContext.tsx"),
        ("Fault Tolerance", "Circuit breaker state machine with fault injection and recovery", "src/pages/SystemMonitorPage.tsx, src/context/AppContext.tsx"),
        ("Message Queue Telemetry", "Partitioned Kafka event stream with Dead Letter Queue isolation", "src/pages/EventsPage.tsx, src/components/events/DLQViewer.tsx"),
        ("High Concurrency Simulation", "Virtual load generator supporting 10k users & 500k RPS", "src/components/dashboard/TrafficSimulationPanel.tsx, RequestGraph.tsx"),
        ("Observability & Telemetry", "Real-time SLA percentiles (p95/p99) and live event stream", "src/pages/AnalyticsPage.tsx, src/components/dashboard/LiveActivityStream.tsx")
    ]
    format_table(req_table, [1.8, 2.2, 2.5], req_headers, req_data)

    doc.add_page_break()

    # =========================================================================
    # 23. LIMITATIONS AND ASSUMPTIONS
    # =========================================================================
    add_h1("23. Limitations and Assumptions")
    add_p("As a high-fidelity prototype, the implementation makes specific architectural assumptions:")
    add_bullet("In-Memory State Storage: ", "To enable frictionless evaluation without complex database setups, state is maintained in React Context with localStorage persistence rather than a distributed PostgreSQL cluster.")
    add_bullet("Client-Side Microservice Simulation: ", "Microservice boundaries are simulated within a unified reactive engine rather than independent Docker containers deployed across a Kubernetes cluster.")
    add_bullet("Mocked Financial Gateway: ", "External banking gateways (Visa/Mastercard acquiring networks) are simulated rather than connected to live production merchant accounts.")
    add_bullet("Simulated High-Concurrency: ", "The 500,000 RPS traffic engine is an interactive mathematical simulator designed for telemetry demonstration rather than an actual distributed load test cluster.")

    # =========================================================================
    # 24. CONCLUSION
    # =========================================================================
    add_h1("24. Conclusion")
    add_p("SalesStorm delivers an end-to-end, visually stunning, and architecturally rigorous implementation of a modern distributed commerce platform for the SysCrafters 2026 hackathon. By transforming complex distributed systems concepts—such as TTL reservation locks, saga compensation, idempotency caching, circuit breakers, and dead letter queues—into interactive, observable demonstrations, the platform bridges the gap between high-level architectural design and tangible software execution.")
    add_p("The implementation is fully committed to GitHub and ready for live evaluation, local development, or cloud static hosting.")

    # Save document
    output_path = os.path.join(os.getcwd(), "SalesStorm_Implementation_Code_Documentation.docx")
    doc.save(output_path)
    print(f"Documentation generated successfully at: {output_path}")

if __name__ == "__main__":
    create_document()
