// RegisterScreen.js
import React, { useState } from "react";
import { View, Text, Alert, Image } from "react-native";
import { Button, TextInput, useTheme, Switch, Surface, Card } from "react-native-paper";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { register } from "../../config/firebase";

const RegisterScreen = ({ navigation }) => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState(isSwitchOn ? "civilian" : "ngo");
  const theme = useTheme();

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await register(email, password);
      const user = userCredential.user
      
      setLoading(false);
      Alert.alert("Success", "User registered successfully!");
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <Surface style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Card
        style={{
          width: wp(85),
          height: hp(90),

          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
          // flex: 1,
        }}
      >
        <Image
          style={{
            width: wp(25),
            height: wp(25),
            marginBottom: wp(7),
          }}
          resizeMode="contain"
        // source={Logo}
        />
        <Text
          style={{
            fontWeight: "bold",
            fontSize: wp(7),
            alignSelf: "center",
            marginBottom: wp(3),
          }}
        >
          Create Account
        </Text>
        {/* <TextInput
          label="Name"
          value={name}
          mode="outlined"
          style={{
            width: wp(70),
            marginBottom: wp(5),
          }}
          onChangeText={(text) => setName(text)}
        /> */}
        <TextInput
          label="Email"
          value={email}
          mode="outlined"
          style={{
            width: wp(70),
          }}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          label="Password"
          mode="outlined"
          value={password}
          secureTextEntry={true}
          style={{
            width: wp(70),
            marginTop: wp(5),
          }}
          onChangeText={(text) => setPassword(text)}
        />


        <Text
          onPress={() => navigation.navigate("ForgotPassword")}
          style={{
            fontSize: wp(3.2),
            alignSelf: "flex-end",
            marginRight: wp(7),
            marginTop: wp(2),
            // color: theme.colors.gray,
          }}
        >
          Forgot password
        </Text>

        <Button
          loading={loading}
          mode="contained"
          style={{
            width: wp(70),
            borderRadius: wp(2),
            marginTop: wp(6),
            paddingVertical: wp(1),
            // backgroundColor: colorPallet.PRIMARY_COLOR,
          }}
          onPress={handleSignup}
        >
          Register
        </Button>

        <Text
          onPress={() => navigation.navigate("LoginScreen")}
          style={{
            fontSize: wp(3.2),
            marginRight: wp(7),
            marginTop: wp(3),
            // color: theme.colors.gray,
          }}
        >
          Already have an account?{" "}
          <Text
            style={{
              fontWeight: "bold",
              // color: colorPallet.PRIMARY_COLOR,
            }}
          >
            Sign In
          </Text>
        </Text>
      </Card>
    </Surface>
  );
};

export default RegisterScreen;
