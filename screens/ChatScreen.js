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

const db = firebase.firestore().collection("messages");
const auth = firebase.auth();

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // This is the listener for authentication
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("Chat");
      } else {
        navigation.navigate("Login");
      }
    });

    // This sets up the top right button
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

    // setMessages([
    //   {
    //     _id: 2,
    //     text: "Hello Too",
    //     createdAt: new Date(),
    //     user: {
    //       _id: 1002,
    //       name: "Another User",
    //       avatar: "https://placeimg.com/141/140/any",
    //     },
    //   },
    //   {
    //     _id: 1,
    //     text: "Hello developer",
    //     createdAt: new Date(),
    //     user: {
    //       _id: 1001,
    //       name: "React Native",
    //       avatar: "https://placeimg.com/140/140/any",
    //     },
    //   },
    // ]);

    // This unsubscribes snapshot and loads data from firebase
    const unsubscribeSnapshot = db.orderBy("createdAt", "desc")
    .onSnapshot((collectionSnapshot) => {
      //const serverMessages = collectionSnapshot.docs.map((doc) => doc.data());
      const serverMessages = collectionSnapshot.docs.map((doc) => {
        const data = doc.data();
        console.log(data);
        const returnData = {
          ...doc.data(),
          createdAt: new Date(data.createdAt.seconds * 1000), // convert to JS date object
        };
        return returnData;
      });
      setMessages(serverMessages);
    });
 

    //return unsubscribe;
    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, []);

  function logout() {
    auth.signOut();
  }

  function onSend(newMessages) {
    console.log(newMessages);
    const newMessage = newMessages[0];
    db.add(newMessage);
    //setMessages([...newMessages, ...messages]);
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => onSend(newMessages)}
      renderUsernameOnMessage={true}
      listViewProps={{
        style: {
          backgroundColor: "#427594",
        },
      }}
      user={{
        _id: 1,
      }}
    />
  );
}