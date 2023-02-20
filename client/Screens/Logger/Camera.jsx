import { Camera, CameraType } from "expo-camera";
import React, { useEffect, useState, useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useAxios from "axios-hooks";
import FormData from "form-data";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { API_URL } from "@env";

export const CameraView = () => {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const ref = useRef(null);

  const [
    { data: __catchData, loading: catchLoading, error: catchError },
    submitCatch,
  ] = useAxios(
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
    catchLoading ? ref.current?.pausePreview() : ref.current?.resumePreview();
    if (catchError) console.log(catchError);
  }, [catchLoading, catchError]);

  const toggleCameraType = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const takeSubmission = async () => {
    const cache = await ref.current.takePictureAsync({
      base64: true,
      quality: 0.5,
    });
    if (cache === undefined) {
      return;
    }

    const resizedImg = await manipulateAsync(
      cache.uri,
      [{ resize: { width: 224, height: 224 } }], // make sure this matches input tensor dims
      { base64: true }
    ).then((val) => `data:image/jpg;base64,${val.base64}`);

    const form = new FormData();
    form.append("time", "test");
    form.append("date", "test");
    form.append("imageBase64", resizedImg);
    form.append("location", "test");
    submitCatch({ data: form });
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takeSubmission}>
            <Text style={styles.text}>Take Pic</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
