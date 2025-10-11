import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

export const navigatorScreenOptions: NativeStackNavigationOptions = {
    headerShown: false,
    animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
    animationTypeForReplace: 'push',
};
export type MainNavigatorParamList = {
    Tab: NavigatorScreenParams<TabNavigatorParamList>;
    Transaction: NavigatorScreenParams<TransactionNavigatorParamList>;
    Analysis: NavigatorScreenParams<AnalysisNavigatorParamList>;
    Settings: NavigatorScreenParams<SettingsNavigatorParamList>;
};

export type TabNavigatorParamList = {
    TabExpenseInput: undefined;
    TabTransactions: undefined;
    TabAnalysis: undefined;
    TabSettings: undefined;
};

export type ExpenseNavigatorParamList = {};

export type TransactionNavigatorParamList = {};
export type AnalysisNavigatorParamList = {};
export type SettingsNavigatorParamList = {};
