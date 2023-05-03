import { View, ActivityIndicator } from "react-native";
import React, { useContext, useEffect } from "react";
import { Client } from "../utils/connection";
import { UserContext } from "../Contexts/UserContext";

export const StartScreen = ({ navigation }) => {
  const { setUser } = useContext(UserContext);
  const [retry, setRetry] = React.useState(false);

  useEffect(() => {
    console.log("fetching status...");
    Client.get("user/status")
      .then(async () => {
        const res = await Client.get("user/profile");
        setUser(res.data);
        navigation.navigate("Home");
      })
      .catch((err) => {
        if (!err.response) {
          setTimeout(() => {
            setRetry(!retry);
            console.log("fetch failed, retry...");
          }, 3000);
          return;
        }
        if (err.response.status === 403) navigation.navigate("Login");
      });
  }, [retry]);

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
