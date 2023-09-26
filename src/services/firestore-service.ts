import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  Timestamp,
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

  async deleteEntry(groupId: string, weekId: string, entryId: string) {
    const entryRef = doc(
      db,
      "groups",
      groupId,
      "weeks",
      weekId,
      "entries",
      entryId,
    );
    await deleteDoc(entryRef);
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
    const _query = query(
      _collection,
      where(`members.${uid}.user_id`, "==", uid),
    );
    const querySnapshot = await getDocs(_query);

    const groups = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        name: data.group_name,
        id: doc.id,
      } as Group;
    });

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
    const _collection = collection(
      db,
      "groups",
      groupId,
      "weeks",
      weekId,
      "entries",
    );
    const _query = query(_collection);
    const querySnapshot = await getDocs(_query);

    const entries = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        createdAt: data.created_at,
        highlight: data.highlight,
        lowlight: data.lowlight,
        userId: data.user_id,
      } as Entry;
    });

    return entries;
  }

  async createGroup(uid: string, groupName: string) {
    const groupRef = collection(db, "groups");
    const newGroupRef = doc(groupRef);

    await setDoc(newGroupRef, {
      group_name: groupName,
      members: {
        [uid]: {
          user_id: uid,
          role: "admin",
        },
      },
    });
  }

  async deleteGroup(groupId: string) {
    const groupRef = doc(collection(db, "groups"), groupId);
    await deleteDoc(groupRef);
  }

  async getUser(userId: string) {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        name: data.name,
        email: data.email,
      };
    }

    return null;
  }

  async getLikes(groupId: string, weekId: string, entryId: string) {
    const likesCollection = collection(
      db,
      `groups/${groupId}/weeks/${weekId}/entries/${entryId}/likes`,
    );
    const likesSnapshot = await getDocs(likesCollection);
    const likes = likesSnapshot.docs.map((doc) => doc.data());

    return likes as Like[];
  }

  async getComments(groupId: string, weekId: string, entryId: string) {
    const commentsCollection = collection(
      db,
      `groups/${groupId}/weeks/${weekId}/entries/${entryId}/comments`,
    );
    const commentsSnapshot = await getDocs(commentsCollection);
    const comments = commentsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        created_at: data.created_at.toDate(),
      };
    });

    return comments as Comment[];
  }

  async createComment(
    groupId: string,
    weekId: string,
    entryId: string,
    userId: string,
    text: string,
  ) {
    const comment = {
      user_id: userId,
      text: text,
      created_at: new Date(),
    };

    const commentsCollection = collection(
      db,
      `groups/${groupId}/weeks/${weekId}/entries/${entryId}/comments`,
    );
    await addDoc(commentsCollection, comment);
  }

  async removeComment(
    groupId: string,
    weekId: string,
    entryId: string,
    commentId: string,
  ) {
    const commentsCollection = collection(
      db,
      `groups/${groupId}/weeks/${weekId}/entries/${entryId}/comments`,
    );
    await deleteDoc(doc(commentsCollection, commentId));
  }

  async createLike(
    groupId: string,
    weekId: string,
    entryId: string,
    userId: string,
  ) {
    const like = {
      user_id: userId,
    };

    const likesCollection = collection(
      db,
      `groups/${groupId}/weeks/${weekId}/entries/${entryId}/likes`,
    );
    await addDoc(likesCollection, like);
  }

  async removeLike(
    groupId: string,
    weekId: string,
    entryId: string,
    userId: string,
  ) {
    const likesCollection = collection(
      db,
      `groups/${groupId}/weeks/${weekId}/entries/${entryId}/likes`,
    );
    const likeQuery = query(likesCollection, where("user_id", "==", userId));
    const likeSnapshot = await getDocs(likeQuery);

    if (!likeSnapshot.empty) {
      const likeDoc = likeSnapshot.docs[0];
      await deleteDoc(doc(db, `groups/${groupId}/weeks/${weekId}/entries/${entryId}/likes`, likeDoc.id));
    }
  }


  async userMadeEntryThisWeek(groupId: string, userId: string) {
    // Get the current week
    const now = new Date();
    const startOfCurrentWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay(),
    );
    const startOfLastWeek = new Date(
      startOfCurrentWeek.getTime() - 7 * 24 * 60 * 60 * 1000,
    );

    // Query for the newest week
    const weekCollection = collection(db, `groups/${groupId}/weeks`);
    const weekQuery = query(
      weekCollection,
      orderBy("start_date", "desc"),
      limit(1),
    );
    const weekSnapshot = await getDocs(weekQuery);

    // If no week found or the newest week is not the current week, return false
    if (
      weekSnapshot.empty ||
      weekSnapshot.docs[0].data().start_date.toDate() < startOfLastWeek
    ) {
      return false;
    }

    // If the newest week is the current week, check if there's an entry by the user
    const weekId = weekSnapshot.docs[0].id;
    const entryCollection = collection(
      db,
      `groups/${groupId}/weeks/${weekId}/entries`,
    );
    const entryQuery = query(entryCollection, where("user_id", "==", userId));
    const entrySnapshot = await getDocs(entryQuery);

    // If no entry exists, return false, else return true
    return !entrySnapshot.empty;
  }

  async createEntry(
    groupId: string,
    userId: string,
    highlight: string,
    lowlight: string,
  ) {
    console.log("Creating entry...");
    const entry = {
      user_id: userId,
      highlight,
      lowlight,
      created_at: new Date(),
    };
    console.log("Entry data: ", entry);

    const now = new Date();
    const startOfCurrentWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay(),
    );
    const startOfLastWeek = new Date(
      startOfCurrentWeek.getTime() - 7 * 24 * 60 * 60 * 1000,
    );

    const weekCollection = collection(db, `groups/${groupId}/weeks`);
    const weekQuery = query(
      weekCollection,
      orderBy("start_date", "desc"),
      limit(1),
    );
    const weekSnapshot = await getDocs(weekQuery);
    console.log("Week snapshot: ", weekSnapshot);

    let weekId;
    if (
      weekSnapshot.empty ||
      weekSnapshot.docs[0].data().start_date.toDate() < startOfLastWeek
    ) {
      console.log(
        "No week found or the newest week is not the last week, creating a new week...",
      );
      const newWeekRef = doc(weekCollection);
      weekId = newWeekRef.id;
      await setDoc(newWeekRef, {
        start_date: startOfLastWeek,
        end_date: new Date(
          startOfLastWeek.getFullYear(),
          startOfLastWeek.getMonth(),
          startOfLastWeek.getDate() + 7,
        ),
      });
      console.log("New week created with id: ", weekId);
    } else {
      console.log("The newest week is the last week, using it as weekId...");
      weekId = weekSnapshot.docs[0].id;
      console.log("Week id: ", weekId);
    }

    console.log("Adding entry to the entries collection...");
    const entriesCollection = collection(
      db,
      "groups",
      groupId,
      "weeks",
      weekId,
      "entries",
    );
    await addDoc(entriesCollection, entry);
    console.log("Entry added successfully.");
  }


}

export type Group = {
  id: string;
  name: string;
};

export type Entry = {
  id: string;
  createdAt: Timestamp;
  highlight: string;
  lowlight: string;
  userId: string;
};

export type Comment = {
  user_id: string;
  text: string;
  created_at: Date;
};

export type Like = {
  user_id: string;
};

export type Week = {
  user_id: string;
};

export default FirestoreService;
