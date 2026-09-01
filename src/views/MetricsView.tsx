import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Percent,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Target,
  Sparkles,
} from 'lucide-react';
import { CalculatedGoalMetrics } from '../types';
import { AggregatedDashboardMetrics } from '../utils/calculations';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { EmptyState } from '../components/EmptyState';

interface MetricsViewProps {
  calculatedGoals: CalculatedGoalMetrics[];
  summary: AggregatedDashboardMetrics;
  onOpenNewGoalModal: () => void;
}

export const MetricsView: React.FC<MetricsViewProps> = ({
  calculatedGoals,
  summary,
  onOpenNewGoalModal,
}) => {
  const hasData = calculatedGoals.length > 0;

  // Category breakdown metrics
  const categoryStats: Record<
    string,
    { target: number; achieved: number; count: number }
  > = {};

  calculatedGoals.forEach((cg) => {
    const cat = cg.goal.category || 'Outros';
    if (!categoryStats[cat]) {
      categoryStats[cat] = { target: 0, achieved: 0, count: 0 };
    }
    categoryStats[cat].target += cg.targetValue;
    categoryStats[cat].achieved += cg.achievedValue;
    categoryStats[cat].count += 1;
  });

  const categoriesList = Object.entries(categoryStats).map(([name, stats]) => ({
    name,
    target: stats.target,
    achieved: stats.achieved,
    count: stats.count,
    percent: stats.target > 0 ? (stats.achieved / stats.target) * 100 : 0,
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight flex items-center gap-2.5">
          <BarChart3 className="w-6 h-6 text-[#0284C7]" />
          <span>Métricas & Indicadores Administrativos</span>
        </h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Painel analítico detalhado com taxas de conversão, ritmos diários/semanais e projeções
        </p>
      </div>

      {!hasData ? (
        <EmptyState
          title="Sem dados para métricas"
          description="Cadastre as metas da Facility Bombas para gerar a análise estatística completa de desempenho operacional."
          actionLabel="+ Cadastrar Meta"
          onAction={onOpenNewGoalModal}
        />
      ) : (
        <>
          {/* Top Performance Highlights Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#64748B] uppercase">
                <span>Taxa Geral de Conversão</span>
                <Percent className="w-4 h-4 text-[#0284C7]" />
              </div>
              <div className="text-2xl font-black text-[#1E293B]">
                {formatPercent(summary.overallPercentage)}
              </div>
              <span className="text-[11px] text-[#64748B] block">
                Do total alvo estabelecido
              </span>
            </div>

            <div className="bg-white border border-sky-200 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#0284C7] uppercase">
                <span>Ritmo Diário Médio Necessário</span>
                <TrendingUp className="w-4 h-4 text-[#0284C7]" />
              </div>
              <div className="text-2xl font-black text-[#0284C7]">
                {formatCurrency(summary.overallRequiredDailyRate)}
              </div>
              <span className="text-[11px] text-[#64748B] block">
                Exigido por dia restante
              </span>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#64748B] uppercase">
                <span>Ritmo Semanal Estimado</span>
                <Calendar className="w-4 h-4 text-[#0284C7]" />
              </div>
              <div className="text-2xl font-black text-[#1E293B]">
                {formatCurrency(summary.overallRequiredDailyRate * 7)}
              </div>
              <span className="text-[11px] text-[#64748B] block">
                Volume necessário a cada 7 dias
              </span>
            </div>

            <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700 uppercase">
                <span>Projeção Final do Ciclo</span>
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-700">
                {formatCurrency(summary.overallProjectedValue)}
              </div>
              <span
                className={`text-[11px] font-semibold block ${
                  summary.isOverallProjectionAboveTarget ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {summary.isOverallProjectionAboveTarget
                  ? '🟢 Projeção Acima da Meta'
                  : '🔴 Projeção Abaixo da Meta'}
              </span>
            </div>
          </div>

          {/* Breakdown Table by Category */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-[#0284C7]" />
              <h2 className="text-base font-bold text-[#1E293B] tracking-tight">
                Desempenho Consolidado por Categoria
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#E2E8F0] text-[#64748B] uppercase text-[10px] font-bold tracking-wider bg-[#F8FAFC]">
                  <tr>
                    <th className="py-3 px-4">Categoria</th>
                    <th className="py-3 px-3 text-center">Metas</th>
                    <th className="py-3 px-3">Alvo Total</th>
                    <th className="py-3 px-3">Realizado</th>
                    <th className="py-3 px-3">Falta</th>
                    <th className="py-3 px-4">% Atingimento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {categoriesList.map((cat) => (
                    <tr key={cat.name} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#1E293B]">{cat.name}</td>
                      <td className="py-3.5 px-3 text-center font-semibold text-[#0284C7]">
                        {cat.count}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-[#1E293B]">
                        {formatCurrency(cat.target)}
                      </td>
                      <td className="py-3.5 px-3 font-extrabold text-[#0284C7]">
                        {formatCurrency(cat.achieved)}
                      </td>
                      <td className="py-3.5 px-3 text-[#64748B]">
                        {formatCurrency(Math.max(0, cat.target - cat.achieved))}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#0284C7] rounded-full"
                              style={{ width: `${Math.min(100, cat.percent)}%` }}
                            />
                          </div>
                          <span className="font-bold text-[#0284C7]">
                            {formatPercent(cat.percent)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
