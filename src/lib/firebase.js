// NOTE: import only the Firebase modules that you need in your app... except
// for the second line, which makes both the linter and react-firebase happy
import firebase from 'firebase/app';
import 'firebase/firestore';

// Initalize Firebase.
const config = {
    apiKey: '{process.env.REACT_APP_TCL_1_FIRESTORE_API_KEY}',
    authDomain: 'tcl-1-i-need-to-buy.firebaseapp.com',
    databaseURL: 'https://tcl-1-i-need-to-buy.firebaseio.com',
    projectId: 'tcl-1-i-need-to-buy',
    storageBucket: 'tcl-1-i-need-to-buy.appspot.com',
    messagingSenderId: "138816077951",
    appId: "1:138816077951:web:a45c6b825fc100e8"
};

let fb = firebase.initializeApp(config);

export { fb };
