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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <button onClick={handleGoogleLogin}>Login with Google</button>
        </div>
    );
}

export default LoginComponent;
