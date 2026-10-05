import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DemoBanner } from './components/layout/DemoBanner';
import { ToastContainer } from './components/layout/ToastContainer';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { InventoryPage } from './pages/InventoryPage';
import { OrdersPage } from './pages/OrdersPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { EventsPage } from './pages/EventsPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { SystemMonitorPage } from './pages/SystemMonitorPage';
import { StateMachinePage } from './pages/StateMachinePage';
import { ApiConsolePage } from './pages/ApiConsolePage';
import { AuditLogPage } from './pages/AuditLogPage';
import { SecurityPage } from './pages/SecurityPage';
import { AnalyticsPage } from './pages/AnalyticsPage';

// Overlays & Drawers
import { ProductDetailDrawer } from './components/products/ProductDetailDrawer';
import { OrderDetailDrawer } from './components/orders/OrderDetailDrawer';
import { PurchaseWizardModal } from './components/checkout/PurchaseWizardModal';
import { EndToEndDemoModal } from './components/demo/EndToEndDemoModal';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'products':
        return <ProductsPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'orders':
        return <OrdersPage />;
      case 'payments':
        return <PaymentsPage />;
      case 'reservations':
        return <ReservationsPage />;
      case 'events':
        return <EventsPage />;
      case 'architecture':
        return <ArchitecturePage />;
      case 'monitoring':
        return <SystemMonitorPage />;
      case 'statemachine':
        return <StateMachinePage />;
      case 'apiconsole':
        return <ApiConsolePage />;
      case 'auditlogs':
        return <AuditLogPage />;
      case 'security':
        return <SecurityPage />;
      case 'analytics':
        return <AnalyticsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white antialiased transition-colors">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Interactive Presenter Demo Mode Banner */}
        <DemoBanner />

        {/* Global Header */}
        <Header />

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Modals, Drawers & Toast Stack */}
      <ToastContainer />
      <ProductDetailDrawer />
      <OrderDetailDrawer />
      <PurchaseWizardModal />
      <EndToEndDemoModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
