import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, SafeAreaView, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Slider } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import { firebaseConfig } from './Secrets';
import { initializeApp } from 'firebase/app';
import { initializeFirestore, collection,
  doc, getDoc, setDoc, addDoc, deleteDoc
} from "firebase/firestore";
  
const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  useFetchStreams: false
});


// import fetch from 'node-fetch';


function HomeScreen({navigation, route}){
    const { id, beerID, username } = route.params;
    const [beerInfo, getInfo] = useState(listBeer());
    const [tasteText, changeTasteText] = useState('');
    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false);
    const [dropdown, setDropdown] = useState(null);
    const [items, setItems] = useState([
        {label: 'Carbonated', value: 'carbonated'},
        {label: 'Citrus', value: 'citrusy'},
        {label: 'Coffeeish', value: 'coffeeish'},
        {label: 'Earthy', value: 'earthy'},
        {label: 'Fruity', value: 'fruity'},
        {label: 'Heavy', value: 'heavy'},
        {label: 'Herbal', value: 'herbal'},
        {label: 'Light', value: 'light'},
        {label: 'Malty', value: 'malty'},
        {label: 'Piney', value: 'piney'},
        {label: 'Rich', value: 'rich'},
        {label: 'Smoky', value: 'smoky'}
    ]);
    const [checkColor, setCheckColor] = useState('green');
    const [checkValue, setcheckValue] = useState(true);

  

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
        beer_arr.push(data[0]['name'], data[0]['image_url'], data[0]['description'])

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

    function drinkAgain() {
        if (checkColor == 'green'){
            setCheckColor('red')
            setcheckValue(false)
        } else {
            setCheckColor('green')
            setcheckValue(true)
        }
    }

    async function submitReview() {
        let user_id = id;
        let user_name = username;
        let beer_name = beerInfo[0];
        let beer_id = beerID;
        let flavor_notes = dropdown;
        let rating = value;
        let drink_again = checkValue;
        let review_text = tasteText;

        const collRef = collection(db, 'reviews');

        let reviewObj = {
            username: user_name,
            user_id: user_id,
            beer_id: beer_id,
            beer_name: beer_name,
            rating: rating,
            drink_again: drink_again, 
            review_text: review_text,
            flavor_notes: flavor_notes
        };
        let docRef = await addDoc(collRef, reviewObj);
        reviewObj.key = docRef.id;
        alert('Awesome! Review Submitted.')
        navigation.navigate('Search', {username: username, id: id});
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Image
                    style={styles.tinyLogo}
                    source={{
                        uri: beerInfo[1],
                    }}
                />
                <View style={styles.beerHeader}>
                    <Text style={styles.name}>{beerInfo[0]}</Text>
                    <View style={styles.descBox}><Text style={styles.description}>{printBeerDes(beerInfo[2])}</Text></View>
                </View>
            </View>
            <TextInput 
                style = {styles.tasteInput} 
                placeholder="How did it taste? Max 40 characters."
                value={tasteText}
                onChangeText={text => changeTasteText(text)}
                maxLength={40}
                returnKeyType='done'
            >
            </TextInput>
            
            <View style={[styles.contentView]}>
                <Slider
                value={value}
                onValueChange={setValue}
                maximumValue={5}
                minimumValue={0}
                step={1}
                allowTouchTrack
                trackStyle={{ height: 10, width: 335, backgroundColor: 'transparent' }}
                thumbStyle={{ height: 30, width: 30, backgroundColor: 'transparent' }}
                thumbProps={{
                    children: (
                    <Icon
                        name="star"
                        size={30}
                        reverse
                        containerStyle={{ bottom: 20, right: 20 }}
                        color='#ffdf0d'
                    />
                    ),
                }}
                />
                <Text style={{ paddingTop: 2, color: '#354866'}}>Rating: {value}</Text>
            </View>
            <DropDownPicker
                style = {{width: '90%', alignSelf:'center', marginTop: '2%'}}
                open={open}
                value={dropdown}
                items={items}
                setOpen={setOpen}
                setValue={setDropdown}
                setItems={setItems}
                multiple={true}
                min={0}
                max={3}
            />
            <View style={{paddingTop: '2%', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
                <Text style={{fontSize: 16}}>Would you drink again?</Text>
                <Icon 
                    name="check"
                    size={20}
                    style={{marginLeft: '5%'}}
                    value={checkValue}
                    color={checkColor}
                    onPress={drinkAgain}
                >
                </Icon>
            </View>
            <Text 
                style={styles.submitButton}
                onPress={submitReview}
            > Submit Review
            </Text>

            <View style={styles.bar}>
                <Icon.Button 
                    onPress={()=>{
                        navigation.navigate('Search', {username: username, password: password, id: id});
                      }}
                    name="search" 
                    size = {45}
                    color = 'white'
                    backgroundColor='#1b2440'>
                </Icon.Button>
                <Icon.Button 
                    onPress={()=>{
                        navigation.navigate('Saved List', {username: username, password: password, id: id});
                    }}
                    name="list-ul" 
                    size = {45}
                    color = 'white'
                    backgroundColor='#1b2440'>
                </Icon.Button>
                <Icon.Button 
                    onPress={()=>{
                        navigation.navigate('Profile', {username: username, password: password, id: id});
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

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexShrink: 3
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
    tasteInput: {
        backgroundColor: '#a3afc2',
        width: '90%',
        height: '8%',
        padding: '1%',
        borderWidth: 1, 
        borderRadius: 5, 
        borderColor: '#a3afc2',
    },
    submitButton: {
        padding: '2%',
        margin: '5%',
        backgroundColor: '#354866',
        height: '5%', 
        width: '40%',
        color: 'white', 
        textAlign: 'center'
    }
});

// function BottomBar({navigation, route}){
//     return (
//         <View style={styles.bottom}>
//             <View style={styles.bar}>
//                 <Icon.Button 
//                     name="plus-circle" 
//                     size = '45' 
//                     color = 'white'
//                     backgroundColor='#1b2440'>
//                 </Icon.Button>
//                 <Icon.Button 
//                     name="search" 
//                     size = '45' 
//                     color = 'white'
//                     backgroundColor='#1b2440'>
//                 </Icon.Button>
//                 <Icon.Button 
//                     name="list-ul" 
//                     size = '45' 
//                     color = 'white'
//                     backgroundColor='#1b2440'>
//                 </Icon.Button>
//                 <Icon.Button 
//                     onPress={()=>{
//                         navigation.navigate('CreateAccount');
//                       }}
//                     name="user" 
//                     size = '45' 
//                     color = 'white'
//                     backgroundColor='#1b2440'>
//                 </Icon.Button>
//             </View>
//         </View>
//     )
// }