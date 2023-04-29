import React, { useEffect, useState, useRef, useContext } from "react";
import isCloseToBottom from "../../utils/isCloseToBottom";
import {
  RefreshControl,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  Keyboard,
  Image,
  TouchableOpacity,
} from "react-native";

import Animated, {
  useAnimatedStyle,
  interpolate,
  withTiming,
} from "react-native-reanimated";
import { FontFamily, Color } from "../../GlobalStyles";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Client } from "../../utils/connection";
import LikeCommentView from "../../Components/LikeCommentView";

const windowHeight = Dimensions.get("window").height;
const displaceHeight = 350;

const CommentContainer = ({ route, navigation }) => {
  const [text, onChangeText] = React.useState();
  const [isChildBool, setIsChild] = useState();

  const [comments, setComments] = React.useState([]);
  const [commentIds, setCommentIds] = React.useState([]);

  const [isFetching, setIsFetching] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const [more, setMore] = React.useState(true);
  const [skip, setSkip] = React.useState(null);
  const [commentComponents, setCommentComponents] = React.useState([]);

  const [screenState, setScreenState] = React.useState(0);
  const animateDetails = useAnimatedStyle(() => {
    const interpolation = interpolate(
      screenState,
      [0, 1],
      [0, -displaceHeight]
    );

    return {
      transform: [{ translateY: withTiming(interpolation, { duration: 250 }) }],
    };
  });

  React.useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardWillHide",
      () => {
        setScreenState(0);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  React.useEffect(() => {
    onRefresh();
  }, []);

  React.useEffect(() => {
    renderComments(comments);
  }, [comments]);

  const onRefresh = () => {
    setIsFetching(true);
    setRefreshing(true);
    getComments(true);
  };

  const renderComments = (comments) => {
    Promise.all(
      comments.map(async (c) => {
        return <RenderOnce comment={c} navigation={navigation} key={c.id} />;
      })
    )
      .then((newCommentsComponents) => {
        setIsFetching(false);
        setCommentComponents(
          (refreshing ? newCommentsComponents : commentComponents).concat(
            refreshing ? commentComponents : newCommentsComponents
          )
        );

        setRefreshing(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const submitComment = async () => {
    await Client.post("comment", {
      commentableId: route.params.caption.id,
      text: text,
      type: !route.params.caption.isChild ? "post" : "comment",
    })
      .then((res) => {
        getComments();
      })
      .catch((error) => {
        console.log("error comment: " + error);
      });
  };

  const getComments = (refresh) => {
    if (!more && !refresh) return;
    const useSkip = refresh ? null : skip;

    Client.get("comment/get-comments", {
      params: {
        limit: 25,
        skip: useSkip,
        commentableId: route.params.caption.id,
        type: !route.params.caption.isChild ? "post" : "comment",
      },
    })
      .then((res) => {
        const newComments = [...res.data.comments].filter(
          (c) => !commentIds.includes(c.id)
        );

        setComments(newComments);
        const ids = [...commentIds, ...newComments.map((c) => c.id)];
        setCommentIds(ids);

        setMore(res.data.hasMore);
        setSkip(ids.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View>
      <View style={styles2.headerBox}>
        <Text style={styles2.fishQuest}>Fish Quest</Text>

        <TouchableOpacity
          style={styles2.back}
          activeOpacity={0.2}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="chevron-back-sharp" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View>
        {!isChildBool ? (
          <Text style={styles2.postCaption}>{route.params.caption.text}</Text>
        ) : (
          <View></View>
        )}
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: 2,
            width: "100%",
            alignSelf: "center",
            marginTop: 40,
          }}
        />
      </View>

      <ScrollView
        style={styles2.comments}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
        }
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent) && !isFetching && !refreshing) {
            getComments(false);
          }
        }}
        scrollEventThrottle={400}
      >
        {commentComponents}
      </ScrollView>

      <Animated.View
        style={[
          {
            flexDirection: "column",
            display: "flex",
            width: "100%",
          },
          animateDetails,
        ]}
      >
        <View style={styles2.typeComment}>
          <Image
            style={styles2.img}
            source={require("../../assets/profilePic.jpg")}
          />
          <View style={styles2.input}>
            <TextInput
              placeholder="write a comment..."
              style={{ flex: 4 }}
              onFocus={() => setScreenState(1)}
              onChangeText={(text) => onChangeText(text)}
            />
            <TouchableOpacity
              style={[{ flex: 1 }]}
              onPress={() => {
                submitComment();
              }}
            >
              <Text style={[{ fontSize: 14 }]}>{"Submit"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: displaceHeight, backgroundColor: "white" }} />
      </Animated.View>
    </View>
  );
};

const RenderOnce = React.memo(({ comment, navigation }) => {
  React.useEffect(() => {
    console.log("RENDER", comment.id);
  });
  const goto = () => {
    navigation.push("CommentContainer", {
      caption: { id: comment.id, isChild: true },
    });
  };
  const likeComment = async () => {
    await Client.post("like/comment", {
      commentId: comment.id,
    })
      .then((res) => {})
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Pressable onPress={goto}>
      <View>
        <View key={comment.id} style={styles2.comment}>
          <Image
            style={styles2.img}
            source={require("../../assets/profilePic.jpg")}
          />
          <View style={styles2.info}>
            <Text style={styles2.userName}>{comment.creator.username}</Text>
            <Text style={styles2.desc}>{comment.text}</Text>
          </View>
          <Text style={styles2.date}>1 hour ago</Text>
        </View>
        <LikeCommentView
          onPressLike={likeComment}
          onPressComment={goto}
          item={comment}
        />
        <View style={styles2.line} />
      </View>
    </Pressable>
  );
});

const styles2 = StyleSheet.create({
  headerBox: {
    marginTop: 0,
    padding: 50,
    borderWidth: 0.3,
    borderColor: "#787777",
    backgroundColor: "#2596be",
  },
  fishQuest: {
    top: 40,
    left: 121,
    fontSize: 44,
    fontFamily: FontFamily.alluraRegular,
    width: 195,
    height: 63,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: {
      width: 0,
      height: 4,
    },
    textShadowRadius: 4,
    textAlign: "left",
    color: Color.black,
    position: "absolute",
  },
  line: {
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "75%",
    alignSelf: "center",
    marginTop: 20,
  },
  back: {
    left: 320,
  },
  postCaption: {
    marginTop: 30,
    marginHorizontal: 20,
  },
  comments: {
    height: windowHeight * 0.6,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  typeComment: {
    paddingTop: 20,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    flex: 5,
    display: "flex",
    flexDirection: "row",
    marginLeft: 10,
    width: "65%",
    padding: 10,
    borderWidth: 1,
    backgroundColor: "white",
  },
  comment: {
    marginVertical: 25,
    marginLeft: 0,
    marginRight: 0,
    display: "flex",
    flexDirection: "row",
  },
  info: {
    flex: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: 10,
  },
  userName: {
    fontWeight: "500",
  },
  desc: {
    // fontFamily: FontFamily.interRegular,
  },
  date: {
    flex: 1,
    alignSelf: "center",
    right: -15,
    color: "gray",
    fontSize: 12,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 50,
    resizeMode: "contain",
  },
  comment2: {
    marginTop: 25,
    marginBottom: 0,
    marginLeft: 45,
    marginRight: 0,
    display: "flex",
    flexDirection: "row",
  },
});

export default CommentContainer;
