import React, { useState } from 'react';
import { 
  History, Search, Filter, Download, Trash2, 
  CheckCircle2, Clock, ShieldCheck, Tag, RefreshCw 
} from 'lucide-react';
import { ActivityLogItem } from '../../../types';
import { StorageService } from '../../../lib/storage';

interface ActivityLogSectionProps {
  onNotify: (msg: string) => void;
}

export const ActivityLogSection: React.FC<ActivityLogSectionProps> = ({ onNotify }) => {
  const [logs, setLogs] = useState<ActivityLogItem[]>(() => StorageService.getActivityLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const refreshLogs = () => {
    setLogs(StorageService.getActivityLogs());
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' ? true : log.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleExportLogs = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gulpash_activity_log_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify('Activity log exported to JSON.');
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'order':
        return 'bg-blue-100 text-blue-800';
      case 'product':
        return 'bg-purple-100 text-purple-800';
      case 'shipping':
        return 'bg-emerald-100 text-emerald-800';
      case 'cms':
        return 'bg-amber-100 text-amber-800';
      case 'collection':
        return 'bg-indigo-100 text-indigo-800';
      case 'settings':
        return 'bg-stone-200 text-stone-800';
      default:
        return 'bg-stone-100 text-stone-600';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. HEADER */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest bg-stone-100 text-stone-800 font-mono font-bold px-2 py-0.5 rounded">
              SECURITY AUDIT TRAIL
            </span>
            <span className="text-xs text-stone-400 font-mono">
              Immutable Admin Activity
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
            System & Merchant Activity Log
          </h2>
          <p className="text-xs text-stone-500">
            Real-time audit log tracking orders verified, products edited, shipping rates updated, and storefront media changes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refreshLogs}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md border border-stone-200 transition-colors"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleExportLogs}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Log</span>
          </button>
        </div>
      </div>

      {/* 2. FILTERS */}
      <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search activity by action, details or admin name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-stone-900"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {['all', 'order', 'product', 'shipping', 'cms', 'collection', 'settings', 'system'].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md font-medium text-xs whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* 3. LOGS TABLE */}
      <div className="bg-white border border-stone-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Admin / Actor</th>
                <th className="py-3.5 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-400">
                    No activity records found matching filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const dateStr = new Date(log.timestamp).toLocaleString('en-PK', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  });

                  return (
                    <tr key={log.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>{dateStr}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${getCategoryBadgeClass(log.category)}`}>
                          {log.category.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-stone-900 whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 font-medium whitespace-nowrap">
                        {log.actor}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">
                        {log.details}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
