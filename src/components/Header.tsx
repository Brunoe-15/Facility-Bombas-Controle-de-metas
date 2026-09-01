import React from 'react';
import {
  Menu,
  Plus,
  Tv,
  Bell,
  Calendar,
  Lock,
} from 'lucide-react';
import { MONTH_NAMES_PT } from '../utils/formatters';

interface HeaderProps {
  onOpenMobileNav: () => void;
  onOpenNewGoalModal: () => void;
  isPresentationMode: boolean;
  onTogglePresentationMode: () => void;
  activeAlertsCount: number;
  onOpenAlerts: () => void;
  onLockSystem: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileNav,
  onOpenNewGoalModal,
  isPresentationMode,
  onTogglePresentationMode,
  activeAlertsCount,
  onOpenAlerts,
  onLockSystem,
}) => {
  const today = new Date();
  const monthName = MONTH_NAMES_PT[today.getMonth()];
  const currentYear = today.getFullYear();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-6 py-3 transition-colors shadow-2xs">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile Nav Toggle & Current Date Indicator */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileNav}
            className="lg:hidden p-2 rounded-xl border border-[#CBD5E1] text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] cursor-pointer"
            aria-label="Abrir Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-semibold text-[#475569]">
            <Calendar className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>
              {monthName} de {currentYear}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Presentation Mode Toggle (Modo Reunião) */}
          <button
            onClick={onTogglePresentationMode}
            title={isPresentationMode ? 'Sair do Modo Apresentação' : 'Entrar no Modo Reunião / Apresentação'}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isPresentationMode
                ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-xs'
                : 'bg-white border-[#CBD5E1] text-[#64748B] hover:text-[#1E293B] hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {isPresentationMode ? 'Apresentação Ativa' : 'Modo Reunião'}
            </span>
          </button>

          {/* Alert Center Trigger */}
          <button
            onClick={onOpenAlerts}
            title="Central de Alertas e Notificações"
            className="relative p-2 rounded-xl bg-white border border-[#CBD5E1] text-[#64748B] hover:text-[#1E293B] hover:border-[#94A3B8] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* Lock Session Button */}
          <button
            onClick={onLockSystem}
            title="Bloquear Painel Administrativo"
            className="p-2 rounded-xl bg-white border border-[#CBD5E1] text-[#64748B] hover:text-[#1E293B] hover:border-[#94A3B8] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Quick Create Goal Button */}
          <button
            onClick={onOpenNewGoalModal}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Nova Meta</span>
            <span className="sm:hidden">Meta</span>
          </button>
        </div>
      </div>
    </header>
  );
};
