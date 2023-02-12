import React, { useState } from "react";
import { Text, View, TextInput } from "react-native";
import styles from "../styles";

export const InputField = React.forwardRef((props, ref) => {
  const [field, setField] = useState(props);
  const defaultProps = {
    placeholderTextColor: "black",
    style: [styles.textInput, { marginVertical: 3 }],
  };

  React.useEffect(() => {
    if (props !== field) {
      setField(props);
    }
  }, [props]);

  return (
    <View>
      {field.pretext !== undefined && (
        <Text style={styles.pretext}>{field.pretext}</Text>
      )}
      <TextInput {...defaultProps} {...field} ref={ref} />
      <Text style={styles.fieldError}>
        {!!field.error && field.error[field.name]}
      </Text>
    </View>
  );
});
