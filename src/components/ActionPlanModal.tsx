import React, { useState, useEffect } from 'react';
import { X, ClipboardList, AlertCircle, User, Calendar, CheckSquare } from 'lucide-react';
import { ActionPlan, ActionPlanPriority, ActionPlanStatus, Employee, Goal } from '../types';

interface ActionPlanModalProps {
  isOpen: boolean;
  actionPlanToEdit?: ActionPlan | null;
  goals: Goal[];
  employees: Employee[];
  initialGoalId?: string;
  onSave: (plan: Partial<ActionPlan>) => void;
  onClose: () => void;
}

export const ActionPlanModal: React.FC<ActionPlanModalProps> = ({
  isOpen,
  actionPlanToEdit,
  goals,
  employees,
  initialGoalId,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [goalId, setGoalId] = useState('');
  const [problemIdentified, setProblemIdentified] = useState('');
  const [actionRequired, setActionRequired] = useState('');
  const [responsibleEmployeeId, setResponsibleEmployeeId] = useState('');
  const [customResponsibleName, setCustomResponsibleName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<ActionPlanPriority>('alta');
  const [status, setStatus] = useState<ActionPlanStatus>('pendente');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (actionPlanToEdit) {
      setTitle(actionPlanToEdit.title);
      setGoalId(actionPlanToEdit.goalId || '');
      setProblemIdentified(actionPlanToEdit.problemIdentified);
      setActionRequired(actionPlanToEdit.actionRequired);
      setResponsibleEmployeeId(actionPlanToEdit.responsibleEmployeeId || '');
      setCustomResponsibleName(actionPlanToEdit.responsibleName || '');
      setDeadline(actionPlanToEdit.deadline);
      setPriority(actionPlanToEdit.priority);
      setStatus(actionPlanToEdit.status);
      setNotes(actionPlanToEdit.notes || '');
    } else {
      const today = new Date();
      const inSevenDays = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      setTitle('');
      setGoalId(initialGoalId || (goals[0]?.id || ''));
      setProblemIdentified('');
      setActionRequired('');
      setResponsibleEmployeeId(employees[0]?.id || '');
      setCustomResponsibleName(employees[0]?.name || 'Administração');
      setDeadline(inSevenDays.toISOString().split('T')[0]);
      setPriority('alta');
      setStatus('pendente');
      setNotes('');
    }
    setErrors({});
  }, [actionPlanToEdit, isOpen, goals, employees, initialGoalId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Título do plano de ação é obrigatório.';
    if (!problemIdentified.trim()) errs.problemIdentified = 'Descreva o desvio ou problema identificado.';
    if (!actionRequired.trim()) errs.actionRequired = 'Descreva a ação corretiva necessária.';
    if (!deadline) errs.deadline = 'Prazo limite é obrigatório.';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const selectedGoal = goals.find((g) => g.id === goalId);
    const selectedEmp = employees.find((emp) => emp.id === responsibleEmployeeId);
    const finalRespName = selectedEmp ? selectedEmp.name : customResponsibleName.trim() || 'Diretoria';

    onSave({
      id: actionPlanToEdit?.id,
      title: title.trim(),
      goalId: goalId || undefined,
      goalName: selectedGoal ? selectedGoal.name : undefined,
      problemIdentified: problemIdentified.trim(),
      actionRequired: actionRequired.trim(),
      responsibleEmployeeId: responsibleEmployeeId || undefined,
      responsibleName: finalRespName,
      deadline,
      priority,
      status,
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div
        className="bg-white border border-[#E2E8F0] rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-xl relative text-[#1E293B] my-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1E293B]">
                {actionPlanToEdit ? 'Editar Plano de Ação' : 'Novo Plano de Ação (5W2H)'}
              </h2>
              <p className="text-xs text-[#64748B]">
                Medidas corretivas e estratégicas para alinhamento de metas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748B] hover:text-[#1E293B] p-1.5 rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
              Título do Plano de Ação *
            </label>
            <input
              type="text"
              placeholder="Ex: Campanha de Recuperação de Clientes Inativos para Bombas Dancor"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#0284C7] text-sm"
            />
            {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                Meta Vinculada
              </label>
              <select
                value={goalId}
                onChange={(e) => setGoalId(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#1E293B] text-xs focus:outline-none focus:border-[#0284C7] cursor-pointer"
              >
                <option value="">Geral / Sem meta vinculada</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                <User className="w-3.5 h-3.5 inline mr-1 text-[#0284C7]" /> Responsável pela Ação *
              </label>
              <select
                value={responsibleEmployeeId}
                onChange={(e) => {
                  setResponsibleEmployeeId(e.target.value);
                  const emp = employees.find((x) => x.id === e.target.value);
                  if (emp) setCustomResponsibleName(emp.name);
                }}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#1E293B] text-xs focus:outline-none focus:border-[#0284C7] cursor-pointer"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.department})
                  </option>
                ))}
                <option value="">Outro / Digitar responsável manual</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
              <AlertCircle className="w-3.5 h-3.5 inline mr-1 text-amber-500" /> Problema Identificado (Causa Raiz) *
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Ritmo diário de faturamento está 30% abaixo do necessário devido à falta de contatos proativos..."
              value={problemIdentified}
              onChange={(e) => setProblemIdentified(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-[#1E293B] text-xs placeholder-[#94A3B8] focus:outline-none focus:border-[#0284C7]"
            />
            {errors.problemIdentified && <p className="text-rose-500 text-xs mt-1">{errors.problemIdentified}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
              <CheckSquare className="w-3.5 h-3.5 inline mr-1 text-[#0284C7]" /> Ação Corretiva Necessária *
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Realizar mutirão de ligações para base de 120 piscineiros e condomínios com condição comercial especial..."
              value={actionRequired}
              onChange={(e) => setActionRequired(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-[#1E293B] text-xs placeholder-[#94A3B8] focus:outline-none focus:border-[#0284C7]"
            />
            {errors.actionRequired && <p className="text-rose-500 text-xs mt-1">{errors.actionRequired}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                <Calendar className="w-3.5 h-3.5 inline mr-1 text-[#0284C7]" /> Prazo Final *
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#1E293B] text-xs focus:outline-none focus:border-[#0284C7] cursor-pointer"
              />
              {errors.deadline && <p className="text-rose-500 text-xs mt-1">{errors.deadline}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ActionPlanPriority)}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#1E293B] text-xs focus:outline-none focus:border-[#0284C7] cursor-pointer"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente 🚨</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ActionPlanStatus)}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#1E293B] text-xs focus:outline-none focus:border-[#0284C7] cursor-pointer"
              >
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluido">Concluído ✅</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
              Observações Adicionais
            </label>
            <input
              type="text"
              placeholder="Ex: Alinhado na reunião de diretoria de 15/09"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-[#1E293B] text-xs placeholder-[#94A3B8] focus:border-[#0284C7]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#CBD5E1] text-[#64748B] hover:text-[#1E293B] text-xs font-semibold cursor-pointer hover:bg-[#F8FAFC]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-xs active:scale-[0.98] transition-all cursor-pointer"
            >
              {actionPlanToEdit ? 'Salvar Alterações' : 'Criar Plano de Ação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
