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
  const [authMode, setAuthMode] = useState<'password' | 'otp_request' | 'otp_verify'>('password');
  const [email, setEmail] = useState('admin@gulpash.online');
  const [password, setPassword] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [supabaseReady, setSupabaseReady] = useState(false);

  useEffect(() => {
    setSupabaseReady(isSupabaseConfigured());
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const supabase = getSupabaseClient();

    if (!supabase) {
      setError('Supabase client is not configured. Please check environment credentials.');
      setLoading(false);
      return;
    }

    try {
      if (authMode === 'otp_verify') {
        // Verify OTP code
        const { data, error: otpError } = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token: otpToken.trim(),
          type: 'email'
        });

        if (otpError) {
          setError(otpError.message || 'Invalid or expired verification code.');
          setLoading(false);
          return;
        }

        if (data.session) {
          StorageService.setAdminAuthenticated(true);
          setLoading(false);
          onSuccess();
          return;
        }
      } else if (authMode === 'otp_request') {
        // Send OTP email
        const { error: sendError } = await supabase.auth.signInWithOtp({
          email: cleanEmail
        });

        if (sendError) {
          setError(sendError.message || 'Failed to send one-time login code.');
          setLoading(false);
          return;
        }

        setAuthMode('otp_verify');
        setInfoMessage(`A 6-digit verification code was sent to ${cleanEmail}. Please enter it below.`);
        setLoading(false);
        return;
      } else {
        // Standard email + password authentication
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword
        });

        if (authError) {
          setError(authError.message || 'Authentication failed. Please check your credentials.');
          setLoading(false);
          return;
        }

        if (data.session) {
          StorageService.setAdminAuthenticated(true);
          setLoading(false);
          onSuccess();
          return;
        }
      }
    } catch (err: any) {
      setError(err.message || 'Remote authentication error.');
      setLoading(false);
      return;
    } finally {
      setLoading(false);
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

        {infoMessage && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-sm flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
            <span>{infoMessage}</span>
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
                placeholder="admin@gulpash.online"
                className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-sm focus:outline-hidden focus:border-stone-900"
              />
            </div>
          </div>

          {authMode === 'password' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => { setAuthMode('otp_request'); setError(null); setInfoMessage(null); }}
                  className="text-[11px] text-stone-500 hover:text-stone-900 underline"
                >
                  Use OTP Code instead
                </button>
              </div>
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
          )}

          {authMode === 'otp_verify' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-700">
                  6-Digit OTP Verification Code
                </label>
                <button
                  type="button"
                  onClick={() => { setAuthMode('otp_request'); setError(null); }}
                  className="text-[11px] text-stone-500 hover:text-stone-900 underline"
                >
                  Resend code
                </button>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={otpToken}
                  onChange={(e) => setOtpToken(e.target.value)}
                  placeholder="123456"
                  maxLength={10}
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono tracking-widest border border-stone-300 rounded-sm focus:outline-hidden focus:border-stone-900"
                />
              </div>
            </div>
          )}

          {authMode === 'otp_request' && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => { setAuthMode('password'); setError(null); setInfoMessage(null); }}
                className="text-[11px] text-stone-500 hover:text-stone-900 underline"
              >
                ← Back to Password Login
              </button>
            </div>
          )}

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
                  <span>
                    {authMode === 'otp_request' ? 'Send Code' : authMode === 'otp_verify' ? 'Verify & Login' : 'Authenticate'}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
