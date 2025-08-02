import { View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomHeader from '../../components/CustomHeader';
import { Button, FAB, Surface, Text } from 'react-native-paper';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { auth, getUserProfile } from '../../config/firebase';
import CustomJuniorHeader from '../../components/CustomJuniorHeader';

const ProfileHealthSection = ({ item }) => (
  <Surface style={{
    padding: wp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderColor: '#ccc'
  }}>
    <Text variant='labelLarge' style={{ flex: 1 }}>{item.label}</Text>
    <Text variant='bodyMedium' style={{ flex: 1, textAlign: 'right' }}>{item.value || '-'}</Text>
  </Surface>
);

const ProfileScreen = ({ navigation }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    dob: '',
    phone: '',
    gender: '',
    address: '',
    language: '',
    timeZone: '',
    notificationPreference: '',
    accountStatus: '',
  });

  const handlePress = () => {
    navigation.navigate('EditProfile', { profileData });
  };



  const loadProfile = async () => {
    try {
      const data = await getUserProfile();
      if (data) setProfileData(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  useEffect(() => {

    loadProfile();

    return (
      setProfileData({
        name: '',
        email: '',
        dob: '',
        phone: '',
        gender: '',
        address: '',
        language: '',
        timeZone: '',
        notificationPreference: '',
        accountStatus: '',
      })
    )
  }, []);

  const profileSettings = [
    { key: 'name', label: 'Name', value: profileData.name },
    { key: 'email', label: 'Email', value: profileData.email },
    { key: 'dob', label: 'Date of Birth', value: profileData.dob },
    { key: 'phone', label: 'Phone', value: profileData.phone },
    { key: 'gender', label: 'Gender', value: profileData.gender },
    { key: 'address', label: 'Address', value: profileData.address },
    { key: 'language', label: 'Language', value: profileData.language },
    { key: 'timeZone', label: 'Time Zone', value: profileData.timeZone },
    { key: 'notificationPreference', label: 'Notification Preference', value: profileData.notificationPreference },
    { key: 'accountStatus', label: 'Account Status', value: profileData.accountStatus },
  ];

  return (
    <View style={{
      flex: 1,
    }}>
      <ScrollView contentContainerStyle={{ paddingBottom: wp(20) }}>
        <CustomHeader
          label="Profile"
          subheading="Here you can edit your profile."
          image_url="https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
        />

        <CustomJuniorHeader label={'Profile'} action={() => { }} />

        <View style={{ gap: wp(0), marginBottom: wp(6) }}>
          {profileSettings.map((item, index) => (
            <ProfileHealthSection key={index} item={item} />
          ))}
        </View>

        <Button onPress={() => auth.signOut()}> Logout </Button>
      </ScrollView>
      <FAB
        icon="pen"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        onPress={handlePress}
      />
    </View>
  );
};

export default ProfileScreen;
