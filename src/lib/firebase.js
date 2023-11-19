// NOTE: import only the Firebase modules that you need in your app... except
// for the second line, which makes both the linter and react-firebase happy
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

// Initalize Firebase.
const config = {
    apiKey: "AIzaSyDvVB6SIAhXqa3chcJgaJi_XGkd1W3xIhI",
    authDomain: "tcl-1-smart-shopping-list.firebaseapp.com",
    projectId: "tcl-1-smart-shopping-list",
    storageBucket: "tcl-1-smart-shopping-list.appspot.com",
    messagingSenderId: "490626563800",
    appId: "1:490626563800:web:1c6c138d68d09a6f8de1ad"
};

let fb = firebase.initializeApp(config);

export { fb };
