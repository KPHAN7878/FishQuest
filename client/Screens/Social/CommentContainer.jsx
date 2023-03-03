import React from 'react'
import { View, Text, Pressable, StyleSheet, Button, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import styles from "../../styles";
import { useNavigation } from '@react-navigation/native';
import { FontFamily, Color } from "../../GlobalStyles";
import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CommentContainer = ({navigation}) => {
    //const navigation = useNavigation();
    const [text, onChangeText] = React.useState();

  return (

    <View>
        
        <View style={styles2.headerBox}>
        {/* <Text style={styles_.fishQuest}>Fish Quest</Text> */}
        <Button 
            title="Back"
            onPress={() => {navigation.goBack()}}
        />
        </View>
        <ScrollView style={{height: windowHeight* 0.75}}>
        <Text>CommentContainer</Text>
        </ScrollView>
        <View style={{marginLeft: 25, marginRight: 25, backgroundColor: '#964d4d'}}>
        <TextInput
                onChange={onChangeText}
                value={text}
                multiline={true}
                placeholder="Type here"
                style={{fontSize: 17}}
            />
        </View>
        
    </View>

    
  )
}


const styles2 = StyleSheet.create({
    headerBox: {
      marginTop: 0,
      padding: 50,
      borderWidth: 0.3,
      borderColor: "#787777",
      backgroundColor: "#2596be",
    },
    fishQuest: {
      top: 40,
      left: 121,
      fontSize: 44,
      fontFamily: FontFamily.alluraRegular,
      width: 195,
      height: 63,
      textShadowColor: "rgba(0, 0, 0, 0.25)",
      textShadowOffset: {
        width: 0,
        height: 4,
      },
      textShadowRadius: 4,
      textAlign: "left",
      color: Color.black,
      position: "absolute",
    },
  });

export default CommentContainer