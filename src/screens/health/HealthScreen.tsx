import { View, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomHeader from '../../components/CustomHeader'
import { ActivityIndicator, FAB, Surface, Text } from 'react-native-paper'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import CustomJuniorHeader from '../../components/CustomJuniorHeader'
import { db, auth } from '../../config/firebase'
import { collection, getDocs } from 'firebase/firestore'

const ProfileHealthSection = ({ item }) => (
    <Surface style={{ padding: wp(3), flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text variant='labelLarge' style={{ flex: 1 }}>{item.key}</Text>
        <Text variant='bodyMedium' style={{ flex: 1, textAlign: 'right' }}>{item.value}</Text>
    </Surface>
);

const HealthScreen = ({ navigation }) => {
    const [healthStats, setHealthStats] = useState([])
    const [userLogs, setUserLogs] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchHealthData = async () => {
            setLoading(true);
            try {
                const uid = auth.currentUser?.uid
                if (!uid) return

                // Fetch stats
                const statSnap = await getDocs(collection(db, 'users', uid, 'healthStats'))
                const stats = statSnap.docs.map(doc => ({
                    key: doc.id,
                    value: doc.data().value
                }))
                setHealthStats(stats)

                // Fetch logs
                const logSnap = await getDocs(collection(db, 'users', uid, 'healthLogs'))
                const logs = logSnap.docs.map(doc => ({
                    key: doc.id,
                    value: doc.data().description
                }))
                setUserLogs(logs)
            } catch (err) {
                console.error("Error fetching health data: ", err)
            }
            setLoading(false)
        }

        fetchHealthData()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <CustomHeader
                    label={'Health Stats'}
                    subheading={'A place to add your health vitals'}
                    image_url={'https://static.vecteezy.com/system/resources/previews/004/413/150/non_2x/simple-illustration-that-prevent-heart-attack-heart-health-cardiology-outlined-icon-free-vector.jpg'}
                />

                <CustomJuniorHeader label={'Health Stats'} action={() => { }} />
                <View>{healthStats.map((item, index) => <ProfileHealthSection key={index} item={item} />)}</View>
                {loading === true && <ActivityIndicator />}

                <CustomJuniorHeader label={'Health Logs'} action={() => { }} />
                <View style={{ marginBottom: wp(6) }}>
                    {userLogs.map((item, index) => <ProfileHealthSection key={index} item={item} />)}
                    {loading === true && <ActivityIndicator />}

                </View>
            </ScrollView>
            <FAB
                icon="pen"
                style={{
                    position: 'absolute',
                    margin: 16,
                    right: 0,
                    bottom: 0,
                }}
                onPress={() => navigation.navigate("AddHealthDataScreen")}
            />
        </View>
    )
}

export default HealthScreen
