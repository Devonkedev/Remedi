import { Alert, Image, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Avatar, FAB, List, Surface, Text, Portal, Modal } from 'react-native-paper'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { getPrescriptions, logout } from '../../config/firebase'
import LogoutButton from '../../components/LogoutButton'
import CustomJuniorHeader from '../../components/CustomJuniorHeader'

const CustomHeader = () => {
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
          <Avatar.Image size={wp(18)} source={{ uri: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/47/6f/b1/476fb1a8-653c-58d2-5a6b-93c1a66d0335/AppIcon-0-0-1x_U007emarketing-0-5-0-85-220.png/512x512bb.jpg' }} />
        </View>
      </Surface>
      <View>
        <Text variant="titleLarge" style={{ textAlign: 'center' }}>Prescriptions</Text>
        <Text variant="titleMedium" style={{ textAlign: 'center' }}>
          Already you have 3 active reminders
        </Text>
      </View>
    </View>
  )
}


const CustomListCard = ({ data, onPress }) => {
  return (
    <Surface style={{
      marginVertical: 8,
      marginHorizontal: 16,
      padding: 10,
      borderRadius: 12,
      elevation: 4,
      backgroundColor: 'white',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
    }} onTouchEnd={onPress}>
      {
        data.imageBase64 ? (
          <Avatar.Image size={60} source={{ uri: data.imageBase64 }} />
        ) : (
          <Avatar.Icon size={60} icon="file-document-outline" />
        )
      }
      <View style={{ flex: 1 }}>
        <Text variant="titleMedium">{data.name || 'NA'}</Text>
        <Text variant="bodySmall">{data.detail || 'NA'}</Text>
      </View>
      <Text style={{ fontWeight: 'bold' }}>{data.type || 'NA'}</Text>
    </Surface>
  );
};




const PrescriptionScreen = ({ navigation }) => {
  const [prescriptions, setPrescriptions] = useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const fetchPrescriptions = async () => {
    try {
      const data = await getPrescriptions();
      setPrescriptions(data); // your state
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };


  const openModal = (item) => {
    setSelectedPrescription(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPrescription(null);
  };



  useEffect(() => {
    fetchPrescriptions();
    return (
      setPrescriptions([])
    )
  }, []);




  const handlePress = () => {
    navigation.navigate("AddPrescriptionScreen")
  }

  return (
    <View style={{
      flex: 1,
    }}>

      <CustomHeader />

      <List.Section>
        <CustomJuniorHeader label={'Prescriptions'} action={() => { }} />
        {
          prescriptions && prescriptions.length > 0 ? (
            prescriptions.map((item) => (
              <CustomListCard key={item.id} data={item} onPress={() => openModal(item)} />
            ))
          ) : (
            <ActivityIndicator />
          )
        }


        {/* <CustomListCard />
        <CustomListCard />
        <CustomListCard />
        <CustomListCard />
        <CustomListCard />
        <CustomListCard />
        <CustomListCard /> */}
      </List.Section>







      {/* ADD PRESCRIPTION */}
      <LogoutButton />

      {/* ADD PRESCRIPTION */}
      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        onPress={handlePress}
      />


      {/* MODAL */}
      <Portal>
        <Modal visible={modalVisible} onDismiss={closeModal} contentContainerStyle={{
          backgroundColor: 'white',
          padding: 20,
          margin: 20,
          borderRadius: 12,
        }}>
          {selectedPrescription && (
            <>
              {selectedPrescription.imageBase64 ? (
                <Image
                  style={{
                    width: wp(80),
                    height: hp(40),
                    alignSelf: 'center',
                    borderRadius: 12,
                    resizeMode: 'contain',
                  }}
                  source={{ uri: selectedPrescription.imageBase64 }}
                />
              ) : (
                <Avatar.Icon
                  size={100}
                  icon="image-off-outline"
                  style={{ alignSelf: 'center' }}
                />
              )}

              <Text variant="titleLarge" style={{ marginTop: 16 }}>
                {selectedPrescription.name}
              </Text>
              <Text variant="bodyMedium">
                {selectedPrescription.detail}
              </Text>
              <Text variant="bodySmall" style={{ marginTop: 8, color: 'gray' }}>
                {selectedPrescription.type}
              </Text>
            </>
          )}
        </Modal>
      </Portal>
    </View>
  )
}

export default PrescriptionScreen