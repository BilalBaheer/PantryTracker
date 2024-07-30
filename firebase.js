// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsU3VRbVT9_gvuXgF3ZSuNrWvxkVyrZTk",
  authDomain: "pantryproject2.firebaseapp.com",
  projectId: "pantryproject2",
  storageBucket: "pantryproject2.appspot.com",
  messagingSenderId: "1003033691256",
  appId: "1:1003033691256:web:2baa70df7010ecbbc8998d",
  measurementId: "G-1G33TXCH9K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export { db };
