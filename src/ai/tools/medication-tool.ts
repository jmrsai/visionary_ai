'use server';

/**
 * @fileOverview A Genkit tool for retrieving medication reminder information.
 */

import {ai} from '@/ai/genkit';
import {MOCK_REMINDERS} from '@/lib/data';
import {z} from 'zod';

export const getMedicationRemindersTool = ai.defineTool(
  {
    name: 'getMedicationReminders',
    description:
      "Retrieves a list of the user's scheduled medication reminders. Use this tool when the user asks about their medications, what they need to take, or when their next dose is.",
    inputSchema: z.object({}),
    outputSchema: z.any(),
  },
  async () => {
    // In a real app, this would fetch data from a database.
    // For now, we return the mock data.
    const medicationReminders = MOCK_REMINDERS.filter(r => ["Eye Drops", "Pill", "Capsule", "Liquid"].includes(r.type));
    return {
        reminders: medicationReminders,
    }
  }
);
