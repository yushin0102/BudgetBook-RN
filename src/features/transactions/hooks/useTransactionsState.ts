import { useMemo, useReducer } from 'react';

import { todayISO } from '~/features/expenseInput/utils';
import { MOCK_TRANSACTIONS } from '~/features/transactions/types/config';
import type Transaction from '~/features/transactions/types/transaction';
type Action =
    | { type: 'SET_ALL'; payload: Transaction[] }
    | { type: 'ADD'; payload: Transaction }
    | { type: 'UPDATE'; id: string; patch: Partial<Transaction> }
    | { type: 'RESTORE'; payload: Transaction }
    | { type: 'REMOVE'; id: string };

interface State {
    items: Transaction[];
}

const initialState: State = {
    items: MOCK_TRANSACTIONS,
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_ALL':
            return { ...state, items: action.payload };
        case 'ADD':
            return { ...state, items: [action.payload, ...state.items] };
        case 'UPDATE':
            return {
                ...state,
                items: state.items.map(item => (item.id === action.id ? { ...item, ...action.patch } : item)),
            };
        case 'REMOVE':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.id),
            };
        case 'RESTORE':
            return {
                ...state,
                items: [action.payload, ...state.items],
            };
        default:
            return state;
    }
}

/**
 * - 初次載入時 dispatch SET_ALL
 * - add/update/remove 時呼叫 Firestore 再 dispatch
 */
export const useTransactionsState = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const transactions = state.items;

    const addTransaction = (draft: {
        mode: Transaction['mode'];
        amount: number;
        note: string;
        date?: string;
        categoryId: Transaction['categoryId'];
        templateId?: string | null;
    }) => {
        const now = Date.now();
        const tx: Transaction = {
            id: `tx_${now}`,
            userId: 'mock-user',
            mode: draft.mode,
            amount: draft.amount,
            note: draft.note,
            date: draft.date ?? todayISO?.(),
            categoryId: draft.categoryId,
            templateId: draft.templateId ?? null,
            createdAt: now,
        };

        dispatch({ type: 'ADD', payload: tx });
    };

    const updateTransaction = (id: string, patch: Partial<Transaction>) => {
        dispatch({ type: 'UPDATE', id, patch });
    };

    const removeTransaction = (id: string) => {
        dispatch({ type: 'REMOVE', id });
    };

    const restoreTransaction = (tx: Transaction) => {
        dispatch({ type: 'RESTORE', payload: tx });
    };

    const sortedByDate = useMemo(
        () =>
            [...transactions].sort((a, b) => {
                if (a.date === b.date) return b.createdAt - a.createdAt;
                return a.date < b.date ? 1 : -1;
            }),
        [transactions],
    );

    return {
        transactions: sortedByDate,
        addTransaction,
        updateTransaction,
        removeTransaction,
        restoreTransaction,
    };
};
