'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User, Lock, Mail, ArrowRight, ShieldCheck, Key, Sparkles, Home, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.user) {
        setSuccessMsg('Logged in successfully! Redirecting...');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex items-center justify-center py-16 px-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8DFF00]/10 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="w-full max-w-md rounded-3xl border border-border bg-card/50 backdrop-blur-xl p-8 space-y-6 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#8DFF00] to-[#7acc00] flex items-center justify-center text-foreground mx-auto shadow-lg shadow-[#8DFF00]/25 mb-4">
            <User size={26} />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Account Sign In</h1>
          <p className="text-muted-foreground text-xs">
            Sign in to manage your orders, saved layouts, and custom printing preferences.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <Sparkles size={15} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-xs text-foreground placeholder-zinc-500 focus:outline-none focus:border-[#8DFF00] focus:ring-1 focus:ring-[#8DFF00] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-xs text-foreground placeholder-zinc-500 focus:outline-none focus:border-[#8DFF00] focus:ring-1 focus:ring-[#8DFF00] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-[#8DFF00] hover:bg-[#9eff1a] text-[#0a0a0a] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#8DFF00]/20 hover:shadow-[#8DFF00]/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground flex items-center gap-1">
            <Home size={13} />
            <span>Return Home</span>
          </Link>
          <Link href="/contact" className="hover:text-[#8DFF00] transition-colors">
            Need Help?
          </Link>
        </div>

      </div>
    </div>
  );
}
