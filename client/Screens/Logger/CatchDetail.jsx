import React from 'react'
import { View, Text, StyleSheet, Dimensions, Button, ScrollView, Image, TouchableOpacity } from 'react-native'
import { FontFamily } from "../../GlobalStyles";
import MapView, { Marker } from 'react-native-maps';
var { height } = Dimensions.get('window')
var { width } = Dimensions.get('window')

const CatchDetail = ({route, navigation}) => {
    const result = route.params;

    let tempString = result.imageUri
    let finalString = tempString.replace("fishquest/development", "development/catches")

  return (
    <View style={styles.testContainer}>
      <View style={styles.headerBox}>
      <Button title='Back' color='#841584' onPress={() => {navigation.goBack()}}/>
        </View>
        <ScrollView style={styles.ScrollViewContainer}>

        <View style={styles.listContainer}>

        <View style={styles.user}>
        <View style={styles.userInfo}>
        <Image
              style={styles.profilePic}
              resizeMode="cover"
              source={require("../../assets/profilePic.jpg")}
            />

        <View style={styles.details}>
          <TouchableOpacity
            style={{ textDecoration: "none", color: "inherit" }}
            activeOpacity={0.2}
            onPress={() => {
              `/users/${post.userId}`;
            }}
          >
            <Text style={styles.name}>{result.user.username}</Text>
          </TouchableOpacity>
          <Text style={styles.date}>a few seconds ago</Text>
        </View>

        </View>
        </View>

        <View style={styles.catchDetails}>
            <Text style={styles.detailsText}>Details</Text>
            <View style={styles.subDetails}>
            <Text style={styles.detailsTitle}>Species</Text>
            <Text style={{alignSelf: 'flex-end', paddingRight: 20}}>Largemouth Bass</Text>
            </View>
            <View style={styles.subDetails}>
            <Text style={styles.detailsTitle}>Date</Text>
            </View>
            <View style={styles.subDetails}>
            <Text style={styles.detailsTitle}>Time</Text>
            </View>
            <View style={styles.subDetails}>
            <Text style={styles.detailsTitle}>Weight</Text>
            </View>
            <View style={styles.subDetails}>
            <Text style={styles.detailsTitle}>Length</Text>
            </View>
            <View style={styles.subDetails}>
            <Text style={styles.detailsTitle}>Temperature</Text>
            </View>
            <View style={styles.subDetails}>
            <Text style={styles.detailsTitle}>Bait</Text>
            </View>
        </View>

        <View style={styles.imageView}>
        <Image            
          // style={styles.postImage}
          style={styles.testImage}
          resizeMode="cover"
          // source={require("../../assets/no_image.png")}
          // source={require("../../assets/post_pic.png")}
          // source={
          // require("../../assets/no_image.png")}
          source={{uri: finalString ? finalString : 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png'}}
        />
        </View>


        <View style={styles.viewForMap}>
        <MapView 
          style={styles.map} 
          initialRegion={{
            latitude: result.location[0],
            longitude: result.location[1],
            // latitudeDelta: 0.0922,
            // longitudeDelta: 0.0421,
            latitudeDelta: 0.2922,
            longitudeDelta: 0.1421,
          }}
          showsUserLocation={true}
          coordinate={{
            latitude: result.location[0],
            longitude: result.location[1]
          }}> 
          <Marker
            //key={item.id}
            coordinate={{
              latitude: result.location[0],
              longitude: result.location[1]
            }}
            >
              <Image 
                source={require("../../assets/image3.png")}
                style={{height: 25, width: 23}}
              />
            </Marker>
        </MapView>
        </View>

        {console.log(JSON.stringify(result))}

        </View>

        </ScrollView>
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
      backgroundColor: '#c2e4f2',
      height: '100%'
    },
    ScrollViewContainer: {
      flex: 1,
      marginBottom: 1,
      height: '100%'
    },
    listContainer: {
      //height: height,
      flex: 1,
      //flexDirection: "row",
      //alignItems: "flex-start",
      //flexWrap: "wrap",
      //backgroundColor: "gainsboro",
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
    user: {
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "row",
      backgroundColor: '#c2e4f2',
      borderBottomColor: "gainsboro",
      borderBottomWidth: 2,
      padding: 2
    },
    userInfo: {
      display: "flex",
      flexDirection: "row",
    },
    profilePic: {
      width: 45,
      height: 45,
      borderRadius: 100,
      resizeMode: "cover",
      marginRight: 10,
    },
    details: {
      display: "flex",
      flexDirection: "column",
      marginTop: 3,
    },
    name: {
      fontFamily: FontFamily.interMedium,
      fontSize: 17,
    },
    date: {
      fontSize: 13,
    },
    catchDetails: {
      backgroundColor: '#c2e4f2',
      marginTop: 2,
      borderBottomColor: "gainsboro",
      borderBottomWidth: 2,
    },
    detailsText: {
      fontWeight: 'bold',
      fontSize: 20,
      marginBottom: 20,
      paddingLeft: 10
    },
    subDetails: {
      flex: 1,
      flexDirection: 'row',
      marginBottom: 18,
      paddingLeft: 30,
      justifyContent: "space-between"
    },
    map: {
      // width: '100%',
      // height: '80%',
      ...StyleSheet.absoluteFillObject
    },
    detailsTitle: {
      fontWeight: 'bold',
      fontSize: 16
    },
    imageView: {
      flex: 1,
      width: '100%',
      height: height * .6,
      marginBottom: 10
    },
    testImage: {
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      alignSelf: 'center',
      //borderRadius: 20,
      flex: 1
    }, 
    viewForMap: {
      //flex: 1,
      //height: '40%',
      height: height * 0.4,
      marginBottom: height * 0.1
      //position: 'relative'
    }
  });

export default CatchDetail