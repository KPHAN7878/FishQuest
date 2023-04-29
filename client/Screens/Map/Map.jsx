import React, { useEffect, useState, useRef, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Client } from "../../utils/connection";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faLocationDot,
  faQuestion,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import speciesToColor, { speciesList } from "../../utils/speciesToColor";

import Animated, {
  useAnimatedStyle,
  interpolate,
  withTiming,
} from "react-native-reanimated";

const displaceHeight = 300;

const Map = ({ route, navigation }) => {
  const [currentLocation, setLocation] = useState();
  const [_, setErrorMsg] = useState(null);
  const [catches, setCatches] = useState([]);

  const [screenState, setScreenState] = React.useState(0);
  const animateDetails = useAnimatedStyle(() => {
    const interpolation = interpolate(
      screenState,
      [0, 1],
      [-50, -displaceHeight]
    );

    return {
      transform: [{ translateY: withTiming(interpolation, { duration: 250 }) }],
    };
  });

  const opaInfo = useAnimatedStyle(() => {
    const interpolation = interpolate(screenState, [0, 1], [0.0, 1.0]);
    return {
      opacity: withTiming(interpolation, { duration: 250 }),
    };
  });

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
      setLocation([location_.coords.latitude, location_.coords.longitude]);
    })();
  }, []);

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
  }, []);

  const infoView = (
    <Animated.View
      style={[
        {
          flexDirection: "column",
          display: "flex",
          width: "100%",
          shadowColor: "gray",
          shadowOpacity: 0.8,
          shadowRadius: 10,
        },
        animateDetails,
      ]}
    >
      <View style={[{}, styles.info]}>
        <View
          style={{
            borderWidth: 2,
            padding: 5,
            borderColor: "blue",
            borderRadius: 100,
            backgroundColor: "white",
            top: -15,
          }}
        >
          <TouchableOpacity
            onPress={() => setScreenState(screenState === 0 ? 1 : 0)}
          >
            <FontAwesomeIcon
              icon={screenState ? faChevronDown : faQuestion}
              size={25}
              color={"blue"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <Animated.View
          style={[
            {
              paddingTop: 20,
              paddingBottom: 100,
              backgroundColor: "white",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
            },
            opaInfo,
          ]}
        >
          {Object.entries(
            catches.reduce((prev, { species }) => {
              if (!speciesList.has(species)) {
                species = "Other";
              }
              if (species in prev) {
                prev[species] += 1;
              } else {
                prev[species] = 1;
              }
              return prev;
            }, {})
          ).map(([species, amount], idx) => {
            return (
              <View
                key={idx}
                style={{
                  margin: 10,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderRadius: 25,
                  padding: 5,
                }}
              >
                <FontAwesomeIcon
                  icon={faLocationDot}
                  size={25}
                  color={speciesToColor(species)}
                />
                <Text>
                  {amount} {species}
                </Text>
              </View>
            );
          })}
        </Animated.View>
        <View style={{ height: displaceHeight, backgroundColor: "white" }} />
      </ScrollView>
    </Animated.View>
  );

  const displayMarkerInfo = () => {
    return <View style={{}}></View>;
  };

  return (
    <View style={styles.container}>
      {currentLocation ? (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: currentLocation[0],
              longitude: currentLocation[1],
              latitudeDelta: 0.1922,
              longitudeDelta: 0.1421,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
            loadingEnabled={true}
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
                    navigation.navigate("CatchDetail", { catch: item });
                  }}
                >
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    size={25}
                    color={speciesToColor(item.species)}
                  />
                </Marker>
              );
            })}
            <Button
              title="My Location"
              style={{
                position: "absolute",
                top: "50%",
                alignSelf: "flex-end",
              }}
            />
          </MapView>
          {infoView}
        </>
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
  info: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default Map;
