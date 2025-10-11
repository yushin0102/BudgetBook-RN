import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { TabNavigator } from '~/navigation/TabNavigator';
import { MainNavigatorParamList, navigatorScreenOptions } from '~/navigation/type';
type Props = {};
const mainStack = createNativeStackNavigator<MainNavigatorParamList>();
const { Navigator, Screen } = mainStack;

export const MainNavigator = ({}: Props) => {
    return (
        <Navigator screenOptions={navigatorScreenOptions}>
            <Screen name="Tab" component={TabNavigator} />
        </Navigator>
    );
};
