import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, Auth, User } from 'firebase/auth';

class AuthService {
  private static instance: AuthService;
  private auth: Auth;
  private googleProvider: GoogleAuthProvider;
  private currentUser: User | null = null;

  private constructor() {
    this.auth = getAuth();
    this.googleProvider = new GoogleAuthProvider();

    this.auth.onAuthStateChanged((user) => {
        this.currentUser = user;
      });
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public getCurrentUser() {
    return this.currentUser;
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
