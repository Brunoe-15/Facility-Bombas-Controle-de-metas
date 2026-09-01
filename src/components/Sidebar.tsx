import React from 'react';
import {
  LayoutDashboard,
  Target,
  CalendarRange,
  Users,
  BarChart3,
  LineChart,
  Bell,
  ClipboardList,
  History,
  FileSpreadsheet,
  ArrowUpDown,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react';
import { FacilityLogo } from './FacilityLogo';

export type NavView =
  | 'dashboard'
  | 'goals'
  | 'upcoming'
  | 'employees'
  | 'metrics'
  | 'charts'
  | 'alerts'
  | 'action_plans'
  | 'history'
  | 'reports'
  | 'import_export'
  | 'settings';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  alertsCount?: number;
  actionPlansCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isOpenMobile,
  onCloseMobile,
  alertsCount = 0,
  actionPlansCount = 0,
}) => {
  const menuItems: Array<{
    id: NavView;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'goals', label: 'Metas', icon: Target },
    { id: 'upcoming', label: 'Próximas Metas', icon: CalendarRange },
    { id: 'employees', label: 'Funcionários', icon: Users },
    { id: 'metrics', label: 'Métricas', icon: BarChart3 },
    { id: 'charts', label: 'Gráficos', icon: LineChart },
    {
      id: 'alerts',
      label: 'Alertas',
      icon: Bell,
      badge: alertsCount,
      badgeColor: 'bg-red-500 text-white',
    },
    {
      id: 'action_plans',
      label: 'Planos de Ação',
      icon: ClipboardList,
      badge: actionPlansCount,
      badgeColor: 'bg-orange-500 text-white',
    },
    { id: 'history', label: 'Histórico', icon: History },
    { id: 'reports', label: 'Relatórios', icon: FileSpreadsheet },
    { id: 'import_export', label: 'Importar / Exportar', icon: ArrowUpDown },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const handleNavClick = (viewId: NavView) => {
    onSelectView(viewId);
    if (isOpenMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-[#E2E8F0] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-xs ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding Section */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FacilityLogo size={38} />
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-[#1E293B] leading-tight">
                Facility Bombas
              </span>
              <span className="text-[11px] text-[#0284C7] font-semibold tracking-wide">
                Controle de Metas
              </span>
            </div>
          </div>

          {/* Close on Mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-[#64748B] hover:text-[#1E293B] p-1 rounded-lg hover:bg-[#F1F5F9]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Confidential Notice Banner */}
        <div className="mx-3 mt-3 px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2 text-[11px] text-[#475569]">
          <ShieldCheck className="w-4 h-4 text-[#0284C7] flex-shrink-0" />
          <span className="font-medium truncate">Acesso Administrativo</span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-[#EBF3FA] text-[#0284C7] font-semibold shadow-xs'
                    : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#0284C7]' : 'text-[#94A3B8] group-hover:text-[#475569]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && item.badge > 0 ? (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.badgeColor || 'bg-[#0284C7] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-3.5 border-t border-[#E2E8F0] text-center">
          <div className="text-[10px] text-[#64748B] font-medium">
            Facility Bombas © {new Date().getFullYear()}
          </div>
          <div className="text-[9px] text-[#94A3B8] mt-0.5">
            Gestão Estratégica & Desempenho
          </div>
        </div>
      </aside>
    </>
  );
};
