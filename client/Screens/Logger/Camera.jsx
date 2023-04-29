import { width, height } from "../../styles";
import { Camera, CameraType } from "expo-camera";
import React, { useEffect, useState, useRef, useContext } from "react";
import {
  Image,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faArrowsRotate,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import useAxios from "axios-hooks";
import FormData from "form-data";
import { manipulateAsync } from "expo-image-manipulator";
import { API_URL, S3_BUCKET, DEV } from "@env";
import { S3 } from "../../utils/connection";
import { UserContext } from "../../Contexts/UserContext";
import { Buffer } from "buffer";
import * as ImagePicker from "expo-image-picker";

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
  const [complete, setComplete] = useState(false);

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
    if (catchError) setIsLoading(false);
    if (result && !isLoading) setComplete(true);
    isLoading || complete
      ? ref.current?.pausePreview()
      : ref.current?.resumePreview();
  }, [result, isLoading, catchError]);

  const toggleCameraType = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const accept = () => {
    result["image"] = image;
    navigation.navigate("Result", result);
    setTimeout(reject, 1000);
  };

  const reject = () => {
    setComplete(false);
    ref.current?.resumePreview();
  };

  const fishView = (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
      }}
    >
      <Text style={styles.headerText}>
        {result?.species
          ? `Is this a ${result.species}?`
          : "No fish detected. Continue without xp?"}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={accept}>
          <Text style={styles.text}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={reject}>
          <Text style={styles.text}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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

    let cache = null;
    if (DEV === "true") {
      cache = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 0.5,
      });
      cache = await manipulateAsync(
        cache.uri,
        [{ resize: { width, height } }],
        { base64: true }
      );
    } else {
      cache = await ref.current.takePictureAsync({
        base64: true,
        quality: 0.5,
      });
    }

    if (cache === undefined || !cache.uri) {
      setIsLoading(false);
      return;
    }

    const resizedImg = await manipulateAsync(
      cache.uri,
      [{ resize: { width: 640, height: 640 } }],
      { base64: true }
    ).then((val) => `data:image/jpg;base64,${val.base64}`);

    const key = `${Date.now()}.${user.username}.jpg`;
    const imageUri = `https://fishquest.${location}/${S3_BUCKET}/${key}`;

    setImage(cache);

    const form = new FormData();
    form.append("imageUri", imageUri);
    form.append("imageBase64", resizedImg);
    form.append("location", currentLocation);

    submitCatch({ data: form }).then(() => {
      setComplete(true);
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

  const renderBoundingBox = (cx, cy, w, h) => {
    const xScale = width / 640;
    const yScale = height / 640;

    const top = Math.ceil((cy - h * 0.5) * yScale);
    const left = Math.ceil((cx - w * 0.5) * xScale);
    w = Math.ceil(w * xScale);
    h = Math.ceil(h * yScale);

    return (
      <>
        <Image
          source={{ uri: image.uri }}
          style={{
            width,
            position: "absolute",
            height,
          }}
        />
        <View
          style={{
            position: "absolute",
            top,
            left,
            width: w,
            height: h,
            borderColor: "#FFD700",
            borderWidth: 3,
          }}
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={ref}>
        {isLoading && (
          <View style={styles.loadingWheel}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </Camera>
      {complete &&
        result.box &&
        renderBoundingBox(...result.box.map((val) => Math.floor(val)))}
      {complete && fishView}
      {!isLoading && !complete && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={navigation.goBack}>
            <FontAwesomeIcon icon={faArrowLeft} color={"white"} size={40} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takeSubmission}>
            <View style={styles.ring}>
              <FontAwesomeIcon icon={faCircle} color={"white"} size={60} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <FontAwesomeIcon icon={faArrowsRotate} color={"white"} size={40} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ring: {
    padding: 2,
    borderWidth: 3,
    borderRadius: 100,
    borderColor: "white",
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  camera: {
    flex: 1,
    position: "absolute",
    width,
    height,
  },
  loadingWheel: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  buttonContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    postition: "absolute",
    bottom: 0,
    maxHeight: height * 0.15,
    paddingBottom: 20,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  headerText: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    paddingTop: 10,
    paddingBottom: 10,

    borderWidth: 3,
    borderColor: "white",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  text: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
  },
  imageContainer: {
    width: 300,
    height: 250,
    alignSelf: "center",
  },
  rectangle: {
    borderWidth: 3,
    borderColor: "red",
    position: "absolute",
  },
});
