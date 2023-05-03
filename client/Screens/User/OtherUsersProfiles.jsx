import { useContext, useState, useEffect } from "react";
import { Text, View, Pressable, Image, Button, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { UserContext } from "../../Contexts/UserContext";
import { width, height } from "../../styles";
import { Client } from "../../utils/connection";
import Posts from "../Social/ProfilePageUserPosts"; 
import { Ionicons } from "@expo/vector-icons";
import { StackActions, NavigationActions, CommonActions  } from "@react-navigation/native";



export const OtherUsersProfiles = ({ navigation, route }) => {
  
  const { user, setUser } = useContext(UserContext);
  const { userProfile } = route.params;
  const [isLoading, setLoading] = useState(true);
  const [followingNumber, setFollowingNumber] = useState(0);
  const [followersNumber, setFollowersNumber] = useState(0);
  const [followUsersArray, setFollowUsersArray] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);



// if user opens their own profile from the social feed then direct to profile page
useEffect(() => 
{
    if (userProfile.id == user.id) {
        navigation.navigate('Profile');
    }
}, [])





const followButton = async (userId) => {

    if (isFollowing) {
        setIsFollowing(false);
    }
    else {
        setIsFollowing(true);
    }


    const res = await Client.post("profile/follow", {
        userId,
      })
        .then()
        .catch((error) => {
          console.log(error);
        });
        return res.data;
}






// Set the following number
useEffect(() => {
    Client.get("profile/get-users", {
      params: {
        limit: 25,
        userId: userProfile.id,
        type: "following",
      },
    })
     .then((res) => {
       console.log("following: ", res.data.users);
       console.log("\n\n")
  
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
        userId: userProfile.id,
        type: "followers",
      },
    })
     .then((res) => {
       console.log("followers: ", res.data.users);
       console.log("\n\n")
  
      setFollowersNumber(Object.keys(res.data.users).length);
      setLoading(false);
    })
     .catch((error) => {
       console.log(error);
     })
   }, [])












// set the button status (follow/unfollow)
useEffect(() => 
{
    Client.get("profile/get-users", {
        params: {
          limit: 25,
          userId: user.id,
          type: "following",
        },
      })
    .then(async (res) => {

        res.data.users.map(
            (userFollowed) => {
                if (userProfile.id == userFollowed.user.id) {
                    setIsFollowing(true);
                }
            }
        )

    })
    .catch((error) => {
        console.log(error);
    })
}, [])




  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  

  return (
    
    <ScrollView style={styles.scroll}>
      <View>
        <View style={styles.headerStyle}>  
          <View style={styles.header}>
            <View style={styles.backView}>
                <TouchableOpacity style={styles.back} activeOpacity={0.2} onPress={() => {navigation.goBack();}}>
                    <Ionicons name="chevron-back-sharp" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <Image style={styles.profilePic} source={require("../../assets/profilePic.jpg")} />
            <Text style={styles.name}>  {userProfile.username} </Text>
            <TouchableOpacity style={styles.appButtonContainer} onPress={() => followButton(userProfile.id)}>
              <Text style={styles.appButtonText}>{(isFollowing) ? "Unfollow" : "Follow"}</Text>
            </TouchableOpacity>
            <View style={styles.follows}>
              <Text style={styles.followers}>{followersNumber} Followers</Text>
              <Text style={styles.following}>{followingNumber} Following</Text>
            </View>
          </View >
        </View>
      </View>
      <View style={styles.postsView}>
        <Posts userObj={userProfile}/>
      </View>
    </ScrollView>
  );
};




const styles = StyleSheet.create({
  backView:{
    top: 70,
    left: -170,
  },
  back: {
  },
  scroll:{
    
  },
  postsView:{
    top: -750,
  },
  follows: {
    
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
  },
  header: {
    top: 730,
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


export default OtherUsersProfiles;
