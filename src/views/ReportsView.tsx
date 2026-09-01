import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Calendar,
  Layers,
  Users,
  AlertOctagon,
  CheckCircle2,
} from 'lucide-react';
import { CalculatedGoalMetrics, Employee, ActionPlan } from '../types';
import { AggregatedDashboardMetrics } from '../utils/calculations';
import { formatCurrency, formatPercent, formatDateBR, MONTH_NAMES_PT } from '../utils/formatters';
import { FacilityLogo } from '../components/FacilityLogo';

interface ReportsViewProps {
  calculatedGoals: CalculatedGoalMetrics[];
  summary: AggregatedDashboardMetrics;
  employees: Employee[];
  actionPlans: ActionPlan[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  calculatedGoals,
  summary,
  employees,
  actionPlans,
}) => {
  const [reportType, setReportType] = useState<'executivo' | 'mensal' | 'funcionarios' | 'riscos'>(
    'executivo'
  );

  const today = new Date();
  const currentMonth = MONTH_NAMES_PT[today.getMonth()];
  const currentYear = today.getFullYear();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-[#0284C7]" />
            <span>Relatórios Administrativos Oficiais</span>
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Gere relatórios executivos formatados para reuniões de diretoria e auditoria interna
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Salvar PDF</span>
          </button>
        </div>
      </div>

      {/* Report Selector Pills */}
      <div className="flex flex-wrap gap-2 no-print">
        <button
          onClick={() => setReportType('executivo')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
            reportType === 'executivo'
              ? 'bg-[#0284C7] text-white border-[#0284C7]'
              : 'bg-white text-[#64748B] border-[#CBD5E1] hover:text-[#1E293B]'
          }`}
        >
          Relatório Executivo Geral
        </button>
        <button
          onClick={() => setReportType('mensal')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
            reportType === 'mensal'
              ? 'bg-[#0284C7] text-white border-[#0284C7]'
              : 'bg-white text-[#64748B] border-[#CBD5E1] hover:text-[#1E293B]'
          }`}
        >
          Relatório Mensal de Metas
        </button>
        <button
          onClick={() => setReportType('funcionarios')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
            reportType === 'funcionarios'
              ? 'bg-[#0284C7] text-white border-[#0284C7]'
              : 'bg-white text-[#64748B] border-[#CBD5E1] hover:text-[#1E293B]'
          }`}
        >
          Desempenho por Colaborador
        </button>
        <button
          onClick={() => setReportType('riscos')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
            reportType === 'riscos'
              ? 'bg-[#0284C7] text-white border-[#0284C7]'
              : 'bg-white text-[#64748B] border-[#CBD5E1] hover:text-[#1E293B]'
          }`}
        >
          Metas em Risco & Planos 5W2H
        </button>
      </div>

      {/* Printable Document Paper Layout */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-10 shadow-xs text-[#1E293B] space-y-8 print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
        {/* Document Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-6 print:border-black/20">
          <div className="flex items-center gap-3">
            <FacilityLogo size={48} />
            <div>
              <h2 className="text-xl font-black text-[#1E293B] print:text-black leading-tight">
                Facility Bombas
              </h2>
              <p className="text-xs text-[#0284C7] print:text-sky-800 font-semibold">
                Relatório de Gestão Estratégica e Controle de Metas
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-[#64748B] print:text-black/70">
            <div>Data de Emissão: {formatDateBR(today.toISOString().split('T')[0])}</div>
            <div>Competência: {currentMonth} de {currentYear}</div>
            <div className="text-[10px] text-[#0284C7] print:text-sky-800 font-bold uppercase mt-1">
              Confidencial — Uso Interno
            </div>
          </div>
        </div>

        {/* Executive Summary Block */}
        {reportType === 'executivo' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0284C7] print:text-sky-800 mb-3">
                1. Síntese Executiva de Desempenho
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] print:border-black/20">
                  <span className="text-[10px] font-bold text-[#64748B] print:text-black/70 uppercase">
                    Meta Total
                  </span>
                  <div className="text-lg font-black text-[#1E293B] print:text-black mt-1">
                    {formatCurrency(summary.financialTarget)}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] print:border-black/20">
                  <span className="text-[10px] font-bold text-[#64748B] print:text-black/70 uppercase">
                    Realizado Total
                  </span>
                  <div className="text-lg font-black text-[#0284C7] print:text-sky-800 mt-1">
                    {formatCurrency(summary.financialAchieved)}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] print:border-black/20">
                  <span className="text-[10px] font-bold text-[#64748B] print:text-black/70 uppercase">
                    Atingimento
                  </span>
                  <div className="text-lg font-black text-emerald-600 print:text-emerald-700 mt-1">
                    {formatPercent(summary.overallPercentage)}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] print:border-black/20">
                  <span className="text-[10px] font-bold text-[#64748B] print:text-black/70 uppercase">
                    Projeção
                  </span>
                  <div className="text-lg font-black text-[#1E293B] print:text-black mt-1">
                    {formatCurrency(summary.overallProjectedValue)}
                  </div>
                </div>
              </div>
            </div>

            {/* Goals List Table */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0284C7] print:text-sky-800 mb-3">
                2. Detalhamento dos Objetivos em Andamento
              </h3>
              <table className="w-full text-left text-xs border border-[#E2E8F0] print:border-black/20">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] print:text-black uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-2.5">Meta</th>
                    <th className="p-2.5">Categoria</th>
                    <th className="p-2.5">Alvo</th>
                    <th className="p-2.5">Realizado</th>
                    <th className="p-2.5">% Atingido</th>
                    <th className="p-2.5">Ritmo / Dia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] print:divide-black/20">
                  {calculatedGoals.map((cg) => (
                    <tr key={cg.goal.id}>
                      <td className="p-2.5 font-bold text-[#1E293B] print:text-black">{cg.goal.name}</td>
                      <td className="p-2.5 text-[#64748B] print:text-black/70">{cg.goal.category}</td>
                      <td className="p-2.5 font-semibold text-[#1E293B]">{formatCurrency(cg.targetValue)}</td>
                      <td className="p-2.5 font-extrabold text-[#0284C7] print:text-sky-800">
                        {formatCurrency(cg.achievedValue)}
                      </td>
                      <td className="p-2.5 font-bold text-emerald-600 print:text-emerald-700">
                        {formatPercent(cg.percentageAchieved)}
                      </td>
                      <td className="p-2.5 text-[#1E293B]">{formatCurrency(cg.requiredDailyAverage)}/dia</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other report views can be toggled similarly */}
        {reportType === 'funcionarios' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0284C7] print:text-sky-800">
              Desempenho Individual por Colaborador
            </h3>
            <table className="w-full text-left text-xs border border-[#E2E8F0] print:border-black/20">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] print:text-black uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-2.5">Colaborador</th>
                  <th className="p-2.5">Departamento</th>
                  <th className="p-2.5">Metas Vinculadas</th>
                  <th className="p-2.5">Alvo Total</th>
                  <th className="p-2.5">Realizado Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] print:divide-black/20">
                {employees.map((emp) => {
                  const empGoals = calculatedGoals.filter((cg) => cg.goal.responsibleEmployeeId === emp.id);
                  const t = empGoals.reduce((acc, g) => acc + g.targetValue, 0);
                  const a = empGoals.reduce((acc, g) => acc + g.achievedValue, 0);

                  return (
                    <tr key={emp.id}>
                      <td className="p-2.5 font-bold text-[#1E293B] print:text-black">{emp.name}</td>
                      <td className="p-2.5 text-[#64748B] print:text-black/70">{emp.department}</td>
                      <td className="p-2.5 text-[#1E293B]">{empGoals.length}</td>
                      <td className="p-2.5 font-semibold text-[#1E293B]">{formatCurrency(t)}</td>
                      <td className="p-2.5 font-bold text-[#0284C7] print:text-sky-800">{formatCurrency(a)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'riscos' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 print:text-amber-800">
              Metas em Risco & Planos de Ação 5W2H
            </h3>
            <div className="space-y-3">
              {actionPlans.map((ap) => (
                <div
                  key={ap.id}
                  className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] print:border-black/20 space-y-1.5 text-xs"
                >
                  <div className="flex justify-between font-bold text-[#1E293B] print:text-black">
                    <span>{ap.title}</span>
                    <span className="uppercase text-[10px] text-amber-600 print:text-amber-800 font-bold">
                      {ap.priority} • {ap.status}
                    </span>
                  </div>
                  <div className="text-[#64748B] print:text-black/70">
                    <span className="font-semibold text-rose-600">Problema:</span> {ap.problemIdentified}
                  </div>
                  <div className="text-[#1E293B] print:text-black">
                    <span className="font-semibold text-[#0284C7]">Ação:</span> {ap.actionRequired}
                  </div>
                  <div className="text-[11px] text-[#64748B] print:text-black/60">
                    Responsável: {ap.responsibleName} • Prazo: {formatDateBR(ap.deadline)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Signature */}
        <div className="pt-10 border-t border-[#E2E8F0] print:border-black/20 flex justify-between items-end text-xs text-[#64748B] print:text-black/70">
          <div>
            <div>Facility Bombas — Sistema de Controle de Metas</div>
            <div>Relatório gerado automaticamente</div>
          </div>
          <div className="text-center">
            <div className="w-48 border-b border-[#CBD5E1] print:border-black mb-1" />
            <span>Assinatura da Diretoria</span>
          </div>
        </div>
      </div>
    </div>
  );
};
