import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { firebaseConfig } from './Secrets';
import { initializeApp } from 'firebase/app';
import { initializeFirestore, collection,
  doc, getDoc, setDoc, addDoc, deleteDoc, getDocs, query, where, onSnapshot
} from "firebase/firestore";

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  useFetchStreams: false
});

function LandingScreen({navigation}) {
    const [username, onChangeUsername] = useState('');
    const [password, onChangePassword] = useState('');

    async function checkPerson() {
        let q = query(collection(db, 'users'), where('username', '==', username));
        onSnapshot(q, (qSnap) => {
            if (qSnap.empty) {
                alert('Username does not exist.')
                onChangeUsername('')
                onChangePassword('')
            }
            qSnap.docs.forEach((docSnap)=>{
                let user = docSnap.data();
                if (user.password == password){
                    onChangeUsername('')
                    onChangePassword('')
                    navigation.navigate('Search', {username: username, password: password, id: docSnap.id})
                } else {
                    alert('Password is incorrect.')
                    onChangeUsername('')
                    onChangePassword('')    
                }
            });
        });
        // const usersRef = collection(db, 'users').where('username', '==', username);
        // const snapshot = await usersRef.where('username', '==', username).get();
        // if (snapshot.empty) {
        //     console.log('No matching documents.');
        //   } else {
        //     snapshot.forEach(doc => {
        //         console.log(doc.id, '=>', doc.data());  
        //   })
        // }
          
        // let allTodos = await getDocs(todoRef);
        // for (let i = 0; i < allTodos.length; i++) {
        //     console.log(allTodos['Object'])
        // } 
        // console.log(allTodos)

        // const cityRef = db.collection('cities').doc('SF');
        // const doc = await cityRef.get();
        // if (!doc.exists) {
        //     console.log('No such document!');
        // } else {
        //     console.log('Document data:', doc.data());
        // }
        // const collRef = collection(db, 'users');
        // let userObj = {
        // username: username, 
        // password: password
        // }; // leave the key out for now
        // let docRef = await getDoc(collRef, userObj);
        // console.log("HI", docRef)
        // userObj.key = docRef.id;

    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Say Cheers</Text>
            <Image style={{width: 150, height: 110}} source={{uri: 'https://cdn.dribbble.com/users/1112628/screenshots/6233083/icon3_1x.png'}}/>
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
              <Button
                title="Login"
                onPress={checkPerson}
              />
              <Button
                title="New user? Create Account!"
                onPress={()=>{
                    navigation.navigate('CreateAccount');
                  }}
              />
            <StatusBar style="auto" />
          </View>
    )
    
}

    export default LandingScreen;
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      input: {
          height: 40,
          margin: '5%',
          width: '50%',
          borderWidth: 1,
          padding: 10,
        },
        username: {
          flexDirection: 'row',
          alignItems: 'center'
        },
        title: {
          fontSize: 30
        }, 
        button: {
          width: '10%',
          borderRadius: 5,
          fontStyle: 'italic'
        }
    });
  