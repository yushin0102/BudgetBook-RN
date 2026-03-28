import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';

import type Transaction from '~/features/transactions/types/transaction';

import type { CategoryConfig } from '../types/analysis';
import { formatCurrency } from '../utils/formatters';

export const RecentTransactionsCard = ({
    title,
    transactions,
    categories,
    onPressSeeAll,
}: {
    title: string;
    transactions: Transaction[];
    categories: CategoryConfig[];
    onPressSeeAll?: () => void;
}) => {
    const cfgMap = new Map(categories.map(c => [c.id, c]));

    return (
        <Card>
            <HeaderRow>
                <Title>{title}</Title>
                {!!onPressSeeAll && (
                    <SeeAll onPress={onPressSeeAll} activeOpacity={0.8}>
                        <SeeAllText>查看全部</SeeAllText>
                        <MaterialIcons name="chevron-right" size={18} color="rgba(0,0,0,0.45)" />
                    </SeeAll>
                )}
            </HeaderRow>

            {transactions.slice(0, 3).map(tx => {
                const cfg = cfgMap.get(tx.categoryId);
                const tone = tx.mode === 'expense' ? 'expense' : 'income';
                return (
                    <Row key={tx.id}>
                        <Left>
                            <Circle style={{ backgroundColor: cfg?.color || '#E0E0E0' }}>
                                <MaterialIcons name={(cfg?.icon as any) || 'more-horiz'} size={18} color="#fff" />
                            </Circle>

                            <TextWrap>
                                <Note numberOfLines={1}>{tx.note || '未命名'}</Note>
                                <Sub>{tx.dateISO}</Sub>
                            </TextWrap>
                        </Left>

                        <Amount $tone={tone}>
                            {tone === 'expense' ? '-' : '+'}
                            {formatCurrency(tx.amount).replace('-', '')}
                        </Amount>
                    </Row>
                );
            })}
        </Card>
    );
};

const Card = styled.View`
    padding: 18px;
    border-radius: 22px;
    background-color: #ffffff;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.06);
`;

const HeaderRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
`;

const Title = styled.Text`
    font-size: 18px;
    font-weight: 900;
    color: ${({ theme }) => theme.colors.black[90]};
`;

const SeeAll = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    gap: 2px;
`;

const SeeAllText = styled.Text`
    font-size: 13px;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.5);
`;

const Row = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-vertical: 12px;
`;

const Left = styled.View`
    flex-direction: row;
    align-items: center;
    flex: 1;
`;

const Circle = styled.View`
    width: 34px;
    height: 34px;
    border-radius: 17px;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
`;

const TextWrap = styled.View`
    flex: 1;
`;

const Note = styled.Text`
    font-size: 16px;
    font-weight: 900;
    color: ${({ theme }) => theme.colors.black[90]};
`;

const Sub = styled.Text`
    font-size: 12px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.black[50]};
    margin-top: 2px;
`;

const Amount = styled.Text<{ $tone: 'expense' | 'income' }>`
    font-size: 16px;
    font-weight: 900;
    color: ${({ theme, $tone }) => ($tone === 'expense' ? theme.colors.secondary.coral : theme.colors.secondary.mint)};
`;
