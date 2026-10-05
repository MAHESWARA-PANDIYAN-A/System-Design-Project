import React, { useState } from 'react';
import { FileText, Search, Download, Filter, ShieldCheck, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getStatusBadge } from '../components/common/Badge';

export const AuditLogPage: React.FC = () => {
  const { auditLogs, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEntity = entityFilter === 'ALL' || log.entity === entityFilter;
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;

    return matchesSearch && matchesEntity && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'User', 'Role', 'Action', 'Entity', 'Entity ID', 'Status', 'IP Address', 'Details'];
    const rows = filteredLogs.map((l) => [
      new Date(l.timestamp).toISOString(),
      l.user,
      l.role,
      l.action,
      l.entity,
      l.entityId,
      l.status,
      l.ipAddress,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `salesstorm_audit_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'Audit Exported', 'Audit trail exported to CSV successfully.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar with Search & Export */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative min-w-[260px] flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail by user, action, entity ID or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-xs focus:outline-none"
          >
            <option value="ALL">Entity: All</option>
            <option value="Order">Order</option>
            <option value="Inventory">Inventory</option>
            <option value="Reservation">Reservation</option>
            <option value="Payment">Payment</option>
            <option value="System">System</option>
            <option value="Security">Security</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            SOC2 / ISO 27001 Immutable Audit Log ({filteredLogs.length} records)
          </h4>
          <span className="text-[10px] font-mono text-slate-400">WORM COMPLIANT STORAGE</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono uppercase text-slate-500">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User & Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Entity Ref</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Detailed Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-900 dark:text-white">
                    <div className="font-semibold text-xs">{log.user}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{log.role}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400">
                    {log.action}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] border border-slate-200 dark:border-slate-700">
                      {log.entity}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                    {log.entityId}
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(log.status)}</td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">{log.ipAddress}</td>
                  <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-300 max-w-sm truncate text-[11px]">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
