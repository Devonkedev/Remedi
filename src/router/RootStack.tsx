import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ReminderScreen from '../screens/reminder/ReminderScreen';
import PrescriptionScreen from '../screens/prescription/PrescriptionScreen';
import AddPrescriptionScreen from '../screens/prescription/AddPrescriptionScreen';
import HealthScreen from '../screens/health/HealthScreen';
import AddReminderScreen from '../screens/reminder/AddReminderScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../config/firebase';
import EditProfile from '../screens/profile/EditProfileScreen';
import AddHealthDataScreen from '../screens/health/AddHealthDataScreen';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      {/* Add other auth screens here if needed */}
    </Stack.Navigator>
  );
};


const HealthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="HealthScreen" component={HealthScreen} />
      <Stack.Screen name="AddHealthDataScreen" component={AddHealthDataScreen} />
      {/* Add other auth screens here if needed */}
    </Stack.Navigator>
  );
};

const PrescriptionStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="PrescriptionScreen" component={PrescriptionScreen} />
      <Stack.Screen name="AddPrescriptionScreen" component={AddPrescriptionScreen} />
      {/* Add other auth screens here if needed */}
    </Stack.Navigator>
  );
}
const ReminderStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="ReminderScreen" component={ReminderScreen} />
      <Stack.Screen name="AddReminderScreen" component={AddReminderScreen} />
      {/* Add other auth screens here if needed */}
    </Stack.Navigator>
  );
}

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      {/* Add other auth screens here if needed */}
    </Stack.Navigator>
  );
}

const BottomNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Prescription"
      // activeColor="#e91e63"
      // inactiveColor="#95a5a6"
      // barStyle={{ backgroundColor: '#ffffff' }}
    >
      <Tab.Screen
        name="Prescription"
        component={PrescriptionStack}
        options={{
          tabBarLabel: 'Prescriptions',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="pill" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Reminders"
        component={ReminderStack}
        options={{
          tabBarLabel: 'Reminders',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bell" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Health"
        component={HealthStack}
        options={{
          tabBarLabel: 'Health',
          tabBarIcon: ({ color }) => (
            <Ionicons name="body" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const RootStack = () => {
  const [user, setUser] = useState <User | null>(null)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log(user)
      setUser(user)
    })
  }, [])

  return (
    <View style={{ flex: 1 }}>
      {user ? <BottomNavigation /> : <AuthStack />}
    </View>
  );
};

export default RootStack;