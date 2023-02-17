import { Text, View } from "react-native";
import { useContext } from "react";
import { Client } from "../utils/connection";
import styles, { width, height } from "../styles";
import { UserContext } from "../Contexts/UserContext";

export const StartScreen = ({ navigation }) => {
  const { setUser } = useContext(UserContext);

  Client.get("user/status")
    .then(async () => {
      const res = await Client.get("user/profile");
      setUser(res.data);
      navigation.navigate("Home");
    })
    .catch((err) => {
      if (err.response.status === 403) navigation.navigate("Login");
    });
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Text
        style={{
          marginTop: height * 0.15,
          textAlign: "center",
        }}
      >
        Loading...
      </Text>
    </View>
  );
};
