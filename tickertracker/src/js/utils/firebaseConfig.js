import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyD0dwEZgt9bAUm5I2laXXMjTS-xb8ef-I0",
  authDomain: "iprog-projekt-6d4e8.firebaseapp.com",
  projectId: "iprog-projekt-6d4e8",
  storageBucket: "iprog-projekt-6d4e8.appspot.com",
  messagingSenderId: "253433507815",
  appId: "1:253433507815:web:a0b0e57d54e9ed0c22d742",
  measurementId: "G-2LSYJ55LW9"
};

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const analytics = firebase.analytics();

export default firestore