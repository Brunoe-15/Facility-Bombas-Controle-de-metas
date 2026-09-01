import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Plus, RefreshCw } from 'lucide-react';
import { Goal } from '../types';
import { formatUnitValue } from '../utils/formatters';

interface QuickResultModalProps {
  isOpen: boolean;
  goal: Goal | null;
  onSave: (goalId: string, newAchievedValue: number, note?: string) => void;
  onClose: () => void;
}

export const QuickResultModal: React.FC<QuickResultModalProps> = ({
  isOpen,
  goal,
  onSave,
  onClose,
}) => {
  const [mode, setMode] = useState<'replace' | 'increment'>('replace');
  const [inputValue, setInputValue] = useState<string>('');
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    if (goal) {
      setInputValue(goal.achievedValue.toString());
      setNote('');
      setMode('replace');
    }
  }, [goal, isOpen]);

  if (!isOpen || !goal) return null;

  const currentAchieved = goal.achievedValue;
  const numInput = parseFloat(inputValue.replace(/\./g, '').replace(',', '.')) || 0;
  const finalCalculatedValue = mode === 'increment' ? currentAchieved + numInput : numInput;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (finalCalculatedValue < 0) return;
    onSave(goal.id, finalCalculatedValue, note.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white border border-[#E2E8F0] rounded-2xl max-w-md w-full p-6 shadow-xl relative text-[#1E293B]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#64748B] hover:text-[#1E293B] p-1 rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-[#0284C7] flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1E293B] leading-tight">
              Registrar Resultado
            </h3>
            <p className="text-xs text-[#64748B] truncate max-w-[260px]">
              {goal.name}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 flex items-center justify-between text-xs">
            <div>
              <span className="text-[#64748B] block font-medium">Meta Alvo:</span>
              <span className="text-[#1E293B] font-bold text-sm">
                {formatUnitValue(goal.targetValue, goal.unitType, goal.unitLabel)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[#64748B] block font-medium">Realizado Atual:</span>
              <span className="text-[#0284C7] font-bold text-sm">
                {formatUnitValue(currentAchieved, goal.unitType, goal.unitLabel)}
              </span>
            </div>
          </div>

          <div className="flex rounded-xl bg-[#F1F5F9] border border-[#CBD5E1] p-1">
            <button
              type="button"
              onClick={() => {
                setMode('replace');
                setInputValue(currentAchieved.toString());
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === 'replace'
                  ? 'bg-white text-[#0284C7] shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Atualizar Total
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('increment');
                setInputValue('');
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === 'increment'
                  ? 'bg-white text-[#0284C7] shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> Somar Valor Novo
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
              {mode === 'replace' ? 'Novo Valor Realizado Total' : 'Valor a Adicionar ao Realizado'}
            </label>
            <input
              type="number"
              step="any"
              min="0"
              required
              autoFocus
              placeholder="0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-[#1E293B] font-bold text-lg focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          {mode === 'increment' && (
            <div className="text-xs text-[#64748B] flex justify-between bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E2E8F0]">
              <span>Novo Total Resultante:</span>
              <span className="font-bold text-[#0284C7]">
                {formatUnitValue(finalCalculatedValue, goal.unitType, goal.unitLabel)}
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#64748B] mb-1">
              Observação / Origem do lançamento (opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Fechamento semanal, Venda pedido #4120"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-[#1E293B] text-xs placeholder-[#94A3B8] focus:border-[#0284C7]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
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
              Salvar Resultado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
