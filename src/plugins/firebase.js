import firebase from "firebase";

const firebaseConfig = JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG)
// Initialize Firebase

const firebaseApp = firebase.initializeApp(firebaseConfig);

export const db = firebaseApp.firestore();
