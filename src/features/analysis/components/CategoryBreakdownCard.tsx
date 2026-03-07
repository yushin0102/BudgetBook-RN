import React from 'react';
import styled, { useTheme } from 'styled-components/native';

import { CommonProgressBar } from '~/features/analysis/components/CommonProgressBar';
import { useProgressBar } from '~/features/analysis/hooks/useProgressBar';
import type { CategoryBudgetProgress, CategoryConfig, CategorySummary } from '~/features/analysis/types/analysis';

const BudgetCard = ({ label, spent, total, themeColor }: CategoryBudgetProgress) => {
    const theme = useTheme();
    const { status, widthInterpolation } = useProgressBar({ spent, total });
    const isOver = spent > total;
    const overAmount = isOver ? spent - total : 0; // 計算超支金額

    return (
        <CardContainer style={isOver ? { borderWidth: 1, borderColor: theme.colors.error.alert } : null}>
            <HeaderRow>
                <LabelBox>
                    <ColorDot color={themeColor} />
                    <LabelText>{label}</LabelText>
                </LabelBox>
                <AmountBox>
                    <AmountText style={{ color: isOver ? theme.colors.error.alert : theme.colors.black[80] }}>
                        ${spent} / ${total}
                    </AmountText>
                    <StatusLabel isOver={isOver}>
                        {isOver ? `已超額 $${overAmount}` : `剩餘 $${total - spent}`}
                    </StatusLabel>
                </AmountBox>
            </HeaderRow>

            <ProgressBarTrack>
                <CommonProgressBar status={status} widthInterpolation={widthInterpolation} />
            </ProgressBarTrack>

            <FooterLabels>
                <FooterText>0%</FooterText>
                <FooterText>80%</FooterText>
                <FooterText>100%</FooterText>
            </FooterLabels>
        </CardContainer>
    );
};

const MOCK_DATA: CategoryBudgetProgress[] = [
    { categoryId: 'food', label: '餐飲', spent: 2400, total: 3000, themeColor: '#FFE0B2' },
    { categoryId: 'transport', label: '交通', spent: 900, total: 1000, themeColor: '#90CAF9' },
    { categoryId: 'shopping', label: '購物', spent: 3900, total: 3000, themeColor: '#EF9A9A' }, // 100% 測試
    { categoryId: 'other', label: '其他', spent: 0, total: 1000, themeColor: '#CE93D8' }, // 0% 測試
];

export const CategoryBreakdownCard = ({
    title,
    categories,
    summaries,
}: {
    title: string;
    categories: CategoryConfig[];
    summaries: CategorySummary[];
}) => {
    const cfgMap = new Map(categories.map(c => [c.id, c]));
    console.log('有什麼summaries', summaries);
    return (
        <Container contentContainerStyle={{ paddingBottom: 40 }}>
            <Title>{title}</Title>
            {MOCK_DATA.map(item => (
                <BudgetCard key={item.categoryId} {...item} />
            ))}
        </Container>
    );
};

const Container = styled.ScrollView`
    flex: 1;
    background-color: #f8f9fa;
    padding: 20px 20px 0px 20px;
`;

const Title = styled.Text`
    font-size: 22px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.black[80]};
    margin-bottom: 20px;
`;

const CardContainer = styled.View`
    background-color: #ffffff;
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 16px;
    /* iOS 陰影 */
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.05;
    shadow-radius: 10px;
    /* Android 陰影 */
    elevation: 2;
`;

const HeaderRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
`;

// 左側標籤區
const LabelBox = styled.View`
    flex-direction: row;
    align-items: center;
`;

// 顏色圓點
const ColorDot = styled.View<{ color: string }>`
    width: 24px;
    height: 24px;
    border-radius: 12px;
    margin-right: 10px;
    background-color: ${props => props.color};
`;

const LabelText = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.black[80]};
`;

// 右側金額區
const AmountBox = styled.View`
    align-items: flex-end;
`;

const AmountText = styled.Text`
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.black[80]};
`;
const StatusLabel = styled.Text<{ isOver: boolean }>`
    font-size: 12px;
    font-weight: bold;
    color: ${({ isOver, theme }) => (isOver ? theme.colors.error.alert : theme.colors.black[60])};
    margin-top: 4px;
`;

// 進度條軌道 (灰色背景)
const ProgressBarTrack = styled.View`
    height: 12px;
    background-color: ${({ theme }) => theme.colors.black[10]};
    border-radius: 6px;
    overflow: hidden;
    position: relative;
`;

// 底部百分比標示
const FooterLabels = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-top: 8px;
`;

const FooterText = styled.Text`
    font-size: 12px;
    color: ${({ theme }) => theme.colors.black[50]};
`;
