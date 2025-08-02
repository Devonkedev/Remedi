import { View } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { Text } from 'react-native-paper'

const CustomJuniorHeader = ({ label, action }) => {
    return (
        <>
            <View style={{
                marginTop: wp(6),
                padding: wp(2),
            }}>
                <Text variant='titleMedium'>{label ? label : "NA"}</Text>
            </View>
        </>
    )
}

export default CustomJuniorHeader