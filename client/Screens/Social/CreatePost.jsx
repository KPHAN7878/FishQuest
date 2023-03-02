import React from 'react'
import { Pressable, Text, View, TextInput, Image, ScrollView, StyleSheet, StatusBar, SafeAreaView } from 'react-native'
import styles from "../../styles";
import {Dimensions} from 'react-native';
import { FontFamily, Color } from "../../GlobalStyles";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CreatePost = ({route, navigation }) => {
    const [text, onChangeText] = React.useState();

    const result = route.params;
    const imageUrl = result.ImageCache

  return (
    <>
    <ScrollView style={styles2.scrollView}>
        <View style={{marginLeft: 25, marginRight: 25}}>
        <TextInput
                onChange={onChangeText}
                value={text}
                multiline={true}
                placeholder="Type here"
                style={{fontSize: 17}}
            />
        </View>

        <View style={{marginTop: 5, marginLeft: 20}}>
        <Image source={{uri: imageUrl}} resizeMode= 'contain' style={{width: 250, height: 450, aspectRatio: 0.85}}/>
        </View>
    </ScrollView>

    <View style={{marginBottom: 25}}>
    <Pressable style={styles.formButton} onPress={() => {
        navigation.navigate("CatchLogger")
    }}>
        <Text style={styles.buttonText}>{"Submit Post"}</Text>
    </Pressable>
    </View>
    </>

  )
}

const styles2 = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
    },
    scrollView: {
      backgroundColor: '##85c8f2',
      marginTop: 0.08 * windowHeight
    },
    text: {
      fontSize: 42,
    },
  });

export default CreatePost