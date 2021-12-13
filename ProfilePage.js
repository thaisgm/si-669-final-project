import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { firebaseConfig } from './Secrets';
import { initializeApp } from 'firebase/app';
import { initializeFirestore, collection,
    doc, getDoc, query, where, onSnapshot, deleteDoc
  } from "firebase/firestore";
  
  const app = initializeApp(firebaseConfig);
  const db = initializeFirestore(app, {
    useFetchStreams: false
  });
  
function ProfileScreen({navigation, route}){
    const { username, id } = route.params;
    const [userArr, getUserArr] = useState([]);
    const [reviewArr, getReviewArr] = useState([]);


    async function getUserDoc(){
        const snap = await getDoc(doc(db, 'users', id));
        let user_array = []
        user_array.push(snap.data()['username'], snap.data()['password'], snap.data()['saved_list'])
        getUserArr(user_array);
        return user_array;
    }

    async function getUserReviews() {
        let q = query(collection(db, 'reviews'), where('user_id', '==', id));
        let review_array = [];
        onSnapshot(q, (qSnap) => {
            if (qSnap.empty) {
                return 'You have not left any reviews yet.';
            }
            qSnap.docs.forEach((docSnap)=>{
                let review = docSnap.data();
                let beer_name = review['beer_name'];
                let review_text = review['review_text'];
                let rating = review['rating'];
                let drink_again = review['drink_again'];
                let flavor_notes = review['flavor_notes']
                let beer_id = review['beer_id']

                let temp_arr = [beer_name, review_text, rating, drink_again, flavor_notes, beer_id]

                review_array.push(temp_arr);
                
            });
            getReviewArr(review_array);
        });

    }

    async function deleteReview(id) {
        const docRef = doc(db, "reviews", id);
        await deleteDoc(docRef); 


    }
    
    function deleteBeerFromDB() {
        // const docRef = await getDoc(doc(db, 'users', user_id));

        let q = query(collection(db, 'reviews'), where('username', '==', username), where('beer_name', '==', reviewArr[0][0]));
        let doc_id = ''
        onSnapshot(q, (qSnap) => {
            if (qSnap.empty) {
                console.log('Review does not exist.');
            }
            qSnap.docs.forEach((docSnap)=>{

                deleteReview(docSnap.id)
                alert('Revew Deleted')

                
                // let user = docSnap.data();
                // if (user.password == password){
                //     onChangeUsername('')
                //     onChangePassword('')
                //     navigation.navigate('Search', {username: username, password: password, id: })
                // } else {
                //     alert('Password is incorrect.')
                //     onChangeUsername('')
                //     onChangePassword('')    
                // }
            });
            // doc.deleteDoc();
        });

        // console.log('HELLO', doc_id)

        // const docRef = await getDoc(doc(db, 'reviews', doc_id));



        // onSnapshot(q, (qSnap) => {
        //     if (qSnap.empty) {
        //         alert('Trouble deleting review.')
        //     }
        //     qSnap.docs.forEach((docSnap)=>{
        //         beer_to_delete = docSnap;
        //         console.log(beer_to_delete)

        //     });
        // });
        // let updated = await deleteDoc(beer_to_delete);


    }

    useEffect(() => {
        getUserReviews();
      
    }, [reviewArr]);

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 25, fontWeight: '400', marginLeft: '3%', color: '#011f4f'}}>Username: <Text style={{fontWeight: '300'}}>{username}</Text></Text>
            <Text style={{marginLeft:'3%', fontSize: 18, color: '#011f4f'}}>Past Reviews: </Text>
            <ScrollView>
            { reviewArr.map((item, key)=>(
                <View key = {key} style={{backgroundColor:'#a3afc2', margin: '1%', padding: '3%', borderRadius: 5, width: '96%'}}>
                    <Text style={{fontSize: 22, color: '#011f4f', fontWeight: '300'}}>Craft Beer Name: <Text style={{fontWeight:'200'}}>{item[0]}</Text> </Text>
                    <Text style={{fontSize: 18, color: 'white', fontWeight: '400'}}>"{item[1]}"</Text>
                    <Text style={{fontSize: 18, color: '#011f4f', fontWeight: '200'}}>Would drink again? <Text style={{color: 'white', fontWeight: '400'}}>{item[3] ? 'True' : 'False'}</Text></Text>
                    <Text style={{fontSize: 18, color: '#011f4f', fontWeight: '200'}}>Flavor Notes: {item[4]}</Text>
                    <Text style={{fontSize: 18, color: '#ebde34'}}>Rating: {item[2]}</Text>
                    <Icon.Button 
                            name="remove" 
                            color="red" 
                            size={30} 
                            backgroundColor= '#a3afc2' 
                            style={{margin: '1%', justifyContent: 'flex-end'}}
                            onPress={() => deleteBeerFromDB(item[5])}
                        >
                    </Icon.Button>
                </View>  
                )
            )}
            </ScrollView>

            <View style={styles.bar}>
                <Icon.Button
                    onPress={()=>{
                        navigation.navigate('Search', { username: username, id: id});
                      }} 
                    name="search" 
                    size = {45}
                    color = 'white'
                    backgroundColor='#1b2440'>
                </Icon.Button>
                <Icon.Button
                    onPress={()=>{
                        navigation.navigate('Saved List', { username: username, id: id});
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

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
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