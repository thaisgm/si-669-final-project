import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomePage.js';
import LandingScreen from './LandingPage.js';
import CreateAccountScreen from './CreateAccountPage.js';
import ProfileScreen from './ProfilePage.js';
import SearchScreen from './SearchPage.js';
import TryScreen from './TryPage.js';
import BeerScreen from './BeerPage.js';
import ReviewsScreen from './ReviewsPage.js';


import { firebaseConfig } from './Secrets';
import { initializeApp } from 'firebase/app';
import { initializeFirestore, collection,
  doc, getDoc, setDoc, addDoc, deleteDoc
} from "firebase/firestore";


const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  useFetchStreams: false
});

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen name="Landing" component={LandingScreen}  />
        <Stack.Screen name="Write Review" component={HomeScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Saved List" component={TryScreen} />
        <Stack.Screen name="Beer" component={BeerScreen} />
        <Stack.Screen name="Read Reviews" component={ReviewsScreen} />



      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

