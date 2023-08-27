import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

function LoginComponent() {
  function handleGoogleLogin() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
        console.log('User signed in: ', user);
        user.getIdToken(true)
  .then((idToken) => {
    console.log('ID Token: ', idToken);
  })
  .catch((error) => {
    console.error('Error getting ID Token: ', error);
  });
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = error.credential;
        console.error('Error signing in: ', errorMessage);
      });
  }

  return (
    <div>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
}

export default LoginComponent;
