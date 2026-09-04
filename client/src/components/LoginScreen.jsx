import React, { useState } from 'react';
import { 
  Bot, 
  Lock, 
  User, 
  Key, 
  ArrowRight, 
  AlertCircle
} from 'lucide-react';

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (!res.ok || !data.token) {
        setError(data.error || 'Authentication failed. Please check your credentials.');
      } else {
        onLoginSuccess(data.user, data.token);
      }
    } catch (err) {
      setError('Connection error. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-creme-100 flex flex-col items-center justify-center p-4 selection:bg-dustypink-200 selection:text-burgundy-950 relative overflow-hidden">
      
      {/* Background Decorative Gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-dustypink-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sand-300/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-creme-50 border border-sand-300/90 rounded-3xl p-8 sm:p-9 shadow-soft-xl relative z-10">
        
        {/* Branding & Logo */}
        <div className="text-center space-y-3">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-burgundy-800 via-burgundy-700 to-dustypink-400 p-[1.5px] shadow-md shadow-burgundy-900/15">
            <div className="w-full h-full bg-creme-50 rounded-[14px] flex items-center justify-center">
              <Bot className="w-8 h-8 text-burgundy-700" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-burgundy-950 tracking-tight">
              Recover
            </h1>
            <p className="text-xs text-sand-700 font-medium mt-1">
              Autonomous Revenue Recovery for Payment Platforms
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-5 p-3.5 rounded-xl bg-burgundy-100/80 border border-burgundy-300 text-xs text-burgundy-950 flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-burgundy-700 flex-shrink-0 mt-0.5" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-sand-800 uppercase tracking-wider mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-sand-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Enter your username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/90 border border-sand-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-semibold text-burgundy-950 placeholder-sand-400 focus:outline-none focus:border-burgundy-700 focus:ring-2 focus:ring-burgundy-700/10 transition-all shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-sand-800 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-sand-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/90 border border-sand-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-semibold text-burgundy-950 placeholder-sand-400 focus:outline-none focus:border-burgundy-700 focus:ring-2 focus:ring-burgundy-700/10 transition-all shadow-2xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl text-xs font-bold text-creme-50 bg-gradient-to-r from-burgundy-800 via-burgundy-700 to-burgundy-600 hover:from-burgundy-900 hover:to-burgundy-700 shadow-md shadow-burgundy-900/20 hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating Session...</span>
            ) : (
              <>
                <span>Sign In to Recovery Portal</span>
                <ArrowRight className="w-4 h-4 text-dustypink-300" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
