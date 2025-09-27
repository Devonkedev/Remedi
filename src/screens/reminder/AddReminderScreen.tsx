import { View, Alert } from 'react-native';
import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, TextInput, Menu, Divider } from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';
import CustomHeader from '../../components/CustomHeader';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { addReminder } from '../../config/firebase';
import * as Notifications from 'expo-notifications';
import { scheduleLocalNotification } from '../../utils/notification';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

const OPTIONS = [
    { label: 'Medicine', value: 'medicine' },
    { label: 'Doctor Appointment', value: 'doctor' },
    { label: 'Vaccination', value: 'vaccination' },
    { label: 'Other', value: 'other' },
];

const AddReminderScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [inputDate, setInputDate] = useState(new Date());
    const [time, setTime] = useState('');
    const [detail, setDetail] = useState('');
    const [timeVisible, setTimeVisible] = useState(false);
    const [dateVisible, setDateVisible] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);

        if (!name || !type || !inputDate || !time) {
            Alert.alert("Error", "Please fill all required fields");
            setLoading(false);
            return;
        }

        const reminderData = {
            name,
            type,
            date: inputDate.toISOString().split('T')[0],
            time,
            detail,
        };

        try {
            await addReminder(reminderData);
            await scheduleLocalNotification(reminderData);

            Alert.alert("Success", "Reminder saved!", [
                { text: "OK", onPress: () => navigation.navigate("ReminderScreen") }
            ]);
        } catch (error) {
            console.error("Error saving reminder:", error);
            Alert.alert("Error", "Failed to save reminder");
        }
        setLoading(false);
    };

    const onTimeConfirm = ({ hours, minutes }) => {
        setTimeVisible(false);
        const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        setTime(formatted);
    };

    const onDateChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setDateVisible(false);
        }

        if (selectedDate && event.type !== 'dismissed') {
            setInputDate(selectedDate);
        }
    };

    const formatDate = (date) => {
        if (!date) return 'Select Date';
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getSelectedTypeLabel = () => {
        const selected = OPTIONS.find(opt => opt.value === type);
        return selected ? selected.label : 'Select reminder type';
    };

    return (
        <ScrollView contentContainerStyle={{
            gap: wp(5),
            paddingHorizontal: wp(5),
            paddingBottom: wp(10),
        }}>
            <CustomHeader
                label="Add Reminder"
                subheading="Here you can add your reminders"
                image_url="https://static.vecteezy.com/system/resources/previews/029/722/371/non_2x/reminder-icon-in-trendy-flat-style-isolated-on-white-background-reminder-silhouette-symbol-for-your-website-design-logo-app-ui-illustration-eps10-free-vector.jpg"
            />

            <TextInput
                label="Enter the reminder name here"
                value={name}
                onChangeText={setName}
                mode="outlined"
            />

            {/* Custom Dropdown using Menu */}
            <Menu
                visible={dropdownVisible}
                onDismiss={() => setDropdownVisible(false)}
                anchor={
                    <Button
                        mode="outlined"
                        onPress={() => setDropdownVisible(true)}
                        style={{
                            justifyContent: 'flex-start',
                            paddingVertical: 8,
                        }}
                        contentStyle={{
                            justifyContent: 'flex-start',
                        }}
                        labelStyle={{
                            textAlign: 'left',
                            color: type ? '#000' : '#666',
                        }}
                    >
                        {getSelectedTypeLabel()}
                    </Button>
                }
                contentStyle={{ marginTop: wp(2) }}
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

            {/* Custom Date Picker */}
            <Button
                mode="outlined"
                onPress={() => setDateVisible(true)}
                style={{
                    justifyContent: 'flex-start',
                    paddingVertical: 8,
                }}
                contentStyle={{
                    justifyContent: 'flex-start',
                }}
                icon="calendar"
            >
                {formatDate(inputDate)}
            </Button>

            {dateVisible && (
                <DateTimePicker
                    value={inputDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                    minimumDate={new Date()}
                />
            )}

            {/* Time Picker */}
            <Button
                onPress={() => setTimeVisible(true)}
                mode="outlined"
                style={{
                    justifyContent: 'flex-start',
                    paddingVertical: 8,
                }}
                contentStyle={{
                    justifyContent: 'flex-start',
                }}
                icon="clock"
            >
                {time ? `Time: ${time}` : 'Pick time'}
            </Button>

            <TimePickerModal
                visible={timeVisible}
                onDismiss={() => setTimeVisible(false)}
                onConfirm={onTimeConfirm}
                hours={12}
                minutes={0}
            />

            <TextInput
                multiline
                numberOfLines={5}
                label="Reminder Detail"
                value={detail}
                onChangeText={setDetail}
                style={{ height: 100 }}
                mode="outlined"
            />

            <Button
                icon="alarm-bell"
                mode="contained"
                loading={loading}
                onPress={handleSave}
                disabled={loading}
                style={{ marginTop: wp(2) }}
            >
                Save Reminder
            </Button>
            <Button mode="contained" onPress={() => navigation.replace("ReminderScreen")}>
                Go back
            </Button>
        </ScrollView>
    );
};

export default AddReminderScreen;