'use client';

import { useState } from 'react';
import { holisticHealthInsights } from '@/ai/flows/holistic-health-insights';

export default function HolisticInsightsPage() {
  const [userInput, setUserInput] = useState('');
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setInsight('');

    // Mock data for screen time and symptoms
    const screenTimeData = JSON.stringify([
      { day: 'Mon', hours: 8 },
      { day: 'Tue', hours: 7 },
      { day: 'Wed', hours: 9 },
      { day: 'Thu', hours: 6 },
      { day: 'Fri', hours: 8 },
      { day: 'Sat', hours: 5 },
      { day: 'Sun', hours: 4 },
    ]);

    const symptomReports = JSON.stringify([
      { day: 'Wed', symptom: 'dry eyes' },
      { day: 'Fri', symptom: 'eye strain' },
    ]);

    try {
      const result = await holisticHealthInsights({
        screenTimeData,
        symptomReports,
        userInputText: userInput,
      });
      setInsight(result.insight);
    } catch (error) {
      console.error('Error getting insights:', error);
      setInsight('Failed to get insights. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Holistic Health Insights</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border rounded"
          rows={5}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter any additional health notes, feelings, or observations..."
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Getting Insights...' : 'Get Holistic Insights'}
        </button>
      </form>

      {insight && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h2 className="text-xl font-semibold">Your Insight</h2>
          <p className="whitespace-pre-wrap">{insight}</p>
        </div>
      )}
    </div>
  );
}
