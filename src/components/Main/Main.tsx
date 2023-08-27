import React, { useEffect, useState } from 'react';
import { User, getAuth, signOut } from 'firebase/auth';
import FirestoreService, { Group } from '../../services/firestore-service';
import AuthService from '../../services/auth-service';
import './Main.css'

const MainComponent = ({ user }: { user: User }) => {


  const [groups, setGroups] = useState<Group[]>([]);
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log(user);
      if (user != null) {
        console.log("fetching")
        const firestoreService = FirestoreService.getInstance();
        const groups = await firestoreService.getGroups(user.uid);
        setGroups(groups)
      }
    }
    fetchData();
  }, [user]);

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
