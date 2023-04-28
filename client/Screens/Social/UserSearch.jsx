import React, { useEffect, useState, useRef, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Button,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { Client } from "../../utils/connection";
import { InputField } from "../../Components/InputField";

var { height } = Dimensions.get("window");
var { width } = Dimensions.get("window");

const UserSearch = ({ navigation }) => {
  const [usersList, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState([]);
  const searchUserRef = React.useRef();

  const searchFunction = async () => {
    console.log("onChangeText: " + searchUser);
    const getData = setTimeout(() => {
      if (searchUser.length !== 0) {
        Client.get("user/find", {
          params: {
            username: searchUser,
          },
        })
          .then((res) => {
            setUsers(res.data);
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
        <Button
          title="Back"
          color="rgba(123,104,238,0.8)"
          onPress={() => {
            navigation.goBack();
          }}
        />
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
      <ScrollView style={{ marginHorizontal: 25 }}>
        {usersList ? (
          usersList.map((item, idx) => {
            return (
              <View style={styles.usersView} key={idx}>
                <Text style={{ fontWeight: "bold", textAlign: "left" }}>
                  {item.username}
                </Text>
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
    marginTop: 0,
    paddingTop: 0.06 * height,
    paddingBottom: 0.01 * height,
    borderWidth: 0.3,
    borderColor: "#787777",
    backgroundColor: "#2596be",
    flexDirection: "row",
  },
  usersView: {
    height: 0.05 * height,
    flexDirection: "row",
    marginBottom: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
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
    marginBottom: height * 0.05 * 0.16,
    width: 150,
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
