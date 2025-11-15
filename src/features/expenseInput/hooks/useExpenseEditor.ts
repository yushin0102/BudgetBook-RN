import { useCallback, useReducer } from 'react';

import type ExpenseDraft from '~/features/expenseInput/types/template';
import { QuickTemplate, TemplateCategoryId, TransactionType } from '~/features/expenseInput/types/template';

const todayISO = () => new Date().toISOString().split('T')[0];

type ExpenseDraftState = {
    draft: ExpenseDraft;
};

type ExpenseDraftAction =
    | { type: 'SET_MODE'; value: TransactionType }
    | { type: 'SET_AMOUNT'; value: number }
    | { type: 'SET_NOTE'; value: string }
    | { type: 'SET_DATE'; value: string }
    | { type: 'SET_CATEGORY'; value: TemplateCategoryId | null }
    | { type: 'SET_TEMPLATE_ID'; value: string | null }
    | { type: 'APPLY_TEMPLATE'; template: QuickTemplate }
    | { type: 'RESET'; payload?: Partial<ExpenseDraft> };

const createInitialDraft = (override?: Partial<ExpenseDraft>): ExpenseDraft => ({
    mode: 'expense',
    amount: 0,
    note: '',
    date: todayISO(),
    categoryId: null,
    templateId: null,
    ...override,
});

function expenseDraftReducer(state: ExpenseDraftState, action: ExpenseDraftAction): ExpenseDraftState {
    switch (action.type) {
        case 'SET_MODE':
            return { ...state, draft: { ...state.draft, mode: action.value } };
        case 'SET_AMOUNT':
            return { ...state, draft: { ...state.draft, amount: action.value } };
        case 'SET_NOTE':
            return { ...state, draft: { ...state.draft, note: action.value } };
        case 'SET_DATE':
            return { ...state, draft: { ...state.draft, date: action.value } };
        case 'SET_CATEGORY':
            return { ...state, draft: { ...state.draft, categoryId: action.value } };
        case 'SET_TEMPLATE_ID':
            return { ...state, draft: { ...state.draft, templateId: action.value } };
        case 'APPLY_TEMPLATE': {
            const tpl = action.template;
            return {
                ...state,
                draft: {
                    ...state.draft,
                    templateId: tpl.id,
                    amount: tpl.amount ?? state.draft.amount,
                    // 如果你的 QuickTemplate 裡有預設備註，可以在這邊一併帶入
                    // note: tpl.note ?? state.draft.note,
                    categoryId: tpl.categoryId ?? state.draft.categoryId,
                },
            };
        }
        case 'RESET':
            return { ...state, draft: createInitialDraft(action.payload) };
        default:
            return state;
    }
}

export function useExpenseEditor(initial?: Partial<ExpenseDraft>) {
    const [state, dispatch] = useReducer(expenseDraftReducer, {
        draft: createInitialDraft(initial),
    });

    const setMode = useCallback((value: TransactionType) => {
        dispatch({ type: 'SET_MODE', value });
    }, []);

    const setAmount = useCallback((value: number) => {
        dispatch({ type: 'SET_AMOUNT', value });
    }, []);

    const setNote = useCallback((value: string) => {
        dispatch({ type: 'SET_NOTE', value });
    }, []);

    const setDate = useCallback((value: string) => {
        dispatch({ type: 'SET_DATE', value });
    }, []);

    const setCategory = useCallback((value: TemplateCategoryId | null) => {
        dispatch({ type: 'SET_CATEGORY', value });
    }, []);

    const setTemplateId = useCallback((value: string | null) => {
        dispatch({ type: 'SET_TEMPLATE_ID', value });
    }, []);

    const applyTemplate = useCallback((template: QuickTemplate) => {
        dispatch({ type: 'APPLY_TEMPLATE', template });
    }, []);

    const resetDraft = useCallback((payload?: Partial<ExpenseDraft>) => {
        dispatch({ type: 'RESET', payload });
    }, []);

    return {
        draft: state.draft,
        setMode,
        setAmount,
        setNote,
        setDate,
        setCategory,
        setTemplateId,
        applyTemplate,
        resetDraft,
    };
}
