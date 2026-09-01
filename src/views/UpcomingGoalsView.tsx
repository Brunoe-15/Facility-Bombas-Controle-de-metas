import React, { useState } from 'react';
import { CalendarRange, Plus, ArrowRight, Clock, Target, Calendar } from 'lucide-react';
import { Goal, Employee, CalculatedGoalMetrics } from '../types';
import { MONTH_NAMES_PT, formatUnitValue, formatCurrency, formatDateBR } from '../utils/formatters';
import { EmptyState } from '../components/EmptyState';

interface UpcomingGoalsViewProps {
  goals: Goal[];
  calculatedGoals: CalculatedGoalMetrics[];
  categories: string[];
  employees: Employee[];
  onOpenNewGoalModal: () => void;
  onOpenEditGoalModal: (goal: Goal) => void;
}

export const UpcomingGoalsView: React.FC<UpcomingGoalsViewProps> = ({
  goals,
  calculatedGoals,
  categories,
  employees,
  onOpenNewGoalModal,
  onOpenEditGoalModal,
}) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // 1-12

  const [selectedHorizon, setSelectedHorizon] = useState<'months' | 'quarters' | 'years'>('months');

  // Compute future months sequence (Next 6 months)
  const futureMonths: Array<{ month: number; year: number; label: string }> = [];
  for (let i = 1; i <= 6; i++) {
    let m = currentMonth + i;
    let y = currentYear;
    if (m > 12) {
      m = m - 12;
      y = y + 1;
    }
    futureMonths.push({
      month: m,
      year: y,
      label: `${MONTH_NAMES_PT[m - 1]} de ${y}`,
    });
  }

  // Filter future goals (goals whose start date or month/year is in the future)
  const upcomingGoals = goals.filter((g) => {
    if (g.year > currentYear) return true;
    if (g.year === currentYear && g.month && g.month > currentMonth) return true;
    if (g.startDate && new Date(g.startDate) > today) return true;
    return false;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight flex items-center gap-2.5">
            <CalendarRange className="w-6 h-6 text-[#0284C7]" />
            <span>Planejamento de Próximas Metas</span>
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Projete o roadmap de faturamento e volume de vendas para os próximos ciclos da Facility Bombas
          </p>
        </div>

        <button
          onClick={onOpenNewGoalModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Planejar Nova Meta Futura</span>
        </button>
      </div>

      {/* Timeline Planner Cards for Next Months */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
            Cronograma dos Próximos 6 Meses
          </h2>
          <span className="text-xs text-[#64748B]">Ciclos Futuros</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {futureMonths.map((fm, idx) => {
            // Find goals planned for this month & year
            const monthGoals = goals.filter(
              (g) => (g.month === fm.month || (g.startDate && new Date(g.startDate).getMonth() + 1 === fm.month)) &&
                     (g.year === fm.year || (g.startDate && new Date(g.startDate).getFullYear() === fm.year))
            );

            const totalPlannedValue = monthGoals.reduce((acc, g) => acc + (Number(g.targetValue) || 0), 0);

            return (
              <div
                key={`${fm.year}-${fm.month}`}
                className="bg-white border border-[#E2E8F0] hover:border-sky-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-3 transition-all"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#0284C7]" />
                    <span className="font-extrabold text-sm text-[#1E293B]">{fm.label}</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-[#0284C7] border border-sky-100">
                    +{idx + 1} mês
                  </span>
                </div>

                <div className="py-2">
                  <span className="text-[10px] text-[#64748B] uppercase tracking-wider block">
                    Meta Prevista Total:
                  </span>
                  <div className="text-xl font-black text-[#1E293B] mt-0.5">
                    {totalPlannedValue > 0 ? formatCurrency(totalPlannedValue) : 'A planejar'}
                  </div>
                </div>

                {/* List of goals in this month */}
                <div className="space-y-1.5 min-h-[60px]">
                  {monthGoals.length === 0 ? (
                    <p className="text-[11px] text-[#94A3B8] italic">
                      Nenhuma meta cadastrada para este mês ainda.
                    </p>
                  ) : (
                    monthGoals.map((g) => (
                      <div
                        key={g.id}
                        onClick={() => onOpenEditGoalModal(g)}
                        className="p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-sky-300 flex items-center justify-between text-xs cursor-pointer transition-colors"
                      >
                        <span className="font-semibold text-[#1E293B] truncate pr-2">
                          {g.name}
                        </span>
                        <span className="font-bold text-[#0284C7] whitespace-nowrap">
                          {formatUnitValue(g.targetValue, g.unitType, g.unitLabel)}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <button
                  onClick={onOpenNewGoalModal}
                  className="w-full py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0284C7] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-sky-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar meta em {MONTH_NAMES_PT[fm.month - 1]}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* List of all Future Goals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[#1E293B] tracking-tight">
            Todas as Metas Futuras Cadastradas ({upcomingGoals.length})
          </h2>
        </div>

        {upcomingGoals.length === 0 ? (
          <EmptyState
            title="Nenhum plano futuro cadastrado"
            description="Cadastre objetivos para os próximos meses ou para o próximo ano para antecipar estratégias da Facility Bombas."
            actionLabel="+ Planejar meta futura"
            onAction={onOpenNewGoalModal}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingGoals.map((g) => (
              <div
                key={g.id}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      {g.category}
                    </span>
                    <h3 className="font-bold text-[#1E293B] text-base mt-0.5">{g.name}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-[#0284C7] border border-sky-200">
                    Futura
                  </span>
                </div>

                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 flex justify-between items-center text-xs">
                  <span className="text-[#64748B]">Valor Planejado:</span>
                  <span className="font-extrabold text-[#0284C7] text-base">
                    {formatUnitValue(g.targetValue, g.unitType, g.unitLabel)}
                  </span>
                </div>

                <div className="text-xs text-[#64748B] space-y-1">
                  <div>Período: {formatDateBR(g.startDate)} até {formatDateBR(g.endDate)}</div>
                  {g.responsibleName && <div>Responsável: {g.responsibleName}</div>}
                  {g.notes && <div className="text-[11px] italic text-[#64748B]/80 truncate">{g.notes}</div>}
                </div>

                <div className="pt-2 border-t border-[#E2E8F0] flex justify-end">
                  <button
                    onClick={() => onOpenEditGoalModal(g)}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-[#64748B] hover:text-[#1E293B] text-xs font-semibold cursor-pointer border border-[#E2E8F0]"
                  >
                    Editar Planejamento
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
