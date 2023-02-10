import { Text, View } from "react-native";
import styles, { width, height } from "../../styles";

export const Profile = ({ navigation }) => {
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
    </View>
  );
};

export default Profile;
