import { AlertItem, CalculatedGoalMetrics, Goal, GoalStatus } from '../types';

/**
 * Calculate dates, progress, daily pacing, projected result, and status for a single goal
 */
export function calculateGoalMetrics(goal: Goal, referenceDate: Date = new Date()): CalculatedGoalMetrics {
  const targetValue = Number(goal.targetValue) || 0;
  const achievedValue = Number(goal.achievedValue) || 0;
  const remainingValue = Math.max(0, targetValue - achievedValue);
  
  const percentageAchieved = targetValue > 0 ? (achievedValue / targetValue) * 100 : 0;
  const percentageRemaining = Math.max(0, 100 - percentageAchieved);

  // Compute period dates
  let start = new Date(goal.startDate);
  let end = new Date(goal.endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    const today = new Date(referenceDate);
    start = new Date(today.getFullYear(), today.getMonth(), 1);
    end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  }

  // Set times to midnight for clean day differences
  const startClean = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endClean = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const refClean = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysTotal = Math.max(1, Math.round((endClean.getTime() - startClean.getTime()) / msPerDay) + 1);
  
  // Days elapsed from start up to refClean (clamped between 1 and daysTotal)
  let daysElapsed = Math.round((refClean.getTime() - startClean.getTime()) / msPerDay) + 1;
  if (daysElapsed < 1) daysElapsed = 1;
  if (daysElapsed > daysTotal) daysElapsed = daysTotal;

  // Days remaining from refClean to endClean
  let daysRemaining = Math.round((endClean.getTime() - refClean.getTime()) / msPerDay);
  if (daysRemaining < 0) daysRemaining = 0;

  // Pacing calculations
  const requiredDailyAverage = daysRemaining > 0 ? remainingValue / daysRemaining : remainingValue;
  const currentDailyAverage = daysElapsed > 0 ? achievedValue / daysElapsed : 0;

  // Expected progress based on linear timeline elapsed %
  const expectedProgress = Math.min(100, Math.max(0, (daysElapsed / daysTotal) * 100));
  const progressGap = percentageAchieved - expectedProgress;

  // Linear projection based on current run-rate
  const projectedFinalValue = achievedValue + (currentDailyAverage * daysRemaining);
  const projectedPercentage = targetValue > 0 ? (projectedFinalValue / targetValue) * 100 : 0;
  const isProjectedAboveTarget = projectedFinalValue >= targetValue;

  // Determine Goal Status
  let status: GoalStatus = 'no_ritmo';
  const isAchieved = percentageAchieved >= 100;
  const isOverdue = daysRemaining === 0 && !isAchieved;

  if (isAchieved) {
    status = 'meta_atingida'; // 🔵
  } else if (isOverdue) {
    status = 'atrasada'; // 🔴
  } else {
    // If progress is keeping pace with elapsed timeline
    const performanceRatio = expectedProgress > 0 ? (percentageAchieved / expectedProgress) : 1;
    
    if (performanceRatio >= 0.95 || projectedFinalValue >= targetValue) {
      status = 'no_ritmo'; // 🟢
    } else if (performanceRatio >= 0.75) {
      status = 'atencao'; // 🟡
    } else if (performanceRatio >= 0.50) {
      status = 'em_risco'; // 🟠
    } else {
      status = 'atrasada'; // 🔴
    }
  }

  const isOnTrack = status === 'no_ritmo' || status === 'meta_atingida';
  const isAtRisk = status === 'atencao' || status === 'em_risco' || status === 'atrasada';

  return {
    goal,
    targetValue,
    achievedValue,
    remainingValue,
    percentageAchieved,
    percentageRemaining,
    daysTotal,
    daysElapsed,
    daysRemaining,
    requiredDailyAverage,
    currentDailyAverage,
    expectedProgress,
    progressGap,
    projectedFinalValue,
    projectedPercentage,
    isProjectedAboveTarget,
    status,
    isAchieved,
    isOnTrack,
    isAtRisk,
    isOverdue,
  };
}

