import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import styled from 'styled-components/native';

import { CategoryBreakdownCard } from '~/features/analysis/components/CategoryBreakdownCard';
import { DailySpendingTrendCard } from '~/features/analysis/components/DailySpendingTrendCard';
import { PeriodSegmentedControl } from '~/features/analysis/components/PeriodSegmentedControl';
import { RecentTransactionsCard } from '~/features/analysis/components/RecentTransactionsCard';
import { SummaryCards } from '~/features/analysis/components/SummaryCards';
import { useAnalysisMetrics } from '~/features/analysis/hooks/useAnalysisMetrics';
import { CATEGORY_CONFIGS } from '~/features/analysis/hooks/useAnalysisMockData';
import type { DailyTotal } from '~/features/analysis/types/analysis';
import { MainNavigatorParamList } from '~/navigation/type';
import { useBudgetStore } from '~/store/useBudgetStore';
import { useTransactionStore } from '~/store/useTransactionStore';
import { getLocalISODate } from '~/utils/tools';

export const AnalysisScreen = () => {
    const navigation = useNavigation<NavigationProp<MainNavigatorParamList>>();

    // ─── ：月度總預算 & 全域交易紀錄 ───
    const monthlyTotalBudget = useBudgetStore(s => s.monthlyTotalBudget);
    const transactions = useTransactionStore(s => s.transactions);
    const filterMode = useTransactionStore(s => s.filterMode);
    const setFilterMode = useTransactionStore(s => s.setFilterMode);

    // ─── 過濾後的交易紀錄 ───
    const filteredTransactions = useMemo(() => {
        const now = new Date();

        if (filterMode === 'month') {
            // 月份過濾：直接取當下日期的 "YYYY-MM" 前綴來比對
            const currentMonthPrefix = getLocalISODate(now).substring(0, 7);
            return transactions.filter(tx => tx.dateISO.startsWith(currentMonthPrefix));
        }
        // 週過濾 (Mon - Sun)
        const dayOfWeek = now.getDay(); // 0 (Sun) - 6 (Sat)
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(now);
        monday.setDate(now.getDate() + diffToMonday);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        const monStr = getLocalISODate(monday);
        const sunStr = getLocalISODate(sunday);

        return transactions.filter(tx => tx.dateISO >= monStr && tx.dateISO <= sunStr);
    }, [transactions, filterMode]);

    // 動態計算每日總計 (DailyTotals) - 改用過濾後的資料
    const daily = useMemo(() => {
        const map = new Map<string, DailyTotal>();

        for (const tx of filteredTransactions) {
            if (!map.has(tx.dateISO)) {
                map.set(tx.dateISO, { dateISO: tx.dateISO, expenseTotal: 0, incomeTotal: 0 });
            }
            const current = map.get(tx.dateISO)!;
            if (tx.mode === 'expense') {
                current.expenseTotal += tx.amount;
            } else {
                current.incomeTotal += tx.amount;
            }
        }

        // 依日期遞減排序（近 -> 遠）
        return Array.from(map.values()).sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
    }, [filteredTransactions]);

    const categories = CATEGORY_CONFIGS;
    const vm = useAnalysisMetrics({ period: filterMode, transactions: filteredTransactions, daily, categories });

    const dailyAvg = useMemo(() => {
        if (!vm.daily.length) return 0;
        return Math.round(vm.daily.reduce((s, d) => s + d.expenseTotal, 0) / vm.daily.length);
    }, [vm.daily]);

    const displayTitle = filterMode === 'month' ? '本月總覽' : '本週總覽';

    return (
        <Screen>
            <TopRow>
                <Title>{displayTitle}</Title>
                <PeriodSegmentedControl value={filterMode} onChange={setFilterMode} />
            </TopRow>

            <SectionGap />

            <SummaryCards
                totalExpense={vm.totalExpense}
                totalIncome={monthlyTotalBudget - vm.totalExpense}
                net={vm.net}
                total={monthlyTotalBudget}
                spent={vm.totalExpense}
            />

            <SectionGap />

            <DailySpendingTrendCard currentAverageSpent={dailyAvg} />

            <SectionGap />

            <CategoryBreakdownCard title="分類預算狀態" categories={vm.categories} summaries={vm.categorySummaries} />

            <SectionGap />

            <RecentTransactionsCard
                title="最近記錄"
                transactions={filteredTransactions}
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
