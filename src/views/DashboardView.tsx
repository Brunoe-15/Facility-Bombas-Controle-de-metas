import React from 'react';
import {
  TrendingUp,
  Target,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Zap,
  Filter,
  Plus,
} from 'lucide-react';
import {
  CalculatedGoalMetrics,
  Goal,
  ActionPlan,
  AlertItem,
  FilterState,
  Employee,
} from '../types';
import {
  AggregatedDashboardMetrics,
  getStatusDetails,
} from '../utils/calculations';
import {
  formatCurrency,
  formatPercent,
  formatUnitValue,
  MONTH_NAMES_PT,
  getPeriodicityLabel,
} from '../utils/formatters';
import { EmptyState } from '../components/EmptyState';

interface DashboardViewProps {
  calculatedGoals: CalculatedGoalMetrics[];
  summary: AggregatedDashboardMetrics;
  filter: FilterState;
  onUpdateFilter: (newFilter: Partial<FilterState>) => void;
  categories: string[];
  employees: Employee[];
  alerts: AlertItem[];
  actionPlans: ActionPlan[];
  onOpenNewGoalModal: () => void;
  onOpenQuickResultModal: (goal: Goal) => void;
  onOpenEditGoalModal: (goal: Goal) => void;
  onOpenNewActionPlan: (goalId?: string) => void;
  onNavigateToView: (view: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  calculatedGoals,
  summary,
  filter,
  onUpdateFilter,
  categories,
  employees,
  alerts,
  actionPlans,
  onOpenNewGoalModal,
  onOpenQuickResultModal,
  onOpenEditGoalModal,
  onOpenNewActionPlan,
  onNavigateToView,
}) => {
  const currentYear = new Date().getFullYear();
  const hasGoals = calculatedGoals.length > 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#475569] uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>Filtros do Painel Administrativo</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onUpdateFilter({
                  periodicity: 'todas',
                  month: 'todos',
                  year: currentYear,
                  category: 'todas',
                  status: 'todos',
                  responsibleId: 'todos',
                  searchQuery: '',
                })
              }
              className="text-[11px] text-[#64748B] hover:text-[#0284C7] font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Periodicidade */}
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">
              Período
            </label>
            <select
              value={filter.periodicity || 'todas'}
              onChange={(e) => onUpdateFilter({ periodicity: e.target.value as any })}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-2.5 py-1.5 text-xs text-[#1E293B] focus:border-[#0284C7] cursor-pointer"
            >
              <option value="todas">Todos os períodos</option>
              <option value="diaria">Diária</option>
              <option value="semanal">Semanal</option>
              <option value="mensal">Mensal</option>
              <option value="trimestral">Trimestral</option>
              <option value="anual">Anual</option>
            </select>
          </div>

          {/* Mês */}
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">
              Mês
            </label>
            <select
              value={filter.month === 'todos' || filter.month === undefined ? 'todos' : filter.month}
              onChange={(e) =>
                onUpdateFilter({
                  month: e.target.value === 'todos' ? 'todos' : Number(e.target.value),
                })
              }
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-2.5 py-1.5 text-xs text-[#1E293B] focus:border-[#0284C7] cursor-pointer"
            >
              <option value="todos">Todos os meses</option>
              {MONTH_NAMES_PT.map((m, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Ano */}
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">
              Ano
            </label>
            <select
              value={filter.year}
              onChange={(e) => onUpdateFilter({ year: Number(e.target.value) })}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-2.5 py-1.5 text-xs text-[#1E293B] focus:border-[#0284C7] cursor-pointer"
            >
              {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">
              Categoria
            </label>
            <select
              value={filter.category || 'todas'}
              onChange={(e) => onUpdateFilter({ category: e.target.value })}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-2.5 py-1.5 text-xs text-[#1E293B] focus:border-[#0284C7] cursor-pointer"
            >
              <option value="todas">Todas as categorias</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">
              Status
            </label>
            <select
              value={filter.status || 'todos'}
              onChange={(e) => onUpdateFilter({ status: e.target.value as any })}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-2.5 py-1.5 text-xs text-[#1E293B] focus:border-[#0284C7] cursor-pointer"
            >
              <option value="todos">Todos os status</option>
              <option value="no_ritmo">🟢 No ritmo</option>
              <option value="meta_atingida">🔵 Meta atingida</option>
              <option value="atencao">🟡 Atenção</option>
              <option value="em_risco">🟠 Em risco</option>
              <option value="atrasada">🔴 Atrasada</option>
            </select>
          </div>

          {/* Responsável */}
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">
              Responsável
            </label>
            <select
              value={filter.responsibleId || 'todos'}
              onChange={(e) => onUpdateFilter({ responsibleId: e.target.value })}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-2.5 py-1.5 text-xs text-[#1E293B] focus:border-[#0284C7] cursor-pointer"
            >
              <option value="todos">Todos os responsáveis</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {/* 1. META DO MÊS / TOTAL */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-[#CBD5E1] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              Meta do Mês
            </span>
            <Target className="w-4 h-4 text-[#64748B]" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-[#1E293B] tracking-tight">
              {formatCurrency(summary.financialTarget)}
            </div>
            <span className="text-[10px] text-[#64748B] block mt-0.5">
              Alvo estabelecido
            </span>
          </div>
        </div>

        {/* 2. REALIZADO */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-sky-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#0284C7] uppercase tracking-wider">
              Realizado
            </span>
            <TrendingUp className="w-4 h-4 text-[#0284C7]" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-[#1E293B] tracking-tight">
              {formatCurrency(summary.financialAchieved)}
            </div>
            <span className="text-[10px] text-[#0284C7] block mt-0.5 font-medium">
              Concretizado até hoje
            </span>
          </div>
        </div>

        {/* 3. % DA META ATINGIDA */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-[#0284C7]/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#0284C7] uppercase tracking-wider">
              Meta Atingida
            </span>
            <Zap className="w-4 h-4 text-[#0284C7]" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-[#0284C7] tracking-tight">
              {formatPercent(summary.overallPercentage)}
            </div>
            {/* Mini Progress Bar */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[#0284C7] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, summary.overallPercentage)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4. FALTA PARA A META */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              Falta Atingir
            </span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-[#1E293B] tracking-tight">
              {formatCurrency(summary.financialRemaining)}
            </div>
            <span className="text-[10px] text-amber-600 block mt-0.5 font-medium">
              Gap para o objetivo
            </span>
          </div>
        </div>

        {/* 5. DIAS RESTANTES */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-[#CBD5E1] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              Dias Restantes
            </span>
            <Clock className="w-4 h-4 text-[#0284C7]" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-[#1E293B] tracking-tight">
              {summary.totalDaysRemaining} {summary.totalDaysRemaining === 1 ? 'dia' : 'dias'}
            </div>
            <span className="text-[10px] text-[#64748B] block mt-0.5">
              Tempo no ciclo
            </span>
          </div>
        </div>

        {/* 6. RITMO NECESSÁRIO */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-sky-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#0284C7] uppercase tracking-wider">
              Ritmo Necessário
            </span>
            <TrendingUp className="w-4 h-4 text-[#0284C7]" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-[#0284C7] tracking-tight">
              {formatCurrency(summary.financialRequiredDailyRate)}/dia
            </div>
            <span className="text-[10px] text-[#64748B] block mt-0.5">
              Para bater a meta
            </span>
          </div>
        </div>
      </div>

      {/* Executive Projection & Quick Status Banner */}
      {hasGoals && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Projection Card */}
          <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0284C7]" />
                <span className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
                  Projeção Automática de Fechamento
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                No ritmo atual de entregas, a empresa projeta fechar o ciclo em:
              </p>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-2xl font-black text-[#1E293B]">
                  {formatCurrency(summary.overallProjectedValue)}
                </span>
                <span className="text-xs text-[#0284C7] font-semibold">
                  ({formatPercent(summary.overallProjectedPercentage)} do alvo)
                </span>
              </div>
            </div>

            <div className="sm:text-right">
              {summary.isOverallProjectionAboveTarget ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>🟢 Projeção acima da meta</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  <TrendingDown className="w-4 h-4" />
                  <span>🔴 Projeção abaixo da meta</span>
                </div>
              )}
              <span className="block text-[11px] text-[#64748B] mt-1">
                Atualização dinâmica contínua
              </span>
            </div>
          </div>

          {/* Goal Counts Status Summary */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
              Status Geral das Metas ({summary.totalGoalsCount})
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-sky-50/60 p-2 rounded-xl border border-sky-100">
                <span className="text-[10px] text-[#0284C7] block font-bold">Atingidas</span>
                <span className="text-base font-extrabold text-[#0284C7]">
                  {summary.achievedGoalsCount}
                </span>
              </div>
              <div className="bg-emerald-50/60 p-2 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-emerald-700 block font-bold">No Ritmo</span>
                <span className="text-base font-extrabold text-emerald-700">
                  {summary.onTrackGoalsCount}
                </span>
              </div>
              <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-100">
                <span className="text-[10px] text-amber-700 block font-bold">Em Risco</span>
                <span className="text-base font-extrabold text-amber-700">
                  {summary.atRiskGoalsCount}
                </span>
              </div>
              <div className="bg-rose-50/60 p-2 rounded-xl border border-rose-100">
                <span className="text-[10px] text-rose-700 block font-bold">Atrasadas</span>
                <span className="text-base font-extrabold text-rose-700">
                  {summary.overdueGoalsCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Goal Cards List / Empty State */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#1E293B] tracking-tight">
              Metas em Acompanhamento
            </h2>
            <span className="text-xs text-[#64748B] font-medium">
              ({calculatedGoals.length} {calculatedGoals.length === 1 ? 'meta' : 'metas'})
            </span>
          </div>

          <button
            onClick={onOpenNewGoalModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Adicionar Meta</span>
          </button>
        </div>

        {!hasGoals ? (
          <EmptyState
            title="Nenhuma meta cadastrada"
            description="Cadastre sua primeira meta para começar a acompanhar os resultados da empresa e acionar as projeções automáticas."
            actionLabel="+ Cadastrar primeira meta"
            onAction={onOpenNewGoalModal}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {calculatedGoals.map((item) => {
              const { goal } = item;
              const statusInfo = getStatusDetails(item.status);

              return (
                <div
                  key={goal.id}
                  className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-4 transition-all group"
                >
                  {/* Top: Category & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                        {goal.category} • {getPeriodicityLabel(goal.periodicity)}
                      </span>
                      <h3 className="text-sm font-bold text-[#1E293B] group-hover:text-[#0284C7] transition-colors line-clamp-1 mt-0.5">
                        {goal.name}
                      </h3>
                      {goal.responsibleName && (
                        <span className="text-[11px] text-[#64748B]">
                          Resp: {goal.responsibleName}
                        </span>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusInfo.badgeClass}`}
                    >
                      <span>{statusInfo.icon}</span>
                      <span>{statusInfo.label}</span>
                    </div>
                  </div>

                  {/* Numbers Comparison */}
                  <div>
                    <div className="flex items-baseline justify-between mb-1 text-xs">
                      <span className="text-[#64748B]">Realizado / Meta:</span>
                      <span className="font-extrabold text-[#1E293B] text-sm">
                        <span className="text-[#0284C7]">
                          {formatUnitValue(item.achievedValue, goal.unitType, goal.unitLabel)}
                        </span>{' '}
                        <span className="text-[#94A3B8]">/</span>{' '}
                        {formatUnitValue(item.targetValue, goal.unitType, goal.unitLabel)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.status === 'meta_atingida'
                            ? 'bg-sky-500'
                            : item.status === 'no_ritmo'
                            ? 'bg-emerald-500'
                            : item.status === 'atencao'
                            ? 'bg-amber-400'
                            : item.status === 'em_risco'
                            ? 'bg-orange-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, item.percentageAchieved)}%` }}
                      />
                    </div>

                    {/* Sub progress metrics */}
                    <div className="flex items-center justify-between text-[11px] mt-1.5">
                      <span className="font-bold text-[#1E293B]">
                        {formatPercent(item.percentageAchieved)} atingido
                      </span>
                      <span className="text-[#64748B]">
                        Falta: {formatUnitValue(item.remainingValue, goal.unitType, goal.unitLabel)}
                      </span>
                    </div>
                  </div>

                  {/* Calculations Details */}
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-2.5 text-[11px] space-y-1">
                    <div className="flex justify-between text-[#64748B]">
                      <span>Ritmo Necessário:</span>
                      <span className="font-semibold text-[#1E293B]">
                        {formatUnitValue(item.requiredDailyAverage, goal.unitType, goal.unitLabel)}/dia
                      </span>
                    </div>
                    <div className="flex justify-between text-[#64748B]">
                      <span>Projeção Final:</span>
                      <span
                        className={`font-semibold ${
                          item.isProjectedAboveTarget ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {formatUnitValue(item.projectedFinalValue, goal.unitType, goal.unitLabel)} (
                        {formatPercent(item.projectedPercentage)})
                      </span>
                    </div>
                    <div className="flex justify-between text-[#64748B]">
                      <span>Prazo Restante:</span>
                      <span className="font-medium text-[#1E293B]">
                        {item.daysRemaining} {item.daysRemaining === 1 ? 'dia' : 'dias'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] gap-2">
                    <button
                      onClick={() => onOpenQuickResultModal(goal)}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0284C7] text-xs font-bold transition-colors text-center cursor-pointer"
                    >
                      + Resultado
                    </button>

                    {item.isAtRisk && (
                      <button
                        onClick={() => onOpenNewActionPlan(goal.id)}
                        className="py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold transition-colors cursor-pointer"
                        title="Criar Plano de Ação"
                      >
                        Plano de Ação
                      </button>
                    )}

                    <button
                      onClick={() => onOpenEditGoalModal(goal)}
                      className="py-1.5 px-2 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#1E293B] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Section: Active Alerts & Active Action Plans */}
      {hasGoals && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Alerts Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#0284C7]" />
                <h3 className="text-sm font-bold text-[#1E293B]">
                  Alertas em Destaque
                </h3>
              </div>
              <button
                onClick={() => onNavigateToView('alerts')}
                className="text-xs text-[#0284C7] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                Ver todos <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {alerts.length === 0 ? (
              <p className="text-xs text-[#64748B] py-4 text-center">
                Nenhum alerta crítico ativo no momento.
              </p>
            ) : (
              <div className="space-y-2">
                {alerts.slice(0, 3).map((al) => (
                  <div
                    key={al.id}
                    className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-2.5 text-xs"
                  >
                    <span className="text-sm">
                      {al.severity === 'danger'
                        ? '🔴'
                        : al.severity === 'warning'
                        ? '🟡'
                        : al.severity === 'success'
                        ? '🟢'
                        : '🔵'}
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-[#1E293B]">{al.title}</div>
                      <div className="text-[#64748B] text-[11px] mt-0.5">
                        {al.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Plans Preview */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-[#1E293B]">
                  Planos de Ação Prioritários
                </h3>
              </div>
              <button
                onClick={() => onNavigateToView('action_plans')}
                className="text-xs text-[#0284C7] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                Gerenciar <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {actionPlans.length === 0 ? (
              <p className="text-xs text-[#64748B] py-4 text-center">
                Nenhum plano de ação pendente.
              </p>
            ) : (
              <div className="space-y-2">
                {actionPlans
                  .filter((p) => p.status !== 'concluido' && p.status !== 'cancelado')
                  .slice(0, 3)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-bold text-[#1E293B] block">{p.title}</span>
                        <span className="text-[11px] text-[#64748B]">
                          Resp: {p.responsibleName} • Prazo: {p.deadline}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 capitalize">
                        {p.priority}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
