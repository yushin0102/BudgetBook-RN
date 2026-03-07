import { useMemo } from 'react';

import { clamp01 } from '~/features/analysis/utils/formatters';

import type { CategoryConfig, CategorySummary, DailyTotal, Period, Transaction } from '../types/analysis';

export const useAnalysisMetrics = ({
    period,
    transactions,
    daily,
    categories,
}: {
    period: Period;
    transactions: Transaction[];
    daily: DailyTotal[];
    categories: CategoryConfig[];
}) => {
    // 先不做 period filter（之後接 Firebase 再做）
    const totalExpense = useMemo(
        () => transactions.filter(t => t.mode === 'expense').reduce((s, t) => s + t.amount, 0),
        [transactions],
    );

    const totalIncome = useMemo(
        () => transactions.filter(t => t.mode === 'income').reduce((s, t) => s + t.amount, 0),
        [transactions],
    );

    const net = totalIncome - totalExpense;

    const categorySummaries: CategorySummary[] = useMemo(() => {
        const expenseTx = transactions.filter(t => t.mode === 'expense');
        const sum = expenseTx.reduce((s, t) => s + t.amount, 0) || 1;

        const map = new Map<string, number>();
        for (const t of expenseTx) {
            map.set(t.categoryId, (map.get(t.categoryId) || 0) + t.amount);
        }

        return Array.from(map.entries())
            .map(([categoryId, total]) => ({ categoryId: categoryId as any, total, ratio: clamp01(total / sum) }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);
    }, [transactions]);

    const maxDailyExpense = useMemo(() => Math.max(...daily.map(d => d.expenseTotal), 1), [daily]);

    return { period, totalExpense, totalIncome, net, categorySummaries, daily, categories, maxDailyExpense };
};
