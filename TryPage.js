import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { firebaseConfig } from './Secrets';
import { initializeApp } from 'firebase/app';
import { initializeFirestore, collection,
    doc, getDoc, setDoc, addDoc, deleteDoc, getDocs, query, where, onSnapshot, updateDoc
  } from "firebase/firestore";
    
const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  useFetchStreams: false
});


function TryScreen({navigation, route}){
    const { username, password, id } = route.params;
    const [savedBeers, getSavedBeers] = useState([]);


    async function apiRequest(id_of_beer) {
        try {
            let response = await fetch(
              'https://api.punkapi.com/v2/beers/' + id_of_beer,
            );
            let responseJson = await response.json();
            let beer_array = [];
            beer_array.push(responseJson[0]['name'], responseJson[0]['description'], responseJson[0]['image_url'], responseJson[0]['abv'], responseJson[0]['id']);
            // console.log(beer_array)
            return(beer_array);
          } catch (error) {
            console.error(error);
          }
    }

    async function getUserDoc() {
        const snap = await getDoc(doc(db, 'users', id))
        let all_saved_beers = [];
        if (snap.exists()) {
            console.log(snap.data()['saved_list'])
            for (let i = 0; i < snap.data()['saved_list'].length; i++) {
                let beer_to_list = await apiRequest(snap.data()['saved_list'][i]);
                all_saved_beers.push(beer_to_list);
              }
        }
        else {
          console.log("Account issues, try again.")
        }
        getSavedBeers(all_saved_beers);
        return all_saved_beers;
    }

    async function deleteSavedBeer(toDelete) {
        const docRef = doc(db, "users", id);
        const snap = await getDoc(doc(db, 'users', id))
        console.log('WORk', snap.data())
        let data_array = [...snap.data()['saved_list']]
        for( var i = 0; i < data_array.length; i++){ 
            if ( data_array[i] === toDelete) { 
                data_array.splice(i, 1);
                let updated = await updateDoc(docRef, {saved_list: data_array});
                alert('Successfully removed beer!');
                return 0;

            } 
        }
    }

    useEffect(() => {
        getUserDoc(); 
        console.log(savedBeers)
      
    }, []);

    return (
        <View contentContainerStyle={styles.container}>
            
        <ScrollView style={{height: '86%'}}>
            <Text style={{textAlign: 'center', fontSize: 22, fontWeight: '400', color: '#08162e'}}>Craft Beers for {username} to try...</Text>
            { savedBeers.map((item, key)=>(
                <View key={key} style={{backgroundColor: '#08162e', flexDirection: 'row', alignItems: 'center', width: '95%', padding: '3%', margin: '1%', borderRadius: 10}}>
                    <Image
                        style={{width: 35, height: 150,  }}
                        source={{ uri: item[2] }}
                    />
                    <View style={{margin:'3%', width: '85%'}}>
                        <Text style={{color: 'white', fontSize: 18, fontWeight: '400', textDecorationLine: 'underline'}} >{item[0]}</Text>
                        <Text style={{color: 'white', fontWeight: '300'}} > {item[1]} <Text style={{color: '#4b5c9c'}}>ABV: {item[3]} </Text></Text>
                        <Icon.Button 
                            name="remove" 
                            color="red" 
                            size={30} 
                            backgroundColor= '#08162e' 
                            style={{margin: '2%', justifyContent: 'flex-end'}}
                            onPress={() => deleteSavedBeer(item[4])}
                        >
                        </Icon.Button>

                    </View>
                </View>
                )
            )}
            </ScrollView>
            <View style={styles.bar}>
                <Icon.Button 
                    onPress={()=>{
                        navigation.navigate('Search', {username: username, id: id});
                      }}
                    name="search" 
                    size = {45}
                    color = 'white'
                    backgroundColor='#1b2440'>
                </Icon.Button>
                <Icon.Button
                    onPress={()=>{
                        navigation.navigate('Saved List', {username: username, id: id});
                      }} 
                    name="list-ul" 
                    size = {45}
                    color = 'white'
                    backgroundColor='#1b2440'>
                </Icon.Button>
                <Icon.Button 
                    onPress={()=>{
                        navigation.navigate('Profile', { username: username, id: id});
                      }}
                    name="user" 
                    size = {45}
                    color = 'white'
                    backgroundColor='#1b2440'>
                </Icon.Button>
            </View>
            
        <StatusBar style="auto" />
        </View>

    )
}

export default TryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottom:{
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        width: '100%'
    }, 
    bar: {
        backgroundColor: '#1b2440', 
        width: '100%', 
        height: '14%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    }
});