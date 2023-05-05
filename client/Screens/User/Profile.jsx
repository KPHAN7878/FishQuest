import { useContext, useState, useEffect } from "react";
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { UserContext } from "../../Contexts/UserContext";
import { Client } from "../../utils/connection";
import Posts from "../Social/ProfilePageUserPosts";

const OFFSET_Y = 740;

export const Profile = ({ navigation, route }) => {
  const { user, setUser } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState(
    <Image
      style={styles.profilePic}
      source={
        user.profilePicUrl
          ? { uri: user.profilePicUrl }
          : require("../../assets/profilePic.jpg")
      }
    />
  );

  if (route.params != undefined) {
    const { username } = route.params;
    setUser(username);
  }

  const [followingNumber, setFollowingNumber] = useState(0);
  const [followersNumber, setFollowersNumber] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setProfileImage(<Image style={styles.profilePic} />);
      setProfileImage(
        <Image
          style={styles.profilePic}
          source={
            user.profilePicUrl
              ? { uri: user.profilePicUrl }
              : require("../../assets/profilePic.jpg")
          }
        />
      );
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    Client.get("profile/follow-count", {
      params: {
        userId: user.id,
      },
    })
      .then((res) => {
        setFollowingNumber(res.data.following);
        setFollowersNumber(res.data.followers);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // GETTING POSTS
  const [cursor, setCursor] = useState(new Date().toISOString().slice(0, 19));

  const useCursor = cursor;

  return (
    <Posts userObj={user}>
      <View style={styles.headerStyle}>
        <View style={styles.header}>
          {profileImage}
          <Text style={styles.name}> {user.username} </Text>
          <TouchableOpacity
            style={styles.appButtonContainer}
            onPress={() => {
              navigation.navigate("Settings");
            }}
          >
            <Text style={styles.appButtonText}>Settings</Text>
          </TouchableOpacity>
          <View style={styles.follows}>
            <Text style={styles.followers}>{followersNumber} Followers</Text>
            <Text style={styles.following}>{followingNumber} Following</Text>
          </View>
        </View>
      </View>
    </Posts>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    marginTop: 50,
  },

  follows: {
    flex: 1,
    top: 10,
    // left: -10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  followers: {
    color: "white",
    marginTop: 10,
    // marginLeft: -90
    left: 0,
  },
  following: {
    color: "white",
    marginTop: 10,
    left: 12,
    // marginLeft: 50
  },
  appButtonContainer: {
    flex: 1,
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    // textTransform: "uppercase"
  },
  header: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  headerStyle: {
    marginTop: 10,
    display: "flex",
    width: "100%",
    flexDirection: "column",
    minHeight: 300,
    borderRadius: 110,
    backgroundColor: "#839feb",
  },
  profilePic: {
    width: 115,
    height: 115,
    borderRadius: 100,
    borderWidth: 1,
    resizeMode: "contain",
    marginTop: 40,
    marginBottom: 10,
  },
  name: {
    flex: 1,
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  editBtn: {
    width: 105,
    fontSize: 12,
  },
});

export default Profile;
