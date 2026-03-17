'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      // Redirigir al dashboard según el rol o por defecto
      router.push('/dashboard');
      router.refresh(); // Refrescar para que el middleware tome la nueva cookie
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#1B243B]">
      <div className="w-full max-w-[420px] p-10 rounded-[40px] z-10 mx-4 bg-[#39425B]/80 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/5">
        <div className="text-center mb-10 mt-2">
          <h1 className="text-[36px] font-bold text-white tracking-wide">
            Login
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[11px] font-bold text-white uppercase tracking-widest mb-2 ml-4">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-6 py-[18px] bg-[#4E5C78] border border-transparent rounded-[30px] focus:ring-1 focus:ring-slate-300 outline-none text-white placeholder-slate-300/70 font-medium transition-all"
              placeholder="admin@aeroempaque.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-white uppercase tracking-widest mb-2 ml-4">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-6 py-[18px] bg-[#4E5C78] border border-transparent rounded-[30px] focus:ring-1 focus:ring-slate-300 outline-none text-white placeholder-slate-300/70 font-medium transition-all tracking-[0.2em]"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-[30px] p-4 text-red-200 text-sm text-center animate-pulse">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ED7044] hover:bg-[#D95F35] text-white font-bold py-[18px] px-4 rounded-[30px] transform transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed tracking-wide text-[15px]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
