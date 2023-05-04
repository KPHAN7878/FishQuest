import { useContext, useState, useEffect } from "react";
import { Text, View, Pressable, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { UserContext } from "../../Contexts/UserContext";
import { width, height } from "../../styles";
import { Client } from "../../utils/connection";
import Posts from "../Social/ProfilePageUserPosts";         //////////////////////////////////////////////////////////////////////////Change the content of the file to the new posts screen
import Settings from "./Settings";
import { StackActions, NavigationActions, CommonActions  } from "@react-navigation/native";

export const Profile = ({ navigation, route }) => {
  const logOut = async () => {
    const res = await Client.post("user/logout");
    navigation.navigate("Login");           //ORIGINAL

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      }))

  };

  const { user, setUser } = useContext(UserContext);

  // console.log("USERR................................................................: ", user);
  
  if (route.params != undefined) {
     const { username } = route.params;
     setUser(username);
  }



 const [isLoading, setLoading] = useState(true);
 const [followingNumber, setFollowingNumber] = useState(0);
 const [followersNumber, setFollowersNumber] = useState(0);




 useEffect(() => {
  Client.get("profile/get-users", {
    params: {
      limit: 25,
      userId: user.id,
      type: "following",
    },
  })
   .then((res) => {
    //  console.log("following: ", res.data.users);
    //  console.log("\n\n")

     setFollowingNumber(Object.keys(res.data.users).length);
   })
   .catch((error) => {
     console.log(error);
   })

 }, [])


 useEffect(() => {
  Client.get("profile/get-users", {
    params: {
      limit: 25,
      userId: user.id,
      type: "followers",
    },
  })
   .then((res) => {
    //  console.log("followers: ", res.data.users);
    //  console.log("\n\n")

    setFollowersNumber(Object.keys(res.data.users).length);
    setLoading(false);
  })
   .catch((error) => {
     console.log(error);
   })
 }, [])



// GETTING POSTS

 const [cursor, setCursor] = useState(
  new Date().toISOString().slice(0, 19)
  );

 const useCursor = cursor;

 
useEffect(() => {
  Client.get("profile/posts", {
    params: {
      limit: 5,
      cursor: useCursor,
      id: user.id,
    },
  })
    .then((res) => {
    //  console.log("Posts: ", res.data);
     console.log("\n\n")

  })
   .catch((error) => {
     console.log(error.response.data);
   })
  }, []);



 
//  if (isLoading) {
//    return <Text>Loading...</Text>;
//  }
 

 return (
   <ScrollView style={styles.scroll}>
     <View>
       <View style={styles.headerStyle}>
         <View style={styles.header}>
           <Image style={styles.profilePic} source={require("../../assets/profilePic.jpg")} />
           <Text style={styles.name}>  {user.username} </Text>
           <TouchableOpacity style={styles.appButtonContainer} onPress={() => {
                      navigation.navigate("Settings");
                    }}>
             <Text style={styles.appButtonText}>Settings</Text>
           </TouchableOpacity>
           <View style={styles.follows}>
             <Text style={styles.followers}>{followersNumber} Followers</Text>
             <Text style={styles.following}>{followingNumber} Following</Text>
           </View>
         </View >
       </View>
     </View>

     <View style={styles.postsView}>
       <Posts/>
     </View>
   </ScrollView>

    



   // </View>
 );
};



const styles = StyleSheet.create({
 buttonText: {
    marginTop: 50
 },
 scroll:{
   paddingBottom: 1350
 },
 postsView:{
   top: -750,
 },
 follows: {
   top: 10,
   // left: -10,
   display: "flex",
   flexDirection: "row",
   justifyContent: "center",
   alignItems: "center",
 },
 followers: {
   color: "white",
   marginTop: 10,
   // marginLeft: -90
   left: 0
 },
 following: {
   color: "white",
   marginTop: 10,
   left: 12
  // marginLeft: 50
 },
 appButtonContainer: {
   elevation: 8,
   backgroundColor: "#009688",
   borderRadius: 10,
   paddingVertical: 10,
   paddingHorizontal: 12
 },
 appButtonText: {
   fontSize: 18,
   color: "#fff",
   fontWeight: "bold",
   alignSelf: "center",
   // textTransform: "uppercase"
 },
 header: {
   // position: "absolute",
   top: 730,
   // left: 0,
   // right: 0,
   // bottom: 0,
   // justifyContent: "center",
   // alignItems: "center",
   // marginBottom: 10,
   // marginTop: 100
   display: "flex",
   flexDirection: "column",
   justifyContent: "center",
   alignItems: "center",

 },
 headerStyle: {
   height: 1036,
   width: "100%",
   borderRadius: 110,
   backgroundColor: "#839feb",
   // bac
   // zIndex: 10,
   top: -740
 },
 profilePic: {
   width: 113,
   height: 112,
   borderRadius: 100,
   borderWidth: 1,
   resizeMode: "contain",
   // marginBottom: 10,
   marginTop: 40,
   // marginVertical: 200
   marginBottom: 10,

  
   
 },
 name: {
   fontSize: 20,
   marginBottom: 10,
   fontWeight: "bold",

 },
 editBtn: {
   width: 105,
   fontSize: 12,
 },
});


export default Profile;




// return (
//   <View
//     style={{
//       flex: 1,
//     }}
//   >
//     <Text
//       style={{
//         marginTop: height * 0.15,
//         textAlign: "center",
//       }}
//     >
//       {JSON.stringify(user.username)}
//     </Text>

//     <Text
//       style={{
//         textAlign: "center",
//       }}
//     >
//       {JSON.stringify(user.email)}
//     </Text>

//     <Text
//       style={{
//         textAlign: "center",
//       }}
//     >
//       {"id: " + JSON.stringify(user.id)}
//     </Text>

//     <Text
//       style={{
//         marginTop: height * 0.15,
//         textAlign: "center",
//       }}
//     >
//       Profile
//     </Text>

//     <Pressable style={styles.formButton} onPress={logOut}>
//       <Text style={styles.buttonText}>{"LOG OUT"}</Text>
//     </Pressable>
//   </View>
// );
// };