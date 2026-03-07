export type Period = 'week' | 'month';

export type TxMode = 'expense' | 'income';

export type CategoryId = 'food' | 'transport' | 'shopping' | 'saving' | 'other';

export type Transaction = {
    id: string;
    mode: TxMode;
    amount: number;
    note: string;
    dateISO: string; // YYYY-MM-DD
    categoryId: CategoryId;
};

export type CategoryConfig = {
    id: CategoryId;
    label: string;
    color: string; // 用於 dot/bar
    icon: string; // MaterialIcons name
};

export type CategorySummary = {
    categoryId: CategoryId;
    total: number;
    ratio: number; // 0~1
};

export type DailyTotal = {
    dateISO: string;
    expenseTotal: number;
    incomeTotal: number;
};
export type CategoryBudgetProgress = {
    categoryId: CategoryId;
    label: string;
    spent: number;
    total: number;
    themeColor: string;
};
