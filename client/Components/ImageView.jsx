import { height, width } from "../styles";
import React from "react";
import { View, Image, TouchableHighlight } from "react-native";

import Animated, {
  useAnimatedStyle,
  interpolate,
  withTiming,
  withDelay,
} from "react-native-reanimated";

const DELAY_AMOUNT = 250;

const ImageView = (props) => {
  const viewWidth = Math.ceil(width * 0.8 * (props.scaleView ?? 1));
  const viewHeight = Math.ceil(height * 0.5 * (props.scaleView ?? 1));
  const { image } = props;
  const [selected, setSelected] = React.useState(false);
  const [buttonWidth, setButtonWidth] = React.useState(1);
  const [buttonHeight, setButtonHeight] = React.useState(1);
  const [borderRadius, setBorderRadius] = React.useState(true);
  const [animated, _] = React.useState(props.animated ?? true);
  const addedDelay = props.delayAnimationAmount ?? 0;

  const interpolateWidth = interpolate(buttonWidth, [0, 1], [width, viewWidth]);

  const animateView = useAnimatedStyle(() => {
    const interpolateHeight = interpolate(
      buttonHeight,
      [0, 1],
      [height, viewHeight]
    );

    const timeWidth = withTiming(interpolateWidth, { duration: DELAY_AMOUNT });
    const delayWidth = withDelay(DELAY_AMOUNT, timeWidth);

    return {
      maxWidth: selected ? timeWidth : delayWidth,
      maxHeight: withTiming(interpolateHeight, { duration: DELAY_AMOUNT }),
    };
  });

  const animateImage = useAnimatedStyle(() => {
    const timeWidth = withTiming(interpolateWidth, { duration: DELAY_AMOUNT });
    return {
      width: timeWidth,
    };
  });

  return (
    <TouchableHighlight
      underlayColor={"black"}
      activeOpacity={0.6}
      style={{
        flex: 1,
        alignItems: "center",
        overflow: "hidden",
        borderRadius: borderRadius ? 30 : 0,
        backgroundColor: "black",
      }}
      onPress={() => {
        setTimeout(() => {
          if (!!props.setter) props.setter(selected);
          setSelected(!selected);
          if (animated) {
            setButtonWidth(buttonWidth ? 0 : 1);
            setButtonHeight(buttonHeight ? 0 : 1);
            setBorderRadius(!borderRadius);
          }
        }, addedDelay);
      }}
    >
      <Animated.View
        elevation={5}
        style={[
          {
            borderRadius: borderRadius ? 30 : 0,
            borderColor: "lightgray",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          },
          animateView,
        ]}
      >
        <Animated.Image
          source={
            image
              ? {
                  uri: image.uri,
                }
              : require("../assets/no_image.png")
          }
          style={[
            image?.width
              ? {
                  aspectRatio: image.width / image.height,
                }
              : {
                  width,
                  height,
                },
            animateImage,
          ]}
          resizeMode={"contain"}
        />
      </Animated.View>
    </TouchableHighlight>
  );
};

export default ImageView;
