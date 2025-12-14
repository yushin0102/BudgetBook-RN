import styled from 'styled-components/native';

import { TransactionFilterBar } from '~/features/transactions/components/TransactionFilterBar';
import { TransactionList } from '~/features/transactions/components/TransactionList';
import { useTransactionFilters } from '~/features/transactions/hooks/useTransactionFilters';
import { useTransactionListViewModel } from '~/features/transactions/hooks/useTransactionListViewModel';
import { useTransactionsState } from '~/features/transactions/hooks/useTransactionsState';
export const TransactionScreen = () => {
    const { transactions, addTransaction, updateTransaction, removeTransaction, restoreTransaction } =
        useTransactionsState();
    const { modeFilter, query, onChangeModeFilter, onChangeQuery } = useTransactionFilters();
    const { filteredTransactions } = useTransactionListViewModel({ transactions, modeFilter, query });
    return (
        <ContentWrapper>
            <TransactionFilterBar
                modeFilter={modeFilter}
                query={query}
                onChangeModeFilter={onChangeModeFilter}
                onChangeQuery={onChangeQuery}
            />

            <TransactionList
                items={filteredTransactions}
                onPressEdit={(id, amount) => updateTransaction(id, { amount })}
                onPressDelete={tx => removeTransaction(tx.id)}
                onPressRestore={tx => restoreTransaction(tx)}
            />
        </ContentWrapper>
    );
};

const ContentWrapper = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.black[0]};
`;
