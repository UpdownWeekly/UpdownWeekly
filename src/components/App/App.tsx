import { useState, useEffect} from 'react'
import './App.css'
import { initializeApp } from 'firebase/app';
import { DocumentData, collectionGroup, getDocs, getFirestore } from 'firebase/firestore';

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

function App() {
  const [data, setData] = useState<DocumentData[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      const documents = await fetchCollectionGroup();
      setData(documents);
    }
    fetchData();
  }, []);

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default App;

async function fetchCollectionGroup() {
  const collectionGroupId = 'entries';
  const query = collectionGroup(db, collectionGroupId);
  const querySnapshot = await getDocs(query);
  const documents = querySnapshot.docs.map(doc => doc.data());
  return documents;
}

