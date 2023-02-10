import React, { useState } from "react";
import { Text, View, TextInput } from "react-native";
import styles from "../styles";

export const InputField = (props) => {
  const [field, setField] = useState(props);

  React.useEffect(() => {
    if (props !== field) {
      setField(props);
    }
  }, [props]);

  return (
    <View>
      <TextInput
        placeholder={field.label}
        placeholderTextColor="black"
        style={styles.textInput}
        onChangeText={(text) => field.setValue(text)}
        secureTextEntry={field.secureTextEntry}
        keyboardType={field.keyboardType}
        onFocus={() => {
          field.setScreenState(2);
        }}
        onSubmitEditing={() => {
          field.setScreenState(0);
        }}
      />
      <Text style={styles.fieldError}>
        {!!field.error && field.error[field.name]}
      </Text>
    </View>
  );
};
