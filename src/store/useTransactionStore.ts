import { create } from 'zustand';

import type Transaction from '~/features/transactions/types/transaction';

interface TransactionState {
    transactions: Transaction[];
    /** 分析頁面過濾模式：週 / 月 */
    filterMode: 'week' | 'month';
}

interface TransactionActions {
    /** 新增一筆交易 */
    addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt' | 'userId'>) => void;
    /** 更新一筆交易 */
    updateTransaction: (id: string, patch: Partial<Transaction>) => void;
    /** 刪除一筆交易 */
    removeTransaction: (id: string) => void;
    /** 恢復交易 */
    restoreTransaction: (tx: Transaction) => void;
    /** 切換過濾模式 */
    setFilterMode: (mode: 'week' | 'month') => void;
}

export type TransactionStore = TransactionState & TransactionActions;

export const useTransactionStore = create<TransactionStore>(set => ({
    transactions: [
        {
            id: 'tx_init_1',
            userId: 'mock-user',
            createdAt: Date.now(),
            mode: 'expense',
            amount: 85,
            note: '初期設定咖啡',
            dateISO: new Date().toISOString().split('T')[0],
            categoryId: 'food',
        },
    ],
    filterMode: 'month',

    addTransaction: tx =>
        set(state => ({
            transactions: [
                {
                    ...tx,
                    id: `tx_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                    userId: 'mock-user',
                    createdAt: Date.now(),
                },
                ...state.transactions,
            ],
        })),

    updateTransaction: (id, patch) =>
        set(state => ({
            transactions: state.transactions.map(t => (t.id === id ? { ...t, ...patch } : t)),
        })),

    removeTransaction: id =>
        set(state => ({
            transactions: state.transactions.filter(t => t.id !== id),
        })),

    restoreTransaction: tx =>
        set(state => {
            // Restore to the front, or optionally sort by date
            const newTransactions = [tx, ...state.transactions].sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
            return { transactions: newTransactions };
        }),

    setFilterMode: mode => set({ filterMode: mode }),
}));
