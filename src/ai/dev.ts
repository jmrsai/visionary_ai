'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/symptom-checker.ts';
import '@/ai/flows/personalized-eye-workouts.ts';
import '@/ai/flows/ishihara-plate-generator.ts';
import '@/ai/flows/hrr-plate-generator.ts';
import '@/ai/ai-form-feedback.ts';
import '@/ai/flows/chatbot.ts';
import '@/ai/flows/holistic-health-insights.ts';
import '@/ai/flows/redness-irritation-scan.ts';
import '@/ai/tools/symptom-checker-tool.ts';
import '@/ai/tools/medication-tool.ts';
import '@/ai/flows/reading-comprehension-test-generator.ts';
import '@/ai/flows/amsler-grid-generator.ts';
import '@/ai/flows/stereopsis-test-generator.ts';
