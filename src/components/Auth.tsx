import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Registration successful! Please check your email for a confirmation link.');
      setMode('login');
    }
    setLoading(false);
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password reset link sent! Please check your email.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-pure-surface rounded-3xl shadow-2xl border border-whisper-border overflow-hidden p-8 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-primary text-3xl">
              {mode === 'login' ? 'lock' : mode === 'signup' ? 'person_add' : 'key_visualizer'}
            </span>
          </div>
          <h1 className="font-display-xl text-3xl text-on-surface mb-2">
            {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Get Started' : 'Reset Password'}
          </h1>
          <p className="font-body-md text-secondary">
            {mode === 'login' 
              ? 'Secure access for restaurant management' 
              : mode === 'signup'
              ? 'Create an account to start managing your staff'
              : 'Enter your email to receive a recovery link'}
          </p>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl border border-error/20 mb-6 text-sm flex items-center gap-3">
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
          </div>
        )}

        {message && (
          <div className="bg-primary/10 text-primary p-4 rounded-xl border border-primary/20 mb-6 text-sm flex items-center gap-3 font-medium">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            {message}
          </div>
        )}

        {(mode === 'login' || mode === 'signup') ? (
          <form onSubmit={mode === 'login' ? handleLogin : handleSignUp} className="flex flex-col gap-6">
            <div>
              <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Work Email</label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chef@restaurant.com"
                className="w-full bg-surface-container-low border border-whisper-border rounded-xl py-4 px-5 font-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider">Password</label>
                {mode === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => { setMode('forgot'); setError(null); setMessage(null); }}
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container-low border border-whisper-border rounded-xl py-4 px-5 font-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="bg-primary text-on-primary py-4 rounded-xl font-body-lg font-bold hover:bg-surface-tint disabled:opacity-50 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>

            <button 
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); setMessage(null); }}
              className="text-sm text-secondary hover:text-on-surface text-center"
            >
              {mode === 'login' ? "¿Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetRequest} className="flex flex-col gap-6">
            <div>
              <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Account Email</label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chef@restaurant.com"
                className="w-full bg-surface-container-low border border-whisper-border rounded-xl py-4 px-5 font-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="bg-primary text-on-primary py-4 rounded-xl font-body-lg font-bold hover:bg-surface-tint disabled:opacity-50 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
              ) : (
                'Send Reset Link'
              )}
            </button>

            <button 
              type="button"
              onClick={() => { setMode('login'); setError(null); setMessage(null); }}
              className="text-sm text-secondary hover:text-on-surface flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

