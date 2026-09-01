import { ActionPlan, Employee, Goal, HistoricalRecord, SystemSettings } from '../types';

const STORAGE_KEYS = {
  GOALS: 'facility_bombas_goals_v1',
  EMPLOYEES: 'facility_bombas_employees_v1',
  ACTION_PLANS: 'facility_bombas_action_plans_v1',
  HISTORY: 'facility_bombas_history_v1',
  CATEGORIES: 'facility_bombas_categories_v1',
  SETTINGS: 'facility_bombas_settings_v1',
  AUTH_SESSION: 'facility_bombas_auth_session_v1',
};

export const DEFAULT_CATEGORIES = [
  'Vendas',
  'Faturamento',
  'Clientes',
  'Produtos',
  'Serviços',
  'Atendimento',
  'Financeiro',
  'Outros',
];

export const DEFAULT_SETTINGS: SystemSettings = {
  companyName: 'Facility Bombas',
  companySubtitle: 'Bombas para Piscina, Equipamentos e Serviços',
  adminPin: '1234', // Default PIN for admin verification (editable in settings)
  requirePinForSensitiveActions: false,
  categories: DEFAULT_CATEGORIES,
  workingDaysOnly: false,
  presentationModeTheme: 'dark',
};

export const StorageService = {
  // --- GOALS ---
  getGoals(): Goal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GOALS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Erro ao ler metas do LocalStorage:', e);
      return [];
    }
  },

  saveGoals(goals: Goal[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch (e) {
      console.error('Erro ao salvar metas no LocalStorage:', e);
    }
  },

  saveGoal(goal: Goal): void {
    const goals = this.getGoals();
    const index = goals.findIndex((g) => g.id === goal.id);
    if (index >= 0) {
      goals[index] = goal;
    } else {
      goals.unshift(goal);
    }
    this.saveGoals(goals);
  },

  deleteGoal(id: string): void {
    const goals = this.getGoals().filter((g) => g.id !== id);
    this.saveGoals(goals);
  },

  // --- EMPLOYEES ---
  getEmployees(): Employee[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Erro ao ler funcionários:', e);
      return [];
    }
  },

  saveEmployees(employees: Employee[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
    } catch (e) {
      console.error('Erro ao salvar funcionários:', e);
    }
  },

  saveEmployee(employee: Employee): void {
    const employees = this.getEmployees();
    const index = employees.findIndex((e) => e.id === employee.id);
    if (index >= 0) {
      employees[index] = employee;
    } else {
      employees.push(employee);
    }
    this.saveEmployees(employees);
  },

  deleteEmployee(id: string): void {
    const employees = this.getEmployees().filter((e) => e.id !== id);
    this.saveEmployees(employees);
  },

  // --- ACTION PLANS ---
  getActionPlans(): ActionPlan[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTION_PLANS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Erro ao ler planos de ação:', e);
      return [];
    }
  },

  saveActionPlans(plans: ActionPlan[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTION_PLANS, JSON.stringify(plans));
    } catch (e) {
      console.error('Erro ao salvar planos de ação:', e);
    }
  },

  saveActionPlan(plan: ActionPlan): void {
    const plans = this.getActionPlans();
    const index = plans.findIndex((p) => p.id === plan.id);
    if (index >= 0) {
      plans[index] = plan;
    } else {
      plans.unshift(plan);
    }
    this.saveActionPlans(plans);
  },

  deleteActionPlan(id: string): void {
    const plans = this.getActionPlans().filter((p) => p.id !== id);
    this.saveActionPlans(plans);
  },

  // --- CATEGORIES ---
  getCategories(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
    } catch (e) {
      return DEFAULT_CATEGORIES;
    }
  },

  saveCategories(categories: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Erro ao salvar categorias:', e);
    }
  },

  // --- HISTORY ---
  getHistory(): HistoricalRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Erro ao ler histórico:', e);
      return [];
    }
  },

  saveHistory(history: HistoricalRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Erro ao salvar histórico:', e);
    }
  },

  // --- SETTINGS ---
  getSettings(): SystemSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (e) {
      console.error('Erro ao ler configurações:', e);
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: SystemSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Erro ao salvar configurações:', e);
    }
  },

  // --- BACKUP & RESTORE ---
  exportBackupJSON(): string {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      company: 'Facility Bombas',
      goals: this.getGoals(),
      employees: this.getEmployees(),
      actionPlans: this.getActionPlans(),
      history: this.getHistory(),
      categories: this.getCategories(),
      settings: this.getSettings(),
    };
    return JSON.stringify(payload, null, 2);
  },

  importBackupJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.goals)) this.saveGoals(parsed.goals);
      if (Array.isArray(parsed.employees)) this.saveEmployees(parsed.employees);
      if (Array.isArray(parsed.actionPlans)) this.saveActionPlans(parsed.actionPlans);
      if (Array.isArray(parsed.history)) this.saveHistory(parsed.history);
      if (Array.isArray(parsed.categories)) this.saveCategories(parsed.categories);
      if (parsed.settings) this.saveSettings(parsed.settings);
      return true;
    } catch (e) {
      console.error('Erro ao importar JSON:', e);
      return false;
    }
  },

  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.GOALS);
    localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
    localStorage.removeItem(STORAGE_KEYS.ACTION_PLANS);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  },
};
