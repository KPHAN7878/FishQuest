import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Modal,
  Pressable,
} from "react-native";
import * as Progress from "react-native-progress";
import { FontFamily } from "../../GlobalStyles";

const MISSIONS_DATA = [
  {
    id: 1,
    title: "New Fishing Spot",
    description: "Catch a fish in a new location to earn +25xp",
    progressPercentage: 0.0,
  },
  {
    id: 2,
    title: "New Species Caught",
    description: "Catch a new species to earn +50xp",
    progressPercentage: 1,
  },
  {
    id: 3,
    title: "Every 5 Fish",
    description: "Catch 5 fish to earn +100xp",
    progressPercentage: 0.2,
  },
];

const Missions = () => {
  const [modalVisible, setModalVisible] = useState(true);

  const renderItem = ({ item }) => (
    <View>
      <View style={styles.missionBox}>
        <View style={styles.missionItem}>
          <Text style={styles.missionTitle}>{item.title}</Text>
          <Text style={styles.missionDescription}>{item.description}</Text>
          <Progress.Bar
            progress={item.progressPercentage}
            width={200}
            height={10}
          />
          <Text>{item.progressPercentage * 100}%</Text>
        </View>
      </View>

      {/* The popup for mission completion: */}
      <View style={{}}>
        {(() => {
          if (item.progressPercentage == 1) {
            return (
              <View style={{ margin: 0 }}>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>
                        Congrats! You completed this mission!
                      </Text>
                      <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}
                      >
                        <Text style={styles.textStyle}>Continue</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
              </View>
            );
          }
        })()}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.missions}>Level 1</Text>
      <Text style={styles.xp}>0/100 xp</Text>
      <FlatList
        data={MISSIONS_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.missionsList}
        e
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 80,
    backgroundColor: "#4a4a4a",
    alignItems: "center",
    justifyContent: "center",
  },
  missions: {
    alignSelf: "center",
    fontSize: 40,
    marginTop: 40,
    fontFamily: FontFamily.interRegular,
  },
  xp: {
    alignSelf: "center",
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  missionsList: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 50,
  },
  missionBox: {
    backgroundColor: "#c2e4f2",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  missionItem: {
    width: "100%",
    alignItems: "center",
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  missionDescription: {
    fontSize: 14,
    marginBottom: 15,
  },
  footer: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#4a4a4a",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  footerButton: {
    color: "#fff",
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 30,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default Missions;
