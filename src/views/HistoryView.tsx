import React, { useState } from 'react';
import { History, Calendar, TrendingUp, Filter, CheckCircle2, XCircle } from 'lucide-react';
import { CalculatedGoalMetrics, Goal } from '../types';
import { formatCurrency, formatPercent, formatDateBR, MONTH_NAMES_PT } from '../utils/formatters';
import { EmptyState } from '../components/EmptyState';

interface HistoryViewProps {
  goals: Goal[];
  calculatedGoals: CalculatedGoalMetrics[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ goals, calculatedGoals }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // Group goals by month/period
  const monthlyHistory: Array<{
    monthName: string;
    monthNumber: number;
    year: number;
    goals: CalculatedGoalMetrics[];
    totalTarget: number;
    totalAchieved: number;
    percentage: number;
  }> = [];

  for (let m = 1; m <= 12; m++) {
    const monthGoals = calculatedGoals.filter(
      (cg) => (cg.goal.month === m || (cg.goal.startDate && new Date(cg.goal.startDate).getMonth() + 1 === m)) &&
              (cg.goal.year === selectedYear || (cg.goal.startDate && new Date(cg.goal.startDate).getFullYear() === selectedYear))
    );

    const totalTarget = monthGoals.reduce((acc, g) => acc + g.targetValue, 0);
    const totalAchieved = monthGoals.reduce((acc, g) => acc + g.achievedValue, 0);
    const percentage = totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0;

    monthlyHistory.push({
      monthName: MONTH_NAMES_PT[m - 1],
      monthNumber: m,
      year: selectedYear,
      goals: monthGoals,
      totalTarget,
      totalAchieved,
      percentage,
    });
  }

  const activeMonths = monthlyHistory.filter((mh) => mh.goals.length > 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-[#0284C7]" />
            <span>Histórico & Comparativo de Ciclos</span>
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Acompanhe o fechamento de meses anteriores e o comparativo anual da Facility Bombas
          </p>
        </div>

        {/* Year Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#0284C7]" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-white border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs text-[#1E293B] focus:border-[#0284C7] cursor-pointer shadow-xs"
          >
            {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map((y) => (
              <option key={y} value={y}>
                Ano {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeMonths.length === 0 ? (
        <EmptyState
          title={`Nenhum histórico registrado para ${selectedYear}`}
          description="As metas cadastradas e seus respectivos fechamentos mensais serão consolidados aqui para auditoria e relatórios."
        />
      ) : (
        <div className="space-y-6">
          {activeMonths.map((mh) => (
            <div
              key={mh.monthNumber}
              className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-sky-50 text-[#0284C7] font-black text-sm border border-sky-100">
                    {mh.monthName.substring(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-[#1E293B]">
                      {mh.monthName} de {mh.year}
                    </h2>
                    <span className="text-xs text-[#64748B]">
                      {mh.goals.length} {mh.goals.length === 1 ? 'meta avaliada' : 'metas avaliadas'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-[#64748B] block text-[10px]">Alvo Total:</span>
                    <span className="font-bold text-[#1E293B]">{formatCurrency(mh.totalTarget)}</span>
                  </div>
                  <div>
                    <span className="text-[#0284C7] block text-[10px]">Realizado Total:</span>
                    <span className="font-extrabold text-[#0284C7]">
                      {formatCurrency(mh.totalAchieved)}
                    </span>
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-black border border-emerald-200">
                    {formatPercent(mh.percentage)}
                  </div>
                </div>
              </div>

              {/* Goals list in this month */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {mh.goals.map((cg) => (
                  <div
                    key={cg.goal.id}
                    className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-bold text-[#1E293B] truncate">{cg.goal.name}</span>
                      {cg.isAchieved ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex justify-between text-[#64748B]">
                      <span>Realizado:</span>
                      <span className="font-semibold text-[#0284C7]">
                        {formatCurrency(cg.achievedValue)} / {formatCurrency(cg.targetValue)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#64748B]">Conclusão:</span>
                      <span className="font-bold text-emerald-600">
                        {formatPercent(cg.percentageAchieved)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
