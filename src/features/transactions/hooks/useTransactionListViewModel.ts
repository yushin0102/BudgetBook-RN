import { useMemo } from 'react';

import { CATEGORY_MAP } from '~/features/expenseInput/types/config';
import type Transaction from '~/features/transactions/types/transaction';

import type { ModeFilter } from './useTransactionFilters';

type Params = {
    transactions: Transaction[];
    modeFilter: ModeFilter;
    query: string;
};

export const useTransactionListViewModel = ({ transactions, modeFilter, query }: Params) => {
    const filteredTransactions = useMemo(() => {
        const q = query.trim().toLowerCase();

        return transactions.filter(tx => {
            //  先過濾收入 / 支出 / 全部
            if (modeFilter !== 'all' && tx.mode !== modeFilter) {
                return false;
            }

            if (!q) return true;

            const category = CATEGORY_MAP[tx.categoryId];

            const noteMatch = tx.note.toLowerCase().includes(q);
            const categoryMatch = category?.label.toLowerCase().includes(q);
            return noteMatch || categoryMatch;
        });
    }, [transactions, modeFilter, query]);

    return {
        filteredTransactions,
    };
};
