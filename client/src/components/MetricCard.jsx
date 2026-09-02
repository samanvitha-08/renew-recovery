import React from 'react';
import { 
  AlertTriangle, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  TrendingUp,
  Percent
} from 'lucide-react';

export default function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  variant = 'default',
  badge,
  progress
}) {
  const getStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          border: 'border-rose-500/20 bg-rose-500/[0.03]',
          iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
          text: 'text-rose-400',
          glow: 'from-rose-500/10 to-transparent'
        };
      case 'success':
        return {
          border: 'border-emerald-500/30 bg-emerald-500/[0.05]',
          iconBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
          text: 'text-emerald-400',
          glow: 'from-emerald-500/15 to-transparent'
        };
      case 'warning':
        return {
          border: 'border-amber-500/20 bg-amber-500/[0.03]',
          iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
          text: 'text-amber-400',
          glow: 'from-amber-500/10 to-transparent'
        };
      case 'brand':
        return {
          border: 'border-brand-500/30 bg-brand-500/[0.05]',
          iconBg: 'bg-brand-500/15 text-brand-400 border border-brand-500/30',
          text: 'text-brand-300',
          glow: 'from-brand-500/15 to-transparent'
        };
      default:
        return {
          border: 'border-slate-800 bg-slate-900/50',
          iconBg: 'bg-slate-800 text-slate-300 border border-slate-700',
          text: 'text-white',
          glow: 'from-slate-700/10 to-transparent'
        };
    }
  };

  const style = getStyles();

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${style.border} p-5 transition-all duration-300 hover:border-slate-700`}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${style.glow} rounded-full blur-2xl pointer-events-none`} />
      
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${style.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
          {value}
        </div>
        {badge && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium font-mono ${
            variant === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
            variant === 'danger' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
            'bg-slate-800 text-slate-300 border border-slate-700'
          }`}>
            {badge}
          </span>
        )}
      </div>

      {progress !== undefined && (
        <div className="mt-3">
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-700 rounded-full ${
                variant === 'success' ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-brand-500'
              }`}
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
        </div>
      )}

      {subtitle && (
        <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
