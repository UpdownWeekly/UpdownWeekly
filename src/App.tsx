import { useState, useEffect} from 'react'
import './App.css'
import { initializeApp } from 'firebase/app';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import LoginComponent from './components/Login/Login';
import MainComponent from './components/Main/Main';

const firebaseConfig = {
  apiKey: "AIzaSyA07dPvgrlnmLAAMwl8hl6N84OmcyQ-sco",
  authDomain: "updownweekly-4d651.firebaseapp.com",
  projectId: "updownweekly-4d651",
  storageBucket: "updownweekly-4d651.appspot.com",
  messagingSenderId: "78399281333",
  appId: "1:78399281333:web:05bd759e9b5d930d4206fc"
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  
  if (user === null) {
    return <LoginComponent />;
  } else {
    return <MainComponent />;
  }

}

export default App;




