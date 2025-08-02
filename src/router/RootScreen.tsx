import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { PaperProvider } from 'react-native-paper'
// import { lightTheme } from '../utils/colors'
import RootStack from './RootStack'
import { NavigationContainer } from '@react-navigation/native'
import { colorPalette } from '../utils/colors'

const RootScreen = () => {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{
                flex: 1,
                // backgroundColor: 'black'
            }}>
                <PaperProvider theme={colorPalette.light}>
                    <NavigationContainer>
                        <RootStack />
                    </NavigationContainer>
                </PaperProvider>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default RootScreen