import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

export const firebaseConfig = {
    apiKey: "AIzaSyDxftJzjiuGcR1dfxgmIkKaz0FqnCeJGIk",
    authDomain: "flaptalk-3c1fc.firebaseapp.com",
    projectId: "flaptalk-3c1fc",
    storageBucket: "flaptalk-3c1fc.appspot.com",
    messagingSenderId: "153690737834",
    appId: "1:153690737834:web:ce0431cc0ceebe876714d3",
    measurementId: "G-W5XS8HREWK"
}

if(firebase.apps.length)
{
    firebase.initializeApp(firebaseConfig);
}