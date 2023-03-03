import React from 'react'
import { View, Text, StyleSheet, Dimensions, Button } from 'react-native'
var { height } = Dimensions.get('window')
var { width } = Dimensions.get('window')

const CatchDetail = ({route, navigation}) => {
    const result = route.params;

  return (
    <View style={styles.testContainer}>
      <View style={styles.headerBox}>
      <Button title='Back' color='#841584' onPress={() => {navigation.goBack()}}/>
        </View>
        <Text>CatchDetail</Text>
        <Text>{JSON.stringify(result)}</Text>
        </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flexWrap: "wrap",
      backgroundColor: "gainsboro",
    },
    testContainer: {
      flex: 1,
      backgroundColor: 'gainsboro'
    },
    listContainer: {
      height: height,
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-start",
      flexWrap: "wrap",
      backgroundColor: "gainsboro",
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerBox: {
      marginTop: 0,
      paddingTop: 0.06*height,
      paddingBottom: 0.01*height,
      borderWidth: 0.3,
      borderColor: "#787777",
      backgroundColor: "#2596be",
      flexDirection: 'row'
    },
  });

export default CatchDetail