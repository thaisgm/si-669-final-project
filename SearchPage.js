import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, FlatList, SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// import fetch from 'node-fetch';




function SearchScreen({navigation, route}){
    const { username, password, id } = route.params;
    const [data, getData] = useState();
    const [searchTerm, getSearchTerm] = useState('');


    async function apiCall(){
        try {
            let response = await fetch(
              'https://api.punkapi.com/v2/beers',
            );
            let responseJson = await response.json();
            return responseJson;
          } catch (error) {
            console.error(error);
          }
    }

    async function searchApiCall(search){
        try {
            let response = await fetch(
              'https://api.punkapi.com/v2/beers?beer_name=' + search,
            );
            let responseJson = await response.json();
            return responseJson;
          } catch (error) {
            console.error(error);
          }
    }
    
    async function listBeer() {
        let data;
        if (searchTerm === '') {
            data = await apiCall();
        } else {
            data = await searchApiCall(searchTerm);
        }
        
        let ret_arr = [];
        for (let i = 0; i < data.length; i++) {
            // console.log('HI', data[i])
            // console.log('NEW BEER', data[i]['name']);
            // console.log('NEW BEER', data[i]['image_url']);
            // console.log('NEW BEER', data[i]['id']);
    
            ret_arr.push([ data[i]['name'], data[i]['image_url'], data[i]['id'], data[i]['description'] ])
            //first_brewed, food_pairing, ibu, image_url, tagline, name
          }
        // console.log(ret_arr)
        getData(ret_arr)
        return ret_arr;
    }

    function printBeerDes(description) {
        if (description) {
          if (description.length > 100){
              return description.substring(0,100) + '...';
          } else {
            return description;
          }
        } else {
            return "No description available.";
        }  
    }

    async function submitSearch() {
        listBeer();
    }

    useEffect(() => {
        listBeer(); 
      
    });


    return (
        <SafeAreaView style={styles.container}>
            <TextInput 
            placeholder="Search by beer name..."
            value={searchTerm}
            onChangeText={getSearchTerm}
            onSubmitEditing={ () => submitSearch() }
            style={{ height: 40, margin: '1%', width: '93%', borderWidth: 1, padding: 10, borderRadius: 10}}
            >
            </TextInput>
            <FlatList
                style = {styles.list}
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => 
                <View style={styles.listItem}>
                    <Image
                        style={styles.tinyLogo}
                        source={{
                            uri: item[1],
                          }}
                    />
                    <View style={styles.beer}>
                        <Text style={styles.item}>{item[0]}</Text>
                        <Text >{printBeerDes(item[3])}</Text>
                        <Icon.Button
                            name="info-circle"
                            color="white"
                            backgroundColor='#a3afc2'
                            size={30}
                            onPress={()=>{
                                navigation.navigate('Beer', {beerName: item[0], beerID: item[2], user_id: id, username: username});
                            }} 
                        >
                        </Icon.Button>

                    </View>

                </View>
                    
                } 
            />
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

export default SearchScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    bottom:{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
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
    list: {
        flex: 0,
        width: '95%'
        
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: '#a3afc2',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
        padding: '10%',
        height: 200,
    },
    beer:{
        flexDirection: 'column',
        padding: '5%',
        marginBottom: '2%'
    },
    item: {
        color: 'black',
        fontSize: 25
      },
    tinyLogo: {
        width: 35,
        height: 150,    
    }
});