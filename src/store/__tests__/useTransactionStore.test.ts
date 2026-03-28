import type Transaction from '~/features/transactions/types/transaction';
import { useTransactionStore } from '~/store/useTransactionStore';

describe('useTransactionStore', () => {
    beforeEach(() => {
        // 重設 store 狀態，避免 state cross-contamination
        useTransactionStore.setState({
            transactions: [],
        });
    });

    it('should initialize with empty array if state is reset', () => {
        const state = useTransactionStore.getState();
        expect(state.transactions).toEqual([]);
    });

    describe('addTransaction', () => {
        it('should add a transaction and generate a unique id', () => {
            const txDraft: Omit<Transaction, 'id' | 'createdAt' | 'userId'> = {
                mode: 'expense',
                amount: 150,
                note: 'Test Coffee',
                dateISO: '2025-01-01',
                categoryId: 'food',
            };

            useTransactionStore.getState().addTransaction(txDraft);

            const state = useTransactionStore.getState();
            expect(state.transactions.length).toBe(1);

            const savedTx = state.transactions[0];
            expect(savedTx.id).toBeDefined();
            expect(savedTx.id.startsWith('tx_')).toBe(true);
            expect(savedTx.amount).toBe(150);
            expect(savedTx.note).toBe('Test Coffee');
        });

        it('should prepend the new transaction to the front of the array (LIFO)', () => {
            const store = useTransactionStore.getState();

            store.addTransaction({
                mode: 'expense',
                amount: 100,
                note: 'First',
                dateISO: '2025-01-01',
                categoryId: 'shopping',
            });

            store.addTransaction({
                mode: 'income',
                amount: 5000,
                note: 'Second',
                dateISO: '2025-01-02',
                categoryId: 'saving',
            });

            const state = useTransactionStore.getState();
            expect(state.transactions.length).toBe(2);
            expect(state.transactions[0].note).toBe('Second'); // 後加的在最前面
            expect(state.transactions[1].note).toBe('First');
        });
    });
});
