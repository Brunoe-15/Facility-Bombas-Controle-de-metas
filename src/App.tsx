import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Goal,
  Employee,
  ActionPlan,
  FilterState,
  CalculatedGoalMetrics,
  GoalCategory,
} from './types';
import { StorageService } from './utils/storage';
import {
  calculateGoalMetrics,
  aggregateDashboardMetrics,
  generateAlerts,
} from './utils/calculations';

// Components & Views
import { Sidebar, NavView } from './components/Sidebar';
import { Header } from './components/Header';
import { GoalModal } from './components/GoalModal';
import { QuickResultModal } from './components/QuickResultModal';
import { EmployeeModal } from './components/EmployeeModal';
import { ActionPlanModal } from './components/ActionPlanModal';
import { ConfirmDialog } from './components/ConfirmDialog';

import { AuthLockScreen } from './views/AuthLockScreen';
import { DashboardView } from './views/DashboardView';
import { GoalsView } from './views/GoalsView';
import { UpcomingGoalsView } from './views/UpcomingGoalsView';
import { EmployeesView } from './views/EmployeesView';
import { MetricsView } from './views/MetricsView';
import { ChartsView } from './views/ChartsView';
import { AlertsView } from './views/AlertsView';
import { ActionPlansView } from './views/ActionPlansView';
import { HistoryView } from './views/HistoryView';
import { ReportsView } from './views/ReportsView';
import { ImportExportView } from './views/ImportExportView';
import { SettingsView } from './views/SettingsView';

