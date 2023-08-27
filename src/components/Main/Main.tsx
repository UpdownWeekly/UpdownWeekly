import React, { useEffect, useState } from 'react';
import { User, getAuth, signOut } from 'firebase/auth';
import FirestoreService, { Group } from '../../services/firestore-service';
import AuthService from '../../services/auth-service';
import './Main.css'

function MainComponent({ }) {

  const [groups, setGroups] = useState<Group[]>([]);
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const firestoreService = FirestoreService.getInstance();
      const authService = AuthService.getInstance();
      const user = authService.getCurrentUser();
      const groups = await firestoreService.getGroups(user!.uid);
      setGroups(groups)
    }

    fetchData();
  }, []);

  return (
    <div>
      <div className='header'>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className='sidebar'>
      {groups.map((group, index) => (
        <button onClick={() => setGroup(group)} className='group-button'>{group.name}</button>
      ))}
      </div>
      <div>
        {group?.name}
      </div>
    </div>
  );
}

export default MainComponent;

function handleLogout() {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      console.log('User signed out');
    })
    .catch((error) => {
      console.error('Error signing out: ', error);
    });
}
