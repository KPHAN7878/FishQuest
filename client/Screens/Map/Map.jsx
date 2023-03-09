import React, { useEffect, useState, useRef, useContext } from "react";
import { Text, View, StyleSheet, ScrollView, Button, Image } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Client } from "../../utils/connection";

const Map = () => {
  const [currentLocation, setLocation] = useState([1, 2]);
  const [errorMsg, setErrorMsg] = useState(null)
  const [catches, setCatches] = useState([]);

  //location services
  React.useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location_ = await Location.getCurrentPositionAsync({enableHighAccuracy: false});
      console.log("maps coordinates: " + location_)
      setLocation(location_)
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (currentLocation) {
    text = JSON.stringify(currentLocation);
  }

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
  }, []);


  return (
    <View style={styles.container}>
      <MapView style={styles.map} 
        // initialRegion={{
        //   latitude: currentLocation.coords.latitude,
        //   longitude: currentLocation.coords.latitude,
        //   //latitudeDelta: 0.0922,
        //   //longitudeDelta: 0.0421,
        // }}
        showsUserLocation={true}
      >
        {catches.map((item) => {
          return(<Marker
            key={item.id}
            coordinate={{
              latitude: item.location[0],
              longitude: item.location[1]
            }}
            >
              <Image 
                source={require("../../assets/image3.png")}
                style={{height: 25, width: 23}}
              />
            </Marker>
            )
        })}
        <Button title="My Location" style={{position: 'absolute', top: '50%', alignSelf: 'flex-end'}}/>
      </MapView>

    </View> 
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default Map;