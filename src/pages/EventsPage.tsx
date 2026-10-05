import React, { useState } from 'react';
import { Activity, Radio, Filter, Search, Eye, AlertOctagon, Terminal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MessageQueueVisualizer } from '../components/events/MessageQueueVisualizer';
import { DLQViewer } from '../components/events/DLQViewer';
import { getStatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { SystemEvent } from '../types';

export const EventsPage: React.FC = () => {
  const { events } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [inspectEvent, setInspectEvent] = useState<SystemEvent | null>(null);

  const eventTypes = ['ALL', ...Array.from(new Set(events.map((e) => e.eventType)))];

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || e.eventType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Live Message Queue & Partitioning Visualizer */}
      <MessageQueueVisualizer />

      {/* 2. Dead Letter Queue Section */}
      <DLQViewer />

      {/* 3. Event Bus Stream Table */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative min-w-[260px] flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search events by ID, topic, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-xs focus:outline-none"
        >
          {eventTypes.map((t) => (
            <option key={t} value={t}>
              Type: {t}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-500" />
            Immutable Event Log Stream ({filteredEvents.length} events)
          </h4>
          <span className="text-[10px] font-mono text-slate-400">RETENTION: 7 DAYS</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono uppercase text-slate-500">
              <tr>
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Source Service</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Message / Payload Summary</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {filteredEvents.slice(0, 50).map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-indigo-500">{evt.id}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {evt.eventType}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] border border-slate-200 dark:border-slate-700">
                      {evt.source}
                    </span>
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(evt.status)}</td>
                  <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-300 max-w-xs truncate">
                    {evt.message}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setInspectEvent(evt)}
                      className="p-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Event Modal */}
      {inspectEvent && (
        <Modal
          isOpen={true}
          onClose={() => setInspectEvent(null)}
          title={`System Event: ${inspectEvent.id}`}
          subtitle={`${inspectEvent.eventType} emitted by ${inspectEvent.source}`}
        >
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-1">Human Description:</span>
              <p className="font-sans text-xs text-slate-800 dark:text-slate-200 font-semibold">
                {inspectEvent.message}
              </p>
            </div>

            <div>
              <span className="text-slate-400 block mb-1 text-[11px]">Structured Payload (JSON):</span>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-indigo-300 overflow-x-auto text-[11px]">
                <pre>{JSON.stringify(inspectEvent.payload, null, 2)}</pre>
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400 pt-2">
              <span>Timestamp: {new Date(inspectEvent.timestamp).toISOString()}</span>
              <span>Status: {inspectEvent.status}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
