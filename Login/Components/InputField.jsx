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
      {field.pretext !== undefined && (
        <Text style={styles.pretext}>{field.pretext}</Text>
      )}
      <TextInput
        placeholder={field.label}
        placeholderTextColor="black"
        style={[styles.textInput, field.style]}
        onChangeText={(val) => field.setValue(val)}
        secureTextEntry={field.secureTextEntry}
        keyboardType={field.keyboardType}
        editable={field.editable}
        maxLength={field.maxLength}
        onFocus={
          "setScreenState" in field
            ? () => {
                field.setScreenState(2);
              }
            : undefined
        }
        onSubmitEditing={
          "setScreenState" in field
            ? () => {
                field.setScreenState[1](0);
              }
            : undefined
        }
      />
      <Text style={styles.fieldError}>
        {!!field.error && field.error[field.name]}
      </Text>
    </View>
  );
};
