import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { firebaseConfig } from './Secrets';
import { initializeApp } from 'firebase/app';
import { initializeFirestore, collection,
  doc, getDoc, setDoc, addDoc, deleteDoc
} from "firebase/firestore";
  
const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  useFetchStreams: false
});


function CreateAccountScreen({navigation}){
    const [username, onChangeUsername] = useState('');
    const [password, onChangePassword] = useState('');
    const [confirmPassword, onChangeConfirm] = useState('');

    function verifyPassword(){
        if (password == confirmPassword){
            alert('Congrats! Your account has been made');
            addPerson(username, password);
            navigation.navigate('Search', {username: username, password: password});
        } else {
            alert('Passwords must match!');
        }
    }

    async function addPerson(username, password) {
        const collRef = collection(db, 'users');
        let userObj = {
        username: username, 
        password: password
        }; // leave the key out for now
        let docRef = await addDoc(collRef, userObj);
        userObj.key = docRef.id;
        // let pList = Array.from(peopleList);
        // setPeopleList(pList);
        // pList.push(personObj);
        onChangeUsername('');
        onChangePassword('');
        onChangeConfirm('');
    }

    return (
    <View style={styles.container}>
        <Text style={styles.text}>Welcome to Say Cheers!</Text>
        <Text style={styles.text}>In order to create an account, all you need is a username, password, and the state you'd like to represent when reviewing beers!</Text>
        <View style={styles.username}>
            <Text>Username: </Text>
            <TextInput
                  style={styles.input}
                  onChangeText={onChangeUsername}
                  value={username}
                  placeholder="Enter Username"
            />
        </View>
        <View style={styles.username}>
            <Text>Password: </Text>
            <TextInput
                style={styles.input}
                onChangeText={onChangePassword}
                value={password}
                placeholder="Enter Password"
                secureTextEntry = {true}
            />
        </View>
        <View style = {styles.username}>
            <Text>Password: </Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeConfirm}
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    secureTextEntry = {true}
                />
        </View>
        <Button
            title="Create your account!"
            onPress={verifyPassword}
        />
        <StatusBar style="auto" />
    </View>

    )
}

export default CreateAccountScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center'
    }, 
    text: {
        margin: '2%'
    },
    username: {
        flexDirection: 'row',
        alignItems: 'center'
      }, 
    input: {
        height: 40,
        margin: '5%',
        width: '50%',
        borderWidth: 1,
        padding: 10,
      },
});

