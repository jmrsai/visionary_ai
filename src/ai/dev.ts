import { config } from 'dotenv';
config();

import '@/ai/flows/symptom-checker.ts';
import '@/ai/flows/personalized-eye-workouts.ts';
import '@/ai/flows/ishihara-plate-generator.ts';
import '@/ai/flows/hrr-plate-generator.ts';
