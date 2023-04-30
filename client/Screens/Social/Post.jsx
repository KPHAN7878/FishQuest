import React, { useEffect, useState, useRef, useContext } from "react";
export const { height, width } = Dimensions.get("window");
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontFamily } from "../../GlobalStyles";
import { Client } from "../../utils/connection";
import ImageView from "../../Components/ImageView";

import { useNavigation } from "@react-navigation/native";
import LikeCommentView from "../../Components/LikeCommentView";

const Post = ({ post, interactable }) => {
  // post.isChild = false;

  const [valid, setValid] = React.useState(false);
  const navigation = useNavigation();

  React.useEffect(() => {
    fetch(post.catch.imageUri)
      .then((res) => {
        if (res.status === 403) {
          setValid(false);
        } else {
          setValid(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const likePost = async (postId) => {
    await Client.post("like/post", {
      postId: postId,
    })
      .then((res) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View
      style={{
        width: Dimensions.get("window").width - 40,
        borderRadius: 35,
        backgroundColor: "#c2e4f2",
        marginTop: 30,
        marginBottom: 10,
      }}
    >
      <View style={styles.container}>
        <View style={styles.user}>
          <View style={styles.userInfo}>
            <Image
              style={styles.profilePic}
              resizeMode="cover"
              //source={require("../../assets/profilePic.jpg")}
              source={{uri: "https://static.vecteezy.com/system/resources/previews/007/033/146/original/profile-icon-login-head-icon-vector.jpg"}}
            />
            <View style={styles.details}>
              <TouchableOpacity
                style={{ textDecoration: "none", color: "inherit" }}
                activeOpacity={0.2}
                onPress={() => {
                  `/users/${post.userId}`;
                }}
              >
                <Text style={styles.name}>{post.creator.username}</Text>
              </TouchableOpacity>
              <Text style={styles.date}>a few seconds ago</Text>
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.2} onPress={() => {}}>
            <Ionicons name="ellipsis-horizontal" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginVertical: 10,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ImageView
            animated={false}
            image={valid ? { uri: post.catch.imageUri } : undefined}
          />
        </View>

        <LikeCommentView
          disableCommentGoto={!interactable}
          onPressLike={() => {
            likePost(post.id);
          }}
          onPressComment={() => {
            navigation.navigate("CommentContainer", { item: post });
          }}
          item={post}
        />

        <View style={styles.captionView}>
          <Text style={styles.caption}>{post.text}</Text>
        </View>

        {interactable && (
          <View style={styles.viewComments}>
            <TouchableOpacity
              activeOpacity={0.2}
              onPress={() => {
                navigation.navigate("CommentContainer", { item: post });
              }}
            >
              <Text style={styles.viewCommentText}>
                {"View " + post.commentValue + " Comments"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    padding: 20,
  },
  user: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  userInfo: {
    display: "flex",
    flexDirection: "row",
  },
  profilePic: {
    width: 45,
    height: 45,
    borderRadius: 100,
    resizeMode: "cover",
    marginRight: 10,
  },
  details: {
    display: "flex",
    flexDirection: "column",
    marginTop: 3,
  },
  name: {
    fontFamily: FontFamily.interMedium,
    fontSize: 17,
  },
  date: {
    fontSize: 13,
  },
  content: {
    marginBottom: -1130,
  },
  postImage: {
    width: "100%",
    maxHeight: 388,
    //resizeMode: "cover",
    marginTop: 20,
    borderRadius: 20,
  },
  info: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 7,
    justifyContent: "space-between",
  },
  item: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    fontSize: 14,
    marginRight: 15,
  },
  like_comment: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  captionView: {
    marginTop: 15,
    marginLeft: 10,
  },
  caption: {
    fontFamily: FontFamily.interMedium,
  },
  viewComments: {
    alignItems: "center",
    marginTop: 25,
  },
  viewCommentText: {
    textDecorationLine: "underline",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    fontSize: 14,
    color: "#828282",
  },
  testContainer: {
    marginVertical: 10,
    alignItems: "center",
    position: "relative",
  },
  testImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    alignSelf: "center",
    borderRadius: 20,
  },
});

export default Post;
