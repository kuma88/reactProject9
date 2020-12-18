import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import firebase from "../database/firebaseDB.js";
import { GiftedChat } from "react-native-gifted-chat";

const auth = firebase.auth();

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("Chat");
      } else {
        navigation.navigate("Login");
      }
    });

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={logout}>
          <MaterialCommunityIcons
            name="logout"
            size={20}
            color="black"
            style={{ marginRight: 20 }}
          />
        </TouchableOpacity>
      ),
    });

    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);

    return unsubscribe;
  }, []);

  function logout() {
    auth.signOut();
  }

  function onSend(newMessages) {
    setMessages([...newMessages, ...messages]);
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => onSend(newMessages)}
      listViewProps={{
        style: {
          backgroundColor: "#666",
        },
      }}
      user={{
        _id: 1,
      }}
    />
  );
}