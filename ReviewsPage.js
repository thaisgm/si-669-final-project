import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, SafeAreaView, Keyboard, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Slider } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import { firebaseConfig } from './Secrets';
import { initializeApp } from 'firebase/app';
import { initializeFirestore, collection,
    doc, getDoc, setDoc, addDoc, deleteDoc, getDocs, query, where, onSnapshot
  } from "firebase/firestore";
    
const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  useFetchStreams: false
});

function ReviewsScreen({navigation, route}) {
    const { beerID } = route.params;
    const [reviewData, getReviewData] = useState([]);


    useEffect(() => {
        // Update the document title using the browser API
        let q = query(collection(db, 'reviews'), where('beer_id', '==', beerID));
        let review_array = [];
        onSnapshot(q, (qSnap) => {
            if (qSnap.empty) {
                alert('Beer has no reviews yet!')
                navigation.navigate('Beer', { beerID: beerID})
            }
            qSnap.docs.forEach((docSnap)=>{
                let review = docSnap.data();
                review_array.push(review);
                getReviewData(review_array);

            });
        });
        
    }, []);
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={{width: '95%'}}>
            <FlatList
                data={reviewData}
                keyExtractor={(item, index1) => index1.toString()}
                renderItem={({item}) => 
                <View style={{backgroundColor:'#a3afc2', margin: '1%', padding: '3%', borderRadius: 5}}>
                    <Text style={{fontSize: 22, color: '#011f4f', fontWeight: '200'}}>{item['username']} says... </Text>
                    <Text style={{fontSize: 18, color: 'white', fontWeight: '400'}}>"{item['review_text']}"</Text>
                    <Text style={{fontSize: 18, color: '#011f4f', fontWeight: '200'}}>Would drink again? <Text style={{color: 'white', fontWeight: '400'}}>{item['drink_again'] ? 'True' : 'False'}</Text></Text>
                    <Text style={{fontSize: 18, color: '#011f4f', fontWeight: '200'}}>Flavor Notes:</Text>
                    <FlatList
                            data={item['flavor_notes']}
                            keyExtractor={(item, index) => index.toString()}
                            style={{ padding: '1%', marginLeft: '10%'}}
                            renderItem={({item}) => 
                                <Text style={{color: 'white'}}>- {item}</Text>
                        }
                    />
                    <Text style={{fontSize: 18, color: '#ebde34'}}>Rating: {item['rating']}</Text>
                </View>  
                } 
            />
            </View>
        </SafeAreaView>
    )
};

export default ReviewsScreen;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    }
});
