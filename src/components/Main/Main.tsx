import { useEffect, useState } from 'react';
import { User, getAuth, signOut } from 'firebase/auth';
import FirestoreService, { Group } from '../../services/firestore-service';
import './Main.css';

const MainComponent = ({ user }: { user: User }) => {

  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroup, selectGroup] = useState<Group | null>(null);

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
        {groups.map((group) => (
          <button onClick={() => selectGroup(group)} className='group-button'>{group.name}</button>
        ))}
      </div>
      <div className='content'>
       <div className='content-container'>
        <div className='content-posts'></div>
         <div className='content-input'>
           <input type='text' id='message-input' placeholder='Type your message...'/>
           <button id='send-button'>Send</button>
         </div>
       </div>
      </div>
      <div>
        {activeGroup?.name}
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
