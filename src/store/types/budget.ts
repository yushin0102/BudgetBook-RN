import { TemplateCategoryId } from '~/features/expenseInput/types/template';

/**
 * 預算分類預設值（來自 UI Mockup）
 * 可於此處集中管理所有分類的初始預算金額
 */
export const DEFAULT_CATEGORY_BUDGETS: Record<string, number> = {
    food: 3000,
    commute: 1000,
    shopping: 2000,
    saving: 5000,
    other: 1000,
};

export const DEFAULT_MONTHLY_BUDGET = 10000;
export const DEFAULT_DAILY_LIMIT = 1000;

export interface BudgetState {
    /** 月度總預算 */
    monthlyTotalBudget: number;
    /** 每日消費限制 */
    dailySpendingLimit: number;
    /** 各分類的月度預算，key = TemplateCategoryId */
    categoryBudgets: Record<string, number>;
}

export interface BudgetActions {
    /** 更新單一分類預算 */
    updateCategoryBudget: (categoryId: string, amount: number) => void;
    /** 更新月度總預算 */
    updateTotalBudget: (amount: number) => void;
    /** 更新每日消費上限 */
    updateDailyLimit: (amount: number) => void;
    /** 重設所有預算為系統預設值 */
    resetToDefault: () => void;
    /** 批次更新所有分類預算（用於 Modal 儲存） */
    batchUpdateCategoryBudgets: (budgets: Record<string, number>) => void;
}

export type BudgetStore = BudgetState & BudgetActions;
