import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  LogBox,
} from "react-native";
import { Client } from "../../utils/connection";
import { InputField } from "../../Components/InputField";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../../Contexts/UserContext";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

var { height } = Dimensions.get("window");

const UserSearch = ({ navigation }) => {
  const [usersList, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState([]);
  const { user } = React.useContext(UserContext);
  const searchUserRef = React.useRef();

  const onGoBack = ({ username }) => {
    setSearchUser(username);
    searchFunction();
    console.log(searchUser);
  };

  const searchFunction = async () => {
    const getData = setTimeout(() => {
      if (searchUser.length !== 0) {
        Client.get("user/find", {
          params: {
            username: searchUser,
          },
        })
          .then((res) => {
            const users = res.data.filter((value, index) => {
              const _value = JSON.stringify(value);
              return (
                index ===
                res.data.findIndex((obj) => {
                  return JSON.stringify(obj) === _value;
                })
              );
            });
            setUsers(users);
          })
          .catch((error) => {
            console.log(error);
          });

        return () => clearTimeout(getData);
      } else {
        setUsers([]);
        console.log("cleared");
        console.log("cleared users list: " + JSON.stringify(usersList));
      }
    }, 500);
  };

  const followButton = async (userId) => {
    const res = await Client.post("profile/follow", {
      userId,
    })
      .then()
      .catch((error) => {
        console.log(error);
      });
    return res.data;
  };

  return (
    <View style={styles.testContainer}>
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
      <View style={{ marginTop: 25 }}>
        <InputField
          onChangeText={(text) => {
            setSearchUser(text);
            searchFunction();
          }}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          placeholder={"Username"}
          name={"username"}
          ref={searchUserRef}
          pretext={"User search"}
        />
      </View>
      <ScrollView style={{ paddingTop: 25, marginHorizontal: 25 }}>
        {usersList ? (
          usersList.map((item, idx) => {
            return (
              <View style={styles.usersView} key={idx}>
                <TouchableOpacity
                  style={{ flex: 5 }}
                  onPress={() => {
                    navigation.navigate("OtherUsersProfiles", {
                      userProfile: item,
                      onGoBack,
                    });
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <Image
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        resizeMode: "contain",
                      }}
                      source={
                        item.profilePicUrl
                          ? { uri: item.profilePicUrl }
                          : require("../../assets/profilePic.jpg")
                      }
                    />

                    <Text
                      style={{
                        marginLeft: 5,
                        fontSize: 16,
                        fontWeight: "bold",
                        textAlign: "left",
                      }}
                    >
                      {item.username}
                    </Text>
                  </View>
                </TouchableOpacity>

                {item.id === user.id ? (
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "green" }]}
                    onPress={() => {
                      navigation.navigate("Profile");
                    }}
                  >
                    <Text style={styles.text}> You </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={async () => {
                      const isFollowing = await followButton(item.id);
                      usersList[idx].following = isFollowing;
                      setUsers([...usersList]);
                    }}
                  >
                    <Text style={styles.text}>
                      {item.following ? "Unfollow" : "Follow"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        ) : (
          <View />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  testContainer: {
    flex: 1,
    backgroundColor: "gainsboro",
  },
  headerBox: {
    display: "flex",
    marginTop: 0,
    paddingTop: 0.06 * height,
    maxHeight: height * 0.1 + 0.06 * height,
    borderWidth: 0.3,
    borderColor: "#787777",
    backgroundColor: "#2596be",
    flexDirection: "row",
  },
  usersView: {
    marginBottom: 25,
    height: 0.05 * height,
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
    // justifyContent: "space-between",
  },
  followButton: {
    alignSelf: "flex-end",
  },
  button: {
    textAlign: "right",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "rgba(123,104,238, 1.0)",
    alignSelf: "flex-end",
    flex: 3,
    marginBottom: height * 0.05 * 0.16,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

export default UserSearch;
