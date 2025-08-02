import { ScrollView, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Avatar, Badge, FAB, List, Surface, Text } from 'react-native-paper'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { colorPalette } from '../../utils/colors'
import CustomHeader from '../../components/CustomHeader'
import LogoutButton from '../../components/LogoutButton'
import { fetchReminders } from '../../config/firebase'
import { format } from 'date-fns'
import CustomJuniorHeader from '../../components/CustomJuniorHeader'

const CustomCardSection = ({ name, detail, type }) => {
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
    }}>
      {/* LEFT */}
      <View style={{
        // gap: wp(1),
      }}>
        <Text variant="titleSmall">{name || 'NA'}</Text>
        <Text variant="bodySmall">{detail || 'NA'}</Text>
      </View>
      {/* RIGHT */}
      <View>
        <Badge style={{
          // backgroundColor: '#EEEEEE',
          alignSelf: 'flex-start',
          paddingHorizontal: wp(2),
        }}>{type || "NA"}</Badge>
      </View>
    </View>
  )
}


const CustomListCard = ({ data }) => {
  console.log(data);

  const formatReminderDate = (dateString: string, timeString: string) => {
    const dateObj = new Date(dateString); // Convert the date string to a Date object.
    const formattedDate = format(dateObj, 'EEEE, MMMM dd, yyyy'); // Day of the week, Month day, Year

    // Format the time string to include AM/PM
    const [hours, minutes] = timeString.split(':').map(Number);
    const dateWithTime = new Date(dateObj.setHours(hours, minutes));
    const formattedTime = format(dateWithTime, 'hh:mm a'); // Format time as 12-hour with AM/PM

    return `${formattedDate} at ${formattedTime}`;
  };

  return (
    <>
      <View style={{
        // width: wp(80),
        // backgroundColor: 'skyblue',
        marginHorizontal: wp(5),
        borderWidth: 1,
        borderRadius: wp(2),
        borderColor: colorPalette.light.colors.outlineVariant,
        flexDirection: 'column',
        padding: wp(3),
      }}>
        {/* BADGE */}
        <Badge
          style={{
            // backgroundColor: '#EEEEEE',
            alignSelf: 'flex-start',
            paddingHorizontal: wp(2),
            marginBottom: wp(1),
          }}
        >
          {data.time && data.date ? formatReminderDate(data.date, data.time) : 'No time or date set'}
        </Badge>


        <View style={{
          gap: wp(2),
        }}>
          <CustomCardSection
            name={data.name}
            type={data.type}
            detail={data.detail}
          />

          {/* {"createdAt": {"nanoseconds": 547000000, "seconds": 1744698328}, "date": "2025-04-15", "detail": "rd", "id": "lFTl4ExVHKZmMsH7jTtl", "name": "r1", "time": "12:00", "type": "medicine"} */}
          {/* <CustomCardSection /> */}
          {/* <CustomCardSection /> */}
        </View>
      </View>
    </>
  )
}


const ReminderScreen = ({ navigation }) => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);


  const handlePress = () => {
    navigation.navigate("AddReminderScreen")
  }

  const loadReminders = async () => {
    try {
      const data = await fetchReminders();
      setReminders(data);
    } catch (error) {
      alert('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadReminders();
  }, []);

  return (
    <View style={{
      flex: 1,
    }}>
      <ScrollView contentContainerStyle={{
        // gap: wp(2),
      }}>
        <CustomHeader label={'Reminders'} subheading={'Here you can add your reminders'} image_url={'https://static.vecteezy.com/system/resources/previews/029/722/371/non_2x/reminder-icon-in-trendy-flat-style-isolated-on-white-background-reminder-silhouette-symbol-for-your-website-design-logo-app-ui-illustration-eps10-free-vector.jpg'} />
        
        
        <CustomJuniorHeader label={'Reminders'} action={() => {}} />

        <View style={{
          gap: wp(5),
        }}>
          {
            reminders && reminders.length > 0 ? (
              reminders.map((item) => (
                <CustomListCard key={item.id} data={item} />
              ))
            ) : (
              <ActivityIndicator />
            )
          }


          {/* <CustomListCard />
          <CustomListCard />
          <CustomListCard /> */}
        </View>
      </ScrollView>
      <LogoutButton />

      {/* ADD REMINDER */}
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
    </View>
  )
}

export default ReminderScreen