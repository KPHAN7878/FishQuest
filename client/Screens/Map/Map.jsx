import React, { useEffect, useState, useRef, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Button,
  Image,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Client } from "../../utils/connection";
import CatchDetail from "../Logger/CatchDetail";

const Map = ({ route, navigation }) => {
  const [currentLocation, setLocation] = useState();
  const [errorMsg, setErrorMsg] = useState(null);
  const [catches, setCatches] = useState([]);

  //location services
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location_ = await Location.getCurrentPositionAsync({
        enableHighAccuracy: false,
      });
      console.log("maps coordinates: " + location_);
      setLocation([location_.coords.latitude, location_.coords.longitude]);
    })();
  }, []);

  let text = "Waiting..";
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
      });
  };

  useEffect(() => {
    getCatches();
    console.log("route: " + JSON.stringify(route.params));
  }, []);

  return (
    <View style={styles.container}>
      {currentLocation ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentLocation[0],
            longitude: currentLocation[1],
            // latitudeDelta: 0.0922,
            // longitudeDelta: 0.0421,
            latitudeDelta: 0.1922,
            longitudeDelta: 0.1421,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          loadingEnabled={true}
          // loadingBackgroundColor={"#42f557"}
        >
          {catches.map((item) => {
            return (
              <Marker
                key={item.id}
                coordinate={{
                  latitude: item.location[0],
                  longitude: item.location[1],
                }}
                onPress={() => {
                  navigation.navigate("CatchDetail", item);
                }}
              >
                <Image
                  source={require("../../assets/image3.png")}
                  style={{ height: 25, width: 23 }}
                />
              </Marker>
            );
          })}
          <Button
            title="My Location"
            style={{ position: "absolute", top: "50%", alignSelf: "flex-end" }}
          />
        </MapView>
      ) : (
        <ActivityIndicator
          size="large"
          style={{ flex: 1, justifyContent: "center" }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default Map;
