import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  RefreshControl,
  Text,
} from "react-native";
import Post from "./Post";
import { Client } from "../../utils/connection";
import isCloseToBottom from "../../utils/isCloseToBottom";
import { UserContext } from "../../Contexts/UserContext";


const RenderOnce = React.memo(({ post }) => {
  return <Post interactable={true} post={post} />;
});

const Posts = ( props ) => {

  const { user, setUser } = React.useContext(UserContext);

  const [posts, setPosts] = React.useState([]);
  const [postIds, setPostIds] = React.useState([]);

  const [isFetching, setIsFetching] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const [cursor, setCursor] = React.useState(
    new Date().toISOString().slice(0, 19)
  );
  const [more, setMore] = React.useState(true);
  const [postComponents, setPostComponents] = React.useState([]);

  const getSocialFeed = (refresh) => {
    if (!more && !refresh) return;
    const useCursor = refresh ? new Date().toISOString().slice(0, 19) : cursor;

    console.log("get feed");

    if (Object.keys(props).length !== 0) {
        const userObj = props.userObj;
      

        Client.get("profile/posts", {
          params: {
            limit: 5,
            cursor: useCursor,
            id: userObj.id
          },
        })
          .then((res) => {
            const newPosts = [...res.data.posts].filter(
              (p) => !postIds.includes(p.id)
            );

            setPosts(newPosts);
            setPostIds([...postIds, ...newPosts.map((p) => p.id)]);

            const last = res.data.posts[res.data.posts.length - 1];
            setMore(res.data.hasMore);
            if (last) setCursor(last.createdAt);
          })
          .catch((error) => {
            console.log(error);
          });
    }
    else {

        Client.get("profile/posts", {
          params: {
            limit: 5,
            cursor: useCursor,
            id: user.id
          },
        })
          .then((res) => {
            console.log("Posts. : ", res.data.posts);

            const newPosts = [...res.data.posts].filter(
              (p) => !postIds.includes(p.id)
            );


            console.log("\n\nProfile Posts:  ", newPosts);
            setPosts(newPosts);
            setPostIds([...postIds, ...newPosts.map((p) => p.id)]);

            const last = res.data.posts[res.data.posts.length - 1];
            setMore(res.data.hasMore);
            if (last) setCursor(last.createdAt);
          })
          .catch((error) => {
            console.log(error);
          });


    }



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
    console.log("render posts, ", posts.length);
    renderPosts(posts);
  }, [posts]);

  const renderPosts = (posts) => {
    Promise.all(
      posts.map(async (p) => {
        return <RenderOnce post={p} key={p.id} />;
      })
    )
      .then((newPostComponents) => {
        setIsFetching(false);
        setPostComponents(
          (refreshing ? newPostComponents : postComponents).concat(
            refreshing ? postComponents : newPostComponents
          )
        );

        setRefreshing(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <ScrollView
        style={styles.posts}
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
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {postComponents}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  posts: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
  },
});

export default Posts;
