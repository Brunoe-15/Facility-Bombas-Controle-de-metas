import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { LineChart as LineChartIcon, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { CalculatedGoalMetrics } from '../types';
import { formatCurrency, formatPercent, formatUnitValue } from '../utils/formatters';
import { EmptyState } from '../components/EmptyState';

interface ChartsViewProps {
  calculatedGoals: CalculatedGoalMetrics[];
  onOpenNewGoalModal: () => void;
}

const COLORS = ['#0284C7', '#0EA5E9', '#38BDF8', '#10B981', '#F59E0B', '#64748B', '#F43F5E'];

export const ChartsView: React.FC<ChartsViewProps> = ({ calculatedGoals, onOpenNewGoalModal }) => {
  const hasData = calculatedGoals.length > 0;

  // Chart 1: Meta x Realizado per goal
  const comparisonData = calculatedGoals.map((cg) => ({
    name: cg.goal.name.length > 18 ? cg.goal.name.substring(0, 18) + '...' : cg.goal.name,
    Meta: cg.targetValue,
    Realizado: cg.achievedValue,
    Projeção: cg.projectedFinalValue,
  }));

  // Chart 2: Category Breakdown
  const categoryMap: Record<string, { target: number; achieved: number }> = {};
  calculatedGoals.forEach((cg) => {
    const cat = cg.goal.category || 'Outros';
    if (!categoryMap[cat]) categoryMap[cat] = { target: 0, achieved: 0 };
    categoryMap[cat].target += cg.targetValue;
    categoryMap[cat].achieved += cg.achievedValue;
  });

  const categoryChartData = Object.entries(categoryMap).map(([name, data]) => ({
    name,
    value: data.achieved,
    target: data.target,
  }));

  // Chart 3: Simulated Daily Trajectory for the current month
  const daysInMonth = 30;
  const currentDay = Math.min(daysInMonth, new Date().getDate());
  const dailyTrajectoryData = [];
  
  const totalTarget = calculatedGoals.reduce((acc, g) => acc + g.targetValue, 0);
  const totalAchieved = calculatedGoals.reduce((acc, g) => acc + g.achievedValue, 0);
  const dailyIdealRate = totalTarget / daysInMonth;
  const actualDailyAvg = currentDay > 0 ? totalAchieved / currentDay : 0;

  for (let d = 1; d <= daysInMonth; d++) {
    dailyTrajectoryData.push({
      dia: `Dia ${d}`,
      MetaIdeal: Math.round(dailyIdealRate * d),
      RealizadoOuProjetado:
        d <= currentDay
          ? Math.round(actualDailyAvg * d)
          : Math.round(totalAchieved + actualDailyAvg * (d - currentDay)),
      tipo: d <= currentDay ? 'Realizado' : 'Projetado',
    });
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight flex items-center gap-2.5">
          <LineChartIcon className="w-6 h-6 text-[#0284C7]" />
          <span>Gráficos & Visualização de Desempenho</span>
        </h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Comparações visuais de Meta x Realizado, projeção linear e distribuição por categoria
        </p>
      </div>

      {!hasData ? (
        <EmptyState
          title="Sem dados para gerar gráficos"
          description="Cadastre as metas da empresa para visualizar automaticamente os gráficos de evolução e comparação."
          actionLabel="+ Cadastrar Meta"
          onAction={onOpenNewGoalModal}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Meta x Realizado (Bar Chart) */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
                Meta x Realizado por Objetivo
              </h2>
              <p className="text-xs text-[#64748B]">
                Comparativo direto entre valor alvo estabelecido e resultado atingido
              </p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.8} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickFormatter={(val) => `R$${val / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2E8F0',
                      borderRadius: '12px',
                      color: '#1E293B',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(val: any) => [formatCurrency(Number(val)), '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="Meta" fill="#94A3B8" radius={[4, 4, 0, 0]} opacity={0.6} />
                  <Bar dataKey="Realizado" fill="#0284C7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Trajetória e Projeção Diária (Area Chart) */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
                Evolução e Projeção Acumulada
              </h2>
              <p className="text-xs text-[#64748B]">
                Ritmo acumulado dia a dia comparado à linha de meta linear ideal
              </p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyTrajectoryData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorRealizado" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284C7" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.8} />
                  <XAxis dataKey="dia" stroke="#64748B" fontSize={10} tickLine={false} interval={4} />
                  <YAxis stroke="#64748B" fontSize={11} tickFormatter={(val) => `R$${val / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2E8F0',
                      borderRadius: '12px',
                      color: '#1E293B',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(val: any) => [formatCurrency(Number(val)), '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line
                    type="monotone"
                    dataKey="MetaIdeal"
                    stroke="#94A3B8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Linha Meta Ideal"
                  />
                  <Area
                    type="monotone"
                    dataKey="RealizadoOuProjetado"
                    stroke="#0284C7"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRealizado)"
                    name="Realizado / Projeção"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Desempenho por Categoria (Pie Chart) */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
                Distribuição de Realizado por Categoria
              </h2>
              <p className="text-xs text-[#64748B]">
                Participação de cada categoria no faturamento consolidado
              </p>
            </div>

            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2E8F0',
                      borderRadius: '12px',
                      color: '#1E293B',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(val: any) => [formatCurrency(Number(val)), 'Realizado']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Comparativo Projeção vs Meta */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
                Projeção de Fechamento por Objetivo
              </h2>
              <p className="text-xs text-[#64748B]">
                Estimativa final baseada no ritmo diário atual de entregas
              </p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.8} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickFormatter={(val) => `R$${val / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2E8F0',
                      borderRadius: '12px',
                      color: '#1E293B',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(val: any) => [formatCurrency(Number(val)), '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="Meta" fill="#94A3B8" radius={[4, 4, 0, 0]} opacity={0.5} />
                  <Bar dataKey="Projeção" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
