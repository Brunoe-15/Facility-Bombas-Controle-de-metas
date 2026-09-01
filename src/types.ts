export type Periodicity = 'diaria' | 'semanal' | 'mensal' | 'trimestral' | 'anual';

export type GoalCategory =
  | 'Vendas'
  | 'Faturamento'
  | 'Clientes'
  | 'Produtos'
  | 'Atendimento'
  | 'Financeiro'
  | 'Outros'
  | string;

export type UnitType = 'currency' | 'number' | 'percentage';

export type GoalStatus =
  | 'no_ritmo'       // 🟢 No ritmo
  | 'meta_atingida'   // 🔵 Meta atingida
  | 'atencao'        // 🟡 Atenção
  | 'em_risco'       // 🟠 Em risco
  | 'atrasada';      // 🔴 Atrasada

export interface Goal {
  id: string;
  name: string;
  category: GoalCategory;
  periodicity: Periodicity;
  unitType: UnitType; // 'currency' (R$), 'number' (qtd/bombas/etc), 'percentage' (%)
  unitLabel?: string; // ex: "Bombas", "Contratos", "Visitas"
  targetValue: number;
  achievedValue: number;
  startDate: string; // ISO date string YYYY-MM-DD
  endDate: string;   // ISO date string YYYY-MM-DD
  month?: number;    // 1-12
  year: number;      // e.g. 2026
  quarter?: number;  // 1-4
  responsibleEmployeeId?: string;
  responsibleName?: string;
  department?: string;
  status?: GoalStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  history?: Array<{
    id?: string;
    date: string;
    valueAdded?: number;
    accumulatedValue?: number;
    achievedValue?: number;
    note?: string;
    registeredBy?: string;
  }>;
  historySnapshots?: Array<{
    date: string;
    achievedValue: number;
    note?: string;
  }>;
}

export interface CalculatedGoalMetrics {
  goal: Goal;
  targetValue: number;
  achievedValue: number;
  remainingValue: number;
  percentageAchieved: number;
  percentageRemaining: number;
  daysTotal: number;
  daysElapsed: number;
  daysRemaining: number;
  requiredDailyAverage: number;
  currentDailyAverage: number;
  expectedProgress: number; // expected % based on time elapsed
  progressGap: number; // actual % - expected %
  projectedFinalValue: number;
  projectedPercentage: number;
  isProjectedAboveTarget: boolean;
  status: GoalStatus;
  isAchieved: boolean;
  isOnTrack: boolean;
  isAtRisk: boolean;
  isOverdue: boolean;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email?: string;
  phone?: string;
  avatarColor?: string;
  active?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type ActionPlanPriority = 'baixa' | 'media' | 'alta' | 'urgente';
export type ActionPlanStatus = 'pendente' | 'em_andamento' | 'concluido' | 'cancelado';

export interface ActionPlan {
  id: string;
  title: string;
  goalId?: string;
  goalName?: string;
  problemIdentified: string;
  actionRequired: string;
  responsibleEmployeeId?: string;
  responsibleName: string;
  deadline: string;
  priority: ActionPlanPriority;
  status: ActionPlanStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type AlertSeverity = 'danger' | 'warning' | 'success' | 'info';

export interface AlertItem {
  id: string;
  goalId?: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  type: 'at_risk' | 'attention_deadline' | 'achieved' | 'surpassed' | 'delayed' | 'pace_drop';
  createdAt: string;
  actionUrl?: string;
}

export interface HistoricalRecord {
  id: string;
  periodLabel: string; // e.g. "Agosto/2026", "2026-T2"
  month?: number;
  year: number;
  periodicity: Periodicity;
  goalName: string;
  category: GoalCategory;
  targetValue: number;
  achievedValue: number;
  percentageAchieved: number;
  finalStatus: GoalStatus;
  unitType: UnitType;
  responsibleName?: string;
  closedAt: string;
}

export interface FilterState {
  periodicity?: Periodicity | 'todas';
  month?: number | 'todos';
  year: number;
  category?: string | 'todas';
  status?: GoalStatus | 'todos';
  responsibleId?: string | 'todos';
  searchQuery?: string;
}

export interface SystemSettings {
  companyName: string;
  companySubtitle: string;
  adminPin: string; // Default admin PIN for security verification
  requirePinForSensitiveActions: boolean;
  categories: string[];
  workingDaysOnly: boolean;
  presentationModeTheme: 'light' | 'dark';
}