export default function App() {
  // 1. Authentication Lock State (Admin security)
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [adminPin, setAdminPin] = useState<string>('1234');

  // 2. Navigation State
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);

  // 3. Core Domain State
  const [goals, setGoals] = useState<Goal[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [categories, setCategories] = useState<string[]>([
    'Vendas',
    'Faturamento',
    'Produtos',
    'Serviços',
    'Clientes',
    'Atendimento',
    'Financeiro',
    'Outros',
  ]);

  // 4. Global Filters
  const currentYear = new Date().getFullYear();
  const [filter, setFilter] = useState<FilterState>({
    periodicity: 'todas',
    month: 'todos',
    year: currentYear,
    category: 'todas',
    status: 'todos',
    responsibleId: 'todos',
    searchQuery: '',
  });

  // 5. Modals State
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null);
  const [preselectedEmployeeIdForGoal, setPreselectedEmployeeIdForGoal] = useState<string | undefined>(undefined);

  const [isQuickResultModalOpen, setIsQuickResultModalOpen] = useState(false);
  const [selectedGoalForResult, setSelectedGoalForResult] = useState<Goal | null>(null);

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

  const [isActionPlanModalOpen, setIsActionPlanModalOpen] = useState(false);
  const [actionPlanToEdit, setActionPlanToEdit] = useState<ActionPlan | null>(null);
  const [initialGoalIdForPlan, setInitialGoalIdForPlan] = useState<string | undefined>(undefined);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  // Load Initial Data from StorageService
  const reloadDataFromStorage = useCallback(() => {
    setGoals(StorageService.getGoals());
    setEmployees(StorageService.getEmployees());
    setActionPlans(StorageService.getActionPlans());
    setCategories(StorageService.getCategories());
    const savedPin = localStorage.getItem('facility_admin_pin');
    if (savedPin) setAdminPin(savedPin);
  }, []);

  useEffect(() => {
    reloadDataFromStorage();
  }, [reloadDataFromStorage]);

  // Calculated Metrics for all Goals
  const calculatedGoals: CalculatedGoalMetrics[] = useMemo(() => {
    return goals.map((g) => calculateGoalMetrics(g));
  }, [goals]);

  // Filtered Calculated Goals based on FilterState
  const filteredCalculatedGoals = useMemo(() => {
    return calculatedGoals.filter((cg) => {
      const g = cg.goal;
      // Periodicity
      if (filter.periodicity && filter.periodicity !== 'todas' && g.periodicity !== filter.periodicity) {
        return false;
      }
      // Year
      if (filter.year && g.year !== filter.year) {
        return false;
      }
      // Month
      if (filter.month && filter.month !== 'todos' && g.month && g.month !== filter.month) {
        return false;
      }
      // Category
      if (filter.category && filter.category !== 'todas' && g.category !== filter.category) {
        return false;
      }
      // Status
      if (filter.status && filter.status !== 'todos' && cg.status !== filter.status) {
        return false;
      }
      // Responsible
      if (filter.responsibleId && filter.responsibleId !== 'todos' && g.responsibleEmployeeId !== filter.responsibleId) {
        return false;
      }
      // Search
      if (filter.searchQuery && filter.searchQuery.trim() !== '') {
        const q = filter.searchQuery.toLowerCase();
        const matchName = g.name.toLowerCase().includes(q);
        const matchResp = g.responsibleName ? g.responsibleName.toLowerCase().includes(q) : false;
        if (!matchName && !matchResp) return false;
      }
      return true;
    });
  }, [calculatedGoals, filter]);

  // Aggregated Summary for Dashboard
  const dashboardSummary = useMemo(() => {
    return aggregateDashboardMetrics(filteredCalculatedGoals);
  }, [filteredCalculatedGoals]);

  // Calculated Alerts
  const activeAlerts = useMemo(() => {
    return generateAlerts(calculatedGoals);
  }, [calculatedGoals]);

  // Update Filter Helper
  const handleUpdateFilter = (newFilter: Partial<FilterState>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  // --- Handlers: Goals CRUD ---
  const handleSaveGoal = (goalData: Partial<Goal>) => {
    if (goalData.id) {
      // Update existing
      const existing = goals.find((g) => g.id === goalData.id);
      if (existing) {
        const updated: Goal = {
          ...existing,
          ...goalData,
          updatedAt: new Date().toISOString(),
        } as Goal;
        StorageService.saveGoal(updated);
      }
    } else {
      // Create new
      const newGoal: Goal = {
        id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: goalData.name || 'Nova Meta',
        category: goalData.category || 'Vendas',
        periodicity: goalData.periodicity || 'mensal',
        targetValue: Number(goalData.targetValue) || 0,
        achievedValue: Number(goalData.achievedValue) || 0,
        unitType: goalData.unitType || 'currency',
        unitLabel: goalData.unitLabel,
        startDate: goalData.startDate || new Date().toISOString().split('T')[0],
        endDate: goalData.endDate || new Date().toISOString().split('T')[0],
        year: goalData.year || currentYear,
        month: goalData.month,
        status: 'no_ritmo',
        responsibleEmployeeId: goalData.responsibleEmployeeId,
        responsibleName: goalData.responsibleName,
        notes: goalData.notes,
        history: [],
        createdAt: new Date().toISOString(),
      };
      StorageService.saveGoal(newGoal);
    }
    reloadDataFromStorage();
  };

  const handleDuplicateGoal = (goal: Goal) => {
    const duplicated: Goal = {
      ...goal,
      id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: `${goal.name} (Cópia)`,
      achievedValue: 0,
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: undefined,
    };
    StorageService.saveGoal(duplicated);
    reloadDataFromStorage();
  };

  const handleDeleteGoalPrompt = (goal: Goal) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Excluir Meta',
      description: `Tem certeza que deseja excluir permanentemente a meta "${goal.name}"? Todos os lançamentos e históricos vinculados serão removidos.`,
      onConfirm: () => {
        StorageService.deleteGoal(goal.id);
        reloadDataFromStorage();
      },
    });
  };

  // --- Handlers: Quick Result Update ---
  const handleSaveQuickResult = (
    goalId: string,
    newValue: number,
    note?: string,
    entryDate?: string
  ) => {
    const targetGoal = goals.find((g) => g.id === goalId);
    if (!targetGoal) return;

    const previousValue = targetGoal.achievedValue;
    const addedAmount = newValue - previousValue;

    // Add entry to history
    const historyEntry = {
      id: `entry-${Date.now()}`,
      date: entryDate || new Date().toISOString().split('T')[0],
      valueAdded: addedAmount,
      accumulatedValue: newValue,
      note: note || 'Lançamento de resultado administrativo',
      registeredBy: 'Administração Facility Bombas',
    };

    const updatedHistory = [...(targetGoal.history || []), historyEntry];

    // Check celebration condition (100% achieved!)
    if (newValue >= targetGoal.targetValue && previousValue < targetGoal.targetValue) {
      // Trigger festive confetti explosion
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#29C7D9', '#6DCCF2', '#6F92BF', '#FFD700'],
      });
    }

    const updatedGoal: Goal = {
      ...targetGoal,
      achievedValue: newValue,
      history: updatedHistory,
      updatedAt: new Date().toISOString(),
    };

    StorageService.saveGoal(updatedGoal);
    reloadDataFromStorage();
  };

  // --- Handlers: Employees CRUD ---
  const handleSaveEmployee = (empData: Partial<Employee>) => {
    if (empData.id) {
      const existing = employees.find((e) => e.id === empData.id);
      if (existing) {
        const updated: Employee = {
          ...existing,
          ...empData,
          updatedAt: new Date().toISOString(),
        } as Employee;
        StorageService.saveEmployee(updated);
      }
    } else {
      const newEmp: Employee = {
        id: `emp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: empData.name || '',
        role: empData.role || '',
        department: empData.department || 'Vendas',
        email: empData.email,
        phone: empData.phone,
        avatarColor: empData.avatarColor || '#29C7D9',
        createdAt: new Date().toISOString(),
      };
      StorageService.saveEmployee(newEmp);
    }
    reloadDataFromStorage();
  };

  const handleDeleteEmployeePrompt = (emp: Employee) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Excluir Colaborador',
      description: `Tem certeza que deseja remover o cadastro de "${emp.name}"? As metas existentes permanecerão no sistema.`,
      onConfirm: () => {
        StorageService.deleteEmployee(emp.id);
        reloadDataFromStorage();
      },
    });
  };

  // --- Handlers: Action Plans CRUD (5W2H) ---
  const handleSaveActionPlan = (planData: Partial<ActionPlan>) => {
    if (planData.id) {
      const existing = actionPlans.find((p) => p.id === planData.id);
      if (existing) {
        const updated: ActionPlan = {
          ...existing,
          ...planData,
          updatedAt: new Date().toISOString(),
        } as ActionPlan;
        StorageService.saveActionPlan(updated);
      }
    } else {
      const newPlan: ActionPlan = {
        id: `plan-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        goalId: planData.goalId,
        goalName: planData.goalName,
        title: planData.title || '',
        problemIdentified: planData.problemIdentified || '',
        actionRequired: planData.actionRequired || '',
        responsibleEmployeeId: planData.responsibleEmployeeId,
        responsibleName: planData.responsibleName || 'Administração',
        deadline: planData.deadline || new Date().toISOString().split('T')[0],
        priority: planData.priority || 'alta',
        status: planData.status || 'pendente',
        notes: planData.notes,
        createdAt: new Date().toISOString(),
      };
      StorageService.saveActionPlan(newPlan);
    }
    reloadDataFromStorage();
  };

  const handleUpdatePlanStatus = (planId: string, status: any) => {
    const plan = actionPlans.find((p) => p.id === planId);
    if (!plan) return;
    const updated: ActionPlan = {
      ...plan,
      status,
      updatedAt: new Date().toISOString(),
    };
    StorageService.saveActionPlan(updated);
    reloadDataFromStorage();
  };

  const handleDeletePlan = (planId: string) => {
    StorageService.deleteActionPlan(planId);
    reloadDataFromStorage();
  };

  // Category management
  const handleAddCategory = (cat: string) => {
    const updated = [...categories, cat];
    setCategories(updated);
    StorageService.saveCategories(updated);
  };

  const handleRemoveCategory = (cat: string) => {
    const updated = categories.filter((c) => c !== cat);
    setCategories(updated);
    StorageService.saveCategories(updated);
  };

  // If locked, render confidential AuthLockScreen
  if (isLocked) {
    return (
      <AuthLockScreen
        correctPin={adminPin}
        onUnlock={() => setIsLocked(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA] text-[#1E293B] flex flex-col selection:bg-[#0284C7] selection:text-white">
      {/* Sidebar Navigation */}
      {!isPresentationMode && (
        <Sidebar
          currentView={currentView}
          onSelectView={(v) => setCurrentView(v)}
          isOpenMobile={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
          alertsCount={activeAlerts.length}
          actionPlansCount={actionPlans.filter((p) => p.status !== 'concluido').length}
        />
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isPresentationMode ? 'lg:pl-0' : 'lg:pl-64'
        }`}
      >
        {/* Top Header */}
        <Header
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          onOpenNewGoalModal={() => {
            setGoalToEdit(null);
            setPreselectedEmployeeIdForGoal(undefined);
            setIsGoalModalOpen(true);
          }}
          isPresentationMode={isPresentationMode}
          onTogglePresentationMode={() => setIsPresentationMode(!isPresentationMode)}
          activeAlertsCount={activeAlerts.length}
          onOpenAlerts={() => setCurrentView('alerts')}
          onLockSystem={() => setIsLocked(true)}
        />

        {/* View Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
          {currentView === 'dashboard' && (
            <DashboardView
              calculatedGoals={filteredCalculatedGoals}
              summary={dashboardSummary}
              filter={filter}
              onUpdateFilter={handleUpdateFilter}
              categories={categories}
              employees={employees}
              alerts={activeAlerts}
              actionPlans={actionPlans}
              onOpenNewGoalModal={() => {
                setGoalToEdit(null);
                setPreselectedEmployeeIdForGoal(undefined);
                setIsGoalModalOpen(true);
              }}
              onOpenQuickResultModal={(g) => {
                setSelectedGoalForResult(g);
                setIsQuickResultModalOpen(true);
              }}
              onOpenEditGoalModal={(g) => {
                setGoalToEdit(g);
                setIsGoalModalOpen(true);
              }}
              onOpenNewActionPlan={(goalId) => {
                setActionPlanToEdit(null);
                setInitialGoalIdForPlan(goalId);
                setIsActionPlanModalOpen(true);
              }}
              onNavigateToView={(v) => setCurrentView(v)}
            />
          )}

          {currentView === 'goals' && (
            <GoalsView
              calculatedGoals={calculatedGoals}
              categories={categories}
              employees={employees}
              onOpenNewGoalModal={() => {
                setGoalToEdit(null);
                setPreselectedEmployeeIdForGoal(undefined);
                setIsGoalModalOpen(true);
              }}
              onOpenEditGoalModal={(g) => {
                setGoalToEdit(g);
                setIsGoalModalOpen(true);
              }}
              onOpenQuickResultModal={(g) => {
                setSelectedGoalForResult(g);
                setIsQuickResultModalOpen(true);
              }}
              onDuplicateGoal={handleDuplicateGoal}
              onDeleteGoalPrompt={handleDeleteGoalPrompt}
            />
          )}

          {currentView === 'upcoming' && (
            <UpcomingGoalsView
              goals={goals}
              calculatedGoals={calculatedGoals}
              categories={categories}
              employees={employees}
              onOpenNewGoalModal={() => {
                setGoalToEdit(null);
                setIsGoalModalOpen(true);
              }}
              onOpenEditGoalModal={(g) => {
                setGoalToEdit(g);
                setIsGoalModalOpen(true);
              }}
            />
          )}

          {currentView === 'employees' && (
            <EmployeesView
              employees={employees}
              calculatedGoals={calculatedGoals}
              onOpenNewEmployeeModal={() => {
                setEmployeeToEdit(null);
                setIsEmployeeModalOpen(true);
              }}
              onOpenEditEmployeeModal={(emp) => {
                setEmployeeToEdit(emp);
                setIsEmployeeModalOpen(true);
              }}
              onDeleteEmployeePrompt={handleDeleteEmployeePrompt}
              onOpenNewGoalForEmployee={(empId) => {
                setGoalToEdit(null);
                setPreselectedEmployeeIdForGoal(empId);
                setIsGoalModalOpen(true);
              }}
            />
          )}

          {currentView === 'metrics' && (
            <MetricsView
              calculatedGoals={filteredCalculatedGoals}
              summary={dashboardSummary}
              onOpenNewGoalModal={() => {
                setGoalToEdit(null);
                setIsGoalModalOpen(true);
              }}
            />
          )}

          {currentView === 'charts' && (
            <ChartsView
              calculatedGoals={filteredCalculatedGoals}
              onOpenNewGoalModal={() => {
                setGoalToEdit(null);
                setIsGoalModalOpen(true);
              }}
            />
          )}

          {currentView === 'alerts' && (
            <AlertsView
              alerts={activeAlerts}
              goals={goals}
              onOpenQuickResultModal={(g) => {
                setSelectedGoalForResult(g);
                setIsQuickResultModalOpen(true);
              }}
              onOpenNewActionPlan={(goalId) => {
                setActionPlanToEdit(null);
                setInitialGoalIdForPlan(goalId);
                setIsActionPlanModalOpen(true);
              }}
            />
          )}

          {currentView === 'action_plans' && (
            <ActionPlansView
              actionPlans={actionPlans}
              goals={goals}
              employees={employees}
              onOpenNewActionPlanModal={() => {
                setActionPlanToEdit(null);
                setInitialGoalIdForPlan(undefined);
                setIsActionPlanModalOpen(true);
              }}
              onOpenEditActionPlanModal={(p) => {
                setActionPlanToEdit(p);
                setIsActionPlanModalOpen(true);
              }}
              onUpdatePlanStatus={handleUpdatePlanStatus}
              onDeletePlan={handleDeletePlan}
            />
          )}

          {currentView === 'history' && (
            <HistoryView goals={goals} calculatedGoals={calculatedGoals} />
          )}

          {currentView === 'reports' && (
            <ReportsView
              calculatedGoals={filteredCalculatedGoals}
              summary={dashboardSummary}
              employees={employees}
              actionPlans={actionPlans}
            />
          )}

          {currentView === 'import_export' && (
            <ImportExportView
              goals={goals}
              employees={employees}
              actionPlans={actionPlans}
              onDataReload={reloadDataFromStorage}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              categories={categories}
              onAddCategory={handleAddCategory}
              onRemoveCategory={handleRemoveCategory}
              onDataReload={reloadDataFromStorage}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <GoalModal
        isOpen={isGoalModalOpen}
        goalToEdit={goalToEdit}
        categories={categories}
        employees={employees}
        initialResponsibleEmployeeId={preselectedEmployeeIdForGoal}
        onSave={handleSaveGoal}
        onClose={() => {
          setIsGoalModalOpen(false);
          setGoalToEdit(null);
          setPreselectedEmployeeIdForGoal(undefined);
        }}
      />

      <QuickResultModal
        isOpen={isQuickResultModalOpen}
        goal={selectedGoalForResult}
        onSave={handleSaveQuickResult}
        onClose={() => {
          setIsQuickResultModalOpen(false);
          setSelectedGoalForResult(null);
        }}
      />

      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        employeeToEdit={employeeToEdit}
        onSave={handleSaveEmployee}
        onClose={() => {
          setIsEmployeeModalOpen(false);
          setEmployeeToEdit(null);
        }}
      />

      <ActionPlanModal
        isOpen={isActionPlanModalOpen}
        actionPlanToEdit={actionPlanToEdit}
        goals={goals}
        employees={employees}
        initialGoalId={initialGoalIdForPlan}
        onSave={handleSaveActionPlan}
        onClose={() => {
          setIsActionPlanModalOpen(false);
          setActionPlanToEdit(null);
          setInitialGoalIdForPlan(undefined);
        }}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
