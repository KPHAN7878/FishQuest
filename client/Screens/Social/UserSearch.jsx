import React, { useEffect, useState, useRef, useContext } from "react";
import { Text, View, StyleSheet, Dimensions, Button, TextInput } from 'react-native'
import { Client } from "../../utils/connection";

var { height } = Dimensions.get('window')
var { width } = Dimensions.get('window')

const UserSearch = ({navigation}) => {
  const [usersList, setUsers] = useState()

  const searchFunction = async (input) => {
    console.log("onChangeText: " + input)

    await Client.get("user/" + input)
    .then((res) => {
      console.log("USERS: " + JSON.stringify(res))
      console.log("\n\n")
    })
    .catch((error) => {
      console.log(error);
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
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flexWrap: "wrap",
      backgroundColor: "gainsboro",
    },
    testContainer: {
      flex: 1,
      backgroundColor: 'gainsboro'
    },
    listContainer: {
      height: height,
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-start",
      flexWrap: "wrap",
      backgroundColor: "gainsboro",
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
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