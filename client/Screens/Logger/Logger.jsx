import React from "react";
import { Client } from "../../utils/connection";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import styles, { height, width } from "../../styles";
import { AnimatedButton } from "../../Components/Button";
import isCloseToBottom from "../../utils/isCloseToBottom";

import ImageView from "../../Components/ImageView";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const RenderOnce = React.memo(({ catch: c, navigation }) => {
  let tempString = c.imageUri;

  const [valid, setValid] = React.useState(false);
  React.useEffect(() => {
    fetch(c.imageUri)
      .then((res) => {
        if (res.status === 403) {
          setValid(false);
        } else {
          setValid(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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
    >
      <ImageView
        scaleView={0.4}
        animated={false}
        setter={() => {
          navigation.navigate("CatchDetail", { catch: c });
        }}
        image={valid ? { uri: c.imageUri } : undefined}
      />
      <Text>{new Date(c.date).toLocaleDateString()}</Text>
      <Text>{c.species}</Text>
    </View>
  );
});

const Logger = ({ navigation }) => {
  const [catches, setCatches] = React.useState([]);
  const [catchIds, setCatchIds] = React.useState([]);

  const [isFetching, setIsFetching] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

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
        limit: 8,
        cursor: useCursor,
      },
    })
      .then((res) => {
        const newCatches = [...res.data.catches].filter(
          (c) => !catchIds.includes(c.catch.id)
        );
        setCatches(newCatches);
        setCatchIds([...catchIds, ...newCatches.map((c) => c.catch.id)]);

        const last = res.data.catches[res.data.catches.length - 1];
        setMore(res.data.hasMore);
        if (last) setCursor(last.catch.date);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onRefresh = () => {
    setIsFetching(true);
    setRefreshing(true);
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
      catches.map(async ({ catch: c }) => {
        return <RenderOnce catch={c} key={c.id} navigation={navigation} />;
      })
    )
      .then((newComps) => {
        setIsFetching(false);
        setComps(
          (refreshing ? newComps : comps).concat(refreshing ? comps : newComps)
        );

        setRefreshing(false);
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

  return (
    <View style={myStyles.parentContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
        }
        onScroll={({ nativeEvent }) => {
          if (
            isCloseToBottom(nativeEvent) &&
            !isFetching &&
            !refreshing &&
            more
          ) {
            setIsFetching(true);
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
