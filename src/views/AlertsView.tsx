import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Info,
  ArrowRight,
  Plus,
  Filter,
} from 'lucide-react';
import { AlertItem, Goal, AlertSeverity } from '../types';
import { EmptyState } from '../components/EmptyState';

interface AlertsViewProps {
  alerts: AlertItem[];
  goals: Goal[];
  onOpenQuickResultModal: (goal: Goal) => void;
  onOpenNewActionPlan: (goalId?: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  goals,
  onOpenQuickResultModal,
  onOpenNewActionPlan,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('todos');

  const filteredAlerts = alerts.filter((al) => {
    if (selectedSeverity === 'todos') return true;
    return al.severity === selectedSeverity;
  });

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'danger':
        return {
          icon: <AlertOctagon className="w-4 h-4 text-rose-600" />,
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          label: 'Crítico / Atrasada',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          label: 'Atenção / Risco',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          label: 'Meta Concluída',
        };
      default:
        return {
          icon: <Info className="w-4 h-4 text-[#0284C7]" />,
          badge: 'bg-sky-50 text-[#0284C7] border-sky-200',
          label: 'Informativo',
        };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-[#0284C7]" />
            <span>Central de Alertas & Notificações</span>
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Monitoramento preditivo automático de desvios, prazos críticos e celebração de metas batidas
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#64748B]" />
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-white border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs text-[#1E293B] focus:border-[#0284C7] cursor-pointer shadow-xs"
          >
            <option value="todos">Todos os alertas ({alerts.length})</option>
            <option value="danger">🔴 Críticos / Atrasados</option>
            <option value="warning">🟡 Em risco / Atenção</option>
            <option value="success">🟢 Metas Batidas</option>
            <option value="info">🔵 Informativos</option>
          </select>
        </div>
      </div>

      {alerts.length === 0 ? (
        <EmptyState
          title="Nenhum alerta pendente"
          description="Todas as metas estão em dia e no ritmo ideal de entregas da Facility Bombas."
        />
      ) : filteredAlerts.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-10 text-center text-[#64748B] text-xs">
          Nenhum alerta correspondente ao filtro selecionado.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((al) => {
            const sev = getSeverityBadge(al.severity);
            const relatedGoal = goals.find((g) => g.id === al.goalId);

            return (
              <div
                key={al.id}
                className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex-shrink-0">
                    {sev.icon}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-[#1E293B] text-sm sm:text-base">
                        {al.title}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${sev.badge}`}
                      >
                        {sev.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] max-w-2xl leading-relaxed">
                      {al.description}
                    </p>
                  </div>
                </div>

                {/* Quick actions for this alert */}
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  {relatedGoal && (
                    <button
                      onClick={() => onOpenQuickResultModal(relatedGoal)}
                      className="px-3 py-1.5 rounded-xl bg-sky-50 text-[#0284C7] hover:bg-sky-100 text-xs font-bold transition-colors cursor-pointer"
                    >
                      + Lançar Resultado
                    </button>
                  )}

                  {(al.severity === 'danger' || al.severity === 'warning') && (
                    <button
                      onClick={() => onOpenNewActionPlan(al.goalId)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-bold transition-colors cursor-pointer border border-amber-200"
                    >
                      Plano de Ação
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
