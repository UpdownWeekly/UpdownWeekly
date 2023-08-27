import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import AuthService from '../../services/auth-service';
import FirestoreService from '../../services/firestore-service';

function LoginComponent() {

    async function handleGoogleLogin() {
        const authService = AuthService.getInstance();
        const firestoreService = FirestoreService.getInstance();
        const user = await authService.loginWithGoogle();
        await firestoreService.createUser(user.uid, user.displayName!, user.email!)
    }

    return (
        <div>
            <button onClick={handleGoogleLogin}>Login with Google</button>
        </div>
    );
}

export default LoginComponent;
