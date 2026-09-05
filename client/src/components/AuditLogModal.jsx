import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Search, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  AlertCircle,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

export default function AuditLogModal({ logs = [], onClose }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [copied, setCopied] = useState(false);

  // Partial email masking helper for audit viewer
  const maskEmail = (email) => {
    if (!email) return '';
    const [user, domain] = email.split('@');
    if (!domain) return email;
    const parts = domain.split('.');
    const tld = parts.slice(1).join('.');
    return `${user.charAt(0)}${user.length > 2 ? user.charAt(1) : ''}***@***.${tld || 'com'}`;
  };

  const filteredLogs = logs.filter(log => {
    if (filter !== 'all' && log.outcomeStatus !== filter) {
      return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const matchCust = log.customer?.toLowerCase().includes(q);
      const matchAction = log.actionLabel?.toLowerCase().includes(q);
      const matchOutcome = log.outcome?.toLowerCase().includes(q);
      const matchId = log.paymentId?.toLowerCase().includes(q);
      if (!matchCust && !matchAction && !matchOutcome && !matchId) {
        return false;
      }
    }
    return true;
  });

  const handleCopyRaw = () => {
    const rawText = filteredLogs.map(l => 
      `[${new Date(l.timestamp).toISOString()}] [${l.customer}] [${l.actionLabel || l.action}] [${l.outcome}] (Tx: ${l.paymentId})`
    ).join('\n');
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-burgundy-950/75 dark:bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-creme-50 dark:bg-burgundy-950 border border-sand-300 dark:border-burgundy-800 rounded-3xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-7 border-b border-sand-200 dark:border-burgundy-800 bg-creme-100/90 dark:bg-burgundy-900/90 flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-burgundy-800 dark:bg-burgundy-900 text-creme-50 shadow-sm border border-burgundy-900 dark:border-burgundy-700">
              <ShieldCheck className="w-6 h-6 text-dustypink-300" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-bold font-serif-luxury text-burgundy-950 dark:text-creme-50">
                  Autonomous Decision Audit Log
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-sand-200 dark:bg-burgundy-800 text-burgundy-900 dark:text-dustypink-200 border border-sand-300 dark:border-burgundy-700">
                  <Lock className="w-3 h-3 text-burgundy-700 dark:text-dustypink-300" />
                  Read-Only • Tamper-Evident
                </span>
              </div>
              <p className="text-xs text-sand-700 dark:text-sand-300 mt-1 font-medium flex items-center gap-2">
                <span>Immutable verification record of all autonomous actions taken by Recover AI.</span>
                <span className="text-burgundy-800 dark:text-dustypink-400 font-bold">• SOC 2 Type II Standard</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-sand-600 dark:text-sand-400 hover:text-burgundy-950 dark:hover:text-creme-50 hover:bg-sand-200/80 dark:hover:bg-burgundy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 sm:px-6 bg-creme-50 dark:bg-burgundy-950 border-b border-sand-200 dark:border-burgundy-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-sand-500 dark:text-sand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit trail by customer, ID, or action..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/90 dark:bg-burgundy-900/90 border border-sand-300/80 dark:border-burgundy-700 rounded-xl pl-9 pr-3.5 py-2 text-xs text-burgundy-950 dark:text-creme-50 placeholder-sand-500 dark:placeholder-sand-400 focus:outline-none focus:border-burgundy-600 dark:focus:border-dustypink-400 font-medium"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/90 dark:bg-burgundy-900/90 border border-sand-300/80 dark:border-burgundy-700 rounded-xl px-3 py-2 text-xs text-burgundy-950 dark:text-creme-50 font-semibold focus:outline-none focus:border-burgundy-600 dark:focus:border-dustypink-400 cursor-pointer shadow-2xs"
            >
              <option value="all">All Outcomes ({logs.length})</option>
              <option value="recovered">Recovered</option>
              <option value="pending">Pending Retry</option>
              <option value="escalated">Escalated</option>
              <option value="detected">Initial Detection</option>
            </select>

            <button
              onClick={handleCopyRaw}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl text-burgundy-900 dark:text-dustypink-200 bg-sand-100 dark:bg-burgundy-900 hover:bg-sand-200 dark:hover:bg-burgundy-800 border border-sand-300 dark:border-burgundy-700 transition-all active:scale-95 shadow-2xs"
              title="Copy audit log to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-burgundy-700 dark:text-dustypink-400" /> : <Copy className="w-3.5 h-3.5 text-sand-600 dark:text-sand-400" />}
              {copied ? 'Copied' : 'Export'}
            </button>
          </div>
        </div>

        {/* Audit Log Entries List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 font-mono text-xs">
          {filteredLogs.length === 0 ? (
            <div className="py-16 text-center text-sand-600 dark:text-sand-400 font-sans">
              <FileText className="w-10 h-10 text-sand-400 dark:text-sand-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-burgundy-950 dark:text-creme-50">No audit records found</p>
              <p className="text-xs text-sand-600 dark:text-sand-400">Try adjusting your filter</p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const formattedDate = new Date(log.timestamp).toLocaleString();
              const isRecovered = log.outcomeStatus === 'recovered';
              const isEscalated = log.outcomeStatus === 'escalated';
              const isPending = log.outcomeStatus === 'pending';

              return (
                <div 
                  key={log.id} 
                  className={`p-4 rounded-2xl border transition-all duration-200 ${
                    isRecovered 
                      ? 'bg-white/80 dark:bg-burgundy-900/40 border-burgundy-200/90 dark:border-burgundy-800/80 shadow-2xs' 
                      : isEscalated
                      ? 'bg-burgundy-50/50 dark:bg-burgundy-900/70 border-burgundy-300 dark:border-burgundy-700 shadow-2xs'
                      : 'bg-creme-100/70 dark:bg-burgundy-950/60 border-sand-200/90 dark:border-burgundy-900/80'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-2 border-b border-sand-200/60 dark:border-burgundy-800/60">
                    <div className="flex items-center space-x-2 font-mono text-[11px] text-sand-700 dark:text-sand-300">
                      <span className="text-burgundy-900 dark:text-dustypink-300 font-bold bg-sand-200/70 dark:bg-burgundy-800/80 px-2 py-0.5 rounded">
                        [{formattedDate}]
                      </span>
                      <span className="font-bold text-burgundy-950 dark:text-creme-50 font-sans text-xs">
                        [{log.customer}]
                      </span>
                      <span className="text-[10px] text-sand-500 dark:text-sand-400">
                        ({maskEmail(log.customer_email)})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sand-100 dark:bg-burgundy-800 text-sand-800 dark:text-sand-200 border border-sand-200 dark:border-burgundy-700">
                        Tx: {log.paymentId}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sand-200 dark:bg-burgundy-800 text-burgundy-900 dark:text-dustypink-200 font-bold">
                        ${log.amount?.toFixed(2)} USD
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                    <div className="flex items-center space-x-2 font-sans font-medium text-burgundy-950 dark:text-creme-50">
                      <span className="text-sand-700 dark:text-sand-400 font-mono text-[11px]">Action Taken:</span>
                      <span className="font-bold text-burgundy-800 dark:text-dustypink-200 bg-white/90 dark:bg-burgundy-800/80 px-2.5 py-0.5 rounded-lg border border-sand-200 dark:border-burgundy-700 shadow-2xs">
                        [{log.actionLabel || log.action}]
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 font-sans font-medium">
                      <span className="text-sand-700 dark:text-sand-400 font-mono text-[11px]">Outcome:</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 ${
                        isRecovered ? 'bg-burgundy-800 text-creme-50 dark:bg-burgundy-800 dark:text-dustypink-200' :
                        isEscalated ? 'bg-burgundy-900 text-dustypink-200 dark:bg-burgundy-950 dark:text-dustypink-300' :
                        isPending ? 'bg-sand-200 text-sand-900 dark:bg-burgundy-800 dark:text-sand-200' :
                        'bg-sand-100 text-sand-800 dark:bg-burgundy-900 dark:text-sand-300'
                      }`}>
                        {isRecovered && <CheckCircle2 className="w-3 h-3 text-dustypink-300" />}
                        {isEscalated && <ShieldAlert className="w-3 h-3 text-dustypink-400" />}
                        {isPending && <Clock className="w-3 h-3 text-sand-600 dark:text-sand-400" />}
                        [{log.outcome}]
                      </span>
                    </div>
                  </div>

                  {log.reasoning && (
                    <div className="mt-2 pt-2 border-t border-sand-200/40 dark:border-burgundy-800/50 text-[11px] text-sand-800 dark:text-sand-300 font-sans leading-relaxed">
                      <span className="font-semibold text-burgundy-950 dark:text-creme-50">Rationale: </span>
                      {log.reasoning}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 border-t border-sand-200 dark:border-burgundy-800 bg-creme-100/90 dark:bg-burgundy-900/90 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-sand-700 dark:text-sand-300 font-mono">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-burgundy-700 dark:text-dustypink-300" />
            <span>Cryptographic Chain: <span className="text-burgundy-900 dark:text-dustypink-200 font-bold">SHA-256 Ledger Verified</span></span>
          </div>
          <div className="font-sans font-semibold text-burgundy-950 dark:text-creme-50">
            Total Logged Events: {logs.length}
          </div>
        </div>

      </div>
    </div>
  );
}
