import type { CategorySummary, DailyTotal, Transaction } from '~/features/analysis/types/analysis';
import { clamp01 } from '~/features/analysis/utils/formatters';

// ---------- 提取自 useAnalysisMetrics 的純計算邏輯 ----------

function computeTotalExpense(transactions: Transaction[]): number {
    return transactions.filter(t => t.mode === 'expense').reduce((s, t) => s + t.amount, 0);
}

function computeTotalIncome(transactions: Transaction[]): number {
    return transactions.filter(t => t.mode === 'income').reduce((s, t) => s + t.amount, 0);
}

function computeCategorySummaries(transactions: Transaction[]): CategorySummary[] {
    const expenseTx = transactions.filter(t => t.mode === 'expense');
    const sum = expenseTx.reduce((s, t) => s + t.amount, 0) || 1;

    const map = new Map<string, number>();
    for (const t of expenseTx) {
        map.set(t.categoryId, (map.get(t.categoryId) || 0) + t.amount);
    }

    return Array.from(map.entries())
        .map(([categoryId, total]) => ({
            categoryId: categoryId as any,
            total,
            ratio: clamp01(total / sum),
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);
}

function computeMaxDailyExpense(daily: DailyTotal[]): number {
    return Math.max(...daily.map(d => d.expenseTotal), 1);
}

// ---------- Test Fixtures ----------

const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 't1', mode: 'expense', amount: 85, note: '咖啡', dateISO: '2025-11-15', categoryId: 'food' },
    { id: 't2', mode: 'expense', amount: 30, note: '捷運', dateISO: '2025-11-15', categoryId: 'transport' },
    { id: 't3', mode: 'income', amount: 80000, note: '月薪', dateISO: '2025-11-10', categoryId: 'saving' },
    { id: 't4', mode: 'expense', amount: 1200, note: '加值', dateISO: '2025-10-03', categoryId: 'transport' },
    { id: 't5', mode: 'expense', amount: 2600, note: '日用品', dateISO: '2025-11-08', categoryId: 'shopping' },
];

const MOCK_DAILY: DailyTotal[] = [
    { dateISO: '2025-11-11', expenseTotal: 320, incomeTotal: 0 },
    { dateISO: '2025-11-12', expenseTotal: 850, incomeTotal: 0 },
    { dateISO: '2025-11-13', expenseTotal: 120, incomeTotal: 0 },
    { dateISO: '2025-11-14', expenseTotal: 600, incomeTotal: 0 },
    { dateISO: '2025-11-15', expenseTotal: 115, incomeTotal: 0 },
];

// ---------- Tests ----------

describe('Analysis Metrics Calculations', () => {
    describe('computeTotalExpense', () => {
        it('should sum only expense transactions', () => {
            // 85 + 30 + 1200 + 2600 = 3915
            expect(computeTotalExpense(MOCK_TRANSACTIONS)).toBe(3915);
        });

        it('should return 0 for empty array', () => {
            expect(computeTotalExpense([])).toBe(0);
        });

        it('should return 0 when no expenses exist', () => {
            const incomeOnly: Transaction[] = [
                { id: 'i1', mode: 'income', amount: 5000, note: '', dateISO: '', categoryId: 'saving' },
            ];
            expect(computeTotalExpense(incomeOnly)).toBe(0);
        });
    });

    describe('computeTotalIncome', () => {
        it('should sum only income transactions', () => {
            expect(computeTotalIncome(MOCK_TRANSACTIONS)).toBe(80000);
        });
    });

    describe('net calculation', () => {
        it('should compute net = totalIncome - totalExpense', () => {
            const income = computeTotalIncome(MOCK_TRANSACTIONS);
            const expense = computeTotalExpense(MOCK_TRANSACTIONS);
            expect(income - expense).toBe(80000 - 3915);
        });
    });

    describe('computeCategorySummaries', () => {
        it('should group expenses by category and sort by total desc', () => {
            const summaries = computeCategorySummaries(MOCK_TRANSACTIONS);

            // shopping: 2600, transport: 1230, food: 85
            expect(summaries[0].categoryId).toBe('shopping');
            expect(summaries[0].total).toBe(2600);

            expect(summaries[1].categoryId).toBe('transport');
            expect(summaries[1].total).toBe(1230);

            expect(summaries[2].categoryId).toBe('food');
            expect(summaries[2].total).toBe(85);
        });

        it('should compute ratio correctly (each category / total expense)', () => {
            const summaries = computeCategorySummaries(MOCK_TRANSACTIONS);
            const totalExpense = 3915;

            expect(summaries[0].ratio).toBeCloseTo(2600 / totalExpense, 4);
            expect(summaries[1].ratio).toBeCloseTo(1230 / totalExpense, 4);
        });

        it('should limit to top 5 categories', () => {
            const summaries = computeCategorySummaries(MOCK_TRANSACTIONS);
            expect(summaries.length).toBeLessThanOrEqual(5);
        });

        it('should handle empty transactions gracefully', () => {
            const summaries = computeCategorySummaries([]);
            expect(summaries).toEqual([]);
        });
    });

    describe('computeMaxDailyExpense', () => {
        it('should return the max daily expense', () => {
            expect(computeMaxDailyExpense(MOCK_DAILY)).toBe(850);
        });

        it('should return at least 1 for empty daily array', () => {
            expect(computeMaxDailyExpense([])).toBe(1);
        });
    });
});
