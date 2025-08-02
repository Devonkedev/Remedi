import { View, Text, Alert, Image } from "react-native";
import React, { useState } from "react";
import { Button, Card, Surface, TextInput, withTheme } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
// import Background from "../../components/Background";
import { useTheme } from "react-native-paper";
import { login } from "../../config/firebase";
// import { colorPallet } from "../../utils/colorPallet";
// import { loginUser } from "../../config/firebase";
// import Logo from "./../../../assets/icon.png"

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const theme = useTheme();

  // michael@mail.com
  // bob@mail.com

  // const [email, setEmail] = useState("bob@mail.com");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    console.log(email, password);
    if (!email || !password) {
      setLoading(false);
      return Alert.alert("Empty fields are not allowed");
    }
    try {
      await login(email, password);
      Alert.alert("User logged successfully!");
    } catch (error) {
      setError(error.message);
      setLoading(false);
      Alert.alert("Error:", error.message);
    }
    setLoading(false);
    return
  };

  return (
    <Surface style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Card
        style={{
          // backgroundColor: "mediumpurple",
          width: wp(85),
          height: hp(90),
          alignSelf: "center",
          // marginHorizontal: wp(15),
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
            // borderRadius: wp(20)
          }}
          resizeMode="contain"
        // source={Logo}
        />
        <Text
          style={{
            fontWeight: "bold",
            fontSize: wp(7),
            alignSelf: "center",
            // color: colorPallet.PRIMARY_COLOR,
            marginBottom: wp(3),
          }}
        >
          Welcome back
        </Text>
        <TextInput
          label="Email"
          value={email}
          mode="outlined"
          style={{
            width: wp(70),
          }}
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          label="Password"
          mode="outlined"
          secureTextEntry={true}
          value={password}
          style={{
            width: wp(70),
            marginTop: wp(5),
          }}
          onChangeText={(password) => setPassword(password)}
        />

        <Text
          onPress={() => navigation.navigate("ForgotPassword", {})}
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
        onPress={handleLogin}
        >
          Login
        </Button>

        <Text
          onPress={() => navigation.navigate("RegisterScreen", {})}
          style={{
            fontSize: wp(3.2),
            marginRight: wp(7),
            marginTop: wp(3),
            // color: theme.colors.gray,
          }}
        >
          Don't have an account?{" "}
          <Text
            style={{
              fontWeight: "bold",
              // color: colorPallet.PRIMARY_COLOR,
            }}
          >
            Sign up
          </Text>
        </Text>
      </Card>
    </Surface>
  );
};

export default LoginScreen;
