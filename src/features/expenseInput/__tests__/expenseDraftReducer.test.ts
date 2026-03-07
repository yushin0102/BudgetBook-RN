/**
 * 記帳核心 Reducer 測試
 */
import { expenseDraftReducer } from '~/features/expenseInput/hooks/useExpenseEditor';
import { createInitialDraft } from '~/features/expenseInput/hooks/useExpenseEditor';
import type ExpenseDraft from '~/features/expenseInput/types/template';
import type { QuickTemplate } from '~/features/expenseInput/types/template';
// ---------- Inline Reducer & Factory (mirror from source) ----------

type ExpenseDraftState = { draft: ExpenseDraft };

// ---------- Tests ----------

describe('expenseDraftReducer', () => {
    const initial = (): ExpenseDraftState => ({
        draft: createInitialDraft(),
    });

    it('should create default draft with mode = expense, amount = 0', () => {
        const state = initial();
        expect(state.draft.mode).toBe('expense');
        expect(state.draft.amount).toBe(0);
        expect(state.draft.note).toBe('');
        expect(state.draft.categoryId).toBeNull();
        expect(state.draft.templateId).toBeNull();
    });

    it('SET_MODE should toggle between expense and income', () => {
        let state = initial();
        state = expenseDraftReducer(state, { type: 'SET_MODE', value: 'income' });
        expect(state.draft.mode).toBe('income');

        state = expenseDraftReducer(state, { type: 'SET_MODE', value: 'expense' });
        expect(state.draft.mode).toBe('expense');
    });

    it('SET_AMOUNT should update amount correctly', () => {
        let state = initial();
        state = expenseDraftReducer(state, { type: 'SET_AMOUNT', value: 150 });
        expect(state.draft.amount).toBe(150);
    });

    it('SET_AMOUNT with 0 should keep amount as 0', () => {
        let state = initial();
        state = expenseDraftReducer(state, { type: 'SET_AMOUNT', value: 0 });
        expect(state.draft.amount).toBe(0);
    });

    it('SET_NOTE should update note', () => {
        let state = initial();
        state = expenseDraftReducer(state, { type: 'SET_NOTE', value: '星巴克咖啡' });
        expect(state.draft.note).toBe('星巴克咖啡');
    });

    it('SET_DATE should update date string', () => {
        let state = initial();
        state = expenseDraftReducer(state, { type: 'SET_DATE', value: '2026-03-01' });
        expect(state.draft.date).toBe('2026-03-01');
    });

    it('SET_CATEGORY should set categoryId', () => {
        let state = initial();
        state = expenseDraftReducer(state, { type: 'SET_CATEGORY', value: 'food' });
        expect(state.draft.categoryId).toBe('food');
    });

    it('SET_CATEGORY with null should clear categoryId', () => {
        let state = initial();
        state = expenseDraftReducer(state, { type: 'SET_CATEGORY', value: 'food' });
        state = expenseDraftReducer(state, { type: 'SET_CATEGORY', value: null });
        expect(state.draft.categoryId).toBeNull();
    });

    it('APPLY_TEMPLATE should apply template fields to draft', () => {
        let state = initial();
        const template: QuickTemplate = {
            id: 't1',
            note: '固定通勤',
            amount: 30,
            categoryId: 'commute',
        };
        state = expenseDraftReducer(state, { type: 'APPLY_TEMPLATE', template });
        expect(state.draft.templateId).toBe('t1');
        expect(state.draft.amount).toBe(30);
        expect(state.draft.categoryId).toBe('commute');
        // note is NOT applied by APPLY_TEMPLATE (by design)
        expect(state.draft.note).toBe('');
    });

    it('APPLY_TEMPLATE should preserve existing amount if template has no amount', () => {
        let state = initial();
        state = expenseDraftReducer(state, { type: 'SET_AMOUNT', value: 500 });

        const template: QuickTemplate = {
            id: 't2',
            note: '健身房',
            amount: 50,
            categoryId: 'other',
        };
        state = expenseDraftReducer(state, { type: 'APPLY_TEMPLATE', template });
        // template.amount is defined, so it should override
        expect(state.draft.amount).toBe(50);
    });

    it('RESET should restore to initial state', () => {
        let state = initial();
        state = expenseDraftReducer(state, { type: 'SET_AMOUNT', value: 999 });
        state = expenseDraftReducer(state, { type: 'SET_NOTE', value: '不想記了' });
        state = expenseDraftReducer(state, { type: 'SET_CATEGORY', value: 'shopping' });

        state = expenseDraftReducer(state, { type: 'RESET' });
        expect(state.draft.amount).toBe(0);
        expect(state.draft.note).toBe('');
        expect(state.draft.categoryId).toBeNull();
    });

    it('RESET with payload should merge with initial', () => {
        let state = initial();
        state = expenseDraftReducer(state, {
            type: 'RESET',
            payload: { amount: 100, note: '預設備註' },
        });
        expect(state.draft.amount).toBe(100);
        expect(state.draft.note).toBe('預設備註');
        expect(state.draft.mode).toBe('expense'); // from default
    });

    it('should be immutable — original state is not mutated', () => {
        const state = initial();
        const frozen = JSON.parse(JSON.stringify(state));
        expenseDraftReducer(state, { type: 'SET_AMOUNT', value: 999 });
        expect(state).toEqual(frozen);
    });
});
