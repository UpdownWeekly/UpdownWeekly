import React from 'react';
import { getAuth, signOut } from 'firebase/auth';


function MainComponent({}) {
  return (
    <div>
        You're logged in, this is the main view.
        <button onClick={handleLogout}>Logout</button>
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
  