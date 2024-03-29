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
  updateDoc,
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

  async createUser(
    uid: string,
    displayName: string,
    email: string,
    photoUrl: string | null,
  ) {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        "name": displayName,
        "email": email,
        "photo_url": photoUrl,
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

    const weeks = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        startDate: data.start_date.toDate(),
        endDate: data.end_date.toDate(),
      } as Week;
    });

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
        photoUrl: data.photo_url,
      };
    }

    return null;
  }

  async updateUserPhotoUrl(userId: string, photoUrl: string) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { photo_url: photoUrl });
  }

  async getLikes(groupId: string, weekId: string, entryId: string) {
    const likesCollection = collection(
      db,
      `groups/${groupId}/weeks/${weekId}/entries/${entryId}/likes`,
    );
    const likesSnapshot = await getDocs(likesCollection);
    const likes = likesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        userId: data.user_id,
      };
    });

    return likes as Like[];
  }

  async addMemberToGroup(groupId: string, email: string) {
    console.log("addMemberToGroup function started");
    const usersCollection = collection(db, "users");
    const userQuery = query(usersCollection, where("email", "==", email));
    const userSnapshot = await getDocs(userQuery);
    const user = userSnapshot.docs[0];
    if (!user) {
      console.log("User not found");
      throw new Error("User not found");
    }
    const userId = user.id;
    console.log(`User found: ${userId}`);

    const groupRef = doc(db, "groups", groupId);
    const groupDoc = await getDoc(groupRef);

    if (groupDoc.exists()) {
      console.log("Group found");
      const groupData = groupDoc.data();
      if (!groupData.members[userId]) {
        groupData.members[userId] = {
          role: "member",
          user_id: userId,
        };
        await updateDoc(groupRef, { members: groupData.members });
        console.log("Member added to group");
      } else {
        throw new Error("Member already exists in the group");
      }
    } else {
      console.log("Group not found");
    }
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
        userId: data.user_id,
        userName: data.user_name,
        text: data.text,
        createdAt: data.created_at.toDate(),
      };
    });

    return comments as Comment[];
  }

  async createComment(
    groupId: string,
    weekId: string,
    entryId: string,
    userId: string,
    userName: string,
    text: string,
  ) {
    const comment = {
      user_id: userId,
      user_name: userName,
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
      await deleteDoc(
        doc(
          db,
          `groups/${groupId}/weeks/${weekId}/entries/${entryId}/likes`,
          likeDoc.id,
        ),
      );
    }
  }

  async userMadeEntryThisWeek(groupId: string, userId: string) {
    // Get the current week
    const now = new Date();
    const startOfCurrentWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1),
    );
    const startOfLastWeek = new Date(
      startOfCurrentWeek.getFullYear(),
      startOfCurrentWeek.getMonth(),
      startOfCurrentWeek.getDate() - 7,
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
      now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1),
      0, 0, 0, 0
    );
    const startOfLastWeek = new Date(
      startOfCurrentWeek.getFullYear(),
      startOfCurrentWeek.getMonth(),
      startOfCurrentWeek.getDate() - 7,
      0, 0, 0, 0
    );
    const endOfLastWeek = new Date(
      startOfLastWeek.getFullYear(),
      startOfLastWeek.getMonth(),
      startOfLastWeek.getDate() + 6,
      23, 59, 59, 999
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
      const newWeekRef = doc(weekCollection);
      weekId = newWeekRef.id;
      await setDoc(newWeekRef, {
        start_date: startOfLastWeek,
        end_date: endOfLastWeek,
      });
      console.log("New week created with id: ", weekId);
    } else {
      weekId = weekSnapshot.docs[0].id;
      console.log("Week id: ", weekId);
    }

    const entriesCollection = collection(
      db,
      "groups",
      groupId,
      "weeks",
      weekId,
      "entries",
    );
    await addDoc(entriesCollection, entry);
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
  userId: string;
  userName: string;
  text: string;
  createdAt: Date;
};

export type Like = {
  userId: string;
};

export type Week = {
  id: string;
  startDate: Date;
  endDate: Date;
};

export default FirestoreService;
