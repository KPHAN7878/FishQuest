import { Text, View, ActivityIndicator } from "react-native";
import { useContext, useEffect } from "react";
import { Client } from "../utils/connection";
import { height } from "../styles";
import { UserContext } from "../Contexts/UserContext";

export const StartScreen = ({ navigation }) => {
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    Client.get("user/status")
      .then(async () => {
        const res = await Client.get("user/profile");
        setUser(res.data);
        navigation.navigate("Home");
      })
      .catch((err) => {
        if (err.response.status === 403) navigation.navigate("Login");
      });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          marginTop: height * 0.15,
          textAlign: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </Text>
    </View>
  );
};
