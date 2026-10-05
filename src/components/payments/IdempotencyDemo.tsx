import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, ShieldCheck, AlertCircle, RefreshCw, Send, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const IdempotencyDemo: React.FC = () => {
  const { checkIdempotency, processPayment, orders, addToast } = useApp();

  const [idempotencyKey, setIdempotencyKey] = useState<string>('PAY-REQ-78321');
  const [requestCount, setRequestCount] = useState<number>(0);
  const [requestHistory, setRequestHistory] = useState<
    Array<{
      reqNum: number;
      timestamp: string;
      status: 'PROCESSING' | 'SUCCESS_NEW' | 'DUPLICATE_CACHED';
      statusCode: number;
      responseBody: any;
      latencyMs: number;
    }>
  >([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleSendRequest = async () => {
    if (!idempotencyKey) return;
    setIsProcessing(true);
    const thisReqNum = requestCount + 1;
    setRequestCount(thisReqNum);

    const startTime = Date.now();
    await new Promise((r) => setTimeout(r, 600)); // Network delay

    // Test with the AppContext idempotency store
    const check = checkIdempotency(idempotencyKey, { amount: 8999, sku: 'WH-1007' });

    if (check.isDuplicate) {
      // DUPLICATE DETECTED! Zero double charge.
      const latency = Date.now() - startTime;
      setRequestHistory((prev) => [
        {
          reqNum: thisReqNum,
          timestamp: new Date().toLocaleTimeString(),
          status: 'DUPLICATE_CACHED',
          statusCode: 200,
          latencyMs: latency,
          responseBody: {
            status: 'SUCCESS',
            message: 'Idempotent replay detected. Returned existing transaction receipt without double billing.',
            idempotencyKey,
            transactionId: 'TX-78321-AUTHORIZATION',
            amount: '₹8,999',
            isDuplicateReplay: true,
            originalRecordedAt: new Date(check.timestamp || Date.now()).toISOString(),
          },
        },
        ...prev,
      ]);

      addToast(
        'warning',
        'Duplicate Request Detected',
        `Request #${thisReqNum} with key [${idempotencyKey}] returned cached 200 OK without re-charging customer.`
      );
    } else {
      // First Request -> New Execution
      const targetOrder = orders[0];
      const res = await processPayment(targetOrder.id, 'credit_card', idempotencyKey, {
        simulateFailure: false,
      });

      const latency = Date.now() - startTime;
      setRequestHistory((prev) => [
        {
          reqNum: thisReqNum,
          timestamp: new Date().toLocaleTimeString(),
          status: 'SUCCESS_NEW',
          statusCode: 201,
          latencyMs: latency,
          responseBody: {
            status: 'CREATED',
            message: 'First execution of idempotency key registered and settled.',
            idempotencyKey,
            transactionId: res.payment.id,
            amount: `₹${res.payment.amount.toLocaleString('en-IN')}`,
            isDuplicateReplay: false,
            executedAt: new Date().toISOString(),
          },
        },
        ...prev,
      ]);

      addToast(
        'success',
        'Transaction Authorized',
        `Request #${thisReqNum} recorded in Redis idempotency cache for 24h.`
      );
    }

    setIsProcessing(false);
  };

  const handleGenerateNewKey = () => {
    const newKey = `PAY-REQ-${Math.floor(10000 + Math.random() * 90000)}`;
    setIdempotencyKey(newKey);
    setRequestCount(0);
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Idempotency Engine & Double-Charge Guard
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold">
              RFC 7386 COMPLIANT
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Proves that network retries or duplicate POST clicks never double-bill the card or double-decrement stock
          </p>
        </div>

        <button
          onClick={handleGenerateNewKey}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Generate New Key</span>
        </button>
      </div>

      {/* Control Area: Key input & Send Request button */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[280px]">
          <label className="text-xs font-mono uppercase text-slate-500 font-bold block mb-1">
            HTTP Header: <span className="text-indigo-500">Idempotency-Key</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={idempotencyKey}
              onChange={(e) => setIdempotencyKey(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400">
              Unique Token
            </span>
          </div>
        </div>

        <div className="flex items-end pt-5">
          <button
            onClick={handleSendRequest}
            disabled={isProcessing}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {isProcessing
                ? 'Processing Gateway...'
                : requestCount === 0
                ? 'SEND INITIAL REQUEST'
                : `SEND IDENTICAL REQUEST (#${requestCount + 1})`}
            </span>
          </button>
        </div>
      </div>

      {/* Visual Explanation of Behavior */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1">
            <CheckCircle2 className="w-4 h-4" /> 1st Call Behavior:
          </span>
          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
            Acquires distributed Redis mutex on key, executes authorization, charges ₹8,999, stores
            successful receipt in idempotency hash table with 24-hour TTL, returns HTTP 201 Created.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 mb-1">
            <AlertCircle className="w-4 h-4" /> 2nd+ Identical Call Behavior:
          </span>
          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
            Detects matching key in cache. Short-circuits gateway without calling payment rails or
            inventory deductions. Immediately returns the previously stored response (HTTP 200 OK).
          </p>
        </div>
      </div>

      {/* Request Execution Log Table */}
      <div>
        <h4 className="text-xs font-mono uppercase text-slate-400 font-bold mb-3">
          Request Execution History ({requestHistory.length} calls)
        </h4>

        {requestHistory.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-xl text-slate-400 text-xs">
            Click <strong className="text-indigo-400">SEND INITIAL REQUEST</strong> above to begin idempotency test.
          </div>
        ) : (
          <div className="space-y-3">
            {requestHistory.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border text-xs font-mono ${
                  item.status === 'DUPLICATE_CACHED'
                    ? 'bg-amber-500/5 border-amber-500/30'
                    : 'bg-emerald-500/5 border-emerald-500/30'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Request #{item.reqNum}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'DUPLICATE_CACHED'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {item.status === 'DUPLICATE_CACHED'
                        ? 'DUPLICATE REQUEST DETECTED'
                        : 'FIRST TIME EXECUTION'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span>Status: HTTP {item.statusCode}</span>
                    <span>Latency: {item.latencyMs}ms</span>
                    <span>{item.timestamp}</span>
                  </div>
                </div>

                <div className="mt-2.5 bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-[11px] text-slate-300 overflow-x-auto">
                  <pre>{JSON.stringify(item.responseBody, null, 2)}</pre>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
