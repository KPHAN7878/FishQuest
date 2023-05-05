import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { UserContext } from "../../Contexts/UserContext";
import { Client } from "../../utils/connection";
import { Ionicons } from "@expo/vector-icons";
import isCloseToBottom from "../../utils/isCloseToBottom";
import LikedPost from "./LikedPost";
import { FontFamily, Color } from "../../GlobalStyles";
import { RenderOnceComment } from "./CommentsUser";

import { width } from "../../styles";
const RenderOnce = React.memo(({ post }) => {
  return <LikedPost interactable={true} post={post} />;
});

export const Likes = ({ navigation }) => {
  const { user, setUser } = React.useContext(UserContext);

  const [items, setItems] = React.useState([]);
  const [itemIds, setItemIds] = React.useState([]);

  const [isFetching, setIsFetching] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const [cursor, setCursor] = React.useState(
    new Date().toISOString().slice(0, 19)
  );
  const [more, setMore] = React.useState(true);
  const [itemComponents, setItemComponents] = React.useState([]);
  const commentReducer = (c) => {
    return {
      ...c,
      ...c.likeContent,
      likeContent: undefined,
    };
  };

  const getSocialFeed = (refresh) => {
    if (!more && !refresh) return;
    const useCursor = refresh ? new Date().toISOString().slice(0, 19) : cursor;

    Client.get("profile/likes", {
      params: {
        limit: 10,
        cursor: useCursor,
        id: user.id,
      },
    })
      .then((res) => {
        const newItems = [...res.data.likes].filter(
          (i) => !itemIds.includes(`${i.likeType}${i.id}`)
        );

        setItems(newItems);
        setItemIds([...itemIds, ...newItems.map((p) => p.id)]);

        const last = res.data.likes[res.data.likes.length - 1];
        setMore(res.data.hasMore);
        if (last) setCursor(last.createdAt);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onRefresh = () => {
    setIsFetching(true);
    setRefreshing(true);
    getSocialFeed(true);
  };

  React.useEffect(() => {
    console.log("on refresh");
    onRefresh();
  }, []);

  React.useEffect(() => {
    renderItems(items);
  }, [items]);

  const renderItems = (items) => {
    Promise.all(
      items.map(async (i, idx) => {
        const key = idx + itemComponents.length;
        if (i.likeType === "post") {
          return <RenderOnce post={i} key={key} />;
        } else if (i.likeType === "comment") {
          return (
            <View style={{ width }} key={key}>
              <RenderOnceComment
                interactable={true}
                comment={commentReducer(i)}
                navigation={navigation}
              />
            </View>
          );
        }
      })
    )
      .then((newItemComponents) => {
        setIsFetching(false);
        setItemComponents(
          (refreshing ? newItemComponents : itemComponents).concat(
            refreshing ? itemComponents : newItemComponents
          )
        );

        setRefreshing(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View>
      <View style={styles.headerBox}>
        <Text style={styles.fishQuest}>Fish Quest</Text>
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

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          top: 0,
          paddingBottom: 320,
        }}
      >
        <ScrollView
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
          }}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
          }
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent) && !isFetching && !refreshing) {
              getSocialFeed(false);
            }
          }}
          scrollEventThrottle={400}
        >
          <View
            style={{
              backgroundColor: "white",
              alignItems: "center",
              flex: 1,
            }}
          >
            {itemComponents}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageLayout: {
    top: 50,
  },
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
  back: {
    left: -30,
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
  },
  btnRight: {
    //  left: 150
  },
  buttonText: {
    top: 30,
    textAlign: "center",
  },
  backView: {
    top: 60,
    left: 30,
  },
  logoutBtn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    top: 350,
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#de2618",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: "25%",
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
  },
});

export default Likes;
