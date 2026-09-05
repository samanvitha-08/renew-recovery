import React from 'react';
import { 
  AlertTriangle, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  TrendingUp
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
          container: 'bg-gradient-to-br from-creme-50 via-dustypink-50/50 to-sand-100/60 dark:from-burgundy-900/70 dark:via-burgundy-950/90 dark:to-burgundy-900/70 border-dustypink-300/60 dark:border-burgundy-800/80 hover:border-dustypink-400 dark:hover:border-dustypink-500',
          iconBg: 'bg-dustypink-100 dark:bg-burgundy-800/90 text-burgundy-700 dark:text-dustypink-300 border border-dustypink-300 dark:border-burgundy-700',
          valText: 'text-burgundy-950 dark:text-creme-50',
          badge: 'bg-dustypink-100 dark:bg-burgundy-800/90 text-burgundy-800 dark:text-dustypink-200 border-dustypink-300 dark:border-burgundy-700',
          progressBg: 'bg-gradient-to-r from-dustypink-400 to-burgundy-600 dark:from-dustypink-500 dark:to-dustypink-300'
        };
      case 'success':
        return {
          container: 'bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-burgundy-950 dark:from-burgundy-800 dark:via-burgundy-900 dark:to-burgundy-950 border-burgundy-700/60 dark:border-burgundy-600/70 text-creme-50 shadow-soft-lg hover:shadow-glow-burgundy',
          iconBg: 'bg-burgundy-700/60 text-dustypink-200 border border-burgundy-500/40',
          valText: 'text-creme-50',
          badge: 'bg-dustypink-300/20 text-dustypink-200 border-dustypink-400/30',
          progressBg: 'bg-gradient-to-r from-dustypink-300 to-dustypink-100'
        };
      case 'brand':
        return {
          container: 'bg-gradient-to-br from-creme-50 via-sand-100/50 to-creme-200/50 dark:from-burgundy-900/70 dark:via-burgundy-950/80 dark:to-burgundy-900/60 border-sand-300/80 dark:border-burgundy-800/80 hover:border-sand-400 dark:hover:border-burgundy-700',
          iconBg: 'bg-sand-200 dark:bg-burgundy-800 text-burgundy-800 dark:text-dustypink-300 border border-sand-300 dark:border-burgundy-700',
          valText: 'text-burgundy-900 dark:text-creme-50',
          badge: 'bg-sand-200 dark:bg-burgundy-800 text-burgundy-900 dark:text-dustypink-200 border-sand-300 dark:border-burgundy-700',
          progressBg: 'bg-gradient-to-r from-sand-500 to-burgundy-700 dark:from-dustypink-400 dark:to-burgundy-500'
        };
      default:
        return {
          container: 'bg-gradient-to-br from-creme-50 via-sand-50 to-dustypink-50/30 dark:from-burgundy-900/50 dark:via-burgundy-950/70 dark:to-burgundy-900/50 border-sand-300/70 dark:border-burgundy-800/70 hover:border-dustypink-300 dark:hover:border-burgundy-700',
          iconBg: 'bg-sand-100 dark:bg-burgundy-800 text-sand-800 dark:text-sand-200 border border-sand-300 dark:border-burgundy-700',
          valText: 'text-burgundy-950 dark:text-creme-50',
          badge: 'bg-sand-100 dark:bg-burgundy-800 text-sand-800 dark:text-sand-200 border border-sand-300 dark:border-burgundy-700',
          progressBg: 'bg-burgundy-600 dark:bg-dustypink-500'
        };
    }
  };

  const style = getStyles();
  const isDarkCard = variant === 'success';

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 shadow-soft ${style.container} group`}>
      
      {/* Top Row: Title and Icon */}
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-bold uppercase tracking-wider ${isDarkCard ? 'text-dustypink-200' : 'text-sand-700 dark:text-sand-400'}`}>
          {title}
        </span>
        <div className={`p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110 ${style.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="mt-4 flex items-baseline justify-between">
        <div className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${style.valText}`}>
          {value}
        </div>
        {badge && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono border ${style.badge}`}>
            {badge}
          </span>
        )}
      </div>

      {/* Progress Bar (if provided) */}
      {progress !== undefined && (
        <div className="mt-3.5">
          <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkCard ? 'bg-burgundy-950/60' : 'bg-sand-200/80 dark:bg-burgundy-900/80'}`}>
            <div 
              className={`h-full transition-all duration-1000 rounded-full ${style.progressBg}`}
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Subtitle */}
      {subtitle && (
        <p className={`mt-2.5 text-xs font-medium ${isDarkCard ? 'text-dustypink-200/80' : 'text-sand-700 dark:text-sand-400'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
