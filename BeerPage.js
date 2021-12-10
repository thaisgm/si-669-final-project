import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, FlatList, SafeAreaView } from 'react-native';
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


function BeerScreen({navigation, route}){
    const { beerName, beerID, user_id, username } = route.params;
    const [info, getInfo] = useState([]);


    async function getBeer(beerID) {
        try {
            let response = await fetch(
              'https://api.punkapi.com/v2/beers/' + beerID,
            );
            let responseJson = await response.json();
            return responseJson;
          } catch (error) {
            console.error(error);
          }
    }

    async function listBeer() {
        let data = await getBeer(beerID);
        let beer_arr = [];
        // console.log('YOU', data)
        beer_arr.push(data[0]['image_url'], data[0]['description'], data[0]['food_pairing'], data[0]['name'])

        //first_brewed, food_pairing, ibu, image_url, tagline, name
        // console.log(beer_arr)
        getInfo(beer_arr)
        return beer_arr;
      }

      function printBeerDes(description) {
          if (description) {
            if (description.length > 150){
                return description.substring(0,150) + '...';
            } else {
              return description;
            }
          } else {
              return "No description available.";
          }  
      }

      async function saveBeer() {
        const docRef = await getDoc(doc(db, 'users', user_id));
        const docRef2 = doc(db, "users", user_id);

        let old_arr = [];
        if (docRef.exists()) {
            if (docRef.data()['saved_list'].includes(beerID)){
                alert("You've already added this beer!")
            } else {
                old_arr = [...docRef.data()['saved_list']]
                old_arr.push(beerID);
                let updated = await updateDoc(docRef2, {saved_list: old_arr});
                alert('Beer saved successfully!')        
            }
        }
      }

      useEffect(() => {
        listBeer(); 
      
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Image
                    style={styles.tinyLogo}
                    source={{
                        uri: info[0],
                    }}
                />
                <View style={styles.beerHeader}>
                    <Text style={styles.name}>{info[3]}</Text>
                    <View style={styles.descBox}><Text style={styles.description}>{printBeerDes(info[1])}</Text></View>
                </View>
            </View>
            <Text style={styles.pairs}>This beer pairs well with... </Text>
            <FlatList
                data = {info[2]}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => <Text>– {item}</Text>}

            />
            <View style={styles.buttonGroup}>
                <Text 
                    style={styles.beerButtons} 
                    onPress={()=>{
                        navigation.navigate('Read Reviews', { beerID: beerID});
                    }}
                >
                    Read Reviews
                </Text>
                <Text 
                    style={styles.beerButtons}
                    onPress={()=>{
                        navigation.navigate('Write Review', {id: user_id, beerID: beerID, username: username});
                    }}
                >
                    Write Review
                </Text>
                <Text style={styles.beerButtons} onPress={saveBeer}>Save Beer</Text>
            </View>
            
            <View style={styles.bar}>
                <Icon.Button 
                    onPress={()=>{
                        navigation.navigate('Search', {id: user_id});
                      }}
                    name="search" 
                    size = {45}
                    color = 'white'
                    backgroundColor='#1b2440'>
                </Icon.Button>
                <Icon.Button
                    onPress={()=>{
                        navigation.navigate('Saved List', {id: user_id});
                      }} 
                    name="list-ul" 
                    size = {45}
                    color = 'white'
                    backgroundColor='#1b2440'>
                </Icon.Button>
                <Icon.Button 
                    onPress={()=>{
                        navigation.navigate('Profile', {username: username, id: id});
                      }}
                    name="user" 
                    size = {45}
                    color = 'white'
                    backgroundColor='#1b2440'>
                </Icon.Button>
            </View>
        <StatusBar style="auto" />
    </SafeAreaView>


    )
}

export default BeerScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      flexShrink: 3
    },
    bottom:{
        flex: 2,
        flexGrow: 3,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        width: '100%', 
        height: '100%'
    }, 
    bar: {
       backgroundColor: '#1b2440', 
       width: '100%', 
       height: '14%',
       flexDirection: 'row',
       justifyContent: 'space-around',
       alignItems: 'center'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '3%'
    },
    tinyLogo: {
        width: 80,
        height: 220,  
        paddingRight: '5%'  
    },
    beerHeader: {
        flexDirection: 'column'
    },
    name: {
        fontSize: 30,
        padding: '8%',
        color: '#354866'
    },
    descBox: {
        backgroundColor: '#354866',
        borderWidth: 1, 
        borderRadius: 5, 
        borderColor: '#354866',
        width: 250, 
        height: 125,
        margin: '5%',
        paddingTop: '5%',
        paddingBottom: '5%'
    },
    description: {
        fontSize: 15,
        paddingLeft: '5%',
        paddingRight: '10%',
        color: 'white'
 
    }, 
    pairs: {
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
        fontSize: 15,
        padding: '3%'
    },
    buttonGroup: {
        flexDirection: 'row', 
        height: '25%',
        justifyContent: 'space-evenly',
        paddingTop: '2%'

    },
    beerButtons: {
        paddingTop: '2%',
        paddingLeft: '2%',
        paddingRight: '2%',
        marginLeft: '2%',
        marginRight: '2%', 
        backgroundColor: '#354866',
        height: '20%', 
        width: '30%',
        color: 'white', 
        textAlign: 'center', 
        borderWidth: 1, 
        borderRadius: 10, 
        borderColor: '#354866',
    }
});