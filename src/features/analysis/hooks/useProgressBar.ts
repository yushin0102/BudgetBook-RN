import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

interface UseProgressBarProps {
    spent: number;
    total: number;
    minFillPercent?: number;
}

export type ProgressStatus = 'normal' | 'warning' | 'danger';

/**
 * 自定義 Hook：用於計算進度條的狀態和動畫值
 * @param spent 已花費的金額
 * @param total 預算總額
 * @param minFillPercent 最小填充百分比，預設為1%
 * @returns 進度條的狀態、百分比和動畫寬度插值
 */
export const useProgressBar = ({ spent, total, minFillPercent = 1 }: UseProgressBarProps) => {
    const percentage = total > 0 ? (spent / total) * 100 : 0;
    const ratio = total > 0 ? spent / total : 0;

    const isWarning = ratio >= 0.9;
    const isDanger = spent >= total;
    const status: ProgressStatus = isDanger ? 'danger' : isWarning ? 'warning' : 'normal';

    const visiblePercentage = spent > 0 ? percentage : minFillPercent;
    const clampedPercentage = Math.min(Math.max(visiblePercentage, 0), 100);

    const animationValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animationValue, {
            toValue: clampedPercentage,
            duration: 1000,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();
    }, [clampedPercentage]);

    /**
     * 【插值運算】
     * Animated.Value 存的是數字 (0 -> 80)
     * 但 CSS width 需要的是字串 ('0%' -> '80%')
     * interpolate 負責做這個映射
     */
    const widthInterpolation = animationValue.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    return {
        status,
        percentage: Math.round(percentage), // 返回原始百分比給文字顯示用
        widthInterpolation,
        isOver: spent > total,
    };
};
