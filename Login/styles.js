import { StyleSheet, Dimensions } from "react-native";
export const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    borderBottomWidth: 2,
  },

  bottomContainer: {
    marginBottom: height * 0.05,
    postition: "absolute",
    bottom: 0,
  },

  button: {
    backgroundColor: "rgba(123,104,238,0.8)",
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
    marginHorizontal: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "white",
  },

  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    letterSpacing: 0.5,
  },

  fieldError: {
    minHeight: 35,
    textAlign: "center",
    color: "#FF3333",
    marginHorizontal: 20,
    paddingLeft: 10,
  },

  pretext: {
    marginHorizontal: 20,
    paddingLeft: 10,
    fontWeight: "bold",
  },

  interactiveText: {
    marginHorizontal: 20,
    paddingLeft: 10,
    marginVertical: 10,
    color: "rgba(123,104,238,0.8)",
    fontWeight: "bold",
  },

  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 25,
    paddingLeft: 10,
  },

  formButton: {
    backgroundColor: "rgba(123,104,238,0.8)",
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
    marginHorizontal: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  closeButtonContainer: {
    minHeight: 40,
    minWidth: 40,
    justifyContent: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 1,
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 20,
    top: -20,
  },
});

export default styles;
