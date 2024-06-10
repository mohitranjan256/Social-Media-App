// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// import admin from 'firebase-admin';
const firebaseConfig = {
  apiKey: "AIzaSyD8gwmVAQwiORyQQ0pMEdi09PoEg5fmhkk",
  authDomain: "social-media-app-7ff75.firebaseapp.com",
  projectId: "social-media-app-7ff75",
  storageBucket: "social-media-app-7ff75.appspot.com",
  messagingSenderId: "219632166153",
  appId: "1:219632166153:web:a4bd240783249dbbe85fd8",
  measurementId: "G-ZRJ2TVEV68"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firedb=getFirestore(app);
const auth= getAuth(app);
export {app,firedb,auth}