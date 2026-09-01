import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  description,
  confirmLabel = 'Confirmar Exclusão',
  cancelLabel = 'Cancelar',
  isDestructive = true,
  onConfirm,
  onCancel,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleDismiss = () => {
    if (onCancel) onCancel();
    if (onClose) onClose();
  };

  const handleConfirmAction = () => {
    onConfirm();
    handleDismiss();
  };

  const dialogText = message || description || '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
      onClick={handleDismiss}
    >
      <div
        className="bg-white border border-[#E2E8F0] rounded-2xl max-w-md w-full p-6 shadow-xl relative text-[#1E293B]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-[#64748B] hover:text-[#1E293B] p-1 rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isDestructive
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-sky-50 text-[#0284C7] border border-sky-200'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1E293B] mb-1.5">{title}</h3>
            <p className="text-sm text-[#64748B] leading-relaxed">{dialogText}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={handleDismiss}
            className="px-4 py-2 rounded-xl border border-[#CBD5E1] text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] font-medium text-sm transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirmAction}
            className={`px-5 py-2 rounded-xl font-bold text-sm shadow-xs transition-all cursor-pointer ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-[#0284C7] hover:bg-[#0369A1] text-white'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
