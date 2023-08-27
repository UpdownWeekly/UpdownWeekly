import { useState } from 'react'
import './App.css'
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

firebase.initializeApp({
  apiKey: "AIzaSyA07dPvgrlnmLAAMwl8hl6N84OmcyQ-sco",
  authDomain: "updownweekly-4d651.firebaseapp.com",
  projectId: "updownweekly-4d651",
  storageBucket: "updownweekly-4d651.appspot.com",
  messagingSenderId: "78399281333",
  appId: "1:78399281333:web:05bd759e9b5d930d4206fc"
})


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     
    </>
  )
}

export default App
