import React, { useState } from "react";
import { Text, View, TextInput } from "react-native";
import styles from "../styles";

export const InputField = React.forwardRef((props, ref) => {
  const [field, setField] = useState(props);
  const defaultProps = {
    placeholderTextColor: "black",
    style: [styles.textInput, { marginVertical: 3 }],
    blurOnSubmit: false,
  };

  React.useEffect(() => {
    if (props !== field) {
      setField(props);
    }
  }, [props]);

  return (
    <View style={field.styleView}>
      {field.pretext !== undefined && (
        <Text style={styles.pretext}>{field.pretext}</Text>
      )}
      <TextInput {...defaultProps} {...field} ref={ref} />
      {field.footer !== undefined && (
        <Text style={styles.footer}>{field.footer}</Text>
      )}
      <Text style={styles.fieldError}>
        {!!field.error && field.error[field.name]}
      </Text>
    </View>
  );
});
