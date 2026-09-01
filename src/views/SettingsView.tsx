import React, { useState } from 'react';
import {
  Settings,
  Lock,
  Tag,
  Plus,
  Trash2,
  Database,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Goal, Employee, ActionPlan } from '../types';
import { StorageService } from '../utils/storage';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface SettingsViewProps {
  categories: string[];
  onAddCategory: (cat: string) => void;
  onRemoveCategory: (cat: string) => void;
  onDataReload: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  categories,
  onAddCategory,
  onRemoveCategory,
  onDataReload,
}) => {
  const [newCat, setNewCat] = useState('');
  const [pin, setPin] = useState(localStorage.getItem('facility_admin_pin') || '1234');
  const [pinSaved, setPinSaved] = useState(false);

  // Status feedback toast
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'info';
    message: string;
  } | null>(null);

  // Dialog State
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    isDestructive: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirmar',
    isDestructive: false,
    onConfirm: () => {},
  });

  const showFeedback = (type: 'success' | 'info', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4500);
  };

  const handleAddCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    onAddCategory(newCat.trim());
    setNewCat('');
    showFeedback('success', `Categoria "${newCat.trim()}" adicionada com sucesso!`);
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('facility_admin_pin', pin);
    setPinSaved(true);
    setTimeout(() => setPinSaved(false), 3000);
  };

  const handleOpenLoadDemoDialog = () => {
    setDialogState({
      isOpen: true,
      title: 'Carregar Dados Modelo Facility Bombas',
      message:
        'Deseja carregar a estrutura de metas modelo da Facility Bombas (Bombas Dancor, Filtros de Piscinas, Produtos Químicos, Serviços e Colaboradores)? Os dados atuais serão substituídos.',
      confirmLabel: 'Carregar Dados Modelo',
      isDestructive: false,
      onConfirm: () => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        const startOfMonth = new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0];
        const endOfMonth = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];

        const demoEmployees: Employee[] = [
          {
            id: 'emp-1',
            name: 'Carlos Alberto Silva',
            role: 'Consultor Comercial Sênior',
            department: 'Vendas de Bombas & Equipamentos',
            email: 'carlos.vendas@facilitybombas.com.br',
            avatarColor: '#29C7D9',
            active: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'emp-2',
            name: 'Mariana Duarte',
            role: 'Especialista em Tratamento & Químicos',
            department: 'Vendas Químicas',
            email: 'mariana.quimicos@facilitybombas.com.br',
            avatarColor: '#6DCCF2',
            active: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'emp-3',
            name: 'Roberto Mendes',
            role: 'Supervisor de Manutenção & Instalações',
            department: 'Serviços Técnicos',
            email: 'roberto.tecnico@facilitybombas.com.br',
            avatarColor: '#6F92BF',
            active: true,
            createdAt: new Date().toISOString(),
          },
        ];

        const demoGoals: Goal[] = [
          {
            id: 'goal-1',
            name: 'Faturamento de Bombas Autoescorvantes Dancor & Jacuzzi',
            category: 'Vendas',
            periodicity: 'mensal',
            targetValue: 120000,
            achievedValue: 88500,
            unitType: 'currency',
            startDate: startOfMonth,
            endDate: endOfMonth,
            year: currentYear,
            month: currentMonth,
            status: 'no_ritmo',
            responsibleEmployeeId: 'emp-1',
            responsibleName: 'Carlos Alberto Silva',
            notes: 'Foco em condomínios e clubes esportivos',
            history: [],
            createdAt: new Date().toISOString(),
          },
          {
            id: 'goal-2',
            name: 'Venda de Cloro Granulado & Produtos Químicos de Piscina',
            category: 'Produtos',
            periodicity: 'mensal',
            targetValue: 45000,
            achievedValue: 46200,
            unitType: 'currency',
            startDate: startOfMonth,
            endDate: endOfMonth,
            year: currentYear,
            month: currentMonth,
            status: 'meta_atingida',
            responsibleEmployeeId: 'emp-2',
            responsibleName: 'Mariana Duarte',
            notes: 'Campanha de alta temporada',
            history: [],
            createdAt: new Date().toISOString(),
          },
          {
            id: 'goal-3',
            name: 'Serviços de Instalação e Troca de Areia de Filtros',
            category: 'Serviços',
            periodicity: 'mensal',
            targetValue: 35000,
            achievedValue: 14000,
            unitType: 'currency',
            startDate: startOfMonth,
            endDate: endOfMonth,
            year: currentYear,
            month: currentMonth,
            status: 'em_risco',
            responsibleEmployeeId: 'emp-3',
            responsibleName: 'Roberto Mendes',
            notes: 'Gargalo na equipe técnica externa',
            history: [],
            createdAt: new Date().toISOString(),
          },
          {
            id: 'goal-4',
            name: 'Prospecção e Ativação de Novos Piscineiros Parceiros',
            category: 'Clientes',
            periodicity: 'mensal',
            targetValue: 20,
            achievedValue: 16,
            unitType: 'number',
            unitLabel: 'parceiros',
            startDate: startOfMonth,
            endDate: endOfMonth,
            year: currentYear,
            month: currentMonth,
            status: 'no_ritmo',
            responsibleEmployeeId: 'emp-1',
            responsibleName: 'Carlos Alberto Silva',
            notes: 'Tabela com desconto para instaladores',
            history: [],
            createdAt: new Date().toISOString(),
          },
        ];

        const demoPlans: ActionPlan[] = [
          {
            id: 'plan-1',
            goalId: 'goal-3',
            goalName: 'Serviços de Instalação e Troca de Areia de Filtros',
            title: 'Mutirão de Atendimento Técnico em Condomínios Cadastrados',
            problemIdentified: 'Atraso no agendamento das ordens de serviço por falta de rotas otimizadas',
            actionRequired: 'Agrupar as ordens de serviço por bairro e contratar 1 técnico terceirizado de apoio',
            responsibleEmployeeId: 'emp-3',
            responsibleName: 'Roberto Mendes',
            deadline: endOfMonth,
            priority: 'urgente',
            status: 'em_andamento',
            notes: 'Alinhado com a diretoria técnica',
            createdAt: new Date().toISOString(),
          },
        ];

        StorageService.saveEmployees(demoEmployees);
        StorageService.saveGoals(demoGoals);
        StorageService.saveActionPlans(demoPlans);
        onDataReload();
        showFeedback('success', 'Dados modelo da Facility Bombas carregados com sucesso!');
      },
    });
  };

  const handleOpenClearAllDialog = () => {
    setDialogState({
      isOpen: true,
      title: 'Zerar Todos os Dados do Sistema',
      message:
        'ATENÇÃO: Deseja realmente zerar todos os dados do sistema? Esta ação excluirá permanentemente todas as metas, resultados, lançamentos diários, histórico, planos de ação e colaboradores. Esta operação não pode ser desfeita.',
      confirmLabel: 'Sim, Apagar Todos os Dados',
      isDestructive: true,
      onConfirm: () => {
        StorageService.clearAllData();
        onDataReload();
        showFeedback('success', 'Todos os dados foram apagados com sucesso. O sistema foi zerado.');
      },
    });
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-[#0284C7]" />
          <span>Configurações do Sistema</span>
        </h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Segurança, categorias de metas e gerenciamento de base de dados da Facility Bombas
        </p>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-semibold animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-sky-50 border-sky-200 text-[#0284C7]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Security PIN Section */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-50 text-[#0284C7] border border-sky-100">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1E293B]">
              PIN de Bloqueio Administrativo
            </h2>
            <p className="text-xs text-[#64748B]">
              Código de segurança para desbloquear a tela restrita de gestão
            </p>
          </div>
        </div>

        <form onSubmit={handleSavePin} className="flex flex-col sm:flex-row items-stretch gap-3">
          <input
            type="text"
            maxLength={10}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Ex: 1234"
            className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-sm text-[#1E293B] focus:border-[#0284C7] focus:bg-white focus:outline-none flex-1 transition-all"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            Salvar PIN de Acesso
          </button>
        </form>
        {pinSaved && (
          <p className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> PIN atualizado com sucesso!
          </p>
        )}
      </div>

      {/* Categories Manager */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-50 text-[#0284C7] border border-sky-100">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1E293B]">
              Categorias de Metas
            </h2>
            <p className="text-xs text-[#64748B]">
              Gerencie as categorias de negócio para agrupamento de indicadores
            </p>
          </div>
        </div>

        <form onSubmit={handleAddCat} className="flex gap-2">
          <input
            type="text"
            placeholder="Nova categoria (ex: Bombas Centrífugas)..."
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            className="flex-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-4 py-2 text-xs text-[#1E293B] placeholder-[#94A3B8] focus:border-[#0284C7] focus:bg-white focus:outline-none transition-all"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-sky-50 text-[#0284C7] hover:bg-sky-100 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-sky-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar</span>
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map((c) => (
            <div
              key={c}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#1E293B]"
            >
              <span>{c}</span>
              {categories.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveCategory(c)}
                  className="text-[#64748B] hover:text-rose-600 transition-colors cursor-pointer"
                  title={`Remover categoria ${c}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Demo & Maintenance Database Controls */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-50 text-[#0284C7] border border-sky-100">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1E293B]">
              Dados e Ambiente de Testes
            </h2>
            <p className="text-xs text-[#64748B]">
              Carregue dados de exemplo para demonstração ou zere o banco de dados
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0284C7] mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Carregar Modelo Facility Bombas</span>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Preenche o sistema com exemplos reais de bombas, filtros, químicos e colaboradores.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenLoadDemoDialog}
              className="w-full py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0284C7] text-xs font-bold transition-colors cursor-pointer border border-sky-200"
            >
              Carregar Dados Modelo
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-rose-700 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Zerar Todos os Dados</span>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Exclui permanentemente todas as metas, resultados, histórico e colaboradores.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenClearAllDialog}
              className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Limpar Banco de Dados
            </button>
          </div>
        </div>
      </div>

      {/* Modal Confirmation Dialog */}
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        title={dialogState.title}
        message={dialogState.message}
        confirmLabel={dialogState.confirmLabel}
        isDestructive={dialogState.isDestructive}
        onConfirm={dialogState.onConfirm}
        onCancel={() => setDialogState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
