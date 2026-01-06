
import { FirebaseApp } from "firebase/app";
import { Auth, User as FirebaseAuthUser } from "firebase/auth";
import { Firestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import type { User } from "@/lib/types";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { getSdks } from "@/firebase";

export const getOrCreateUser = async (firebaseUser: FirebaseAuthUser, interests?: string[]): Promise<User> => {
  const { firestore } = getSdks(firebaseUser.app);
  const userRef = doc(firestore, "users", firebaseUser.uid);
  
  try {
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      const newUser: Omit<User, 'id'> & { id: string } = {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName: firebaseUser.displayName || "Anonymous User",
        photoURL: firebaseUser.photoURL || undefined,
        points: 0,
        interests: interests || []
      };
      
      // Non-blocking write with contextual error handling
      setDoc(userRef, {...newUser, dateJoined: serverTimestamp()}).catch(error => {
          errorEmitter.emit(
              'permission-error',
              new FirestorePermissionError({
                  path: userRef.path,
                  operation: 'create',
                  requestResourceData: newUser,
              })
          );
      });
      
      return newUser as User;
    }
  } catch (error) {
     errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
            path: userRef.path,
            operation: 'get',
        })
    );
    // This will be caught by the global error handler
    throw error;
  }
};

    