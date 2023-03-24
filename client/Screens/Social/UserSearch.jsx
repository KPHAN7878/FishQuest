import React, { useEffect, useState, useRef, useContext } from "react";
import { Text, View, StyleSheet, Dimensions, Button, TextInput, ScrollView, Pressable  } from 'react-native'
import { Client } from "../../utils/connection";

var { height } = Dimensions.get('window')
var { width } = Dimensions.get('window')

const UserSearch = ({navigation}) => {
  const [usersList, setUsers] = useState([])
  const [followUsersArray, setArray] = useState([]);
  const [onSwitch, setSwitch] = useState();

  const searchFunction = async (input) => {
    console.log("onChangeText: " + input)

    if(input.length !== 0)
    {   
        // setArray([]);

        await Client.get("user/" + input)
        .then((res) => {
        //console.log("USERS: " + JSON.stringify(res))
        console.log("\n\n")
        setUsers(res.data)
        
        // const followArray = []
        // usersList.forEach(function(item){
        //   console.log("usersList Item: " + JSON.stringify(item.username) + "\n")
        //   followArray.push(item.username)
        // });

        // setArray(followArray.slice())

        // console.log("usersList: " + JSON.stringify(usersList) + "\n\n")
        // console.log("usersArray: " + JSON.stringify(usersArray))

        })
        .then(async () => {
          //setArray([]);

          const res = await Client.get("profile/get-usersV2/testing");

          console.log("RES: " + JSON.stringify(res.data.users) + "\n\n")

          const followArray = []
          res.data.users.forEach(function(item){
          console.log("usersList Item: " + JSON.stringify(item.user.username) + "\n")
          followArray.push(item.user.username)
        });

        setArray(followArray.slice())

        //console.log("usersList: " + JSON.stringify(usersList) + "\n\n")
        console.log("usersArray: " + JSON.stringify(followUsersArray))

        })
        .catch((error) => {
        console.log(error);
        })

        // const followArray = []
        // usersList.forEach(function(item){
        //   console.log("usersList Item: " + JSON.stringify(item.username) + "\n")
        //   followArray.push(item.username)
        // });

        // setArray(followArray.slice())

        // console.log("usersList: " + JSON.stringify(usersList) + "\n\n")
        // console.log("usersArray: " + JSON.stringify(usersArray))
    }
    else
    {
        setUsers([])
    }
  }

  const followButton = async (userId) => {
    await Client.post("profile/follow", {
      userId: userId
    })
    .then(async () => {
      //setArray([]);

      const res = await Client.get("profile/get-usersV2/testing");

      console.log("RES: " + JSON.stringify(res.data.users) + "\n\n")

      const followArray = []
      res.data.users.forEach(function(item){
      console.log("usersList Item: " + JSON.stringify(item.user.username) + "\n")
      followArray.push(item.user.username)
    });

    setArray(followArray.slice())

    //console.log("usersList: " + JSON.stringify(usersList) + "\n\n")
    console.log("usersArray: " + JSON.stringify(followUsersArray))

    })
    .catch((error) => {
      console.log(error)
    })
  }

  return (
    <View style={styles.testContainer}>
      <View style={styles.headerBox}>
        <Button title='Back' color='#841584' onPress={() => {navigation.goBack()}}/>
      </View>
      <Text>User Searches</Text>
      <TextInput 
        placeholder='input here'
        onChangeText={(input) => searchFunction(input)}/>
      <ScrollView>
      {usersList ? usersList.map((item) => {
          return(
            // <Text>
            //     {JSON.stringify(item.username)}
            // </Text>
            <View style={styles.usersView}>
                <Text style={{fontWeight: 'bold'}}>{item.username}</Text>
                {/* <Button title="Follow" style={styles.followButton}/> */}
                <Pressable style={styles.button} onPress={() => followButton(item.id)}>
                    <Text style={styles.text}>{followUsersArray.includes(item.username) ? "Following" : "Follow"}</Text>
                </Pressable>
            </View>
          )
        }) : <View/>}
     </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    testContainer: {
      flex: 1,
      backgroundColor: 'gainsboro'
    },
    headerBox: {
      marginTop: 0,
      paddingTop: 0.06*height,
      paddingBottom: 0.01*height,
      borderWidth: 0.3,
      borderColor: "#787777",
      backgroundColor: "#2596be",
      flexDirection: 'row'
    },
    usersView: {
        height: 0.05 * height,
        flexDirection: 'row',
        marginBottom: 1,
        //backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    followButton: {
        alignSelf: 'flex-end'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 50,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: 'purple',
        alignSelf: 'flex-end',
        marginRight: width * 0.05,
        marginBottom: (height * 0.05)*0.16
      },
      text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
      },
  });

export default UserSearch