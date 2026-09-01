import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Trophy,
  Award,
  Medal,
  Flame,
  TrendingUp,
  Star,
  Edit2,
  Trash2,
  Target,
  ShieldAlert,
} from 'lucide-react';
import { Employee, CalculatedGoalMetrics, Goal } from '../types';
import { formatCurrency, formatPercent, formatUnitValue } from '../utils/formatters';
import { EmptyState } from '../components/EmptyState';

interface EmployeesViewProps {
  employees: Employee[];
  calculatedGoals: CalculatedGoalMetrics[];
  onOpenNewEmployeeModal: () => void;
  onOpenEditEmployeeModal: (emp: Employee) => void;
  onDeleteEmployeePrompt: (emp: Employee) => void;
  onOpenNewGoalForEmployee: (empId: string) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  calculatedGoals,
  onOpenNewEmployeeModal,
  onOpenEditEmployeeModal,
  onDeleteEmployeePrompt,
  onOpenNewGoalForEmployee,
}) => {
  // Aggregate individual performance for each employee
  const employeePerformance = employees.map((emp) => {
    const empGoals = calculatedGoals.filter(
      (cg) => cg.goal.responsibleEmployeeId === emp.id
    );

    const totalTarget = empGoals.reduce((acc, g) => acc + g.targetValue, 0);
    const totalAchieved = empGoals.reduce((acc, g) => acc + g.achievedValue, 0);
    const percentage = totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0;
    const goalsCount = empGoals.length;
    const achievedCount = empGoals.filter((g) => g.isAchieved).length;

    // Badges / Achievements
    const badges: Array<{ label: string; icon: string; desc: string }> = [];

    if (achievedCount > 0) {
      badges.push({
        label: 'Meta Atingida',
        icon: '🎯',
        desc: `${achievedCount} meta(s) concluída(s)`,
      });
    }
    if (percentage >= 110) {
      badges.push({
        label: 'Meta Superada',
        icon: '🚀',
        desc: `${formatPercent(percentage)} de entrega`,
      });
    }
    if (goalsCount >= 3 && percentage >= 90) {
      badges.push({
        label: 'Sequência de Excelência',
        icon: '🔥',
        desc: 'Múltiplas metas com alto desempenho',
      });
    }

    return {
      employee: emp,
      goals: empGoals,
      totalTarget,
      totalAchieved,
      remaining: Math.max(0, totalTarget - totalAchieved),
      percentage,
      goalsCount,
      achievedCount,
      badges,
    };
  });

  // Sort by percentage descending for ranking
  employeePerformance.sort((a, b) => {
    if (b.totalTarget === 0 && a.totalTarget === 0) return 0;
    return b.percentage - a.percentage;
  });

  // Top 3 for podium
  const top1 = employeePerformance[0];
  const top2 = employeePerformance[1];
  const top3 = employeePerformance[2];

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Confidentiality Notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight flex items-center gap-2.5">
              <Users className="w-6 h-6 text-[#0284C7]" />
              <span>Metas Individuais & Equipe</span>
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Confidencial Administrativo
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Acompanhamento individual de desempenho, ranking corporativo e conquistas de metas
          </p>
        </div>

        <button
          onClick={onOpenNewEmployeeModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar Colaborador</span>
        </button>
      </div>

      {/* Gamification Ranking Podium (Section 17) */}
      {employeePerformance.length > 0 && employeePerformance.some((ep) => ep.goalsCount > 0) && (
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-[#0284C7]" />
            <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
              Ranking de Desempenho do Período
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end max-w-4xl mx-auto">
            {/* 2º Lugar */}
            {top2 && (
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 text-center flex flex-col items-center order-2 md:order-1">
                <div className="text-2xl mb-1">🥈</div>
                <div className="text-xs font-bold text-slate-500">2º Lugar</div>
                <div className="font-extrabold text-[#1E293B] text-base mt-1 truncate max-w-[180px]">
                  {top2.employee.name}
                </div>
                <div className="text-[11px] text-[#64748B]">{top2.employee.role}</div>
                <div className="mt-3 px-3 py-1 rounded-full bg-slate-200 text-[#1E293B] font-black text-sm border border-slate-300">
                  {formatPercent(top2.percentage)} da meta
                </div>
              </div>
            )}

            {/* 1º Lugar (Center / Champion) */}
            {top1 && (
              <div className="bg-gradient-to-b from-sky-50 to-white border-2 border-[#0284C7] rounded-3xl p-6 text-center flex flex-col items-center shadow-md order-1 md:order-2 scale-105">
                <div className="text-4xl mb-1 animate-bounce">🥇</div>
                <div className="text-xs font-extrabold text-[#0284C7] uppercase tracking-wider">
                  1º Lugar — Destaque
                </div>
                <div className="font-black text-[#1E293B] text-lg mt-1 truncate max-w-[200px]">
                  {top1.employee.name}
                </div>
                <div className="text-xs text-[#0284C7] font-medium">{top1.employee.role}</div>
                <div className="mt-4 px-4 py-1.5 rounded-full bg-[#0284C7] text-white font-extrabold text-base shadow-xs">
                  {formatPercent(top1.percentage)} da meta
                </div>
              </div>
            )}

            {/* 3º Lugar */}
            {top3 && (
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 text-center flex flex-col items-center order-3">
                <div className="text-2xl mb-1">🥉</div>
                <div className="text-xs font-bold text-amber-600">3º Lugar</div>
                <div className="font-extrabold text-[#1E293B] text-base mt-1 truncate max-w-[180px]">
                  {top3.employee.name}
                </div>
                <div className="text-[11px] text-[#64748B]">{top3.employee.role}</div>
                <div className="mt-3 px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-black text-sm border border-amber-200">
                  {formatPercent(top3.percentage)} da meta
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Employees Table / Cards (Section 16) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[#1E293B] tracking-tight">
            Colaboradores Cadastrados ({employees.length})
          </h2>
        </div>

        {employees.length === 0 ? (
          <EmptyState
            title="Nenhum colaborador cadastrado"
            description="Cadastre os membros da equipe de vendas e técnica para vincular metas individuais e acompanhar o ranking corporativo."
            actionLabel="+ Cadastrar Colaborador"
            onAction={onOpenNewEmployeeModal}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {employeePerformance.map((item, index) => {
              const { employee, goals, totalTarget, totalAchieved, remaining, percentage, badges } = item;

              return (
                <div
                  key={employee.id}
                  className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-2xl p-5 shadow-xs space-y-4 transition-all"
                >
                  {/* Top: Name, Ranking pill & Actions */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-extrabold text-base shadow-xs flex-shrink-0"
                        style={{ backgroundColor: employee.avatarColor || '#0284C7' }}
                      >
                        {employee.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-[#1E293B] text-base leading-tight">
                            {employee.name}
                          </h3>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F1F5F9] text-[#0284C7] border border-[#CBD5E1]">
                            #{index + 1}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B]">
                          {employee.role} • {employee.department}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenEditEmployeeModal(employee)}
                        className="p-1.5 text-[#64748B] hover:text-[#1E293B] rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                        title="Editar Perfil"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteEmployeePrompt(employee)}
                        className="p-1.5 text-rose-600 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Excluir Colaborador"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Badges and Gamification Conquistas */}
                  {badges.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {badges.map((b, bIdx) => (
                        <div
                          key={bIdx}
                          title={b.desc}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-[#0284C7] border border-sky-200"
                        >
                          <span>{b.icon}</span>
                          <span>{b.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Goal numbers summary */}
                  {totalTarget > 0 ? (
                    <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="text-[#64748B]">Desempenho Geral:</span>
                        <span className="font-extrabold text-[#1E293B] text-sm">
                          <span className="text-[#0284C7]">{formatCurrency(totalAchieved)}</span> /{' '}
                          {formatCurrency(totalTarget)}
                        </span>
                      </div>

                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0284C7] rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, percentage)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                        <span className="font-bold text-[#0284C7]">
                          {formatPercent(percentage)} atingido
                        </span>
                        <span>Falta: {formatCurrency(remaining)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 text-[11px] text-[#64748B] italic text-center bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      Nenhuma meta atribuída a este colaborador no momento.
                    </div>
                  )}

                  {/* Footer Action */}
                  <div className="pt-2 flex items-center justify-between border-t border-[#E2E8F0] text-xs">
                    <span className="text-[#64748B] text-[11px]">
                      {goals.length} {goals.length === 1 ? 'meta vinculada' : 'metas vinculadas'}
                    </span>
                    <button
                      onClick={() => onOpenNewGoalForEmployee(employee.id)}
                      className="px-3 py-1 rounded-lg bg-sky-50 text-[#0284C7] hover:bg-sky-100 font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      + Atribuir Nova Meta
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
