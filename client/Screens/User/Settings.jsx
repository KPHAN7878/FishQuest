import { useContext, useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { UserContext } from "../../Contexts/UserContext";
import { Client } from "../../utils/connection";
import { Ionicons } from "@expo/vector-icons";
import { S3_BUCKET } from "@env";
import { S3 } from "../../utils/connection";
const S3_REGION = S3.getBucketLocation().service.endpoint.host;

import * as ImagePicker from "expo-image-picker";
import { Buffer } from "buffer";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowRightFromBracket,
  faFileArrowUp,
} from "@fortawesome/free-solid-svg-icons";

import { CommonActions } from "@react-navigation/native";

export const Settings = ({ navigation, route }) => {
  const { user, setUser } = useContext(UserContext);
  const logOut = async () => {
    const res = await Client.post("user/logout");
    navigation.navigate("Login"); //ORIGINAL

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  const uploadToS3 = async (base64Image, Key) => {
    const Bucket = `fishquest/${S3_BUCKET}/profilePics`;
    const params = {
      Body: Buffer.from(
        base64Image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      ),
      ContentType: "jpg",
      Bucket,
      Key,
    };

    await S3.upload(params).promise();
  };

  const uploadProfilePic = async () => {
    let cache = null;
    cache = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });

    if (cache === undefined || !cache.uri) {
      setIsLoading(false);
      return;
    }

    const key = `${user.username}.jpg`;
    const imageUri = `https://fishquest.${S3_REGION}/${S3_BUCKET}/profilePics/${key}`;

    uploadToS3(cache.base64, key);
    await Client.post("profile/change-profile-picture", { imageUri });
    Client.get("user/profile").then((res) => {
      setUser(res.data);
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.backView}>
        <TouchableOpacity
          style={styles.back}
          activeOpacity={0.2}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="chevron-back-sharp" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.pageLayout}>
        <TouchableOpacity
          style={styles.likeButtonContainer}
          onPress={() => {
            navigation.navigate("Likes");
          }}
        >
          <Text style={styles.likeButtonText}>Likes</Text>
          <Ionicons name="caret-forward-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.commentButtonContainer}
          onPress={() => {
            navigation.navigate("CommentContainer2");
          }}
        >
          <Text style={styles.likeButtonText}>Comments</Text>
          <Ionicons name="caret-forward-outline" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.appButtonContainer} onPress={logOut}>
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              size={35}
              color={"white"}
            />
            <Text style={styles.appButtonText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.appButtonContainer, { backgroundColor: "grey" }]}
            onPress={uploadProfilePic}
          >
            <FontAwesomeIcon icon={faFileArrowUp} size={35} color={"white"} />
            <Text style={styles.appButtonText}>Profile Picture</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageLayout: {
    top: 100,
  },
  likeButtonContainer: {
    elevation: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderLeftColor: "#dff0f7",
    borderRightColor: "#dff0f7",
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    // justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  commentButtonContainer: {
    elevation: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderLeftColor: "#dff0f7",
    borderRightColor: "#dff0f7",
    borderTopColor: "#dff0f7",
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
  },
  likeButtonText: {
    fontSize: 18,
    color: "#000000",
    fontWeight: "bold",
    alignSelf: "center",
    // left: 150
  },
  btnRight: {
    //  left: 150
  },
  buttonText: {
    top: 30,
    textAlign: "center",
  },
  backView: {
    top: 50,
    left: 10,
  },
  buttonContainer: {
    marginHorizontal: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    top: 350,
  },
  appButtonContainer: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    elevation: 8,
    backgroundColor: "#de2618",
    borderRadius: 10,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 1,
    width: "25%",
  },
  appButtonText: {
    fontSize: 16,
    marginTop: 5,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
  },
});

export default Settings;
