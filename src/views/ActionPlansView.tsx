import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Calendar,
  User,
  AlertCircle,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  Filter,
} from 'lucide-react';
import { ActionPlan, ActionPlanStatus, Goal, Employee } from '../types';
import { formatDateBR } from '../utils/formatters';
import { EmptyState } from '../components/EmptyState';

interface ActionPlansViewProps {
  actionPlans: ActionPlan[];
  goals: Goal[];
  employees: Employee[];
  onOpenNewActionPlanModal: () => void;
  onOpenEditActionPlanModal: (plan: ActionPlan) => void;
  onUpdatePlanStatus: (planId: string, status: ActionPlanStatus) => void;
  onDeletePlan: (planId: string) => void;
}

export const ActionPlansView: React.FC<ActionPlansViewProps> = ({
  actionPlans,
  goals,
  employees,
  onOpenNewActionPlanModal,
  onOpenEditActionPlanModal,
  onUpdatePlanStatus,
  onDeletePlan,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const filteredPlans = actionPlans.filter((p) => {
    if (statusFilter === 'todos') return true;
    return p.status === statusFilter;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgente':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'alta':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'media':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-sky-50 text-[#0284C7] border-sky-200';
    }
  };

  const kanbanColumns: Array<{ status: ActionPlanStatus; label: string; icon: string }> = [
    { status: 'pendente', label: 'Pendente', icon: '⏳' },
    { status: 'em_andamento', label: 'Em Andamento', icon: '⚡' },
    { status: 'concluido', label: 'Concluído', icon: '✅' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight flex items-center gap-2.5">
            <ClipboardList className="w-6 h-6 text-[#0284C7]" />
            <span>Planos de Ação & Medidas Corretivas (5W2H)</span>
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Ações estratégicas e operacionais para recuperação e alinhamento de metas
          </p>
        </div>

        <button
          onClick={onOpenNewActionPlanModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Novo Plano de Ação</span>
        </button>
      </div>

      {actionPlans.length === 0 ? (
        <EmptyState
          title="Nenhum plano de ação registrado"
          description="Quando uma meta apresentar risco de desvio ou atraso, registre um plano de ação para alinhar as medidas necessárias com a equipe."
          actionLabel="+ Criar Plano de Ação"
          onAction={onOpenNewActionPlanModal}
        />
      ) : (
        /* Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kanbanColumns.map((col) => {
            const colPlans = actionPlans.filter((p) => p.status === col.status);

            return (
              <div
                key={col.status}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-3">
                  <div className="flex items-center gap-2 font-bold text-[#1E293B] text-xs uppercase tracking-wider">
                    <span>{col.icon}</span>
                    <span>{col.label}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E2E8F0] text-[#1E293B]">
                    {colPlans.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colPlans.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-[11px] text-[#94A3B8] italic">
                      Nenhum item nesta coluna
                    </div>
                  ) : (
                    colPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl p-4 shadow-xs space-y-2.5 transition-all text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getPriorityBadge(
                              plan.priority
                            )}`}
                          >
                            {plan.priority}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onOpenEditActionPlanModal(plan)}
                              className="p-1 text-[#64748B] hover:text-[#1E293B] rounded hover:bg-[#F1F5F9] cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onDeletePlan(plan.id)}
                              className="p-1 text-rose-600 hover:text-rose-700 rounded hover:bg-rose-50 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <h3 className="font-bold text-[#1E293B] text-sm leading-snug">
                          {plan.title}
                        </h3>

                        {plan.goalName && (
                          <div className="text-[11px] text-[#0284C7] font-semibold">
                            🎯 Meta: {plan.goalName}
                          </div>
                        )}

                        <div className="bg-[#F8FAFC] rounded-lg p-2.5 text-[11px] space-y-1.5 border border-[#E2E8F0]">
                          <div className="text-[#64748B]">
                            <span className="font-semibold text-rose-600">Problema:</span>{' '}
                            {plan.problemIdentified}
                          </div>
                          <div className="text-[#1E293B]">
                            <span className="font-semibold text-[#0284C7]">Ação:</span>{' '}
                            {plan.actionRequired}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1">
                          <span className="flex items-center gap-1 font-medium text-[#1E293B]">
                            <User className="w-3 h-3 text-[#0284C7]" />
                            {plan.responsibleName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDateBR(plan.deadline)}
                          </span>
                        </div>

                        {/* Quick status switch buttons */}
                        <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between gap-1 text-[10px]">
                          {col.status !== 'pendente' && (
                            <button
                              onClick={() => onUpdatePlanStatus(plan.id, 'pendente')}
                              className="text-[#64748B] hover:text-[#1E293B] font-medium hover:underline cursor-pointer"
                            >
                              ← Pendente
                            </button>
                          )}
                          {col.status !== 'em_andamento' && (
                            <button
                              onClick={() => onUpdatePlanStatus(plan.id, 'em_andamento')}
                              className="text-[#0284C7] font-semibold hover:underline cursor-pointer"
                            >
                              {col.status === 'pendente' ? 'Iniciar →' : '← Em andamento'}
                            </button>
                          )}
                          {col.status !== 'concluido' && (
                            <button
                              onClick={() => onUpdatePlanStatus(plan.id, 'concluido')}
                              className="text-emerald-600 font-semibold hover:underline cursor-pointer"
                            >
                              Concluir ✅
                            </button>
                          )}
                        </div>
                      </div>
                    ))
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
