import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Copy,
  Edit2,
  Trash2,
  TrendingUp,
  Tag,
  Clock,
  User,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { CalculatedGoalMetrics, Employee, Goal, GoalCategory, Periodicity } from '../types';
import { getStatusDetails } from '../utils/calculations';
import {
  formatDateBR,
  formatPercent,
  formatUnitValue,
  getPeriodicityLabel,
} from '../utils/formatters';
import { EmptyState } from '../components/EmptyState';

interface GoalsViewProps {
  calculatedGoals: CalculatedGoalMetrics[];
  categories: string[];
  employees: Employee[];
  onOpenNewGoalModal: () => void;
  onOpenEditGoalModal: (goal: Goal) => void;
  onOpenQuickResultModal: (goal: Goal) => void;
  onDuplicateGoal: (goal: Goal) => void;
  onDeleteGoalPrompt: (goal: Goal) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  calculatedGoals,
  categories,
  employees,
  onOpenNewGoalModal,
  onOpenEditGoalModal,
  onOpenQuickResultModal,
  onDuplicateGoal,
  onDeleteGoalPrompt,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedPeriodicity, setSelectedPeriodicity] = useState<string>('todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'name' | 'percentage' | 'target' | 'date'>('date');

  // Filtered goals
  const filteredGoals = calculatedGoals.filter((item) => {
    const { goal } = item;
    const matchesSearch =
      goal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (goal.responsibleName && goal.responsibleName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (goal.notes && goal.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'todas' || goal.category === selectedCategory;
    const matchesPeriod = selectedPeriodicity === 'todas' || goal.periodicity === selectedPeriodicity;
    const matchesStatus = selectedStatus === 'todos' || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesPeriod && matchesStatus;
  });

  // Sort
  filteredGoals.sort((a, b) => {
    if (sortBy === 'percentage') return b.percentageAchieved - a.percentageAchieved;
    if (sortBy === 'target') return b.targetValue - a.targetValue;
    if (sortBy === 'name') return a.goal.name.localeCompare(b.goal.name);
    return new Date(b.goal.createdAt).getTime() - new Date(a.goal.createdAt).getTime();
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Main Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight">
            Gestão Completa de Metas
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Cadastre, edite, duplique e acompanhe o ritmo operacional da Facility Bombas
          </p>
        </div>

        <button
          onClick={onOpenNewGoalModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-sm shadow-xs active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar Nova Meta</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar meta por nome, responsável ou anotação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl pl-9 pr-4 py-2 text-xs text-[#1E293B] placeholder-[#94A3B8] focus:border-[#0284C7] focus:outline-none"
            />
          </div>

          {/* View toggle (Grid / Table) */}
          <div className="flex items-center gap-1 bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl p-1 self-end md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#0284C7] shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
              title="Visualização em Cartões"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grade</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#0284C7] shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
              title="Visualização em Tabela"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Tabela</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#E2E8F0] text-xs">
          {/* Categoria */}
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">
              Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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

          {/* Periodicidade */}
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">
              Periodicidade
            </label>
            <select
              value={selectedPeriodicity}
              onChange={(e) => setSelectedPeriodicity(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-2.5 py-1.5 text-xs text-[#1E293B] focus:border-[#0284C7] cursor-pointer"
            >
              <option value="todas">Todas</option>
              <option value="diaria">Diária</option>
              <option value="semanal">Semanal</option>
              <option value="mensal">Mensal</option>
              <option value="trimestral">Trimestral</option>
              <option value="anual">Anual</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
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

          {/* Ordenação */}
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">
              Ordenar Por
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-2.5 py-1.5 text-xs text-[#1E293B] focus:border-[#0284C7] cursor-pointer"
            >
              <option value="date">Mais recentes</option>
              <option value="percentage">% Conclusão (Maior)</option>
              <option value="target">Valor Alvo (Maior)</option>
              <option value="name">Nome (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Listing */}
      {calculatedGoals.length === 0 ? (
        <EmptyState
          title="Nenhuma meta cadastrada"
          description="Cadastre sua primeira meta para começar a acompanhar os resultados da empresa e visualizar os indicadores operacionais."
          actionLabel="+ Cadastrar primeira meta"
          onAction={onOpenNewGoalModal}
        />
      ) : filteredGoals.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-10 text-center text-[#64748B] text-xs">
          Nenhuma meta encontrada para os filtros selecionados. Tente ajustar os termos da busca.
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGoals.map((item) => {
            const { goal } = item;
            const statusInfo = getStatusDetails(item.status);

            return (
              <div
                key={goal.id}
                className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-4 transition-all group"
              >
                {/* Header info */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                      {goal.category} • {getPeriodicityLabel(goal.periodicity)}
                    </span>
                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.badgeClass}`}
                    >
                      <span>{statusInfo.icon}</span>
                      <span>{statusInfo.label}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#1E293B] group-hover:text-[#0284C7] transition-colors leading-tight">
                    {goal.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#64748B] mt-1.5">
                    {goal.responsibleName && (
                      <span className="flex items-center gap-1 text-[#0284C7] font-medium">
                        <User className="w-3 h-3" />
                        {goal.responsibleName}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Até {formatDateBR(goal.endDate)} ({item.daysRemaining}d)
                    </span>
                  </div>
                </div>

                {/* Progress Visual */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-[#64748B]">Realizado / Alvo:</span>
                    <span className="font-bold text-[#1E293B] text-sm">
                      <span className="text-[#0284C7]">
                        {formatUnitValue(item.achievedValue, goal.unitType, goal.unitLabel)}
                      </span>{' '}
                      / {formatUnitValue(item.targetValue, goal.unitType, goal.unitLabel)}
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
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

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#0284C7]">
                      {formatPercent(item.percentageAchieved)} concluído
                    </span>
                    <span className="text-[#64748B]">
                      Falta: {formatUnitValue(item.remainingValue, goal.unitType, goal.unitLabel)}
                    </span>
                  </div>
                </div>

                {/* KPI stats */}
                <div className="grid grid-cols-2 gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-2.5 text-[11px]">
                  <div>
                    <span className="text-[#64748B] block text-[10px]">Ritmo Necessário:</span>
                    <span className="font-semibold text-[#1E293B]">
                      {formatUnitValue(item.requiredDailyAverage, goal.unitType, goal.unitLabel)}/dia
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px]">Projeção Final:</span>
                    <span
                      className={`font-semibold ${
                        item.isProjectedAboveTarget ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {formatUnitValue(item.projectedFinalValue, goal.unitType, goal.unitLabel)}
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] gap-1.5">
                  <button
                    onClick={() => onOpenQuickResultModal(goal)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0284C7] text-xs font-bold transition-colors text-center cursor-pointer flex items-center justify-center gap-1"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+ Lançar</span>
                  </button>

                  <button
                    onClick={() => onOpenEditGoalModal(goal)}
                    title="Editar Meta"
                    className="p-1.5 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#1E293B] transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDuplicateGoal(goal)}
                    title="Duplicar Meta"
                    className="p-1.5 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#0284C7] transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteGoalPrompt(goal)}
                    title="Excluir Meta"
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Meta / Detalhes</th>
                  <th className="py-3 px-3">Categoria</th>
                  <th className="py-3 px-3">Período</th>
                  <th className="py-3 px-3">Alvo</th>
                  <th className="py-3 px-3">Realizado</th>
                  <th className="py-3 px-3">% Atingido</th>
                  <th className="py-3 px-3">Ritmo / Projeção</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredGoals.map((item) => {
                  const { goal } = item;
                  const statusInfo = getStatusDetails(item.status);

                  return (
                    <tr key={goal.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#1E293B]">{goal.name}</div>
                        {goal.responsibleName && (
                          <div className="text-[11px] text-[#0284C7] font-medium">
                            Resp: {goal.responsibleName}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-[#64748B]">{goal.category}</td>
                      <td className="py-3 px-3 text-[#64748B]">
                        {getPeriodicityLabel(goal.periodicity)}
                        <span className="block text-[10px] text-[#94A3B8]">
                          {formatDateBR(goal.endDate)}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#1E293B]">
                        {formatUnitValue(item.targetValue, goal.unitType, goal.unitLabel)}
                      </td>
                      <td className="py-3 px-3 font-bold text-[#0284C7]">
                        {formatUnitValue(item.achievedValue, goal.unitType, goal.unitLabel)}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-extrabold text-[#0284C7]">
                          {formatPercent(item.percentageAchieved)}
                        </div>
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-[#0284C7] rounded-full"
                            style={{ width: `${Math.min(100, item.percentageAchieved)}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-[#1E293B] font-medium">
                          {formatUnitValue(item.requiredDailyAverage, goal.unitType, goal.unitLabel)}/dia
                        </div>
                        <div
                          className={`text-[10px] ${
                            item.isProjectedAboveTarget ? 'text-emerald-600' : 'text-amber-600'
                          }`}
                        >
                          Proj: {formatUnitValue(item.projectedFinalValue, goal.unitType, goal.unitLabel)}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.badgeClass}`}
                        >
                          <span>{statusInfo.icon}</span>
                          <span>{statusInfo.label}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1 justify-end">
                          <button
                            onClick={() => onOpenQuickResultModal(goal)}
                            className="px-2 py-1 rounded bg-sky-50 text-[#0284C7] hover:bg-sky-100 text-[11px] font-bold cursor-pointer"
                          >
                            + Lançar
                          </button>
                          <button
                            onClick={() => onOpenEditGoalModal(goal)}
                            className="p-1 text-[#64748B] hover:text-[#1E293B] rounded hover:bg-[#F1F5F9] cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDuplicateGoal(goal)}
                            className="p-1 text-[#64748B] hover:text-[#0284C7] rounded hover:bg-[#F1F5F9] cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteGoalPrompt(goal)}
                            className="p-1 text-rose-600 hover:text-rose-700 rounded hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
