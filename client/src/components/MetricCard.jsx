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
          container: 'bg-gradient-to-br from-creme-50 via-dustypink-50/50 to-sand-100/60 border-dustypink-300/60 hover:border-dustypink-400',
          iconBg: 'bg-dustypink-100 text-burgundy-700 border border-dustypink-300',
          valText: 'text-burgundy-950',
          badge: 'bg-dustypink-100 text-burgundy-800 border-dustypink-300',
          progressBg: 'bg-gradient-to-r from-dustypink-400 to-burgundy-600'
        };
      case 'success':
        return {
          container: 'bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-burgundy-950 border-burgundy-700/60 text-creme-50 shadow-soft-lg hover:shadow-glow-burgundy',
          iconBg: 'bg-burgundy-700/60 text-dustypink-200 border border-burgundy-500/40',
          valText: 'text-creme-50',
          badge: 'bg-dustypink-300/20 text-dustypink-200 border-dustypink-400/30',
          progressBg: 'bg-gradient-to-r from-dustypink-300 to-dustypink-100'
        };
      case 'brand':
        return {
          container: 'bg-gradient-to-br from-creme-50 via-sand-100/50 to-creme-200/50 border-sand-300/80 hover:border-sand-400',
          iconBg: 'bg-sand-200 text-burgundy-800 border border-sand-300',
          valText: 'text-burgundy-900',
          badge: 'bg-sand-200 text-burgundy-900 border-sand-300',
          progressBg: 'bg-gradient-to-r from-sand-500 to-burgundy-700'
        };
      default:
        return {
          container: 'bg-gradient-to-br from-creme-50 via-sand-50 to-dustypink-50/30 border-sand-300/70 hover:border-dustypink-300',
          iconBg: 'bg-sand-100 text-sand-800 border border-sand-300',
          valText: 'text-burgundy-950',
          badge: 'bg-sand-100 text-sand-800 border-sand-300',
          progressBg: 'bg-burgundy-600'
        };
    }
  };

  const style = getStyles();
  const isDarkCard = variant === 'success';

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 shadow-soft ${style.container} group`}>
      
      {/* Top Row: Title and Icon */}
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-bold uppercase tracking-wider ${isDarkCard ? 'text-dustypink-200' : 'text-sand-700'}`}>
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
          <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkCard ? 'bg-burgundy-950/60' : 'bg-sand-200/80'}`}>
            <div 
              className={`h-full transition-all duration-1000 rounded-full ${style.progressBg}`}
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Subtitle */}
      {subtitle && (
        <p className={`mt-2.5 text-xs font-medium ${isDarkCard ? 'text-dustypink-200/80' : 'text-sand-700'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
