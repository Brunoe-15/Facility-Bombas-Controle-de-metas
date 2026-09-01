import React, { useRef, useState } from 'react';
import {
  ArrowUpDown,
  Download,
  Upload,
  FileSpreadsheet,
  FileJson,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { Goal, Employee, ActionPlan } from '../types';
import { StorageService } from '../utils/storage';

interface ImportExportViewProps {
  goals: Goal[];
  employees: Employee[];
  actionPlans: ActionPlan[];
  onDataReload: () => void;
}

export const ImportExportView: React.FC<ImportExportViewProps> = ({
  goals,
  employees,
  actionPlans,
  onDataReload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // 1. Export JSON Backup
  const handleExportJSON = () => {
    const jsonStr = StorageService.exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facility_bombas_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 2. Export Goals to CSV
  const handleExportCSV = () => {
    const headers = [
      'Nome da Meta',
      'Categoria',
      'Periodicidade',
      'Valor Alvo',
      'Valor Realizado',
      'Unidade',
      'Responsável',
      'Data Início',
      'Data Fim',
      'Status',
      'Ano',
      'Mês',
    ];

    const rows = goals.map((g) => [
      `"${g.name.replace(/"/g, '""')}"`,
      `"${g.category}"`,
      `"${g.periodicity}"`,
      g.targetValue,
      g.achievedValue,
      `"${g.unitType}"`,
      `"${g.responsibleName || ''}"`,
      g.startDate,
      g.endDate,
      `"${g.status}"`,
      g.year,
      g.month || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `facility_bombas_metas_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Import JSON Backup File
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const success = StorageService.importBackupJSON(content);
        if (success) {
          setImportStatus({
            type: 'success',
            message: 'Backup restaurado com sucesso no sistema!',
          });
          onDataReload();
        } else {
          setImportStatus({
            type: 'error',
            message: 'Formato de arquivo inválido. Verifique o JSON de backup.',
          });
        }
      } catch (err) {
        setImportStatus({
          type: 'error',
          message: 'Erro ao processar o arquivo de importação.',
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight flex items-center gap-2.5">
          <ArrowUpDown className="w-6 h-6 text-[#0284C7]" />
          <span>Importação e Exportação de Dados</span>
        </h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Faça backup completo, exporte relatórios em planilhas CSV/Excel ou restaure dados
        </p>
      </div>

      {importStatus.type && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-semibold ${
            importStatus.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}
        >
          {importStatus.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          <span>{importStatus.message}</span>
        </div>
      )}

      {/* Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export JSON Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-[#0284C7] flex items-center justify-center">
              <FileJson className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-[#1E293B]">
              Exportar Backup Completo (JSON)
            </h2>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Gera um arquivo de segurança contendo todas as metas cadastradas, histórico de
              lançamentos diários, colaboradores e planos de ação 5W2H.
            </p>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0]">
            <button
              onClick={handleExportJSON}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Backup JSON</span>
            </button>
          </div>
        </div>

        {/* Export CSV Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-[#1E293B]">
              Exportar para Planilha Excel (CSV)
            </h2>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Exporta a lista completa de metas, alvos, faturamento realizado e porcentagens para
              abrir diretamente no Microsoft Excel, Google Planilhas ou LibreOffice.
            </p>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0]">
            <button
              onClick={handleExportCSV}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Planilha CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-50 text-[#0284C7] border border-sky-100">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1E293B]">
              Restaurar Backup do Sistema
            </h2>
            <p className="text-xs text-[#64748B]">
              Selecione um arquivo de backup (.json) exportado anteriormente para recuperar dados
            </p>
          </div>
        </div>

        <div className="p-6 border-2 border-dashed border-[#CBD5E1] hover:border-[#0284C7] rounded-2xl text-center space-y-3 transition-colors bg-[#F8FAFC]">
          <Upload className="w-8 h-8 text-[#94A3B8] mx-auto" />
          <div>
            <p className="text-xs font-semibold text-[#1E293B]">
              Clique no botão abaixo para selecionar o arquivo de backup
            </p>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              Somente arquivos com extensão .json válidos
            </p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2 rounded-xl bg-sky-50 border border-sky-200 text-[#0284C7] hover:bg-sky-100 font-bold text-xs transition-colors cursor-pointer"
          >
            Selecionar Arquivo JSON
          </button>
        </div>
      </div>
    </div>
  );
};
