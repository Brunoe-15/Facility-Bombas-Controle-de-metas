import React, { useState, useEffect } from 'react';
import { X, Target, Calendar, User, DollarSign, Tag, Clock, FileText } from 'lucide-react';
import { Employee, Goal, GoalCategory, Periodicity, UnitType } from '../types';
import { MONTH_NAMES_PT } from '../utils/formatters';

interface GoalModalProps {
  isOpen: boolean;
  goalToEdit?: Goal | null;
  employees: Employee[];
  categories: string[];
  onSave: (goal: Partial<Goal>) => void;
  onClose: () => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  goalToEdit,
  employees,
  categories,
  onSave,
  onClose,
}) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const [name, setName] = useState('');
  const [category, setCategory] = useState<GoalCategory>('Faturamento');
  const [customCategory, setCustomCategory] = useState('');
  const [periodicity, setPeriodicity] = useState<Periodicity>('mensal');
  const [unitType, setUnitType] = useState<UnitType>('currency');
  const [unitLabel, setUnitLabel] = useState('');
  const [targetValue, setTargetValue] = useState<string>('');
  const [achievedValue, setAchievedValue] = useState<string>('0');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [month, setMonth] = useState<number>(currentMonth);
  const [year, setYear] = useState<number>(currentYear);
  const [responsibleEmployeeId, setResponsibleEmployeeId] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (goalToEdit) {
      setName(goalToEdit.name);
      setCategory(goalToEdit.category);
      setPeriodicity(goalToEdit.periodicity);
      setUnitType(goalToEdit.unitType || 'currency');
      setUnitLabel(goalToEdit.unitLabel || '');
      setTargetValue(goalToEdit.targetValue.toString());
      setAchievedValue(goalToEdit.achievedValue.toString());
      setStartDate(goalToEdit.startDate || '');
      setEndDate(goalToEdit.endDate || '');
      setMonth(goalToEdit.month || currentMonth);
      setYear(goalToEdit.year || currentYear);
      setResponsibleEmployeeId(goalToEdit.responsibleEmployeeId || '');
      setNotes(goalToEdit.notes || '');
    } else {
      // Default new goal for current month
      const y = currentYear;
      const m = currentMonth;
      const firstDay = `${y}-${String(m).padStart(2, '0')}-01`;
      const lastDay = new Date(y, m, 0).getDate();
      const lastDayStr = `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      setName('');
      setCategory(categories[0] || 'Faturamento');
      setCustomCategory('');
      setPeriodicity('mensal');
      setUnitType('currency');
      setUnitLabel('');
      setTargetValue('');
      setAchievedValue('0');
      setStartDate(firstDay);
      setEndDate(lastDayStr);
      setMonth(m);
      setYear(y);
      setResponsibleEmployeeId('');
      setNotes('');
    }
    setErrors({});
  }, [goalToEdit, isOpen, categories, currentYear, currentMonth]);

  // Adjust dates when month/year changes if periodicity is mensal
  const handleMonthYearChange = (newMonth: number, newYear: number) => {
    setMonth(newMonth);
    setYear(newYear);
    if (periodicity === 'mensal') {
      const firstDay = `${newYear}-${String(newMonth).padStart(2, '0')}-01`;
      const lastDay = new Date(newYear, newMonth, 0).getDate();
      const lastDayStr = `${newYear}-${String(newMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      setStartDate(firstDay);
      setEndDate(lastDayStr);
    }
  };

  const handlePeriodicityChange = (newPeriod: Periodicity) => {
    setPeriodicity(newPeriod);
    const y = year;
    const m = month;

    if (newPeriod === 'diaria') {
      const todayStr = `${y}-${String(m).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (newPeriod === 'semanal') {
      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay() + 1); // Monday
      const end = new Date(start);
      end.setDate(start.getDate() + 6); // Sunday
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(end.toISOString().split('T')[0]);
    } else if (newPeriod === 'mensal') {
      const firstDay = `${y}-${String(m).padStart(2, '0')}-01`;
      const lastDay = new Date(y, m, 0).getDate();
      setStartDate(firstDay);
      setEndDate(`${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`);
    } else if (newPeriod === 'trimestral') {
      const q = Math.ceil(m / 3);
      const qStartMonth = (q - 1) * 3 + 1;
      const qEndMonth = q * 3;
      const lastDay = new Date(y, qEndMonth, 0).getDate();
      setStartDate(`${y}-${String(qStartMonth).padStart(2, '0')}-01`);
      setEndDate(`${y}-${String(qEndMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`);
    } else if (newPeriod === 'anual') {
      setStartDate(`${y}-01-01`);
      setEndDate(`${y}-12-31`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'O nome da meta é obrigatório.';
    }

    const numTarget = parseFloat(targetValue.replace(/\./g, '').replace(',', '.'));
    if (isNaN(numTarget) || numTarget <= 0) {
      newErrors.targetValue = 'Informe um valor de meta válido maior que zero.';
    }

    const numAchieved = achievedValue ? parseFloat(achievedValue.replace(/\./g, '').replace(',', '.')) : 0;
    if (isNaN(numAchieved) || numAchieved < 0) {
      newErrors.achievedValue = 'Informe um valor realizado válido (0 ou mais).';
    }

    if (!startDate) newErrors.startDate = 'Data de início é obrigatória.';
    if (!endDate) newErrors.endDate = 'Data de término é obrigatória.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalCategory = category === 'Outros' && customCategory.trim() ? customCategory.trim() : category;
    const selectedEmp = employees.find((emp) => emp.id === responsibleEmployeeId);

    onSave({
      id: goalToEdit?.id,
      name: name.trim(),
      category: finalCategory,
      periodicity,
      unitType,
      unitLabel: unitLabel.trim() || undefined,
      targetValue: numTarget,
      achievedValue: numAchieved,
      startDate,
      endDate,
      month,
      year,
      responsibleEmployeeId: responsibleEmployeeId || undefined,
      responsibleName: selectedEmp ? selectedEmp.name : undefined,
      department: selectedEmp ? selectedEmp.department : undefined,
      notes: notes.trim(),
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div
        className="bg-white border border-[#E2E8F0] rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-xl relative text-[#1E293B] my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-[#0284C7] flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1E293B]">
                {goalToEdit ? 'Editar Meta' : 'Cadastrar Nova Meta'}
              </h2>
              <p className="text-xs text-[#64748B]">
                Preencha as diretrizes e parâmetros de desempenho da Facility Bombas
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Nome da Meta */}
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
              Nome da Meta *
            </label>
            <input
              type="text"
              placeholder="Ex: Faturamento de Setembro, Venda de 50 Bombas Trifásicas..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] transition-all text-sm"
            />
            {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Categoria & Periodicidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                <Tag className="w-3.5 h-3.5 inline mr-1 text-[#0284C7]" /> Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#1E293B] focus:outline-none focus:border-[#0284C7] transition-all text-sm cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {category === 'Outros' && (
                <input
                  type="text"
                  placeholder="Especifique a categoria personalizada..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full mt-2 bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-[#1E293B] text-xs placeholder-[#94A3B8] focus:border-[#0284C7]"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                <Clock className="w-3.5 h-3.5 inline mr-1 text-[#0284C7]" /> Periodicidade *
              </label>
              <select
                value={periodicity}
                onChange={(e) => handlePeriodicityChange(e.target.value as Periodicity)}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#1E293B] focus:outline-none focus:border-[#0284C7] transition-all text-sm cursor-pointer"
              >
                <option value="diaria">Diária</option>
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
                <option value="trimestral">Trimestral</option>
                <option value="anual">Anual</option>
              </select>
            </div>
          </div>

          {/* Mês e Ano de Referência */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                <Calendar className="w-3.5 h-3.5 inline mr-1 text-[#0284C7]" /> Mês de Referência
              </label>
              <select
                value={month}
                onChange={(e) => handleMonthYearChange(Number(e.target.value), year)}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#1E293B] focus:outline-none focus:border-[#0284C7] text-sm cursor-pointer"
              >
                {MONTH_NAMES_PT.map((mName, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {mName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                Ano de Referência
              </label>
              <select
                value={year}
                onChange={(e) => handleMonthYearChange(month, Number(e.target.value))}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#1E293B] focus:outline-none focus:border-[#0284C7] text-sm cursor-pointer"
              >
                {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tipo de Unidade de Medida */}
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
              Tipo de Métrica / Unidade
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUnitType('currency')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  unitType === 'currency'
                    ? 'bg-[#EBF3FA] border-[#0284C7] text-[#0284C7]'
                    : 'bg-white border-[#CBD5E1] text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" /> Financeiro (R$)
              </button>
              <button
                type="button"
                onClick={() => setUnitType('number')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  unitType === 'number'
                    ? 'bg-[#EBF3FA] border-[#0284C7] text-[#0284C7]'
                    : 'bg-white border-[#CBD5E1] text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                Quantidade (Qtd)
              </button>
              <button
                type="button"
                onClick={() => setUnitType('percentage')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  unitType === 'percentage'
                    ? 'bg-[#EBF3FA] border-[#0284C7] text-[#0284C7]'
                    : 'bg-white border-[#CBD5E1] text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                Percentual (%)
              </button>
            </div>
            {unitType === 'number' && (
              <input
                type="text"
                placeholder="Rótulo da unidade (ex: bombas, clientes, atendimentos, visitas)"
                value={unitLabel}
                onChange={(e) => setUnitLabel(e.target.value)}
                className="w-full mt-2 bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-[#1E293B] text-xs placeholder-[#94A3B8] focus:border-[#0284C7]"
              />
            )}
          </div>

          {/* Valores: Meta & Realizado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
            <div>
              <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-1.5">
                Valor da Meta * {unitType === 'currency' ? '(R$)' : unitType === 'percentage' ? '(%)' : ''}
              </label>
              <input
                type="number"
                step="any"
                min="0"
                placeholder={unitType === 'currency' ? 'Ex: 150000' : 'Ex: 100'}
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-[#1E293B] font-semibold placeholder-[#94A3B8] focus:outline-none focus:border-[#0284C7] text-sm"
              />
              {errors.targetValue && <p className="text-rose-500 text-xs mt-1">{errors.targetValue}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-1.5">
                Valor Realizado Atual {unitType === 'currency' ? '(R$)' : unitType === 'percentage' ? '(%)' : ''}
              </label>
              <input
                type="number"
                step="any"
                min="0"
                placeholder="Ex: 98500"
                value={achievedValue}
                onChange={(e) => setAchievedValue(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-[#1E293B] font-semibold placeholder-[#94A3B8] focus:outline-none focus:border-[#0284C7] text-sm"
              />
              {errors.achievedValue && <p className="text-rose-500 text-xs mt-1">{errors.achievedValue}</p>}
            </div>
          </div>

          {/* Datas Início e Fim */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                Data Inicial *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#1E293B] focus:outline-none focus:border-[#0284C7] text-sm cursor-pointer"
              />
              {errors.startDate && <p className="text-rose-500 text-xs mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                Data Limite / Final *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#1E293B] focus:outline-none focus:border-[#0284C7] text-sm cursor-pointer"
              />
              {errors.endDate && <p className="text-rose-500 text-xs mt-1">{errors.endDate}</p>}
            </div>
          </div>

          {/* Responsável */}
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
              <User className="w-3.5 h-3.5 inline mr-1 text-[#0284C7]" /> Responsável pela Meta
            </label>
            <select
              value={responsibleEmployeeId}
              onChange={(e) => setResponsibleEmployeeId(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#1E293B] focus:outline-none focus:border-[#0284C7] text-sm cursor-pointer"
            >
              <option value="">Geral da Empresa (Sem funcionário específico)</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.role} - {emp.department})
                </option>
              ))}
            </select>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
              <FileText className="w-3.5 h-3.5 inline mr-1 text-[#0284C7]" /> Observações e Detalhes
            </label>
            <textarea
              rows={3}
              placeholder="Descreva detalhes estratégicos, regras de apuração, campanhas de incentivo, canais de venda..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#0284C7] text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#CBD5E1] text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] font-medium text-sm transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-sm shadow-xs active:scale-[0.98] transition-all cursor-pointer"
            >
              {goalToEdit ? 'Salvar Alterações' : 'Cadastrar Meta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
