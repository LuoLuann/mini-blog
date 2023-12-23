import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQFqyELctbxPnV-oSlpsX4grZuVHaO754",
  authDomain: "miniblog-e188d.firebaseapp.com",
  projectId: "miniblog-e188d",
  storageBucket: "miniblog-e188d.appspot.com",
  messagingSenderId: "500509768305",
  appId: "1:500509768305:web:05ff7d3e7b8e3b243579d0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Database
const db = getFirestore(app)

export { db };
