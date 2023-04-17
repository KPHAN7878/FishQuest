import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import * as Progress from "react-native-progress";
import { FontFamily } from "../../GlobalStyles";
import { Client } from "../../utils/connection";

const Missions = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [items, setItems] = useState();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      Client.get("mission", {}).then(({ data }) => {
        console.log(data);
        setItems(data);
      });
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = (item) => (
    <View style={styles.missionBox}>
      <View style={styles.missionItem}>
        <Text style={styles.missionTitle}>{item.description}</Text>
        {Object.entries(item.progress).map(([_, details], index) => {
          return details.map((info, index) => {
            const percent = info.currentValue / info.completionValue;
            return (
              <View key={index}>
                <Text style={styles.missionDescription}>
                  {`${info.completionValue} ${info.label}`}
                </Text>
                <Progress.Bar
                  color={info.complete ? "green" : undefined}
                  progress={percent}
                  width={200}
                  height={10}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <Text
                    style={{ fontWeight: info.complete ? "bold" : undefined }}
                  >
                    {info.complete ? "completed" : `${percent * 100}% complete`}
                  </Text>
                  <Text style={{ marginLeft: 10 }}>
                    {info.bonus ? `+${info.bonus} bonus xp` : ""}
                  </Text>
                </View>
              </View>
            );
          });
        })}
      </View>
    </View>
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.missions}>Level 1</Text>
        <Text style={styles.xp}>0/100 xp</Text>
        {items ? (
          items.map((item, index) => {
            return (
              <View style={styles.missionsList} key={index}>
                {renderItem(item)}
              </View>
            );
          })
        ) : (
          <></>
        )}
      </View>
    </ScrollView>
  );
};

// <View style={{}}>
//   {(() => {
//     if (item.progressPercentage == 1) {
//       return (
//         <View style={{ margin: 0 }}>
//           <Modal
//             animationType="slide"
//             transparent={true}
//             visible={modalVisible}
//           >
//             <View style={styles.centeredView}>
//               <View style={styles.modalView}>
//                 <Text style={styles.modalText}>
//                   Congrats! You completed this mission!
//                 </Text>
//                 <Pressable
//                   style={[styles.button, styles.buttonClose]}
//                   onPress={() => setModalVisible(!modalVisible)}
//                 >
//                   <Text style={styles.textStyle}>Continue</Text>
//                 </Pressable>
//               </View>
//             </View>
//           </Modal>
//         </View>
//       );
//     }
//   })()}
// </View>;

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
  },
  missionBox: {
    backgroundColor: "#c2e4f2",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  missionItem: {
    width: "100%",
    alignItems: "center",
  },
  missionTitle: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  missionDescription: {
    fontSize: 18,
    marginVertical: 15,
    fontWeight: "bold",
    textAlign: "center",
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
