import * as React from "react";
import { StyleSheet, ScrollView } from "react-native";
import Post from "./Post";

const Posts = () => {
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
    <ScrollView style={styles.posts}>
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
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
