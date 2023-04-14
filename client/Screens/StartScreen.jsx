import { Text, View, ActivityIndicator } from "react-native";
import { useContext, useEffect } from "react";
import { Client } from "../utils/connection";
import { height } from "../styles";
import { UserContext } from "../Contexts/UserContext";

export const StartScreen = ({ navigation }) => {
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    console.log("fetching status...");
    Client.get("user/status")
      .then(async () => {
        const res = await Client.get("user/profile");
        setUser(res.data);
        navigation.navigate("Home");
      })
      .catch((err) => {
        console.log(err);
        if (!err.response) return;
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
      <ActivityIndicator
        size="large"
        style={{ flex: 1, justifyContent: "center" }}
      />
    </View>
  );
};
