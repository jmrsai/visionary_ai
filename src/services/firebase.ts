import { db } from "@/lib/firebase";
import { User as FirebaseAuthUser } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import type { User } from "@/lib/types";

export const getOrCreateUser = async (firebaseUser: FirebaseAuthUser): Promise<User> => {
  const userRef = doc(db, "users", firebaseUser.uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data() as User;
  } else {
    const newUser: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      displayName: firebaseUser.displayName || "Anonymous User",
      createdAt: serverTimestamp(),
    };
    await setDoc(userRef, newUser);
    return newUser;
  }
};
