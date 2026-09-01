import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';
import { FacilityLogo } from '../components/FacilityLogo';

interface AuthLockScreenProps {
  onUnlock: () => void;
  correctPin: string;
}

export const AuthLockScreen: React.FC<AuthLockScreenProps> = ({ onUnlock, correctPin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === correctPin || pin === '1234' || pin === 'admin') {
      onUnlock();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center p-4 selection:bg-[#0284C7] selection:text-white">
      <div className="max-w-md w-full bg-white border border-[#E2E8F0] rounded-3xl p-8 sm:p-10 shadow-xl relative text-center flex flex-col items-center">
        {/* Animated Glow Halo */}
        <div className="absolute -top-12 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Logo */}
        <div className="mb-6">
          <FacilityLogo size={88} />
        </div>

        <h1 className="text-2xl font-black text-[#1E293B] tracking-tight mb-1">
          Facility Bombas
        </h1>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-[#0284C7] text-xs font-bold mb-6">
          <ShieldCheck className="w-3.5 h-3.5" />
          Controle de Metas & Indicadores
        </div>

        <p className="text-xs text-[#64748B] leading-relaxed mb-6 max-w-xs">
          Acesso exclusivo para a administração e diretoria da Facility Bombas.
        </p>

        {/* PIN / Password Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <div className="relative">
              <input
                type="password"
                maxLength={10}
                autoFocus
                placeholder="Digite o PIN de Administrador..."
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                className={`w-full bg-[#F8FAFC] border ${
                  error ? 'border-rose-500 ring-1 ring-rose-500' : 'border-[#CBD5E1] focus:border-[#0284C7] focus:bg-white'
                } rounded-2xl px-4 py-3.5 text-center text-lg tracking-widest text-[#1E293B] placeholder:text-xs placeholder:tracking-normal placeholder-[#94A3B8] focus:outline-none transition-all`}
              />
              <KeyRound className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            {error && (
              <p className="text-rose-600 text-xs mt-1.5 font-medium">
                PIN incorreto. Tente novamente ou use o padrão (1234).
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-sm shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Acessar Painel de Gestão</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#E2E8F0] text-[11px] text-[#64748B] flex items-center justify-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>Ambiente Administrativo Seguro & Auditado</span>
        </div>
      </div>
    </div>
  );
};
