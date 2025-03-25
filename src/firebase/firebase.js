// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import {signInWithEmailAndPassword} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAr7yfDKXSi3bZh5xW0hAwEwu8BQbp-rec",
  authDomain: "clipboard-extension-63acb.firebaseapp.com",
  databaseURL: "https://clipboard-extension-63acb-default-rtdb.firebaseio.com",
  projectId: "clipboard-extension-63acb",
  storageBucket: "clipboard-extension-63acb.firebasestorage.app",
  messagingSenderId: "236309694102",
  appId: "1:236309694102:web:2cbe48a255c5cbab4924b7",
  measurementId: "G-SWFPY56YVJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export { createUserWithEmailAndPassword };
export { signInWithEmailAndPassword };
