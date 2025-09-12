import { View } from 'react-native'
import React from 'react'
import { Avatar, Surface, Text } from 'react-native-paper'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'

const CustomHeader = ({ label, subheading, image_url }) => {
    return (
      <View style={{
        gap: wp(10),
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Surface style={{
          width: wp(100),
          height: hp(10),
          position: 'relative',
          backgroundColor: 'skyblue',
        }}>
          {/* PHOTO */}
          <View style={{
            width: wp(20),
            height: wp(20),
            backgroundColor: 'white',
            borderRadius: wp(20),
            position: 'absolute',
            left: wp(40),
            top: hp(4),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Avatar.Image size={wp(18)} source={{ uri: image_url ? image_url : 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/47/6f/b1/476fb1a8-653c-58d2-5a6b-93c1a66d0335/AppIcon-0-0-1x_U007emarketing-0-5-0-85-220.png/512x512bb.jpg' }} />
          </View>
        </Surface>
        <View>
          <Text variant="titleLarge" style={{ textAlign: 'center' }}>{label || `NA`}</Text>
          <Text variant="titleMedium" style={{ textAlign: 'center' }}>
            {subheading || 'NA'}
          </Text>
        </View>
      </View>
    )
  }

export default CustomHeader