export interface AggregatedDashboardMetrics {
  totalGoalsCount: number;
  achievedGoalsCount: number;
  onTrackGoalsCount: number;
  atRiskGoalsCount: number;
  overdueGoalsCount: number;
  totalTargetValue: number;
  totalAchievedValue: number;
  totalRemainingValue: number;
  overallPercentage: number;
  overallProjectedValue: number;
  overallProjectedPercentage: number;
  isOverallProjectionAboveTarget: boolean;
  totalDaysRemaining: number;
  overallRequiredDailyRate: number;
  financialTarget: number;
  financialAchieved: number;
  financialPercentage: number;
  financialRemaining: number;
  financialRequiredDailyRate: number;
  financialProjectedValue: number;
}

/**
 * Aggregates all goals in a selected filtered group
 */
export function aggregateMetrics(
  calculatedGoals: CalculatedGoalMetrics[],
  maxDaysRemaining: number = 0
): AggregatedDashboardMetrics {
  let totalGoalsCount = calculatedGoals.length;
  let achievedGoalsCount = 0;
  let onTrackGoalsCount = 0;
  let atRiskGoalsCount = 0;
  let overdueGoalsCount = 0;

  let totalTargetValue = 0;
  let totalAchievedValue = 0;
  let totalRemainingValue = 0;
  let totalProjectedValue = 0;

  let financialTarget = 0;
  let financialAchieved = 0;
  let financialRemaining = 0;
  let financialProjected = 0;
  let financialRequiredDaily = 0;

  let computedMaxDaysRemaining = maxDaysRemaining;

  for (const item of calculatedGoals) {
    if (item.status === 'meta_atingida') achievedGoalsCount++;
    else if (item.status === 'no_ritmo') onTrackGoalsCount++;
    else if (item.status === 'atrasada') overdueGoalsCount++;
    else atRiskGoalsCount++;

    totalTargetValue += item.targetValue;
    totalAchievedValue += item.achievedValue;
    totalRemainingValue += item.remainingValue;
    totalProjectedValue += item.projectedFinalValue;

    if (item.daysRemaining > computedMaxDaysRemaining) {
      computedMaxDaysRemaining = item.daysRemaining;
    }

    if (
      item.goal.unitType === 'currency' ||
      item.goal.category === 'Faturamento' ||
      item.goal.category === 'Financeiro' ||
      item.goal.category === 'Vendas' ||
      item.goal.category === 'Produtos' ||
      item.goal.category === 'Serviços'
    ) {
      financialTarget += item.targetValue;
      financialAchieved += item.achievedValue;
      financialRemaining += item.remainingValue;
      financialProjected += item.projectedFinalValue;
      financialRequiredDaily += item.requiredDailyAverage;
    }
  }

  const overallPercentage = totalTargetValue > 0 ? (totalAchievedValue / totalTargetValue) * 100 : 0;
  const overallProjectedPercentage = totalTargetValue > 0 ? (totalProjectedValue / totalTargetValue) * 100 : 0;
  const isOverallProjectionAboveTarget = totalProjectedValue >= totalTargetValue;
  const overallRequiredDailyRate =
    computedMaxDaysRemaining > 0 ? totalRemainingValue / computedMaxDaysRemaining : totalRemainingValue;

  const financialPercentage = financialTarget > 0 ? (financialAchieved / financialTarget) * 100 : 0;

  return {
    totalGoalsCount,
    achievedGoalsCount,
    onTrackGoalsCount,
    atRiskGoalsCount,
    overdueGoalsCount,
    totalTargetValue,
    totalAchievedValue,
    totalRemainingValue,
    overallPercentage,
    overallProjectedValue: totalProjectedValue,
    overallProjectedPercentage,
    isOverallProjectionAboveTarget,
    totalDaysRemaining: computedMaxDaysRemaining,
    overallRequiredDailyRate,
    financialTarget: financialTarget || totalTargetValue,
    financialAchieved: financialAchieved || totalAchievedValue,
    financialPercentage: financialPercentage || overallPercentage,
    financialRemaining: financialRemaining || totalRemainingValue,
    financialRequiredDailyRate: financialRequiredDaily || overallRequiredDailyRate,
    financialProjectedValue: financialProjected || totalProjectedValue,
  };
}

