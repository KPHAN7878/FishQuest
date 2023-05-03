import React from "react";
import { Text, View, Pressable, Image, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { UserContext } from "../../Contexts/UserContext";
import { width, height } from "../../styles";
import { Client } from "../../utils/connection";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import isCloseToBottom from "../../utils/isCloseToBottom";
import Post from "../Social/Post";

import { StackActions, NavigationActions, CommonActions  } from "@react-navigation/native";


const RenderOnce = React.memo(({ post }) => {
    return <Post interactable={true} post={post} />;
  });

export const Likes = () => {


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

        Client.get("profile/likes", {
          params: {
            limit: 10,
            cursor: useCursor,
            id: user.id
          },
        })
          .then((res) => {
            // console.log("\n\nresss: ", res.data.likes);
            
            // const likes = res.data.likes;
            // likes.forEach(like => {
            //   const likeContent = like.likeContent;
            //   console.log(likeContent);
            // });
        

                const newPosts = [...res.data.likes].filter(
                (p) => !postIds.includes(p.id)
                );

                console.log("\n\nnewPosts:   ", newPosts);

                setPosts(newPosts);
                setPostIds([...postIds, ...newPosts.map((p) => p.id)]);

                const last = res.data.likes[res.data.likes.length - 1];
                setMore(res.data.hasMore);
                if (last) setCursor(last.createdAt);


           // }

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
  
  <View style={{flex: 1,  backgroundColor: "#dff0f7"}}>
    <View style={styles.backView}>
        <TouchableOpacity style={styles.back} activeOpacity={0.2} onPress={() => {navigation.goBack();}}>
          <Ionicons name="chevron-back-sharp" size={24} color="black" />
        </TouchableOpacity>
    </View>

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
  
  </View>
);
};


const styles = StyleSheet.create({
  pageLayout: {
    top: 100
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
    marginBottom: 0
  },
  commentButtonContainer: {
    elevation: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderLeftColor: "#dff0f7",
    borderRightColor: "#dff0f7",
    borderTopColor: '#dff0f7',
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0
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
    textAlign: "center"
  },
  backView: {
    top: 50,
    left: 10,
  },
  logoutBtn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    top: 350

  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#de2618",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: "25%"
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
  }

});






export default Likes;




