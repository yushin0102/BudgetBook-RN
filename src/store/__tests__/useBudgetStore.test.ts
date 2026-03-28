import { DEFAULT_CATEGORY_BUDGETS, DEFAULT_DAILY_LIMIT, DEFAULT_MONTHLY_BUDGET } from '~/store/types/budget';
import { useBudgetStore } from '~/store/useBudgetStore';

beforeEach(() => {
    useBudgetStore.getState().resetToDefault();
});

describe('useBudgetStore', () => {
    describe('initial state', () => {
        it('should have correct default monthlyTotalBudget', () => {
            const { monthlyTotalBudget } = useBudgetStore.getState();
            expect(monthlyTotalBudget).toBe(DEFAULT_MONTHLY_BUDGET);
        });

        it('should have correct default dailySpendingLimit', () => {
            const { dailySpendingLimit } = useBudgetStore.getState();
            expect(dailySpendingLimit).toBe(DEFAULT_DAILY_LIMIT);
        });

        it('should have correct default categoryBudgets', () => {
            const { categoryBudgets } = useBudgetStore.getState();
            expect(categoryBudgets).toEqual(DEFAULT_CATEGORY_BUDGETS);
        });
    });

    describe('updateTotalBudget', () => {
        it('should update monthlyTotalBudget to the given amount', () => {
            useBudgetStore.getState().updateTotalBudget(15000);
            expect(useBudgetStore.getState().monthlyTotalBudget).toBe(15000);
        });

        it('should not affect other state fields', () => {
            useBudgetStore.getState().updateTotalBudget(20000);
            expect(useBudgetStore.getState().dailySpendingLimit).toBe(DEFAULT_DAILY_LIMIT);
            expect(useBudgetStore.getState().categoryBudgets).toEqual(DEFAULT_CATEGORY_BUDGETS);
        });
    });

    describe('updateDailyLimit', () => {
        it('should update dailySpendingLimit', () => {
            useBudgetStore.getState().updateDailyLimit(2000);
            expect(useBudgetStore.getState().dailySpendingLimit).toBe(2000);
        });
    });

    describe('updateCategoryBudget', () => {
        it('should update a single category budget', () => {
            useBudgetStore.getState().updateCategoryBudget('food', 5000);
            expect(useBudgetStore.getState().categoryBudgets.food).toBe(5000);
        });

        it('should preserve other category budgets', () => {
            useBudgetStore.getState().updateCategoryBudget('food', 5000);
            expect(useBudgetStore.getState().categoryBudgets.commute).toBe(DEFAULT_CATEGORY_BUDGETS.commute);
        });

        it('should handle updating a new category that does not exist yet', () => {
            useBudgetStore.getState().updateCategoryBudget('fitness', 800);
            expect(useBudgetStore.getState().categoryBudgets.fitness).toBe(800);
        });
    });

    describe('batchUpdateCategoryBudgets', () => {
        it('should replace all category budgets at once', () => {
            const newBudgets = { food: 4000, commute: 1500, shopping: 3000 };
            useBudgetStore.getState().batchUpdateCategoryBudgets(newBudgets);
            expect(useBudgetStore.getState().categoryBudgets).toEqual(newBudgets);
        });

        it('should not affect monthlyTotalBudget or dailySpendingLimit', () => {
            useBudgetStore.getState().batchUpdateCategoryBudgets({ food: 9999 });
            expect(useBudgetStore.getState().monthlyTotalBudget).toBe(DEFAULT_MONTHLY_BUDGET);
            expect(useBudgetStore.getState().dailySpendingLimit).toBe(DEFAULT_DAILY_LIMIT);
        });
    });

    describe('resetToDefault', () => {
        it('should restore all state to initial defaults', () => {
            // 先改變所有值
            useBudgetStore.getState().updateTotalBudget(99999);
            useBudgetStore.getState().updateDailyLimit(5000);
            useBudgetStore.getState().updateCategoryBudget('food', 10000);

            // 重設
            useBudgetStore.getState().resetToDefault();

            const state = useBudgetStore.getState();
            expect(state.monthlyTotalBudget).toBe(DEFAULT_MONTHLY_BUDGET);
            expect(state.dailySpendingLimit).toBe(DEFAULT_DAILY_LIMIT);
            expect(state.categoryBudgets).toEqual(DEFAULT_CATEGORY_BUDGETS);
        });

        it('should produce a fresh object reference for categoryBudgets', () => {
            const before = useBudgetStore.getState().categoryBudgets;
            useBudgetStore.getState().resetToDefault();
            const after = useBudgetStore.getState().categoryBudgets;
            // 值相等但引用不同（避免意外 mutation）
            expect(after).toEqual(before);
            expect(after).not.toBe(DEFAULT_CATEGORY_BUDGETS); // spread 產生新物件
        });
    });
});
