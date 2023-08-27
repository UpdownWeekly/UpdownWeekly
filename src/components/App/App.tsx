import { useState, useEffect} from 'react'
import './App.css'
import { initializeApp } from 'firebase/app';
import { DocumentData, collectionGroup, getDocs, getFirestore } from 'firebase/firestore';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import MainComponent from '../Main/Main';
import LoginComponent from '../Login/Login';

const firebaseConfig = {
  apiKey: "AIzaSyA07dPvgrlnmLAAMwl8hl6N84OmcyQ-sco",
  authDomain: "updownweekly-4d651.firebaseapp.com",
  projectId: "updownweekly-4d651",
  storageBucket: "updownweekly-4d651.appspot.com",
  messagingSenderId: "78399281333",
  appId: "1:78399281333:web:05bd759e9b5d930d4206fc"
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

function App() {
  const [data, setData] = useState<DocumentData[] | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    async function fetchData() {
      const documents = await fetchCollectionGroup();
      setData(documents);
    }
    fetchData();
  }, []);

  if (user === null) {
    return <LoginComponent />;
  } else {
    return <MainComponent />;
  }
}

export default App;

async function fetchCollectionGroup() {
  const collectionGroupId = 'entries';
  const query = collectionGroup(db, collectionGroupId);
  const querySnapshot = await getDocs(query);
  const documents = querySnapshot.docs.map(doc => doc.data());
  return documents;
}



