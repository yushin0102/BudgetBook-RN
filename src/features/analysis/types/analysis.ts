export type Period = 'week' | 'month';

export type TxMode = 'expense' | 'income';

import type { TemplateCategoryId } from '~/features/expenseInput/types/template';

export type CategoryConfig = {
    id: TemplateCategoryId;
    label: string;
    color: string; // 用於 dot/bar
    icon: string; // MaterialIcons name
};

export type CategorySummary = {
    categoryId: TemplateCategoryId;
    total: number;
    ratio: number; // 0~1
};

export type DailyTotal = {
    dateISO: string;
    expenseTotal: number;
    incomeTotal: number;
};
export type CategoryBudgetProgress = {
    categoryId: TemplateCategoryId;
    label: string;
    spent: number;
    total: number;
    themeColor: string;
};
