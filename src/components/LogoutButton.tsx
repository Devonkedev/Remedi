import { View, Text } from 'react-native'
import React from 'react'
import { FAB } from 'react-native-paper'
import { logout } from '../config/firebase'

const LogoutButton = () => {
    const handlePressLogout = () => {
        logout();
    }
    return (
        <>
            <FAB
                icon="exit-run"
                style={{
                    position: 'absolute',
                    margin: 16,
                    left: 0,
                    bottom: 0,
                }}
                onPress={handlePressLogout}
            />
        </>
    )
}

export default LogoutButton