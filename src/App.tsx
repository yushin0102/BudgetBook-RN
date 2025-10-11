import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, useColorScheme } from 'react-native';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components';

import { MainNavigator } from '~/navigation/MainNavigator';

import theme from './styles/theme';
const NavigationContainerStack = () => {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <NavigationContainer>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <MainNavigator />
        </NavigationContainer>
    );
};
function App() {
    return (
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <ThemeProvider theme={theme}>
                <NavigationContainerStack />
            </ThemeProvider>
        </SafeAreaProvider>
    );
}

export default App;
