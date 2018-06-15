import firebase from 'firebase'


const config = {
    apiKey: "AIzaSyA0N6RCwq40yDJlRlnGP7PA9ZRNY25tFgE",
    authDomain: "ling-pro.firebaseapp.com",
    databaseURL: "https://ling-pro.firebaseio.com",
    projectId: "ling-pro",
    storageBucket: "",
    messagingSenderId: "1031748313030"
};

firebase.initializeApp(config);

export const ref = firebase.database().ref()
export const auth = firebase.auth();
export const provider = new firebase.auth.FacebookAuthProvider();
export const provider2 = new firebase.auth.GoogleAuthProvider();
export default firebase;