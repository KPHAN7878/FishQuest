import React, { useEffect, useState, useRef, useContext } from "react";
import { Text, View, StyleSheet } from 'react-native'
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

const Map = () => {
  const [currentLocation, setLocation] = useState([1, 2]);
  const [errorMsg, setErrorMsg] = useState(null)

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
      />
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