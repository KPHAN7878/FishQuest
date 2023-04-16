import { height, width } from "../styles";
import React from "react";
import { View, Image, TouchableHighlight } from "react-native";

const ImageView = (props) => {
  const viewWidth = Math.ceil(width * 0.8);
  const viewHeight = Math.ceil(height * 0.5);
  const { image } = props.result;
  const [selected, setSelected] = React.useState(false);

  return (
    <TouchableHighlight
      underlayColor={"black"}
      activeOpacity={0.6}
      style={{
        marginTop: selected ? 0 : 15,
        borderRadius: 5,
        flex: 1,
        alignItems: "center",
        borderRadius: 30,
        overflow: "hidden",
      }}
      onPress={() => {
        setSelected(!selected);
      }}
    >
      <View
        style={{
          maxWidth: selected ? width : viewWidth,
          maxHeight: selected ? height : viewHeight,
          borderRadius: 30,
          borderWidth: selected ? 0 : 3,
          borderColor: "lightgray",
          justifyContent: selected ? undefined : "center",
          alignItems: selected ? undefined : "center",
          overflow: "hidden",
        }}
      >
        <Image
          source={{
            uri: image.uri,
            width: selected ? width : viewWidth,
          }}
          style={{
            borderRadius: 30,
            borderWidth: 3,
            borderWidth: selected ? 3 : 1,
            borderColor: "lightgray",
            aspectRatio: image.width / image.height,
          }}
        />
      </View>
    </TouchableHighlight>
  );
};

export default ImageView;
