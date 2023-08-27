import { Firestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

class FirestoreService {
  private static instance: FirestoreService;
  private db: Firestore;

  private constructor() {
    this.db = db;
  }

  public static getInstance(): FirestoreService {
    if (!FirestoreService.instance) {
      FirestoreService.instance = new FirestoreService();
    }
    return FirestoreService.instance;
  }

  async createUser(uid: string, displayName: string, email: string) {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        'name': displayName,
        'email': email,
      });
    }
  }

}

export default FirestoreService;
