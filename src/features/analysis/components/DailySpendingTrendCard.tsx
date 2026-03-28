import React from 'react';
import styled from 'styled-components/native';

import { CommonProgressBar } from '~/features/analysis/components/CommonProgressBar';
import { useProgressBar } from '~/features/analysis/hooks/useProgressBar';
import { useBudgetStore } from '~/store/useBudgetStore';
import theme from '~/styles/theme';

interface Props {
    currentAverageSpent: number; // 實際的今日/日均總額
}

export const DailySpendingTrendCard = ({ currentAverageSpent }: Props) => {
    const idealAverageTotal = useBudgetStore(s => s.dailySpendingLimit);

    const { status, widthInterpolation } = useProgressBar({ spent: currentAverageSpent, total: idealAverageTotal });
    const percentage = Math.round(idealAverageTotal > 0 ? (currentAverageSpent / idealAverageTotal) * 100 : 0);

    const isOver = currentAverageSpent > idealAverageTotal;
    const alertColor = theme.colors.error.alert;

    return (
        <CardContainer style={isOver ? { borderWidth: 1, borderColor: alertColor } : null}>
            <Title>每日消費趨勢</Title>

            <StatsRow>
                <InfoBox style={{ marginLeft: 0 }}>
                    <InfoLabel style={isOver ? { color: alertColor, fontWeight: 'bold' } : null}>實際日均</InfoLabel>
                    <InfoValue color={isOver ? alertColor : theme.colors.secondary.mint}>
                        ${currentAverageSpent}
                    </InfoValue>
                </InfoBox>

                <InfoBox style={{ marginRight: 0 }}>
                    <InfoLabel>理想限額</InfoLabel>
                    <InfoValue color={theme.colors.secondary.coral}>${idealAverageTotal}</InfoValue>
                </InfoBox>
            </StatsRow>

            <ProgressTrack>
                <PercentageText>{percentage}%</PercentageText>
                <CommonProgressBar status={status} widthInterpolation={widthInterpolation} height={28} />
            </ProgressTrack>
            {isOver && <OverWarningText>⚠️ 每日花費已超過設定限額！</OverWarningText>}
        </CardContainer>
    );
};

const CardContainer = styled.View`
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 24px;
    padding: 16px 20px 24px 20px;
    /* 陰影設定 */
    shadow-color: #000;
    shadow-offset: 0px 4px;
    shadow-opacity: 0.05;
    shadow-radius: 15px;
    elevation: 3;
`;

const Title = styled.Text`
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 24px;
    color: ${({ theme }) => theme.colors.black[90]};
`;

const StatsRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 24px;
`;

const InfoBox = styled.View`
    flex: 1;
    background-color: #f9f9f9;
    border-radius: 16px;
    padding: 16px;
    align-items: center;
    margin: 0 6px;
`;

const InfoLabel = styled.Text`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.black[60]};
    margin-bottom: 8px;
`;

const InfoValue = styled.Text<{ color: string }>`
    font-size: 22px;
    font-weight: bold;
    color: ${props => props.color};
`;

const ProgressTrack = styled.View`
    height: 28px;
    background-color: #f2f2f2;
    border-radius: 14px;
    overflow: hidden;
    justify-content: center;
`;

const PercentageText = styled.Text`
    position: absolute;
    align-self: center;
    font-size: 14px;
    font-weight: bold;
    color: #ffffff;
    z-index: 1;
`;

const OverWarningText = styled.Text`
    font-size: 13px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.error.alert};
    margin-top: 14px;
    text-align: center;
`;
