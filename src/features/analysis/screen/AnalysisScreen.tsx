import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import styled from 'styled-components/native';

import { CategoryBreakdownCard } from '~/features/analysis/components/CategoryBreakdownCard';
import { DailySpendingTrendCard } from '~/features/analysis/components/DailySpendingTrendCard';
import { PeriodSegmentedControl } from '~/features/analysis/components/PeriodSegmentedControl';
import { RecentTransactionsCard } from '~/features/analysis/components/RecentTransactionsCard';
import { SummaryCards } from '~/features/analysis/components/SummaryCards';
import { useAnalysisMetrics } from '~/features/analysis/hooks/useAnalysisMetrics';
import { useAnalysisMockData } from '~/features/analysis/hooks/useAnalysisMockData';
import { useAnalysisPeriod } from '~/features/analysis/hooks/useAnalysisPeriod';
import { MainNavigatorParamList } from '~/navigation/type';

export const AnalysisScreen = () => {
    const { period, setPeriod } = useAnalysisPeriod();
    const { transactions, daily, categories } = useAnalysisMockData();
    const navigation = useNavigation<NavigationProp<MainNavigatorParamList>>();
    const vm = useAnalysisMetrics({ period, transactions, daily, categories });

    const dailyExpenseValues = useMemo(() => vm.daily.map(d => d.expenseTotal), [vm.daily]);

    const dailyAvg = useMemo(() => {
        if (!vm.daily.length) return 0;
        return Math.round(vm.daily.reduce((s, d) => s + d.expenseTotal, 0) / vm.daily.length);
    }, [vm.daily]);

    return (
        <Screen>
            <TopRow>
                <Title>本月總覽</Title>
                <PeriodSegmentedControl value={period} onChange={setPeriod} />
            </TopRow>

            <SectionGap />

            <SummaryCards
                totalExpense={vm.totalExpense}
                totalIncome={vm.totalIncome}
                net={vm.net}
                total={1000}
                spent={0}
            />

            <SectionGap />

            {/* <DailySpendingTrendCard
                title="每日消費趨勢"
                values={dailyExpenseValues}
                max={vm.maxDailyExpense}
                avg={dailyAvg}
            /> */}
            <DailySpendingTrendCard />

            <SectionGap />

            <CategoryBreakdownCard title="分類預算狀態" categories={vm.categories} summaries={vm.categorySummaries} />
            <SectionGap />

            <RecentTransactionsCard
                title="最近記錄"
                transactions={transactions}
                categories={categories}
                onPressSeeAll={() => {
                    navigation.navigate('Tab', {
                        screen: 'TabTransactions',
                    });
                }}
            />

            <BottomSpace />
        </Screen>
    );
};

const Screen = styled.ScrollView.attrs({
    contentContainerStyle: { paddingHorizontal: 22, paddingTop: 20 },
})`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.white};
`;

const TopRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const Title = styled.Text`
    font-size: 22px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.black[80]};
`;

const SectionGap = styled.View`
    height: 16px;
`;

const BottomSpace = styled.View`
    height: 28px;
`;
