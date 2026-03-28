import React, { useMemo } from 'react';
import styled, { useTheme } from 'styled-components/native';

import { CommonProgressBar } from '~/features/analysis/components/CommonProgressBar';
import { useProgressBar } from '~/features/analysis/hooks/useProgressBar';
import type { CategoryBudgetProgress, CategoryConfig, CategorySummary } from '~/features/analysis/types/analysis';
import { useBudgetStore } from '~/store/useBudgetStore';

/**
 * 單一分類預算卡片
 * 根據 spent/total 比例動態顯示 progress bar 與超支警示
 */
const BudgetCard = ({ label, spent, total, themeColor }: CategoryBudgetProgress) => {
    const theme = useTheme();
    const { status, widthInterpolation } = useProgressBar({ spent, total });
    const isOver = spent >= total;
    const overAmount = isOver ? spent - total : 0;

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

/**
 * 分類預算狀態總覽
 *
 * 從 Zustand store 讀取各分類預算上限，
 * 從 props summaries 取得各分類的實際支出，
 * 動態計算 progress 並顯示超支警示（紅色邊框 + 文字）
 */
export const CategoryBreakdownCard = ({
    title,
    categories,
    summaries,
}: {
    title: string;
    categories: CategoryConfig[];
    summaries: CategorySummary[];
}) => {
    const categoryBudgets = useBudgetStore(s => s.categoryBudgets);

    // 將 summaries 轉為 Map 方便查表
    const summaryMap = useMemo(() => {
        const map = new Map<string, number>();
        for (const s of summaries) {
            map.set(s.categoryId, s.total);
        }
        return map;
    }, [summaries]);

    // 動態建立每個分類的 BudgetProgress 資料
    const budgetItems: CategoryBudgetProgress[] = useMemo(() => {
        return categories.map(cat => ({
            categoryId: cat.id,
            label: cat.label,
            spent: summaryMap.get(cat.id) ?? 0,
            total: categoryBudgets[cat.id] ?? 0,
            themeColor: cat.color,
        }));
    }, [categories, summaryMap, categoryBudgets]);

    return (
        <Container contentContainerStyle={{ paddingBottom: 40 }}>
            <Title>{title}</Title>
            {budgetItems.map(item => (
                <BudgetCard key={item.categoryId} {...item} />
            ))}
        </Container>
    );
};

// ─── Styled Components ───

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

const LabelBox = styled.View`
    flex-direction: row;
    align-items: center;
`;

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

const ProgressBarTrack = styled.View`
    height: 12px;
    background-color: ${({ theme }) => theme.colors.black[10]};
    border-radius: 6px;
    overflow: hidden;
    position: relative;
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
