import React, { useState, useEffect } from 'react';
import { Lock, Mail, Key, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { getSupabaseClient, isSupabaseConfigured } from '../../lib/supabaseClient';
import { StorageService } from '../../lib/storage';

interface AdminAuthModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supabaseReady, setSupabaseReady] = useState(false);

  useEffect(() => {
    setSupabaseReady(isSupabaseConfigured());
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = getSupabaseClient();

    if (supabase) {
      // 1. Production Supabase Auth flow
      try {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        });

        if (authError) {
          setError(authError.message || 'Authentication failed. Please check credentials.');
          setLoading(false);
          return;
        }

        if (data.session) {
          StorageService.setAdminAuthenticated(true);
          setLoading(false);
          onSuccess();
          return;
        }
      } catch (err: any) {
        setError(err.message || 'Remote authentication error.');
        setLoading(false);
        return;
      }
    } else {
      // 2. Fallback if remote environment variables are not yet provided
      setError('Supabase remote environment variables (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY) are not configured in runtime environment. Set them in settings to authenticate.');
      setLoading(false);
      return;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white max-w-md w-full p-6 sm:p-8 rounded-sm shadow-2xl border border-stone-200">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-stone-100 mx-auto mb-4 text-stone-900">
          <Lock className="w-6 h-6" />
        </div>
        
        <h2 className="text-xl font-serif text-center font-bold text-stone-900 tracking-wide">
          GulPash Admin Portal
        </h2>
        <p className="text-xs text-center text-stone-500 mt-1">
          {supabaseReady 
            ? 'Sign in with your verified Supabase Admin credentials'
            : 'Remote Supabase connection credentials required'}
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gulpash.pk"
                className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-sm focus:outline-hidden focus:border-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-sm focus:outline-hidden focus:border-stone-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-medium text-stone-600 hover:text-black py-2 px-3"
            >
              Back to Storefront
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-stone-900 hover:bg-black text-white text-xs font-semibold py-2.5 px-5 rounded-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
