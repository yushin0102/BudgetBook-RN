import React from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

import type { ModeFilter } from '~/features/transactions/hooks/useTransactionFilters';

type Mode = ModeFilter;
type IProps = {
    modeFilter: Mode;
    query: string;
    onChangeModeFilter: (m: Mode) => void;
    onChangeQuery: (text: string) => void;
};

export const TransactionFilterBar = ({ modeFilter, query, onChangeModeFilter, onChangeQuery }: IProps) => {
    return (
        <Container>
            <SearchBox placeholder="搜尋備註或類別..." value={query} onChangeText={onChangeQuery} />

            <TabRow>
                <FilterTab variant="all" active={modeFilter === 'all'} onPress={() => onChangeModeFilter('all')}>
                    <FilterText variant="all" active={modeFilter === 'all'}>
                        全部
                    </FilterText>
                </FilterTab>
                <FilterTab
                    variant="income"
                    active={modeFilter === 'income'}
                    onPress={() => onChangeModeFilter('income')}
                >
                    <FilterText variant="income" active={modeFilter === 'income'}>
                        ＋ 收入
                    </FilterText>
                </FilterTab>

                <FilterTab
                    variant="expense"
                    active={modeFilter === 'expense'}
                    onPress={() => onChangeModeFilter('expense')}
                >
                    <FilterText variant="expense" active={modeFilter === 'expense'}>
                        － 支出
                    </FilterText>
                </FilterTab>
            </TabRow>
        </Container>
    );
};

const Container = styled.View`
    width: 100%;
    padding: 16px 26px 26px 26px;
`;

const SearchBox = styled(TextInput)`
    width: 100%;
    background-color: #f5f5f5;
    border-radius: 12px;
    padding: 12px 16px;
    margin-bottom: 16px;
    font-size: 14px;
`;

const TabRow = styled.View`
    flex-direction: row;
    align-items: center;
`;

const FilterTab = styled(TouchableOpacity)<{ active: boolean; variant: string }>`
    padding: 8px 16px;
    margin-right: 10px;
    border-radius: 20px;
    background-color: ${({ active, variant, theme }) =>
        !active
            ? '#F5F5F5'
            : variant === 'income'
              ? theme.colors.main.success
              : variant === 'expense'
                ? theme.colors.secondary.coral
                : theme.colors.secondary.coral};
`;

const FilterText = styled.Text<{ active: boolean; variant?: string }>`
    color: ${({ active, variant, theme }) => (!active ? 'black' : variant === 'income' ? 'black' : theme.colors.white)};
    font-weight: ${({ active }) => (active ? '700' : '500')};
    font-size: 14px;
`;
