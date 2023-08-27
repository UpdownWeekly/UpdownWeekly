import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, Auth, User } from 'firebase/auth';

class AuthService {
  private static instance: AuthService;
  private auth: Auth;
  private googleProvider: GoogleAuthProvider;
  private currentUser: User | null = null;
  private subscribers: ((user: User | null) => void)[] = [];

  private constructor() {
    this.auth = getAuth();
    this.googleProvider = new GoogleAuthProvider();

    this.auth.onAuthStateChanged((user) => {
        this.currentUser = user;
        this.notifySubscribers();
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

  public subscribe(onUserChanged: (user: User | null) => void): void {
    this.subscribers.push(onUserChanged);
  }

  public unsubscribe(onUserChanged: (user: User | null) => void): void {
    this.subscribers = this.subscribers.filter(sub => sub !== onUserChanged);
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(sub => sub(this.currentUser));
  }
}

export default AuthService;
