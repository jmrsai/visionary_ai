
import { doc, runTransaction, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/firebase/config"; // Assuming you have a client-side firebase config
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import type { ActivityLog } from "./types";
import { getFirestore } from "firebase/firestore";

const POINTS_PER_EXERCISE = 10;
const POINTS_PER_TEST = 5;
const POINTS_PER_CHECKUP = 50;

export const awardPointsForActivity = async (userId: string, activityType: ActivityLog['activityType'], activityName: string) => {
    const db = getFirestore();
    const userRef = doc(db, "users", userId);
    const rewardsLogRef = collection(db, `users/${userId}/rewards`);

    let pointsToAward = 0;
    switch (activityType) {
        case 'completed_exercise':
            pointsToAward = POINTS_PER_EXERCISE;
            break;
        case 'completed_test':
            pointsToAward = activityName === 'Comprehensive Check-up' ? POINTS_PER_CHECKUP : POINTS_PER_TEST;
            break;
    }

    try {
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) {
                throw "User document does not exist!";
            }
            const currentPoints = userDoc.data().points || 0;
            const newPoints = currentPoints + pointsToAward;
            transaction.update(userRef, { points: newPoints });

            const newActivityLog: Omit<ActivityLog, 'id'> = {
                activityType,
                activityName,
                pointsEarned: pointsToAward,
                timestamp: serverTimestamp() as any,
            };
            
            // This is a non-blocking write, so we don't await it in the transaction
            addDocumentNonBlocking(rewardsLogRef, newActivityLog);
        });

    } catch (e) {
        console.error("Transaction failed: ", e);
    }
};
