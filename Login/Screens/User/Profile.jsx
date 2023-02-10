import { Text, View, Pressable } from "react-native";
import styles, { width, height } from "../../styles";
import { Client } from "../../utils/connection";

export const Profile = ({ navigation }) => {
  const logOut = async () => {
    const res = await Client.post("user/logout");
    navigation.navigate("Login");
  };

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
        Profile
      </Text>

      <Pressable style={styles.formButton} onPress={logOut}>
        <Text style={styles.buttonText}>{"LOG OUT"}</Text>
      </Pressable>
    </View>
  );
};

export default Profile;
