import React, { useState } from 'react';
import { Shield, Lock, Key, CheckCircle2, AlertTriangle, RefreshCw, Zap, Server, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SecurityPage: React.FC = () => {
  const { addToast } = useApp();
  const [rateCurrent, setRateCurrent] = useState<number>(2340);
  const rateLimitMax = 5000;

  const handleSimulateBurst = () => {
    setRateCurrent((c) => {
      const next = Math.min(rateLimitMax, c + 850);
      if (next >= rateLimitMax) {
        addToast('error', 'Rate Limit Exceeded', 'HTTP 429 Too Many Requests: Client quota throttled for 60s');
      } else {
        addToast('info', 'Rate Limiter Ingress', `Burst added. Current usage: ${next.toLocaleString()} / 5,000`);
      }
      return next;
    });
  };

  const handleResetQuota = () => {
    setRateCurrent(2340);
    addToast('success', 'Rate Quota Reset', 'Token bucket counter reset to baseline.');
  };

  const securityPillars = [
    {
      title: 'Authentication (OAuth2 & JWT)',
      desc: 'RS256 signed bearer tokens with 15-minute expiration and rotating public JWKS key set.',
      status: 'Enabled',
      icon: Key,
    },
    {
      title: 'Role-Based Access Control (RBAC)',
      desc: 'Granular permissions: presenter, shopper, inventory_admin, devops_lead, and service_account.',
      status: 'Enabled',
      icon: Shield,
    },
    {
      title: 'Transport Encryption (mTLS & TLS 1.3)',
      desc: 'Strict zero-trust mutual TLS between Envoy sidecars; automatic certificate rotation via SPIFFE/SPIRE.',
      status: 'Enabled',
      icon: Lock,
    },
    {
      title: 'Payload Validation & Schema Sanitization',
      desc: 'Zod and JSON Schema validation on all edge endpoints before dispatching to internal RPC.',
      status: 'Enabled',
      icon: CheckCircle2,
    },
    {
      title: 'Secrets Management (HashiCorp Vault / KMS)',
      desc: 'Payment processor keys, database connection strings, and webhook HMAC secrets encrypted at rest.',
      status: 'Enabled',
      icon: Server,
    },
    {
      title: 'Audit Logging & Forensic Immutability',
      desc: 'WORM (Write Once, Read Many) tamper-evident hash chaining for all state transitions.',
      status: 'Enabled',
      icon: Globe,
    },
  ];

  const ratePercent = Math.round((rateCurrent / rateLimitMax) * 100);

  return (
    <div className="space-y-6 pb-12">
      {/* Rate Limiting Active Controller (Prompt Section 29) */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Distributed Token-Bucket Rate Limiter
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Protects downstream microservices from DDoS, inventory hoarding bots, and checkout scraping
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateBurst}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
            >
              Simulate Client Burst (+850 Req)
            </button>
            <button
              onClick={handleResetQuota}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-lg transition-colors"
            >
              Reset Meter
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500 uppercase">Requests In Window:</span>
            <span className="font-bold text-base text-slate-900 dark:text-white">
              {rateCurrent.toLocaleString()} / {rateLimitMax.toLocaleString()}{' '}
              <span className="text-xs text-indigo-400 font-normal">({ratePercent}%)</span>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                ratePercent > 90
                  ? 'bg-rose-500'
                  : ratePercent > 70
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${ratePercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>Algorithm: Redis Leaky Bucket (Sliding Window)</span>
            <span>IP Ref: 10.240.4.12 · Tier: Enterprise</span>
          </div>
        </div>
      </div>

      {/* Security Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {securityPillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    ✓ {p.status}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{p.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-400">
                AUDITED COMPLIANT
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
