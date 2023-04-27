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
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { FontFamily } from "../../GlobalStyles";
import { Client } from "../../utils/connection";
import ImageView from "../../Components/ImageView";

import { useNavigation } from "@react-navigation/native";

const Post = ({ post }) => {
  post.isChild = false;

  const [valid, setValid] = React.useState(false);
  const [hasLiked, setHasLiked] = React.useState(post.liked);
  const navigation = useNavigation();

  let tempString = post.catch.imageUri;
  let finalString = tempString.replace(
    "fishquest/development",
    "development/catches"
  );

  React.useEffect(() => {
    fetch(finalString)
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
    setHasLiked(!hasLiked);
    await Client.post("like/post", {
      postId: postId,
    })
      .then((res) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const postCaption = post.text;

  return (
    <View
      style={{
        width: Dimensions.get("window").width - 40,
        marginLeft: 20,
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
              source={require("../../assets/profilePic.jpg")}
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
            image={valid ? { uri: finalString } : undefined}
          />
        </View>

        <View style={styles.info}>
          <View style={styles.like_comment}>
            <View style={styles.item}>
              <TouchableOpacity
                activeOpacity={0.2}
                onPress={() => {
                  likePost(post.id);
                }} //like button
              >
                {hasLiked ? (
                  <AntDesign name="like2" size={24} color="green" />
                ) : (
                  <AntDesign name="like2" size={24} color="black" />
                )}
              </TouchableOpacity>

              <Text
                style={{
                  marginHorizontal: 10,
                  fontFamily: FontFamily.interMedium,
                  fontWeight: "bold",
                }}
              >
                {post.likeValue + (hasLiked ? 1 : 0)}
              </Text>
            </View>
            <View style={styles.item}>
              <TouchableOpacity
                style={styles.comment}
                activeOpacity={0.2}
                onPress={() => {}}
              >
                <FontAwesome name="comment-o" size={24} color="black" />
              </TouchableOpacity>

              <Text
                style={{
                  marginHorizontal: 10,
                  fontFamily: FontFamily.interMedium,
                  fontWeight: "bold",
                }}
              >
                {post.commentValue}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.captionView}>
          <Text style={styles.caption}>{post.text}</Text>
        </View>

        <View style={styles.viewComments}>
          <TouchableOpacity
            activeOpacity={0.2}
            onPress={() => {
              // navigation.navigate('CommentContainer', {caption: postCaption});
              navigation.navigate("CommentContainer", { caption: post });
            }}
          >
            <Text style={styles.viewCommentText}>
              {"View " + post.commentValue + " Comments"}
            </Text>
          </TouchableOpacity>
        </View>
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
