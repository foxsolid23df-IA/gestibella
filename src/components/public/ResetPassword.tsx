import React, { useState, useEffect } from 'react';
import { KeyRound, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

export const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const hash = window.location.hash;
    if (hash.includes('access_token') && hash.includes('type=recovery')) {
      setHasToken(true);
      // Supabase auto-handles the token from the URL hash
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          setError('Token inválido o expirado. Solicita un nuevo link de recuperación.');
          setHasToken(false);
        }
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);
    try {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error('Supabase no configurado');
      }
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess(true);
      // Redirect to home after 3 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6">
        <div className="bg-white border border-[#E8DFD8] rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <Check className="w-7 h-7" />
          </div>
          <h2 className="font-serif-luxury text-2xl font-bold text-[#1C1917]">Contraseña Actualizada</h2>
          <p className="text-sm text-[#78716C]">Tu contraseña ha sido cambiada exitosamente. Serás redirigido al login...</p>
        </div>
      </div>
    );
  }

  if (!hasToken) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6">
        <div className="bg-white border border-[#E8DFD8] rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <KeyRound className="w-7 h-7" />
          </div>
          <h2 className="font-serif-luxury text-2xl font-bold text-[#1C1917]">Link Inválido</h2>
          <p className="text-sm text-[#78716C]">El link de recuperación es inválido o ha expirado. Solicita uno nuevo desde el login.</p>
          <a href="/" className="inline-block px-5 py-2.5 bg-[#1C1917] text-white text-xs font-bold rounded-xl hover:bg-[#2D2A26] transition-colors">
            Volver al Inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6">
      <div className="bg-white border border-[#E8DFD8] rounded-3xl p-8 max-w-md w-full shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#BE5A38] to-[#E07A5F] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="font-serif-luxury text-2xl font-bold text-[#1C1917]">Nueva Contraseña</h2>
          <p className="text-xs text-[#78716C] mt-1">Ingresa tu nueva contraseña para acceder a GestiBella.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#44403C] mb-1">Nueva Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-4 py-2.5 text-sm text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#44403C] mb-1">Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la contraseña"
              required
              minLength={6}
              className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-4 py-2.5 text-sm text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
            />
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3 text-xs">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white font-bold text-xs rounded-xl shadow-md hover:from-[#A84E30] hover:to-[#B45309] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <span>{isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#F0E8E1] text-center">
          <p className="text-[10px] text-[#78716C] flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            GestiBella — Acceso Seguro
          </p>
        </div>
      </div>
    </div>
  );
};
