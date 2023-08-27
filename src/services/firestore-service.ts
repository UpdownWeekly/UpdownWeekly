import {
    Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

class FirestoreService {
  private static instance: FirestoreService;

  public static getInstance(): FirestoreService {
    if (!FirestoreService.instance) {
      FirestoreService.instance = new FirestoreService();
    }
    return FirestoreService.instance;
  }

  async createUser(uid: string, displayName: string, email: string) {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        "name": displayName,
        "email": email,
      });
    }
  }

  async getGroups(uid: string) {
    const _collection = collection(db, "groups");
    const _query = query(_collection, where("user_ids", "array-contains", uid));
    const querySnapshot = await getDocs(_query);
    const groups = querySnapshot.docs.map((doc) => doc.data() as Group);
    return groups;
  }

  async getWeeks(groupId: string) {
    const _collection = collection(db, "groups", groupId, "weeks");
    const _query = query(_collection);
    const querySnapshot = await getDocs(_query);
    const weeks = querySnapshot.docs.map((doc) => doc.id);
    return weeks;
  }

  async getEntriesPerWeek(groupId: string, weekId: string) {
    const _collection = collection(db, "groups", groupId, "weeks", weekId);
    const _query = query(_collection);
    const querySnapshot = await getDocs(_query);

    const entries = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            createdAt: data.created_at,
            highlight: data.highlight,
            lowlight: data.lowlight,
            userId: data.user_id,
        } as Entry;
    });

    return entries;
  }
}

export interface Group {
    id: string,
    name: string
}

export interface Entry {
    createdAt: Timestamp,
    highlight: string,
    lowlight: string,
    userId: string,
}

export default FirestoreService;
