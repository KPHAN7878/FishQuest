import React, { useEffect, useState, useRef, useContext } from "react";
import Posts from "./Posts";
import { Client } from "../../utils/connection";
import axios from "axios";

const SocialFeed = ({ navigation }) => {

  // const [posts, setPosts] = useState();

  // const getSocialFeed = async () => {
  //   await Client.get("profile/feedV2/10,2023-03-17T21:04:30.752Z")
  //   .then((res) => {
  //     //setCatches(res.data.catches);
  //     console.log("profile feed: " + JSON.stringify(res.data.posts))
  //     setPosts(res.data.posts)
      
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   })
  // }

  // React.useEffect(() => {
  //   getSocialFeed();
  //   // console.log("route: " + JSON.stringify(route.params))
  // }, []);

  return (
    <>
      {/* {console.log("\n\nPOSTS" + JSON.stringify(posts))} */}
      <Posts />
    </>
  );
};

export default SocialFeed;
