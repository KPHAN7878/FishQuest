import React from "react";
import { StyleSheet, ScrollView, View, RefreshControl } from "react-native";
import Post from "./Post";
import { Client } from "../../utils/connection";
import isCloseToBottom from "../../utils/isCloseToBottom";

const RenderOnce = React.memo(({ post }) => {
  return <Post post={post} />;
});

const Posts = () => {
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

    Client.get("profile/feed", {
      params: {
        limit: 3,
        cursor: useCursor,
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
  };

  const onRefresh = () => {
    setIsFetching(true);
    setRefreshing(true);
    getSocialFeed(true);
  };

  React.useEffect(() => {
    onRefresh();
  }, []);

  React.useEffect(() => {
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
      {postComponents}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  posts: {
    display: "flex",
    flexDirection: "column",
  },
});

export default Posts;
