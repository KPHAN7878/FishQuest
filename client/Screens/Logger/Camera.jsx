import { Camera, CameraType } from "expo-camera";
import React, { useEffect, useState, useRef, useContext } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import useAxios from "axios-hooks";
import FormData from "form-data";
import { manipulateAsync } from "expo-image-manipulator";
import { API_URL, S3_BUCKET } from "@env";
import { S3 } from "../../utils/connection";
import { UserContext } from "../../Contexts/UserContext";
import { Buffer } from "buffer";
import { height } from "../../styles";

import * as Location from "expo-location";

export const CameraView = ({ navigation }) => {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const { user } = useContext(UserContext);
  const ref = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = S3.getBucketLocation().service.endpoint.host;
  const [image, setImage] = useState(null);
  const [currentLocation, setLocation] = useState([1, 2]);
  const [errorMsg, setErrorMsg] = useState(null);

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
      let finalString =
        location_.coords.latitude + "," + location_.coords.longitude;
      setLocation(finalString);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (currentLocation) {
    text = JSON.stringify(currentLocation);
  }

  const [{ data: result, loading: _, error: catchError }, submitCatch] =
    useAxios(
      {
        url: `http://${API_URL}/catch`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
      { manual: true }
    );

  useEffect(() => {
    isLoading ? ref.current?.pausePreview() : ref.current?.resumePreview();
    if (catchError) {
      setIsLoading(false);
    }

    if (result && !isLoading) {
      result["ImageCache"] = image;
      navigation.navigate("Result", result);
    }
  }, [result, isLoading, catchError]);

  const toggleCameraType = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const uploadToS3 = async (base64Image, Key) => {
    const Bucket = `${S3_BUCKET}/catches`;
    const params = {
      Body: Buffer.from(
        base64Image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      ),
      ContentType: "jpg",
      Bucket,
      Key,
    };

    await S3.upload(params).promise();
  };

  const takeSubmission = async () => {
    setIsLoading(true);
    const cache = await ref.current.takePictureAsync({
      base64: true,
      quality: 0.1,
    });
    if (cache === undefined) {
      return;
    }

    const resizedImg = await manipulateAsync(
      cache.uri,
      [{ resize: { width: 640, height: 640 } }], // make sure this matches input tensor dims
      { base64: true }
    ).then((val) => `data:image/jpg;base64,${val.base64}`);

    const key = `${Date.now()}.${user.username}.jpg`;
    const imageUri = `https://fishquest.${location}/${S3_BUCKET}/${key}`;

    setImage(resizedImg);

    const form = new FormData();
    form.append("imageUri", imageUri);
    form.append("imageBase64", resizedImg);
    form.append("location", currentLocation);

    submitCatch({ data: form }).then(() => {
      setIsLoading(false);
      uploadToS3(cache.base64, key);
    });
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={ref}>
        {isLoading && (
          <View style={styles.loadingWheel}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </Camera>
      {!isLoading && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={navigation.goBack}>
            <Text style={styles.text}>Go Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takeSubmission}>
            <Text style={styles.text}>Take Pic</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  camera: {
    flex: 1,
  },
  loadingWheel: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  buttonContainer: {
    backgroundColor: "black",
    flex: 1,
    flexDirection: "row",

    alignItems: "center",

    postition: "absolute",
    bottom: 0,
    maxHeight: height * 0.15,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
  },
});
