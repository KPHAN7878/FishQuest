import React, { useEffect, useState, useRef, useContext } from "react";
import { StyleSheet, ScrollView, Dimensions, View, Text, Button, TouchableOpacity, ActivityIndicator, SafeAreaView } from "react-native";
import Catch from "./Catch";
import { Client } from "../../utils/connection";
var { height } = Dimensions.get('window')
var { width } = Dimensions.get('window')


const Catches = ({navigation}) => {

  const [catches2, setCatches] = useState([]);
  
  //SAMPLE DATA
  //QUERY CATCH TABLE LATER
  const catches = [
    {
      id: 1,
      name: "John Doe",
      userId: 1,
      profilePic:
        "https://media.istockphoto.com/id/1369523627/photo/red-tailed-catfish-in-aquarium-freshwater-fish.jpg?s=612x612&w=0&k=20&c=FjQVpu8LlIiFmR4LbupAUOrGVvqpRFbxJgz2PKy3wMw=",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
      img: "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600",
    },
    {
      id: 2,
      name: "Will Smith",
      userId: 2,
      profilePic:
        "https://assets.bonappetit.com/photos/61ba108ad0d0db624848035a/1:1/w_3679,h_3679,c_limit/20211022-0222-Fam-Meal-+-AOTT-+-Opener16633.jpg",
      desc: "Tenetur iste voluptates dolorem rem commodi voluptate pariatur, voluptatum, laboriosam consequatur enim nostrum cumque! Maiores a nam non adipisci minima modi tempore.",
    },
    {
      id: 2,
      name: "Will Smith",
      userId: 2,
      profilePic:
        "https://www.onthewater.com/wp-content/uploads/2016/04/LongIsland-Carp.jpg",
      desc: "Tenetur iste voluptates dolorem rem commodi voluptate pariatur, voluptatum, laboriosam consequatur enim nostrum cumque! Maiores a nam non adipisci minima modi tempore.",
    },
    {
      id: 2,
      name: "Will Smith",
      userId: 2,
      profilePic:
        "https://people.com/thmb/7MNWuD9P0sO6Sqkd3_rMtSXoCX0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(749x0:751x2)/carrot-largest-goldfish-112222-1-27575ac7bf774b98a7eee11e7ad43c05.jpg",
      desc: "Tenetur iste voluptates dolorem rem commodi voluptate pariatur, voluptatum, laboriosam consequatur enim nostrum cumque! Maiores a nam non adipisci minima modi tempore.",
    },
    {
      id: 2,
      name: "Will Smith",
      userId: 2,
      profilePic:
        "data:image/jpeg;base64,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",
      desc: "Tenetur iste voluptates dolorem rem commodi voluptate pariatur, voluptatum, laboriosam consequatur enim nostrum cumque! Maiores a nam non adipisci minima modi tempore.",
    },
    {
      id: 2,
      name: "Will Smith",
      userId: 2,
      profilePic:
        "https://media.istockphoto.com/id/1198489926/photo/largemouth-bass.jpg?s=612x612&w=0&k=20&c=9XFEtj-491bqsiPjsEJJFxtQe_eNIxV_2eIL6XN4wmc=",
      desc: "Tenetur iste voluptates dolorem rem commodi voluptate pariatur, voluptatum, laboriosam consequatur enim nostrum cumque! Maiores a nam non adipisci minima modi tempore.",
    },
  ];
  ///////////////////////////////////////////////////////

  const getCatches = async () => {
    await Client.get("catch")
    .then((res) => {
      setCatches(res.data.catches);
    })
    .catch((error) => {
      console.log(error);
    })
  }

  useEffect(() => {
    getCatches();
    console.log("route: " + JSON.stringify(catches2))
  }, []);

  return (
    
    <View style={styles.testContainer}>
      <View style={styles.headerBox}>
        <Button title='Back' color='#841584' onPress={() => {navigation.goBack()}}/>
      </View>
      
      <ScrollView style={{marginBottom: 1, flex: 1, height: '100%'}}>
        {catches2 ? 
        <View style={styles.listContainer}>
        {catches2.map((item) => {
          return(
            <TouchableOpacity
            style={{width: '25%'}}
            onPress={() => {navigation.navigate("CatchDetail", item)}}
            >
            <Catch {...item} />
            </TouchableOpacity>
          )
        })}
        <View></View>
      </View>
      : <ActivityIndicator size="large" style={{flex:1, justifyContent: 'center'}}/> }
        {/* <Text>Product Container</Text> */}
        {/* <View style={styles.listContainer}>
          {catches.map((item) => {
            return(
              <TouchableOpacity
              style={{width: '25%'}}
              onPress={() => {navigation.navigate("CatchDetail", item)}}
              >
              <Catch {...item} />
              </TouchableOpacity>
            )
          })}
        </View> */}
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    backgroundColor: "gainsboro",
    flex: 1
  },
  testContainer: {
    flex: 1,
    backgroundColor: 'gainsboro',
    height: '100%',
    //padding: 5
  },
  listContainer: {
    //height: height,
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
    //padding: 55,
    paddingTop: 0.06*height,
    paddingBottom: 0.01*height,
    borderWidth: 0.3,
    borderColor: "#787777",
    backgroundColor: "#2596be",
    flexDirection: 'row'
  },
});

export default Catches;
