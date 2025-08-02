import { View, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomHeader from '../../components/CustomHeader';
import { Button, FAB, TextInput } from 'react-native-paper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { auth, getUserProfile, updateUserProfile } from '../../config/firebase';

const EditProfileScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profile = await getUserProfile();
        setName(profile.name || '');
        setEmail(profile.email || '');
        setDob(profile.dob || '');
        setPhone(profile.phone || '');
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        Alert.alert('Error', 'Unable to fetch profile data.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await updateUserProfile({
        name,
        email,
        dob,
        phone,
      });
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  // const handleLogout = async () => {
  //   await auth.signOut();
  // };

  return (
    <View style={{
      flex: 1,
    }}>
      <ScrollView contentContainerStyle={{ padding: wp(4) }}>
        <CustomHeader
          label={'Profile'}
          subheading={'Here you can edit your profile.'}
          image_url={
            'https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg'
          }
        />

        <View style={{ marginBottom: wp(6) }}>
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            style={{ marginBottom: wp(3) }}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ marginBottom: wp(3) }}
          />
          <TextInput
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={{ marginBottom: wp(3) }}
          />
          <TextInput
            label="Date of Birth (YYYY-MM-DD)"
            value={dob}
            onChangeText={setDob}
            placeholder="1990-05-15"
            style={{ marginBottom: wp(3) }}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleSaveProfile}
          loading={loading}
          disabled={loading}
          style={{ marginBottom: wp(5) }}
        >
          Save Profile
        </Button>

        {/* <Button mode="outlined" onPress={handleLogout}>
        Logout
      </Button> */}

        <Button mode="outlined" onPress={() => {
          navigation.replace("ProfileScreen");
        }}>
          Exit
        </Button>


      </ScrollView>
      <FAB
        icon="pen"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        onPress={handleSaveProfile}
      />
    </View>
  );
};

export default EditProfileScreen;
