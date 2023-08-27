import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, Auth, User } from 'firebase/auth';

class AuthService {
  private static instance: AuthService;
  private auth: Auth;
  private googleProvider: GoogleAuthProvider;

  private constructor() {
    this.auth = getAuth();
    this.googleProvider = new GoogleAuthProvider();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public loginWithGoogle(): Promise<User> {
    return signInWithPopup(this.auth, this.googleProvider)
      .then((result) => result.user);
  }

  public logout(): Promise<void> {
    return signOut(this.auth);
  }

  public onAuthChange(onUserChanged: (user: User | null) => void): void {
    this.auth.onAuthStateChanged(onUserChanged);
  }
}

export default AuthService;
