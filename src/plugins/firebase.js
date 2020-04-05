import firebase from "firebase";
import {firebaseConfig} from "../../config/firebase-config";


// Initialize Firebase

const firebaseApp = firebase.initializeApp(firebaseConfig);

export const db = firebaseApp.firestore();