export const aggregateDashboardMetrics = aggregateMetrics;

/**
 * Automatically generates dynamic alerts from calculated goals
 */
export function generateAlerts(calculatedGoals: CalculatedGoalMetrics[]): AlertItem[] {
  const alerts: AlertItem[] = [];

  for (const cg of calculatedGoals) {
    const { goal } = cg;

    if (cg.status === 'atrasada') {
      alerts.push({
        id: `alert-overdue-${goal.id}`,
        goalId: goal.id,
        title: `🔴 Meta Atrasada: ${goal.name}`,
        description: `O prazo desta meta venceu ou o ritmo diário está crítico (apenas ${cg.percentageAchieved.toFixed(1)}% atingido). Crie um plano de ação imediato.`,
        severity: 'danger',
        type: 'delayed',
        createdAt: new Date().toISOString(),
      });
    } else if (cg.status === 'em_risco') {
      alerts.push({
        id: `alert-risk-${goal.id}`,
        goalId: goal.id,
        title: `🟠 Meta em Risco: ${goal.name}`,
        description: `A projeção atual indica fechamento em ${cg.projectedPercentage.toFixed(1)}% do alvo. É necessário acelerar o ritmo diário para ${cg.requiredDailyAverage.toFixed(1)}/dia.`,
        severity: 'warning',
        type: 'at_risk',
        createdAt: new Date().toISOString(),
      });
    } else if (cg.status === 'atencao') {
      alerts.push({
        id: `alert-attention-${goal.id}`,
        goalId: goal.id,
        title: `🟡 Ponto de Atenção: ${goal.name}`,
        description: `O ritmo de entregas está ligeiramente abaixo do esperado para o tempo decorrido do ciclo.`,
        severity: 'warning',
        type: 'pace_drop',
        createdAt: new Date().toISOString(),
      });
    } else if (cg.isAchieved) {
      alerts.push({
        id: `alert-success-${goal.id}`,
        goalId: goal.id,
        title: `🟢 Meta Atingida: ${goal.name}`,
        description: `Parabéns à equipe! A meta foi 100% concretizada (${cg.percentageAchieved.toFixed(1)}%).`,
        severity: 'success',
        type: 'achieved',
        createdAt: new Date().toISOString(),
      });
    }
  }

  return alerts;
}

/**
 * Returns helper styling & labels for statuses
 */
export function getStatusDetails(status: GoalStatus) {
  switch (status) {
    case 'meta_atingida':
      return {
        label: 'Meta atingida',
        icon: '🔵',
        color: '#0284C7',
        bgColor: 'bg-sky-50 text-sky-700 border-sky-200',
        badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
        description: 'A meta foi concluída com sucesso!',
      };
    case 'no_ritmo':
      return {
        label: 'No ritmo',
        icon: '🟢',
        color: '#0D9488',
        bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        description: 'Progresso alinhado com o esperado para o período.',
      };
    case 'atencao':
      return {
        label: 'Atenção',
        icon: '🟡',
        color: '#D97706',
        bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        description: 'Progresso ligeiramente abaixo do ritmo ideal.',
      };
    case 'em_risco':
      return {
        label: 'Em risco',
        icon: '🟠',
        color: '#EA580C',
        bgColor: 'bg-orange-50 text-orange-700 border-orange-200',
        badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
        description: 'Desempenho significativamente abaixo do ritmo necessário.',
      };
    case 'atrasada':
      return {
        label: 'Atrasada',
        icon: '🔴',
        color: '#E11D48',
        bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        description: 'Meta com atraso crítico ou prazo vencido sem atingimento.',
      };
    default:
      return {
        label: 'Não definida',
        icon: '⚪',
        color: '#64748B',
        bgColor: 'bg-slate-50 text-slate-700 border-slate-200',
        badgeClass: 'bg-slate-50 text-slate-700 border-slate-200',
        description: '',
      };
  }
}
