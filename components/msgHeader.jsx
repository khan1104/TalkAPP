import { View, Text, Image, Alert } from 'react-native';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const MsgHeader = ({ userName, profileImage }) => {
    const router = useRouter();

    const call = () => {
        Alert.alert("Under Construction", "Feature Coming very soon, stay connected");
    };

    const video = () => {
        Alert.alert("Under Construction", "Feature Coming very soon, stay connected");
    };

    const BackNext = () => {
        router.navigate("/(tabs)/chats");
    };

    return (
        <View style={{
            backgroundColor: "#2f3030",
            height: 70,
            justifyContent: "flex-end",
            padding: 10
        }}>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
                <Ionicons name="arrow-back-outline" size={30} color="white" onPress={BackNext} />
                
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1, marginLeft: 10 }}>
                    <Image source={{ uri: profileImage }} style={{
                        width: 45,
                        height: 45,
                        borderWidth: 1.5,
                        borderColor: "white",
                        borderRadius: 22.5,
                        marginRight: 10
                    }} />
                    <Text style={{
                        color: "white",
                        fontSize: 27,
                        flexShrink: 1,
                        marginTop: 5
                    }} numberOfLines={1}>{userName}</Text>
                </View>

                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                    marginRight:8
                }}>
                    <MaterialIcons name="add-call" size={24} color="white" onPress={call} />
                    <FontAwesome name="video-camera" size={24} color="white" onPress={video} />
                </View>
            </View>
        </View>
    );
};

export default MsgHeader;