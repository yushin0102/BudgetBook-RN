import { create } from 'zustand';

import {
    BudgetStore,
    DEFAULT_CATEGORY_BUDGETS,
    DEFAULT_DAILY_LIMIT,
    DEFAULT_MONTHLY_BUDGET,
} from '~/store/types/budget';

/**
 * Zustand Store：預算全域管理
 *
 * 管理月度總預算、每日消費限制、各分類預算
 * 目前為 client-side only，結構已預留 Firebase 整合接口
 *
 * 使用方式：
 *   const budget = useBudgetStore(s => s.monthlyTotalBudget);
 *   const update = useBudgetStore(s => s.updateTotalBudget);
 */
export const useBudgetStore = create<BudgetStore>(set => ({
    // ─── State ───
    monthlyTotalBudget: DEFAULT_MONTHLY_BUDGET,
    dailySpendingLimit: DEFAULT_DAILY_LIMIT,
    categoryBudgets: { ...DEFAULT_CATEGORY_BUDGETS },

    // ─── Actions ───
    updateCategoryBudget: (categoryId, amount) =>
        set(state => ({
            categoryBudgets: {
                ...state.categoryBudgets,
                [categoryId]: amount,
            },
        })),

    updateTotalBudget: amount =>
        set(() => ({
            monthlyTotalBudget: amount,
        })),

    updateDailyLimit: amount =>
        set(() => ({
            dailySpendingLimit: amount,
        })),

    resetToDefault: () =>
        set(() => ({
            monthlyTotalBudget: DEFAULT_MONTHLY_BUDGET,
            dailySpendingLimit: DEFAULT_DAILY_LIMIT,
            categoryBudgets: { ...DEFAULT_CATEGORY_BUDGETS },
        })),

    batchUpdateCategoryBudgets: budgets =>
        set(() => ({
            categoryBudgets: { ...budgets },
        })),
}));
