import React, { useEffect, useState, useRef, useContext } from "react";
import { StyleSheet, ScrollView, View, RefreshControl } from "react-native";
import Post from "./Post";
import { Client } from "../../utils/connection";
import axios from "axios";

const Posts = () => {
  const [postsPostgres, setPosts] = useState();
  const [refreshing, setRefreshing] = React.useState(false);

  const getSocialFeed = async () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    //await Client.get("profile/feedV2/10,2023-03-21T21:04:30.752Z")
    await Client.get("profile/feedV2/100," + today + "T21:04:30.752Z")
      .then((res) => {
        setPosts(res.data.posts);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    getSocialFeed();
    // console.log("route: " + JSON.stringify(route.params))
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getSocialFeed();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  //TEMPORARY DATABASE //////////////////////////////////
  const posts = [
    {
      id: 1,
      name: "John Doe",
      userId: 1,
      profilePic:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
      img: "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600",
    },
    {
      id: 2,
      name: "Will Smith",
      userId: 2,
      profilePic:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
      desc: "Tenetur iste voluptates dolorem rem commodi voluptate pariatur, voluptatum, laboriosam consequatur enim nostrum cumque! Maiores a nam non adipisci minima modi tempore.",
    },
  ];
  ///////////////////////////////////////////////////////

  return (
    <ScrollView
      style={styles.posts}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {postsPostgres ? (
        postsPostgres.map((post) => <Post post={post} key={post.id} />)
      ) : (
        <View></View>
      )}
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
