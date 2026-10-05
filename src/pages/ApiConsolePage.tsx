import React, { useState } from 'react';
import { Terminal, Send, Play, CheckCircle2, AlertTriangle, Code, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  defaultPayload?: any;
}

const ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'ep-1',
    method: 'POST',
    path: '/api/v1/reservations',
    title: 'Reserve Inventory with TTL Lock',
    defaultPayload: {
      productId: 'prod-1',
      sku: 'WH-1007',
      quantity: 2,
      ttlSeconds: 600,
    },
  },
  {
    id: 'ep-2',
    method: 'POST',
    path: '/api/v1/orders',
    title: 'Create Order Saga Intent',
    defaultPayload: {
      customerName: 'Aarav Sharma',
      customerEmail: 'aarav.sharma@example.com',
      reservationId: 'RES-78321',
      items: [{ sku: 'WH-1007', quantity: 2, price: 8999 }],
    },
  },
  {
    id: 'ep-3',
    method: 'POST',
    path: '/api/v1/payments',
    title: 'Process Idempotent Payment',
    defaultPayload: {
      orderId: 'ORD-10201',
      amount: 17998,
      method: 'credit_card',
      idempotencyKey: 'PAY-IDEMP-ORD-10201-V1',
    },
  },
  {
    id: 'ep-4',
    method: 'GET',
    path: '/api/v1/inventory/WH-1007',
    title: 'Get Real-Time SKU Stock Level',
  },
  {
    id: 'ep-5',
    method: 'GET',
    path: '/api/v1/orders/ORD-10201',
    title: 'Get Order Transaction Timeline',
  },
  {
    id: 'ep-6',
    method: 'POST',
    path: '/api/v1/payments/PAY-78235/retry',
    title: 'Retry Failed Payment with Backoff',
    defaultPayload: {
      forceSuccess: true,
      strategy: 'EXPONENTIAL_BACKOFF',
    },
  },
];

export const ApiConsolePage: React.FC = () => {
  const { products, orders, reserveInventory, processPayment } = useApp();
  const [selectedEp, setSelectedEp] = useState<ApiEndpoint>(ENDPOINTS[0]);
  const [payloadText, setPayloadText] = useState<string>(
    JSON.stringify(ENDPOINTS[0].defaultPayload || {}, null, 2)
  );
  const [response, setResponse] = useState<any>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleSelectEndpoint = (ep: ApiEndpoint) => {
    setSelectedEp(ep);
    setPayloadText(JSON.stringify(ep.defaultPayload || {}, null, 2));
    setResponse(null);
    setStatusCode(null);
    setLatencyMs(null);
  };

  const handleSendRequest = async () => {
    setIsSending(true);
    const start = Date.now();
    await new Promise((r) => setTimeout(r, 280)); // Network simulation

    let resBody: any = {};
    let code = 200;

    try {
      if (selectedEp.path === '/api/v1/reservations') {
        const parsed = JSON.parse(payloadText);
        const prod = products.find((p) => p.sku === parsed.sku) || products[0];
        const res = await reserveInventory(prod.id, parsed.quantity || 1, parsed.ttlSeconds || 600);
        if (res.success) {
          code = 201;
          resBody = {
            success: true,
            reservation: res.reservation,
            lockExpiresAt: new Date(res.reservation!.expiresAt).toISOString(),
          };
        } else {
          code = 409;
          resBody = { success: false, error: res.error };
        }
      } else if (selectedEp.path === '/api/v1/inventory/WH-1007') {
        const prod = products.find((p) => p.sku === 'WH-1007') || products[0];
        resBody = {
          sku: prod.sku,
          name: prod.name,
          totalStock: prod.totalStock,
          availableStock: prod.availableStock,
          reservedStock: prod.reservedStock,
          soldStock: prod.soldStock,
          status: prod.status,
          clusterShard: 'redis-us-east-1-shard-3',
        };
      } else if (selectedEp.path === '/api/v1/orders/ORD-10201') {
        const ord = orders[0];
        resBody = {
          id: ord.id,
          customer: ord.customerName,
          totalAmount: ord.totalAmount,
          status: ord.status,
          timeline: ord.timeline,
        };
      } else if (selectedEp.path === '/api/v1/payments') {
        const parsed = JSON.parse(payloadText);
        const targetOrder = orders[0];
        const res = await processPayment(targetOrder.id, parsed.method || 'credit_card', parsed.idempotencyKey, {
          simulateFailure: false,
        });
        code = 200;
        resBody = {
          success: true,
          payment: res.payment,
          idempotentCacheStatus: 'COMMITTED',
        };
      } else {
        code = 200;
        resBody = {
          status: 'SUCCESS',
          message: `Endpoint ${selectedEp.path} executed successfully in mock runtime`,
          timestamp: new Date().toISOString(),
        };
      }
    } catch (e: any) {
      code = 400;
      resBody = { error: 'Invalid JSON payload format', details: e.message };
    }

    setStatusCode(code);
    setResponse(resBody);
    setLatencyMs(Date.now() - start);
    setIsSending(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Interactive API Sandbox & Postman Explorer
            </h3>
            <p className="text-xs text-slate-500">
              Live REST API console executing actual inventory locks and payments against the system state
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoints List (1 col) */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm space-y-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-2">
            Available Endpoints
          </span>
          {ENDPOINTS.map((ep) => {
            const isSelected = selectedEp.id === ep.id;
            return (
              <div
                key={ep.id}
                onClick={() => handleSelectEndpoint(ep)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-500/10 border-indigo-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      ep.method === 'POST'
                        ? 'bg-emerald-500/20 text-emerald-500'
                        : 'bg-indigo-500/20 text-indigo-400'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {ep.path}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">{ep.title}</p>
              </div>
            );
          })}
        </div>

        {/* Request & Response Sandbox (2 cols) */}
        <div className="lg:col-span-2 p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Address Bar */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
              <span
                className={`text-xs font-mono font-bold px-2 py-1 rounded ${
                  selectedEp.method === 'POST'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {selectedEp.method}
              </span>
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white flex-1 truncate">
                {selectedEp.path}
              </span>
              <button
                onClick={handleSendRequest}
                disabled={isSending}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Sending...' : 'SEND REQUEST'}</span>
              </button>
            </div>

            {/* Request Payload Editor */}
            {selectedEp.method !== 'GET' && (
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block mb-1">
                  Request JSON Body:
                </span>
                <textarea
                  rows={6}
                  value={payloadText}
                  onChange={(e) => setPayloadText(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-slate-950 text-indigo-300 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            )}

            {/* Response Section */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono uppercase text-slate-400 font-bold mb-1">
                <span>Response Body:</span>
                {statusCode && (
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-bold ${
                        statusCode < 300 ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      HTTP {statusCode}
                    </span>
                    <span>Latency: {latencyMs}ms</span>
                  </div>
                )}
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 font-mono text-xs min-h-[160px] max-h-72 overflow-y-auto">
                {response ? (
                  <pre>{JSON.stringify(response, null, 2)}</pre>
                ) : (
                  <span className="text-slate-600 italic">
                    Click "SEND REQUEST" to dispatch API call to the mock runtime...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
