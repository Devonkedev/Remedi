import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior for all app states
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Call this at app startup (e.g., in App.tsx)
export const initializeNotifications = async () => {
  try {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.warn('Notification permission not granted');
      return false;
  }
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }
    return true;
  } catch (error) {
    console.error('Error initializing notifications:', error);
    return false;
  }
};

// Schedules two notifications: one at the scheduled time, one 5 seconds later
export const scheduleLocalNotification = async ({
  name,
  date,
  time,
  detail,
}: {
  name: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  detail?: string;
}): Promise<boolean> => {
  try {
    // Parse date and time
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const triggerDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
    const now = new Date();

    // Calculate time difference in seconds
    const secondsUntilTrigger = Math.floor((triggerDate.getTime() - now.getTime()) / 1000);
    if (secondsUntilTrigger < 1) {
      console.warn('Cannot schedule notification for past time');
      return false;
    }

    // Schedule first notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: name,
        body: detail || 'Reminder',
        sound: 'default',
        data: { name, date, time, detail, notificationId: 'first' },
        priority: Platform.OS === 'android' ? Notifications.AndroidNotificationPriority.HIGH : undefined,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntilTrigger,
      },
    });

    // Schedule second notification 5 seconds after the first one
    await Notifications.scheduleNotificationAsync({
      content: {
        title: name,
        body: detail || 'Reminder',
        sound: 'default',
        data: { name, date, time, detail, notificationId: 'second' },
        priority: Platform.OS === 'android' ? Notifications.AndroidNotificationPriority.HIGH : undefined,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntilTrigger + 5,
      },
    });

    console.log('Two notifications successfully scheduled');
    return true;
  } catch (error) {
    console.error('Error scheduling local notification:', error);
    return false;
  }
};

// Utility to cancel all scheduled notifications
export const cancelAllScheduledNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

// Utility to get all scheduled notifications
export const getAllScheduledNotifications = async () => {
  return await Notifications.getAllScheduledNotificationsAsync();
};