import firebase from 'firebase/app';
import 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyBWkI5hKhFBS1maOvFpxLoV_tyD9gMxASk",
    authDomain: "beverageorderingapp.firebaseapp.com",
    projectId: "beverageorderingapp",
    storageBucket: "beverageorderingapp.appspot.com",
    messagingSenderId: "589865975430",
    appId: "1:589865975430:web:44b49a930c2db512221b07"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.firestore();
// database.settings({
//     timestampsInSnapshots: true
// });


export { database };