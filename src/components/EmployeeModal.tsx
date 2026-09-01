import React, { useState, useEffect } from 'react';
import { X, UserPlus, Mail, Phone, Briefcase, Building } from 'lucide-react';
import { Employee } from '../types';

interface EmployeeModalProps {
  isOpen: boolean;
  employeeToEdit?: Employee | null;
  onSave: (employee: Partial<Employee>) => void;
  onClose: () => void;
}

const AVATAR_COLORS = [
  '#29C7D9',
  '#6DCCF2',
  '#6F92BF',
  '#38BDF8',
  '#34D399',
  '#FBBF24',
  '#F87171',
  '#A78BFA',
];

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  employeeToEdit,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Comercial / Vendas');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [active, setActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employeeToEdit) {
      setName(employeeToEdit.name);
      setRole(employeeToEdit.role);
      setDepartment(employeeToEdit.department || 'Comercial / Vendas');
      setEmail(employeeToEdit.email || '');
      setPhone(employeeToEdit.phone || '');
      setAvatarColor(employeeToEdit.avatarColor || AVATAR_COLORS[0]);
      setActive(employeeToEdit.active !== false);
    } else {
      setName('');
      setRole('Vendedor / Consultor Técnico');
      setDepartment('Comercial / Vendas');
      setEmail('');
      setPhone('');
      setAvatarColor(AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]);
      setActive(true);
    }
    setErrors({});
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Nome do colaborador é obrigatório.';
    if (!role.trim()) errs.role = 'Cargo ou função é obrigatório.';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onSave({
      id: employeeToEdit?.id,
      name: name.trim(),
      role: role.trim(),
      department: department.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      avatarColor,
      active,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white border border-[#E2E8F0] rounded-2xl max-w-lg w-full p-6 shadow-xl relative text-[#1E293B]"
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
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1E293B]">
              {employeeToEdit ? 'Editar Colaborador' : 'Adicionar Colaborador'}
            </h3>
            <p className="text-xs text-[#64748B]">
              Gestão de perfil para metas individuais confidenciais
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
              Nome Completo *
            </label>
            <input
              type="text"
              placeholder="Ex: Carlos Eduardo Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#0284C7] text-sm"
            />
            {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                <Briefcase className="w-3.5 h-3.5 inline mr-1 text-[#0284C7]" /> Cargo / Função *
              </label>
              <input
                type="text"
                placeholder="Ex: Vendedor Técnico"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#0284C7] text-xs"
              />
              {errors.role && <p className="text-rose-500 text-xs mt-1">{errors.role}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                <Building className="w-3.5 h-3.5 inline mr-1 text-[#0284C7]" /> Departamento
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-[#1E293B] focus:outline-none focus:border-[#0284C7] text-xs cursor-pointer"
              >
                <option value="Comercial / Vendas">Comercial / Vendas</option>
                <option value="Serviços Técnicos / Instalação">Serviços Técnicos / Instalação</option>
                <option value="Atendimento e Suporte">Atendimento e Suporte</option>
                <option value="Financeiro e Cobrança">Financeiro e Cobrança</option>
                <option value="Operações / Estoque">Operações / Estoque</option>
                <option value="Administrativo">Administrativo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                <Mail className="w-3.5 h-3.5 inline mr-1 text-[#0284C7]" /> E-mail (Opcional)
              </label>
              <input
                type="email"
                placeholder="colaborador@facilitybombas.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#0284C7] text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                <Phone className="w-3.5 h-3.5 inline mr-1 text-[#0284C7]" /> Telefone / WhatsApp
              </label>
              <input
                type="text"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#0284C7] text-xs"
              />
            </div>
          </div>

          {/* Avatar Color Picker */}
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
              Cor do Marcador
            </label>
            <div className="flex items-center gap-2.5">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setAvatarColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                    avatarColor === c ? 'scale-125 ring-2 ring-[#0284C7] shadow-sm' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="activeCheckbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4 rounded text-[#0284C7] bg-white border-[#CBD5E1] focus:ring-[#0284C7] cursor-pointer"
            />
            <label htmlFor="activeCheckbox" className="text-xs text-[#64748B] select-none cursor-pointer">
              Colaborador ativo na equipe
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#CBD5E1] text-[#64748B] hover:text-[#1E293B] text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-xs active:scale-[0.98] transition-all cursor-pointer"
            >
              {employeeToEdit ? 'Salvar Alterações' : 'Cadastrar Colaborador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
