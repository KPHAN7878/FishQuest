import { useContext } from "react";
import { Text, View, Pressable } from "react-native";
import { UserContext } from "../../Contexts/UserContext";
import styles, { width, height } from "../../styles";
import { Client } from "../../utils/connection";

export const Profile = ({ navigation }) => {
  const logOut = async () => {
    const res = await Client.post("user/logout");
    navigation.navigate("Login");
  };

  const {user, setUser} = useContext(UserContext);

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
        {JSON.stringify(user.username)}
      </Text>

      <Text
        style={{
          textAlign: "center",
        }}
      >
        {JSON.stringify(user.email)}
      </Text>

      <Text
        style={{
          textAlign: "center",
        }}
      >
        {"id: " + JSON.stringify(user.id)}
      </Text>

      <Text
        style={{
          marginTop: height * 0.15,
          textAlign: "center",
        }}
      >
        Profile
      </Text>

      <Pressable style={styles.formButton} onPress={logOut}>
        <Text style={styles.buttonText}>{"LOG OUT"}</Text>
      </Pressable>
    </View>
  );
};

export default Profile;
