import { StyleSheet, View, Image, Text, TextInput, Button } from "react-native";
import { color } from "react-native-reanimated";
import { FontFamily, FontSize } from "../../GlobalStyles";

const Comment = () => {
  //TEMPORARY DATABASE //////////////////////////////////
  const comments = [
    {
      id: 1,
      name: "John Doe",
      userId: 1,
      profilePic:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
      desc: "Great picture, what bait did you use?",
    },
    {
      id: 2,
      name: "Will Smith",
      userId: 2,
      profilePic:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
      desc: "What part of Joe Pool Lake were you fishing in? I never caught a big fish there",
    },
    {
      id: 3,
      name: "Luka Doncic",
      userId: 3,
      profilePic:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
      desc: "Nice catch!",
    },
    {
      id: 4,
      name: "Lionel Messi",
      userId: 4,
      profilePic:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
      desc: "When's dinner?",
    },
    {
      id: 5,
      name: "Jake Paul",
      userId: 5,
      profilePic:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
      desc: "I am the GOAT",
    },
  ];
  ///////////////////////////////////////////////////////

  return (
    <View style={styles.comments}>
      <View style={styles.typeComment}>
        <Image
          style={styles.img}
          source={require("../../assets/profilePic.jpg")}
        />
        <TextInput style={styles.input} placeholder="write a comment..." />
        <Button style={styles.send} title="Send" onPress={() => {}} />
      </View>

      {comments.map((comment) => (
        <View key={comment.id} style={styles.comment}>
          <Image
            style={styles.img}
            source={require("../../assets/profilePic.jpg")}
          />
          <View style={styles.info}>
            <Text style={styles.userName}>{comment.name}</Text>
            <Text style={styles.desc}>{comment.desc}</Text>
          </View>

          {/* <View style={{marginLeft: 20}}>
                <Text style={styles.date}>1 hour ago</Text>
                <Image style={styles.img} source={require("../../assets/profilePic.jpg")} />
                <View style={styles.info}>
                    <Text style={styles.userName}>{comment.name}</Text>
                    <Text style={styles.desc}>{comment.desc}</Text>
                </View>
                <Text style={styles.date}>1 hour ago</Text>
                </View> */}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  comments: {},
  typeComment: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  input: {
    width: "65%",
    padding: 10,
    borderWidth: 1,
    backgroundColor: "white",
  },
  comment: {
    marginTop: 25,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    display: "flex",
    flexDirection: "row",
    // justifyContent: "space-between",
    // gap: 20
  },
  info: {
    flex: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: 10,
  },
  userName: {
    fontWeight: "500",
  },
  desc: {
    // fontFamily: FontFamily.interRegular,
  },
  date: {
    flex: 1,
    alignSelf: "center",
    right: -15,
    color: "gray",
    fontSize: 12,
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 50,
    resizeMode: "contain",
  },
});

export default Comment;
