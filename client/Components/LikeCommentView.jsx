import React from "react";
export const { height, width } = Dimensions.get("window");
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { FontFamily } from "../GlobalStyles";

const LikeCommentView = (props) => {
  const { onPressLike, onPressComment, item } = props;
  const [hasLiked, setHasLiked] = React.useState(props.item.liked);
  const [addValue, setAddValue] = React.useState(0);

  return (
    <View style={styles.info}>
      <View style={styles.like_comment}>
        <View style={styles.item}>
          <TouchableOpacity
            activeOpacity={0.2}
            onPress={() => {
              setAddValue(
                item.liked ? (!hasLiked ? 0 : -1) : !hasLiked ? 1 : 0
              );
              setHasLiked(!hasLiked);
              onPressLike();
            }}
          >
            <AntDesign
              name="like2"
              size={24}
              color={hasLiked ? "green" : "black"}
            />
          </TouchableOpacity>

          <Text
            style={{
              marginHorizontal: 10,
              fontFamily: FontFamily.interMedium,
              fontWeight: "bold",
            }}
          >
            {item.likeValue + (hasLiked ? addValue : addValue)}
          </Text>
        </View>
        <View style={styles.item}>
          <TouchableOpacity
            style={styles.comment}
            activeOpacity={0.2}
            onPress={() => {
              onPressComment();
            }}
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
            {item.commentValue}
          </Text>
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

export default LikeCommentView;
