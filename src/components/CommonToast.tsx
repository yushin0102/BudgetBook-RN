import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';

import { useUIStore } from '~/store/useUIStore';

export const CommonToast = () => {
    const { toastVisible, toastMessage, toastType, hideToast } = useUIStore();
    const insets = useSafeAreaInsets();

    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (toastVisible) {
            // Show toast
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: insets.top ? insets.top + 10 : 40,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto hide after 2 seconds
            const timer = setTimeout(() => {
                hideToast();
            }, 2000);

            return () => clearTimeout(timer);
        } else {
            // Hide toast
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: -100,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 350,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [toastVisible, hideToast, insets.top, translateY, opacity]);

    const isSuccess = toastType === 'success';

    return (
        <AnimatedContainer
            style={{
                transform: [{ translateY }],
                opacity,
            }}
            pointerEvents={toastVisible ? 'auto' : 'none'}
        >
            <ToastContent $isSuccess={isSuccess}>
                <IconWrap $isSuccess={isSuccess}>
                    <MaterialIcons
                        name={isSuccess ? 'check-circle' : 'error'}
                        size={20}
                        color={isSuccess ? '#69F0AE' : '#b42c2cff'}
                    />
                </IconWrap>
                <MessageText>{toastMessage}</MessageText>
            </ToastContent>
        </AnimatedContainer>
    );
};

const AnimatedContainer = styled(Animated.View)`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    align-items: center;
    z-index: 9999;
`;

const ToastContent = styled.View<{ $isSuccess: boolean }>`
    flex-direction: row;
    align-items: center;
    padding: 12px 20px;
    background-color: ${({ theme, $isSuccess }) =>
        $isSuccess ? theme.colors.secondary.mint : theme.colors.error.alert};
    border-radius: 24px;

    /* iOS 柔和陰影 */
    shadow-color: #000;
    shadow-opacity: 0.15;
    shadow-radius: 12px;
    shadow-offset: 0px 4px;

    /* Android 柔和陰影 */
    elevation: 2;
`;

const IconWrap = styled.View<{ $isSuccess: boolean }>`
    margin-right: 10px;
`;

const MessageText = styled.Text`
    font-size: 15px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.white};
`;
