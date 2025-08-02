import { View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Text, TextInput, Button } from 'react-native-paper'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { addHealthLog, addHealthStat } from '../../config/firebase'

const AddHealthDataScreen = ({ navigation }) => {
  const [statKey, setStatKey] = useState('')
  const [statValue, setStatValue] = useState('')
  const [logText, setLogText] = useState('')

  const handleAddStat = async () => {
    if (!statKey || !statValue) return
    await addHealthStat(statKey, statValue)
    setStatKey('')
    setStatValue('')
  }

  const handleAddLog = async () => {
    if (!logText) return
    await addHealthLog(logText)
    setLogText('')
  }

  return (
    <ScrollView contentContainerStyle={{ padding: wp(5), gap: wp(5) }}>
      <Text variant="titleMedium">Add Health Stat</Text>
      <TextInput
        label="Stat Name (e.g. Blood Pressure)"
        value={statKey}
        onChangeText={setStatKey}
      />
      <TextInput
        label="Stat Value (e.g. 120/80 mmHg)"
        value={statValue}
        onChangeText={setStatValue}
      />
      <Button mode="contained" onPress={handleAddStat}>
        Save Stat
      </Button>

      <Text variant="titleMedium" style={{ marginTop: hp(3) }}>
        Add Health Log
      </Text>
      <TextInput
        label="Log Description"
        multiline
        numberOfLines={4}
        value={logText}
        onChangeText={setLogText}
      />
      <Button mode="contained" onPress={handleAddLog}>
        Save Log
      </Button>
      <Button mode="contained" onPress={() => navigation.replace("HealthScreen")}>
        Go back
      </Button>
    </ScrollView>
  )
}

export default AddHealthDataScreen
