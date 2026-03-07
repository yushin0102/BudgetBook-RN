import React from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';

import { ProgressStatus } from '~/features/analysis/hooks/useProgressBar'; // 引用剛才定義的型別

interface CommonProgressBarProps {
    widthInterpolation: Animated.AnimatedInterpolation<string | number>;
    status: ProgressStatus;
    height?: number; // 允許額外自定義高度
}

/**
 * 通用進度條component
 * 高度傳入參數調整，預設為12px
 */
export const CommonProgressBar: React.FC<CommonProgressBarProps> = ({ widthInterpolation, status, height }) => {
    return (
        <Track style={height ? { height } : null}>
            <AnimatedFillBar status={status} style={{ width: widthInterpolation }} />
        </Track>
    );
};

const Track = styled.View`
    height: 12px;
    background-color: #eeeeee;
    border-radius: 14px;
    overflow: hidden;
    width: 100%;
`;

const AnimatedFillBar = styled(Animated.View)<{ status: 'normal' | 'warning' | 'danger' }>`
    height: 100%;
    border-radius: 14px;
    background-color: ${({ status, theme }) => {
        if (status === 'danger') return theme.colors.error.alert;
        if (status === 'warning') return theme.colors.secondary.coral;
        return theme.colors.secondary.mint;
    }};
`;
