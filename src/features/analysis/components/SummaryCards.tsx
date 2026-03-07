import styled from 'styled-components/native';

import { CommonProgressBar } from '~/features/analysis/components/CommonProgressBar';
import { useProgressBar } from '~/features/analysis/hooks/useProgressBar';
import { formatCurrency } from '~/features/analysis/utils/formatters';
export const SummaryCards = ({
    total,
    spent,
    totalExpense,
    totalIncome,
    net,
}: {
    total: number;
    spent: number;
    totalExpense: number;
    totalIncome: number;
    net: number;
}) => {
    const { status, widthInterpolation } = useProgressBar({ spent, total });

    return (
        <>
            <Row>
                <Card>
                    <Label>總支出</Label>
                    <Value $tone="expense">{formatCurrency(totalExpense)}</Value>
                </Card>

                <Card>
                    <Label>剩餘預算</Label>
                    <Value $tone="income">{formatCurrency(totalIncome)}</Value>
                </Card>
            </Row>
            <CardBar>
                <Label>月度預算進度</Label>

                <BarTrack>
                    <CommonProgressBar status={status} widthInterpolation={widthInterpolation} />
                </BarTrack>

                <FooterLabels>
                    <FooterText>0%</FooterText>
                    <FooterText>100%</FooterText>
                </FooterLabels>
            </CardBar>
        </>
    );
};

const Row = styled.View`
    flex-direction: row;
    gap: 12px;
`;

const Card = styled.View`
    flex: 1;
    padding: 16px;
    border-radius: 18px;
    background-color: rgba(0, 0, 0, 0.03);
`;

const Label = styled.Text`
    color: ${({ theme }) => theme.colors.black[50]};
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 8px;
`;

const Value = styled.Text<{ $tone: 'income' | 'expense' }>`
    font-size: 22px;
    font-weight: 900;
    color: ${({ theme, $tone }) => ($tone === 'expense' ? theme.colors.secondary.coral : theme.colors.secondary.mint)};
`;

const CardBar = styled.View`
    margin-top: 20px;
    flex: 1;
    padding: 16px;
    border-radius: 18px;
    background-color: rgba(0, 0, 0, 0.03);
`;

const BarTrack = styled.View`
    width: 100%;
    height: 12px;
    border-radius: 6px;
    background-color: rgba(0, 0, 0, 0.08);
    overflow: hidden;
`;

const FooterLabels = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-top: 8px;
`;

const FooterText = styled.Text`
    font-size: 12px;
    color: ${({ theme }) => theme.colors.black[50]};
`;
