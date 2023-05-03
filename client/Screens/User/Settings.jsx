import { useContext, useState, useEffect } from "react";
import { Text, View, Pressable, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { UserContext } from "../../Contexts/UserContext";
import { width, height } from "../../styles";
import { Client } from "../../utils/connection";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { StackActions, NavigationActions, CommonActions  } from "@react-navigation/native";

export const Settings = ({ navigation, route }) => {
  const logOut = async () => {
    const res = await Client.post("user/logout");
    navigation.navigate("Login");           //ORIGINAL

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      }))

  };

  const { user, setUser } = useContext(UserContext);

 

return (
  
  <View style={{flex: 1,  backgroundColor: "#dff0f7"}}>
    <View style={styles.backView}>
        <TouchableOpacity style={styles.back} activeOpacity={0.2} onPress={() => {navigation.goBack();}}>
          <Ionicons name="chevron-back-sharp" size={24} color="black" />
        </TouchableOpacity>
    </View>

    <View style={styles.pageLayout}>
      <TouchableOpacity style={styles.likeButtonContainer} onPress={() => {
                          navigation.navigate("Likes");
                        }}>
                <Text style={styles.likeButtonText}>Likes</Text>
                  <Ionicons name="caret-forward-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.commentButtonContainer} onPress={() => {
                          navigation.navigate("");
                        }}>
                <Text style={styles.likeButtonText}>Comments</Text>
                  <Ionicons name="caret-forward-outline" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.logoutBtn}>
        <TouchableOpacity style={styles.appButtonContainer} onPress={() => {
                          navigation.navigate("Settings");
                        }}>
                <Text style={styles.appButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>


    </View>
    
  
  </View>
);
};


const styles = StyleSheet.create({
  pageLayout: {
    top: 100
  },
  likeButtonContainer: {
    elevation: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderLeftColor: "#dff0f7",
    borderRightColor: "#dff0f7",
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    // justifyContent: "center",
    alignItems: "center",
    marginBottom: 0
  },
  commentButtonContainer: {
    elevation: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderLeftColor: "#dff0f7",
    borderRightColor: "#dff0f7",
    borderTopColor: '#dff0f7',
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0
  },
  likeButtonText: {
    fontSize: 18,
    color: "#000000",
    fontWeight: "bold",
    alignSelf: "center",
    // left: 150
  },
  btnRight: {
    //  left: 150
    
  },
  buttonText: {
    top: 30,
    textAlign: "center"
  },
  backView: {
    top: 50,
    left: 10,
  },
  logoutBtn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    top: 350

  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#de2618",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: "25%"
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
  }

});






export default Settings;




