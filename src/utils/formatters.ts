import { UnitType } from '../types';

export const MONTH_NAMES_PT = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export const MONTH_SHORT_PT = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

/**
 * Format currency to Brazilian Real: R$ 150.000 ou R$ 150.000,50
 */
export function formatCurrency(value: number, includeDecimals = false): string {
  if (isNaN(value) || value === null || value === undefined) return 'R$ 0';
  
  const hasDecimals = includeDecimals || (value % 1 !== 0);
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format standard number with Brazilian thousand separators (e.g. 1.250)
 */
export function formatNumber(value: number, decimals = 0): string {
  if (isNaN(value) || value === null || value === undefined) return '0';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format percentage with 1 decimal place (e.g. 65,7%)
 */
export function formatPercent(value: number, decimals = 1): string {
  if (isNaN(value) || value === null || value === undefined) return '0%';
  return `${new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)}%`;
}

/**
 * Format any value based on its unit type
 */
export function formatUnitValue(value: number, unitType: UnitType, unitLabel?: string): string {
  if (isNaN(value) || value === null || value === undefined) value = 0;
  
  if (unitType === 'currency') {
    return formatCurrency(value);
  }
  if (unitType === 'percentage') {
    return formatPercent(value);
  }
  
  const formattedNum = formatNumber(value);
  return unitLabel ? `${formattedNum} ${unitLabel}` : formattedNum;
}

/**
 * Format date from ISO string (YYYY-MM-DD) to DD/MM/YYYY
 */
export function formatDateBR(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR');
  } catch {
    return dateStr;
  }
}

/**
 * Get PT-BR month name (1 -> Janeiro)
 */
export function getMonthName(monthNumber?: number): string {
  if (!monthNumber || monthNumber < 1 || monthNumber > 12) return '';
  return MONTH_NAMES_PT[monthNumber - 1];
}

/**
 * Get PT-BR periodicity label
 */
export function getPeriodicityLabel(period: string): string {
  switch (period) {
    case 'diaria':
      return 'Diária';
    case 'semanal':
      return 'Semanal';
    case 'mensal':
      return 'Mensal';
    case 'trimestral':
      return 'Trimestral';
    case 'anual':
      return 'Anual';
    default:
      return period;
  }
}
