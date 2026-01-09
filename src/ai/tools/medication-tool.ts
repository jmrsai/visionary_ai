
'use server';

/**
 * @fileOverview A Genkit tool for retrieving medication reminder information.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { initializeFirebase } from '@/firebase';


export const getMedicationRemindersTool = ai.defineTool(
  {
    name: 'getMedicationReminders',
    description:
      "Retrieves a list of the user's scheduled medication reminders for a specific user ID. Use this tool when the user asks about their medications, what they need to take, or when their next dose is.",
    inputSchema: z.object({
        userId: z.string().describe("The ID of the user to fetch reminders for.")
    }),
    outputSchema: z.any(),
  },
  async ({ userId }) => {
    try {
      const { firestore } = initializeFirebase();
      const remindersRef = collection(firestore, `users/${userId}/medicationReminders`);
      const q = query(remindersRef, where("type", "in", ["Eye Drops", "Pill", "Capsule", "Liquid"]));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return { reminders: [] };
      }
      
      const reminders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return { reminders };

    } catch (e) {
      console.error("Firebase error in getMedicationRemindersTool:", e);
      return { error: "Failed to fetch reminders from the database." };
    }
  }
);
