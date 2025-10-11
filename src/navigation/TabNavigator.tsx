import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { Platform, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';

import { AnalysisScreen } from '~/features/analysis/screen/AnalysisScreen';
import { ExpenseInputScreen } from '~/features/expenseInput/screen/ExpenseInputScreen';
import { SettingScreen } from '~/features/settings/screens/SettingScreen';
import { TransactionScreen } from '~/features/transactions/screen/TransactionScreen';
import { MainNavigatorParamList, TabNavigatorParamList } from '~/navigation/type';
import theme from '~/styles/theme';

const tabStack = createBottomTabNavigator<TabNavigatorParamList>();
const { Navigator, Screen } = tabStack;

type Props = NativeStackScreenProps<MainNavigatorParamList, 'Tab'>;

export const TabNavigator = ({}: Props) => {
    const { bottom: safeAreaBottom } = useSafeAreaInsets();
    const isAndroid = Platform.OS === 'android';

    const tabBarStyle = useMemo(() => {
        if (isAndroid) {
            return {
                paddingTop: 35,
                height: 65,
            };
        } else if (safeAreaBottom == 0) {
            return {
                paddingTop: 0,
                height: 67,
            };
        } else {
            return {
                paddingTop: 15,
                height: 80,
            };
        }
    }, [isAndroid, safeAreaBottom]);

    return (
        <>
            <Navigator
                initialRouteName="TabExpenseInput"
                backBehavior="history"
                screenOptions={() => ({
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: tabBarStyle,
                })}
            >
                <Screen
                    name="TabExpenseInput"
                    component={() => <ExpenseInputScreen />}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TabBarItem $isAndroid={isAndroid}>
                                <IconBadge
                                    $focused={focused}
                                    colors={focused ? theme.colors.gradients.coral : ['transparent', 'transparent']}
                                >
                                    <MaterialIcons
                                        size={18}
                                        name={'home'}
                                        color={focused ? theme.colors.white : '#9E9E9E'}
                                    />
                                    <TabBarLabel $focused={focused}>{'記 帳'}</TabBarLabel>
                                </IconBadge>
                            </TabBarItem>
                        ),
                    }}
                />
                <Screen
                    name="TabTransactions"
                    component={() => <TransactionScreen />}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TabBarItem $isAndroid={isAndroid}>
                                <IconBadge
                                    $focused={focused}
                                    colors={focused ? theme.colors.gradients.coral : ['transparent', 'transparent']}
                                >
                                    <MaterialIcons
                                        size={18}
                                        name={'format-list-bulleted'}
                                        color={focused ? theme.colors.white : '#9E9E9E'}
                                    />
                                    <TabBarLabel $focused={focused}>{'清 單'}</TabBarLabel>
                                </IconBadge>
                            </TabBarItem>
                        ),
                    }}
                />
                <Screen
                    name="TabAnalysis"
                    component={() => <AnalysisScreen />}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TabBarItem $isAndroid={isAndroid}>
                                <IconBadge
                                    $focused={focused}
                                    colors={focused ? theme.colors.gradients.coral : ['transparent', 'transparent']}
                                >
                                    <MaterialIcons
                                        size={18}
                                        name={'analytics'}
                                        color={focused ? theme.colors.white : '#9E9E9E'}
                                    />
                                    <TabBarLabel $focused={focused}>{'分 析'}</TabBarLabel>
                                </IconBadge>
                            </TabBarItem>
                        ),
                    }}
                />
                <Screen
                    name="TabSettings"
                    component={() => <SettingScreen />}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TabBarItem $isAndroid={isAndroid}>
                                <IconBadge
                                    $focused={focused}
                                    colors={focused ? theme.colors.gradients.coral : ['transparent', 'transparent']}
                                >
                                    <MaterialIcons
                                        size={18}
                                        name={'settings'}
                                        color={focused ? theme.colors.white : '#9E9E9E'}
                                    />
                                    <TabBarLabel $focused={focused}>{'設 定'}</TabBarLabel>
                                </IconBadge>
                            </TabBarItem>
                        ),
                    }}
                />
            </Navigator>
        </>
    );
};

const TabBarItem = styled.View<{ $isAndroid: boolean }>`
    top: ${({ $isAndroid }) => ($isAndroid ? -6 : 0)}px;
    align-items: center;
    justify-content: center;
`;

const IconBadge = styled(LinearGradient).attrs({
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
})<{ $focused: boolean }>`
    width: 48px;
    height: 48px;
    border-radius: 16px;
    align-items: center;
    justify-content: center;

    /* iOS 陰影 */
    shadow-color: rgba(0, 0, 0, 0.25);
    shadow-opacity: 0.3;
    shadow-offset: 0px 8px;
    shadow-radius: 6px;

    /* Android 陰影 */
    elevation: ${({ $focused }) => ($focused ? 6 : 0)};
`;

const TabBarLabel = styled.Text<{ $focused: boolean }>`
    color: ${({ theme, $focused }) => ($focused ? theme.colors.white : theme.colors.black[70])};
    font-size: ${({ $focused }) => ($focused ? '12px' : '10px')};
    font-weight: ${({ $focused }) => ($focused ? '700' : '500')};
    line-height: 20px;
    text-align: center;
`;
