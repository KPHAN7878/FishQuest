import { useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../../Contexts/UserContext";
import { Client } from "../../utils/connection";
import Posts from "../Social/ProfilePageUserPosts";
var { height } = Dimensions.get("window");

export const OtherUsersProfiles = ({ navigation, route }) => {
  const { user, setUser } = useContext(UserContext);
  const { userProfile, onGoBack, fromSearch } = route.params;
  const [isLoading, setLoading] = useState(true);
  const [followingNumber, setFollowingNumber] = useState(0);
  const [followersNumber, setFollowersNumber] = useState(0);
  const [followUsersArray, setFollowUsersArray] = useState([]);
  const [isFollowing, setIsFollowing] = useState(userProfile.following);

  // if user opens their own profile from the social feed then direct to profile page
  useEffect(() => {
    if (userProfile.id == user.id) {
      navigation.navigate("Profile");
    }
  }, []);

  const followButton = async (userId) => {
    setIsFollowing(!isFollowing);

    const res = await Client.post("profile/follow", {
      userId,
    })
      .then()
      .catch((error) => {
        console.log(error);
      });
    return res.data;
  };

  // Set the following number
  useEffect(() => {
    Client.get("profile/follow-count", {
      params: {
        userId: userProfile.id,
      },
    })
      .then((res) => {
        setFollowingNumber(res.data.following);
        setFollowersNumber(res.data.followers);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isFollowing]);

  // set the button status ("follow"/"unfollow")
  useEffect(() => {
    Client.get("profile/get-users", {
      params: {
        limit: 25,
        userId: user.id,
        type: "following",
      },
    })
      .then(async (res) => {
        res.data.users.map((userFollowed) => {
          if (userProfile.id == userFollowed.user.id) {
            setIsFollowing(true);
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  const goBack = () => {
    navigation.goBack();
    onGoBack({ username: userProfile.username });
  };

  return (
    <View>
      <View style={styles.headerBox}>
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: "center",
            marginVertical: 10,
            marginHorizontal: 10,
          }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <FontAwesomeIcon icon={faArrowLeft} size={25} />
            <Text style={{ fontSize: 20, flex: 1 }}>{"Back"}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Posts fromSearch={true} userObj={userProfile}>
        <View style={styles.headerStyle}>
          <View style={styles.header}>
            <Image
              style={styles.profilePic}
              source={
                userProfile.profilePicUrl
                  ? { uri: userProfile.profilePicUrl }
                  : require("../../assets/profilePic.jpg")
              }
            />
            <Text style={styles.name}> {userProfile.username} </Text>
            <TouchableOpacity
              style={styles.appButtonContainer}
              onPress={() => followButton(userProfile.id)}
            >
              <Text style={styles.appButtonText}>
                {isFollowing ? "Unfollow" : "Follow"}
              </Text>
            </TouchableOpacity>
            <View style={styles.follows}>
              <Text style={styles.followers}>{followersNumber} Followers</Text>
              <Text style={styles.following}>{followingNumber} Following</Text>
            </View>
          </View>
        </View>
      </Posts>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBox: {
    display: "flex",
    paddingTop: 0.06 * height,
    maxHeight: height * 0.1 + 0.06 * height,
    borderWidth: 0.3,
    borderColor: "#787777",
    backgroundColor: "#2596be",
    flexDirection: "row",
  },
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

export default OtherUsersProfiles;
