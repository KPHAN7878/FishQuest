import React from "react";
import { Client } from "../../utils/connection";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
} from "react-native";
import styles, { height, width } from "../../styles";
import { AnimatedButton } from "../../Components/Button";

import ImageView from "../../Components/ImageView";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const Logger = ({ navigation }) => {
  const [catches, setCatches] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const [cursor, setCursor] = React.useState(
    new Date().toISOString().slice(0, 19)
  );
  const [more, setMore] = React.useState(true);
  const [comps, setComps] = React.useState([]);

  const getCatches = (refresh) => {
    if (!more && !refresh) return;
    const useCursor = refresh ? new Date().toISOString().slice(0, 19) : cursor;

    setIsFetching(true);
    Client.get("catch/my-catches", {
      params: {
        limit: 16,
        cursor: useCursor,
      },
    })
      .then((res) => {
        const newCatches = (
          refresh
            ? [...res.data.catches, ...catches]
            : [...catches, ...res.data.catches]
        ).filter(
          ({ catch: value }, index, self) =>
            index === self.findIndex(({ catch: c }) => c.id === value.id)
        );

        setCatches(newCatches);
        const last = res.data.catches[res.data.catches.length - 1];
        setMore(res.data.hasMore);
        setCursor(last.catch.date);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onRefresh = () => {
    setIsFetching(true);
    getCatches(true);
  };

  React.useEffect(() => {
    onRefresh();
  }, []);

  React.useEffect(() => {
    handleComps(catches);
  }, [catches]);

  const handleComps = (catches) => {
    Promise.all(
      catches.map(async ({ catch: c }, idx) => {
        let tempString = c.imageUri;
        let finalString = tempString.replace(
          "fishquest/development",
          "development/catches"
        );
        const valid = await fetch(finalString)
          .then((res) => {
            return res.status !== 403;
          })
          .catch((error) => {
            console.error(error);
          });
        return (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#c2e4f2",
              padding: 10,
              borderRadius: 30,
              margin: 10,
            }}
            key={idx}
          >
            <ImageView
              scaleView={0.4}
              animated={false}
              setter={() => {
                navigation.navigate("CatchDetail", catches[idx]);
              }}
              image={valid ? { uri: finalString } : undefined}
            />
            <Text>{new Date(c.date).toLocaleDateString()}</Text>
            <Text>{c.species}</Text>
          </View>
        );
      })
    )
      .then((newComps) => {
        setIsFetching(false);
        setComps(newComps);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ToCamera = (
    <View style={myStyles.container}>
      <AnimatedButton
        next={() => {
          navigation.navigate("CameraView");
        }}
        style={{ borderBottomWidth: 1, borderColor: "lightgray" }}
      >
        <View
          style={[
            styles.buttonContainer,
            {
              backgroundColor: "white",
              padding: 10,
              paddingBottom: 15,
              maxHeight: height * 0.1,
              flexDirection: "row",
            },
          ]}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <FontAwesomeIcon icon={faCamera} size={25} />
            <Text
              style={{
                fontSize: 20,
                flex: 1,
              }}
            >
              {"Submit a Catch"}
            </Text>
          </View>
        </View>
      </AnimatedButton>
    </View>
  );
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = height;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <View style={myStyles.parentContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
        }
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent) && !isFetching) {
            getCatches(false);
          }
        }}
        scrollEventThrottle={400}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {comps}
        </View>
        <View style={{ height: height * 0.1 }} />
      </ScrollView>
      {ToCamera}
    </View>
  );
};

const myStyles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: "center",
  },

  container: {
    shadowColor: "gray",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    flex: 1,
    position: "absolute",
    width,
    height: height * 0.1,
    bottom: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  parentContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
});

export default Logger;
