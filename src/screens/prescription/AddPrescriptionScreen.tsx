import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { Appbar, Button, TextInput, Menu } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { addPrescription } from '../../config/firebase';

const OPTIONS = [
  { label: 'Medicine', value: 'medicine' },
  { label: 'X-ray', value: 'x-ray' },
  { label: 'MRI', value: 'mri' },
  { label: 'Lab Report', value: 'lab' },
  { label: 'Other', value: 'other' },
];

const AddPrescriptionScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [doctor, setDoctor] = useState('');
  const [detail, setDetail] = useState('');
  const [type, setType] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const takePicture = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission denied', 'Camera access is required.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        setImageBase64(`data:image/jpeg;base64,${asset.base64}`);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture');
    }
  };

  const selectFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission denied', 'Gallery access is required.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        setImageBase64(`data:image/jpeg;base64,${asset.base64}`);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: takePicture },
        { text: 'Gallery', onPress: selectFromGallery },
        { text: 'Cancel', style: 'cancel' }
      ],
      { cancelable: true }
    );
  };

  const handleSave = async () => {
    if (!name || !doctor || !detail || !type) {
      Alert.alert('Missing Info', 'Please fill all required fields.');
      return;
    }

    if (!imageBase64) {
      Alert.alert('Missing Image', 'Please capture or select an image.');
      return;
    }

    setLoading(true);

    try {
      const prescription = {
        name: name.trim(),
        doctor: doctor.trim(),
        detail: detail.trim(),
        type,
        imageBase64,
        createdAt: new Date(),
      };

      await addPrescription(prescription);

      Alert.alert('Success', 'Prescription saved!', [
        { text: 'OK', onPress: () => navigation.navigate('PrescriptionScreen') }
      ]);
    } catch (error) {
      console.error('Error saving prescription:', error);
      Alert.alert('Error', 'Something went wrong while saving.');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedTypeLabel = () => {
    const selected = OPTIONS.find(opt => opt.value === type);
    return selected ? selected.label : 'Select prescription type';
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add Prescription" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          label="Prescription Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          returnKeyType="next"
        />

        <TextInput
          label="Doctor Name"
          value={doctor}
          onChangeText={setDoctor}
          mode="outlined"
          style={styles.input}
          returnKeyType="next"
        />

        {/* Custom Dropdown using Menu */}
        <Menu
          visible={dropdownVisible}
          onDismiss={() => setDropdownVisible(false)}
          anchor={
            <Button 
              mode="outlined" 
              onPress={() => setDropdownVisible(true)}
              style={[styles.dropdownButton]}
              contentStyle={styles.dropdownContent}
              labelStyle={{
                textAlign: 'left',
                color: type ? '#000' : '#666',
              }}
            >
              {getSelectedTypeLabel()}
            </Button>
          }
          contentStyle={styles.menuContent}
        >
          {OPTIONS.map((option) => (
            <Menu.Item
              key={option.value}
              onPress={() => {
                setType(option.value);
                setDropdownVisible(false);
              }}
              title={option.label}
              titleStyle={{
                color: type === option.value ? '#6200ea' : '#000'
              }}
            />
          ))}
        </Menu>

        <TextInput
          label="Prescription Detail"
          value={detail}
          onChangeText={setDetail}
          mode="outlined"
          multiline
          numberOfLines={5}
          style={[styles.input, styles.detailInput]}
          returnKeyType="done"
        />

        <Button 
          icon="camera" 
          mode="outlined" 
          onPress={showImageOptions}
          style={styles.imageButton}
        >
          {imageUri ? 'Change Image' : 'Add Prescription Image'}
        </Button>

        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        )}

        <Button 
          mode="contained" 
          loading={loading} 
          onPress={handleSave} 
          style={styles.saveButton}
          disabled={loading}
          icon="content-save"
        >
          Save Prescription
        </Button>
      </ScrollView>
    </>
  );
};

export default AddPrescriptionScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  input: {
    marginBottom: 16,
  },
  detailInput: {
    height: 120,
  },
  dropdownButton: {
    justifyContent: 'flex-start',
    paddingVertical: 8,
    marginBottom: 16,
  },
  dropdownContent: {
    justifyContent: 'flex-start',
  },
  menuContent: {
    marginTop: 8,
  },
  imageButton: {
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  saveButton: {
    marginTop: 8,
  },
});