// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, initializeAuth, signInWithEmailAndPassword, signOut, UserCredential, getReactNativePersistence } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, orderBy, query, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCx8KtJgzOxtN79GQ5UEf5IjPliiPLrypM",
  authDomain: "remedi-expo.firebaseapp.com",
  databaseURL: "https://remedi-expo-default-rtdb.firebaseio.com",
  projectId: "remedi-expo",
  storageBucket: "remedi-expo.firebasestorage.app",
  messagingSenderId: "334172498513",
  appId: "1:334172498513:web:f07b738f9912cf9e252670",
  measurementId: "G-ZL77ZMTJ5J"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// export const auth = getAuth();
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


// AUTH **
// REGISTER - ROLES 
// Define User Profile Type
interface UserProfile {
  email: string;
  createdAt: Timestamp;
  profile: Record<string, unknown>; // Allows flexibility for future profile fields
}

// Register User Function
export const register = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user?.uid) throw new Error("User ID not found");

    // Create user profile document in Firestore
    const userProfile: UserProfile = {
      email: user.email ?? "", // Ensuring email is not undefined
      createdAt: Timestamp.now(),
      profile: {}, // Empty object for future profile data
    };
    try {
      await setDoc(doc(db, "users", user.uid), userProfile);
      console.log("User registered and added to Firestore:", user.uid);
    } catch (error) {
      console.log('Error addding data ', error);
    }

    return userCredential;
  } catch (error) {
    console.error("Error registering user:", (error as Error).message);
    throw error;
  }
};

// LOGIN
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user);
  } catch (error) {
    console.error("Error logging in:", error.message);
  }
};

// LOGOUT
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Error logging out:", error.message);
  }
};


// ADD REMINDER
// Add Reminder Function
export const addReminder = async (reminderData: {
  name: string;
  type: string;
  date: string; // yyyy-mm-dd format
  time: string; // hh:mm format
  detail: string;
}) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const reminder = {
      ...reminderData,
      createdAt: Timestamp.now(),
    };

    const ref = collection(db, 'users', user.uid, 'reminders');
    await addDoc(ref, reminder);
  } catch (error) {
    console.error('Error adding reminder:', error);
    throw error;
  }
};


export const fetchReminders = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const remindersRef = collection(db, 'users', user.uid, 'reminders');
    const q = query(remindersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const reminders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return reminders;
  } catch (error) {
    console.error('Error fetching reminders:', error);
    throw error;
  }
};


// PRESCRIPTION SCREEN
// Add Prescription Screen
type PrescriptionInput = {
  name: string;
  doctor: string;
  detail: string;
  type: string;
};

type PrescriptionResponse = {
  success: boolean;
  message: string;
  id?: string;
};

export const addPrescription = async (
  prescriptionData: PrescriptionInput
): Promise<PrescriptionResponse> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return {
        success: false,
        message: 'User not authenticated. Please log in.',
      };
    }

    // Add base64 image along with the rest of the prescription data
    const prescription = {
      ...prescriptionData,
      imageBase64: prescriptionData.imageBase64 || '', // make sure it's passed from frontend
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(
      collection(db, 'users', user.uid, 'prescriptions'),
      prescription
    );

    return {
      success: true,
      message: 'Prescription added successfully',
      id: docRef.id,
    };
  } catch (error: any) {
    console.error('Error adding prescription:', error);
    return {
      success: false,
      message: error?.message || 'An unexpected error occurred',
    };
  }
};


export const getPrescriptions = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const prescriptionsRef = collection(db, 'users', user.uid, 'prescriptions');
    const q = query(prescriptionsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const prescriptions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return prescriptions;
  } catch (error: any) {
    console.error('Error fetching prescriptions:', error);
    throw new Error(error?.message || 'Failed to fetch prescriptions');
  }
};



// PROFILE
export const getUserProfile = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const profileRef = doc(db, 'users', user.uid, 'profile', 'basic');
  const docSnap = await getDoc(profileRef);

  return docSnap.exists() ? docSnap.data() : {};
};

export const updateUserProfile = async (data: any) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const profileRef = doc(db, 'users', user.uid, 'profile', 'basic');
  await setDoc(profileRef, data, { merge: true });
};



export const saveHealthData = async (stats, logs) => {
  const uid = auth.currentUser?.uid;
  const userRef = doc(db, 'users', uid);

  await setDoc(userRef, {
    healthStats: stats, // plain object
    healthLogs: logs,   // array of { timestamp, description }
  }, { merge: true });
}

// Add Health Stat
export const addHealthStat = async (key: string, value: string) => {
  const uid = auth.currentUser?.uid
  if (!uid) return

  const statRef = doc(db, 'users', uid, 'healthStats', key)
  await setDoc(statRef, {
    key,
    value,
    timestamp: serverTimestamp(),
  })
}

// Add Health Log
export const addHealthLog = async (text: string) => {
  const uid = auth.currentUser?.uid
  if (!uid) return

  const logsRef = collection(db, 'users', uid, 'healthLogs')
  await addDoc(logsRef, {
    description: text,
    createdAt: serverTimestamp(),
  })
}
