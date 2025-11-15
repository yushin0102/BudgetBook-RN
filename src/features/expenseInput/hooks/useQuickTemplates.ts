import { useCallback, useReducer } from 'react';

import { QuickTemplate } from '~/features/expenseInput/types/template';

type QuickTemplatesState = {
    items: QuickTemplate[];
};

type QuickTemplatesAction =
    | { type: 'ADD'; template: QuickTemplate }
    | { type: 'UPDATE'; template: QuickTemplate }
    | { type: 'DELETE'; id: string }
    | { type: 'REPLACE_ALL'; templates: QuickTemplate[] };

function quickTemplatesReducer(state: QuickTemplatesState, action: QuickTemplatesAction): QuickTemplatesState {
    switch (action.type) {
        case 'ADD':
            return { ...state, items: [...state.items, action.template] };
        case 'UPDATE':
            return {
                ...state,
                items: state.items.map(t => (t.id === action.template.id ? action.template : t)),
            };
        case 'DELETE':
            return { ...state, items: state.items.filter(t => t.id !== action.id) };
        case 'REPLACE_ALL':
            return { ...state, items: action.templates };
        default:
            return state;
    }
}

export function useQuickTemplates(initialTemplates: QuickTemplate[] = []) {
    const [state, dispatch] = useReducer(quickTemplatesReducer, {
        items: initialTemplates,
    });

    const addTemplate = useCallback((tpl: QuickTemplate) => {
        dispatch({ type: 'ADD', template: tpl });
    }, []);

    const updateTemplate = useCallback((tpl: QuickTemplate) => {
        dispatch({ type: 'UPDATE', template: tpl });
    }, []);

    const removeTemplate = useCallback((id: string) => {
        dispatch({ type: 'DELETE', id });
    }, []);

    const setTemplates = useCallback((templates: QuickTemplate[]) => {
        dispatch({ type: 'REPLACE_ALL', templates });
    }, []);

    return {
        templates: state.items,
        addTemplate,
        updateTemplate,
        removeTemplate,
        setTemplates,
    };
}
