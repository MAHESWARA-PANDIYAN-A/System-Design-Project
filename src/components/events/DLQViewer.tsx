import React, { useState } from 'react';
import { AlertOctagon, RotateCcw, Eye, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DLQMessage } from '../../types';
import { Modal } from '../common/Modal';

export const DLQViewer: React.FC = () => {
  const { dlqMessages, replayDLQMessage, discardDLQMessage } = useApp();
  const [inspectMessage, setInspectMessage] = useState<DLQMessage | null>(null);

  return (
    <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-rose-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Dead Letter Queue (DLQ) Management
            </h3>
            <p className="text-xs text-slate-500">
              Isolates poisoned or unprocessable events for inspection, manual retry, and remediation
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20">
          {dlqMessages.filter((m) => m.status === 'PENDING').length} ACTIVE FAILURES
        </span>
      </div>

      {/* Messages List */}
      <div className="space-y-2.5">
        {dlqMessages.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 font-mono">
            ✓ Dead Letter Queue is clean. Zero failed message poison pills.
          </div>
        ) : (
          dlqMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                msg.status === 'RESOLVED'
                  ? 'bg-emerald-500/5 border-emerald-500/20 opacity-60'
                  : msg.status === 'DISCARDED'
                  ? 'bg-slate-100 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 opacity-50'
                  : 'bg-rose-500/5 border-rose-500/20'
              }`}
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{msg.id}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {msg.source}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-rose-500">
                    {msg.eventType}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    (Retries: {msg.retryCount})
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] truncate">
                  {msg.errorReason}
                </p>
              </div>

              {/* Action Buttons: RETRY, INSPECT, DISCARD */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setInspectMessage(msg)}
                  className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px] flex items-center gap-1"
                >
                  <Eye className="w-3 h-3 text-indigo-400" />
                  <span>INSPECT</span>
                </button>

                {msg.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => replayDLQMessage(msg.id)}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] flex items-center gap-1 shadow-sm"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>RETRY</span>
                    </button>

                    <button
                      onClick={() => discardDLQMessage(msg.id)}
                      className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 font-semibold text-[11px] flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>DISCARD</span>
                    </button>
                  </>
                )}

                {msg.status === 'RESOLVED' && (
                  <span className="text-[10px] font-mono text-emerald-500 font-bold">REPLAYED ✓</span>
                )}
                {msg.status === 'DISCARDED' && (
                  <span className="text-[10px] font-mono text-slate-400">DISCARDED</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Inspect Modal */}
      {inspectMessage && (
        <Modal
          isOpen={true}
          onClose={() => setInspectMessage(null)}
          title={`DLQ Message Inspector: ${inspectMessage.id}`}
          subtitle={`Captured from ${inspectMessage.source} due to ${inspectMessage.eventType}`}
        >
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <span className="font-bold block mb-1">Failure Reason:</span>
              <p className="font-sans text-xs">{inspectMessage.errorReason}</p>
            </div>

            <div>
              <span className="text-slate-400 block mb-1 text-[11px]">Enqueued Payload:</span>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 overflow-x-auto text-[11px]">
                <pre>{JSON.stringify(inspectMessage.payload, null, 2)}</pre>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 text-[11px] text-slate-400">
              <span>Timestamp: {new Date(inspectMessage.enqueuedAt).toLocaleString()}</span>
              <span>Attempt count: {inspectMessage.retryCount}</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  replayDLQMessage(inspectMessage.id);
                  setInspectMessage(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs"
              >
                Re-inject to Live Topic
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
