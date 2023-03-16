import React, { useEffect, useState, useRef, useContext } from "react";
import { Text, View, StyleSheet, Dimensions, Button, TextInput } from 'react-native'
import { Client } from "../../utils/connection";

var { height } = Dimensions.get('window')
var { width } = Dimensions.get('window')

const UserSearch = ({navigation}) => {
  const [usersList, setUsers] = useState([])

  const searchFunction = async (input) => {
    console.log("onChangeText: " + input)

    if(input.length !== 0)
    {
        await Client.get("user/" + input)
        .then((res) => {
        console.log("USERS: " + JSON.stringify(res))
        console.log("\n\n")
        setUsers(res.data)
        })
        .catch((error) => {
        console.log(error);
        })
    }
    else
    {
        setUsers([])
    }
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
      {usersList ? usersList.map((item) => {
          return(
            <Text>
                {JSON.stringify(item.username)}
            </Text>
          )
        }) : <View/>}
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
  });

export default UserSearch