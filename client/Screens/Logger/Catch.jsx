import React from 'react'
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
  } from "react-native";

  var { height } = Dimensions.get('window')
var { width } = Dimensions.get('window')

const Catch = (props) => {
  let tempString = props.imageUri
  let finalString = tempString.replace("fishquest/development", "development/catches")
  return (
    <View style={styles.container}>
      {/* <Text>{JSON.stringify(props)}</Text> */}
      {/* {console.log(props.imageUri)} */}
      {console.log("final string: " + finalString)}
      <Image 
        style={styles.image}
        resizeMode="cover"
        source={{uri: finalString ? finalString : 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png'}}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
      width: width / 4,
      height: width / 4,
      paddingLeft: 2,
      paddingRight: 2,
      marginTop: 4,
      alignItems: 'center',
      overflow: 'hidden',
      position: 'relative',
      elevation: 8,
      //backgroundColor: 'black',
  },
  image: {
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      alignSelf: 'center'
  },
  card: {
      marginBottom: 10,
      height: width / 2 - 20 - 90,
      backgroundColor: 'transparent',
      width: width / 2 - 20 - 10
  },
  title: {
      fontWeight: "bold",
      fontSize: 14,
      textAlign: 'center'
  },
  price: {
      fontSize: 20,
      color: 'orange',
      marginTop: 10
  }
});

export default Catch