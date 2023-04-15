import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Button,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity
} from "react-native";
import styles from "../../styles";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, Color } from "../../GlobalStyles";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Client } from "../../utils/connection";
import axios from "axios";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const CommentContainer = ({route, navigation}) => {
  //const navigation = useNavigation();
  const [text, onChangeText] = React.useState();
  const [commentsDB, setComments] = useState();
  const [isChildBool, setIsChild] = useState();

  const {postDetails} = route.params;

  const submitComment = async () => {

    console.log("in submit comment function")
    console.log("commentableId: " + route.params.caption.id)
    console.log("text: " + text)
    
    await Client.post("comment", {
      // commentableId: route.params.caption.id,
      // text: text,
      // type: 'comment'
      commentableId: route.params.caption.id,
      text: text,
      type: 'post'
    })
    .then((res) => {
    console.log("\n\create comment response: " + JSON.stringify(res));
    getComments();
    })
    .catch((error) => {
    console.log("error comment: " + error);
    })
  }

  const getComments = async () => {

    if(!isChildBool) {
    await Client.get("comment/get-commentsV2/100," + route.params.caption.id + ",post")
    .then((res) => {
      console.log("\n\NOOOOOO!!!\n\n")
      console.log("comments: " + JSON.stringify(res) + "\n\n")
      setComments(res.data.comments)
      console.log("comment array: " + commentsDB)
      
    })
    .catch((error) => {
      console.log(error);
    })
    }
    else {
      await Client.get("comment/get-commentsV2/100," + route.params.caption.id + ",comment")
    .then((res) => {
      console.log("\n\nYAY!!!\n\n")
      console.log("comments: " + JSON.stringify(res) + "\n\n")
      setComments(res.data.comments)
      console.log("comment array: " + commentsDB)
      
    })
    .catch((error) => {
      console.log(error);
    })
    }
  }

  React.useEffect(() => {
    if (route.params.caption.isChild)
    {
      setIsChild(true);
    }
    getComments();
    // console.log("route: " + JSON.stringify(route.params))
  }, []);

  //TEMPORARY DATABASE //////////////////////////////////
  const comments = [
    {
      id: 1,
      name: "John Doe",
      userId: 1,
      profilePic:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
      desc: "Great picture, what bait did you use?",
    },
    {
      id: 2,
      name: "Will Smith",
      userId: 2,
      profilePic:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
      desc: "What part of Joe Pool Lake were you fishing in? I never caught a big fish there",
    },
    {
        id: 3,
        name: "Luka Doncic",
        userId: 3,
        profilePic:
          "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
        desc: "Nice catch!",
    },
    {
        id: 4,
        name: "Lionel Messi",
        userId: 4,
        profilePic:
          "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
        desc: "When's dinner?",
      },  
  ];
  ///////////////////////////////////////////////////////

  return (
    // <KeyboardAvoidingView style={{flex:1}} behavior="padding">
    <View>
      
      {console.log("COMMENTS: " + JSON.stringify(route))}
      <View style={styles2.headerBox}>
        <Text style={styles2.fishQuest}>Fish Quest</Text>
        
        <TouchableOpacity style={styles2.back} activeOpacity={0.2} onPress={() => {navigation.goBack();}}>
            <Ionicons name="chevron-back-sharp" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View>
        {!isChildBool ? <Text style={styles2.postCaption}>{route.params.caption.text}</Text> : <View></View>}
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: 2,
            width: "100%",
            alignSelf: "center",
            marginTop: 40
          }}
        />
      </View>

     

      <ScrollView style={styles2.comments}>

          {commentsDB ? commentsDB.map((comment) => (
            <Pressable onPress={() => {navigation.push("CommentContainer", {caption:{id: comment.id, isChild: true}}, )}}>
            <View>
              {console.log("commentsDB: " + JSON.stringify(commentsDB))}
              <View key={comment.id} style={styles2.comment}>
                  <Image style={styles2.img} source={require("../../assets/profilePic.jpg")} />
                  <View style={styles2.info}>
                      <Text style={styles2.userName}>{comment.creator.username}</Text>
                      <Text style={styles2.desc}>{comment.text}</Text>
                  </View>
                  <Text style={styles2.date}>1 hour ago</Text>
              </View>
              {/* <View key={comment.id} style={styles2.comment2}>
                  <Image style={styles2.img} source={require("../../assets/profilePic.jpg")} />
                  <View style={styles2.info}>
                      <Text style={styles2.userName}>{comment.name}</Text>
                      <Text style={styles2.desc}>{comment.desc}</Text>
                  </View>
                  <Text style={styles2.date}>1 hour ago</Text>
              </View> */}
              <View style={styles2.line}/>
            </View>
            </Pressable>

          ))
          :
          <View></View>
          }

          
      </ScrollView>

      <View style={styles2.typeComment}>
          <Image style={styles2.img} source={require("../../assets/profilePic.jpg")}/>
          <TextInput 
            style={styles2.input} 
            placeholder="write a comment..." 
            onChangeText={(text) => onChangeText(text)}/>
          {/* <Button style={styles2.send} title="Send" onPress={this.submitComment()}/> */}
          <Pressable
          style={styles.formButton}
          onPress={() => {
            submitComment();
          }}
        >
          <Text style={styles.buttonText}>{"Submit Post"}</Text>
        </Pressable>
      </View>
    </View>
    // </KeyboardAvoidingView>

 
  );
};

const styles2 = StyleSheet.create({
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
  line: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "75%",
    alignSelf: "center",
    marginTop: 20
  },
  back:{
    left: 320
  },
  postCaption:{
    marginTop: 30,
    marginHorizontal: 20,
  },
  comments: {
    height: windowHeight * 0.6,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  typeComment:{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 20,
      marginHorizontal: 20,
  },
  input: {
      width: "65%",
      padding: 10,
      borderWidth: 1,
      backgroundColor: "white",
  },
  comment: {
      marginTop: 25,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      display: "flex",
      flexDirection: "row",
  },
  info:{
      flex: 3,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      marginLeft: 10,
  },
  userName:{
      fontWeight: "500",
  },
  desc: {
      // fontFamily: FontFamily.interRegular,
  },
  date: {
      flex: 1,
      alignSelf: "center",
      right: -15,
      color: "gray",
      fontSize: 12
  },
  img: {
      width: 40,
      height: 40,
      borderRadius: 50,
      resizeMode: "contain"
  },
  comment2: {
    marginTop: 25,
    marginBottom: 0,
    marginLeft: 45,
    marginRight: 0,
    display: "flex",
    flexDirection: "row",
},
});

export default CommentContainer;
