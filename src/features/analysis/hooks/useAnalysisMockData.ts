import type { CategoryBudgetProgress, CategoryConfig, DailyTotal, Transaction } from '../types/analysis';

export const CATEGORY_CONFIGS: CategoryConfig[] = [
    { id: 'food', label: '餐飲', color: '#FFE0B2', icon: 'restaurant' },
    { id: 'transport', label: '交通', color: '#82B1FF', icon: 'directions-car' },
    { id: 'shopping', label: '購物', color: '#CBB8FF', icon: 'shopping-bag' },
    { id: 'saving', label: '存錢', color: '#A5F1D6', icon: 'savings' },
    { id: 'other', label: '其他', color: '#E0E0E0', icon: 'more-horiz' },
];

// export const MOCK_CATEGORY_BUDGET_PROGRESS: CategoryBudgetProgress[] = [
//     { categoryId: 'food', spent: 2400, limit: 3000, ratio: 0.8, remaining: 600, isOver: false },
//     { categoryId: 'transport', spent: 900, limit: 1000, ratio: 0.9, remaining: 100, isOver: false },
//     { categoryId: 'shopping', spent: 3900, limit: 3000, ratio: 1.3, remaining: -900, isOver: true },
// ];

export const useAnalysisMockData = () => {
    const transactions: Transaction[] = [
        { id: 't1', mode: 'expense', amount: 85, note: '星巴克咖啡', dateISO: '2025-11-15', categoryId: 'food' },
        { id: 't2', mode: 'expense', amount: 30, note: '捷運通勤', dateISO: '2025-11-15', categoryId: 'transport' },
        { id: 't3', mode: 'income', amount: 80000, note: '月薪', dateISO: '2025-11-10', categoryId: 'saving' },
        {
            id: 't4',
            mode: 'expense',
            amount: 1200,
            note: 'TPA 卡自動加值',
            dateISO: '2025-10-03',
            categoryId: 'transport',
        },
        { id: 't5', mode: 'expense', amount: 2600, note: '日用品', dateISO: '2025-11-08', categoryId: 'shopping' },
    ];

    const daily: DailyTotal[] = [
        { dateISO: '2025-11-11', expenseTotal: 320, incomeTotal: 0 },
        { dateISO: '2025-11-12', expenseTotal: 850, incomeTotal: 0 },
        { dateISO: '2025-11-13', expenseTotal: 120, incomeTotal: 0 },
        { dateISO: '2025-11-14', expenseTotal: 600, incomeTotal: 0 },
        { dateISO: '2025-11-15', expenseTotal: 115, incomeTotal: 0 },
    ];

    return { transactions, daily, categories: CATEGORY_CONFIGS };
};
