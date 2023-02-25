import * as React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons';
import { FontFamily } from '../../GlobalStyles';

const Post = ({post}) => {
    return (
        <View style={{width: Dimensions.get("window").width - 40, marginLeft: 20, borderRadius: 35, backgroundColor: "#c2e4f2", marginTop:30, marginBottom: 10}}>
            <View style={styles.container}>
                <View style={styles.user}>
                    <View style={styles.userInfo}> 
                        <Image
                            style={styles.profilePic}
                            resizeMode="cover"
                            source={require("../../assets/profilePic.jpg")}
                        />
                        <View style={styles.details}>
                            <TouchableOpacity
                                style={{textDecoration: "none", color:"inherit"}}
                                activeOpacity={0.2}
                                onPress={() => {`/users/${post.userId}`}}>      
                                    <Text style={styles.name}>{post.name}</Text>
                            </TouchableOpacity>
                            <Text style={styles.date}>a few seconds ago</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.2}
                        onPress={() => {}}>      
                        <Ionicons name="ellipsis-horizontal" size={24} color="black" />
                    </TouchableOpacity>
                </View>


                <View style={styles.content}>
                    <Image
                        style={styles.postImage}
                        source={require("../../assets/post_pic.png")}
                    />
                </View>


                <View style={styles.info}>
                    <View style={styles.like_comment}>
                        <View style={styles.item}>
                            <TouchableOpacity
                                style={styles.like}
                                activeOpacity={0.2}
                                onPress={() => {}}
                            >
                                <AntDesign name="like2" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.item}>
                            <TouchableOpacity
                                style={styles.comment}
                                activeOpacity={0.2}
                                onPress={() => {}}
                            >
                                <FontAwesome name="comment-o" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={{marginRight: 10, fontFamily: FontFamily.interMedium}}>
                            14 Likes
                    </Text>
                </View>

                <View style={styles.captionView}>
                    <Text style={styles.caption}>{post.desc}</Text>
                </View>

                <View style={styles.viewComments}>
                    <TouchableOpacity
                          activeOpacity={0.2}
                          onPress={() => {}}
                    >
                        <Text style={styles.viewCommentText}>View 4 Comments</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    user: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",

    },
    userInfo: {
        display: "flex",
        flexDirection: "row",
    },
    profilePic: {
        width: 45,
        height: 45,
        borderRadius: 100,
        resizeMode: "cover",
        marginRight: 10
    },
    details: {
        display: "flex",
        flexDirection: "column",
        marginTop: 3
    },
    name: {
        fontFamily: FontFamily.interMedium,
        fontSize: 17,
    },
    date: {
        fontSize: 13
    },
    content: {
        marginBottom: -1130
    },
    postImage: {
        width: '100%',
        maxHeight: 388,
        resizeMode: "cover",
        marginTop: 20,
        borderRadius: 20,
    },
    info: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        marginLeft: 7,
        justifyContent: "space-between",

    },
    item: {
        display: "flex",
        alignItems: "center",
        fontSize: 14,
        marginRight: 15

    },
    like_comment: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
    },
    captionView: {
        marginTop: 15,
        marginLeft: 10
    },
    caption: {
        fontFamily: FontFamily.interMedium,
    },
    viewComments: {
        alignItems: "center",
        marginTop: 25,
    },
    viewCommentText: {
        textDecorationLine: "underline",
        fontFamily: FontFamily.interMedium,
        fontWeight: "500",
        fontSize: 14,
        color: "#828282"
    }

});

export default Post;