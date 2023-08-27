import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA07dPvgrlnmLAAMwl8hl6N84OmcyQ-sco",
  authDomain: "updownweekly-4d651.firebaseapp.com",
  projectId: "updownweekly-4d651",
  storageBucket: "updownweekly-4d651.appspot.com",
  messagingSenderId: "78399281333",
  appId: "1:78399281333:web:05bd759e9b5d930d4206fc",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, auth, db };
