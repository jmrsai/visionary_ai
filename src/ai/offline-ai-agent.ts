import * as tf from '@tensorflow/tfjs';

/**
 * Offline AI Agent: Game Difficulty Recommender
 * Uses a small neural network to recommend the next game's difficulty
 * based on the user's performance in previous sessions.
 */

// Model architecture: 2 inputs (score, duration_seconds) -> 8 hidden -> 1 output (difficulty 1-10)
let recommenderModel: tf.Sequential | null = null;

async function createModel() {
  const m = tf.sequential();
  m.add(tf.layers.dense({ inputShape: [2], units: 8, activation: 'relu' }));
  m.add(tf.layers.dense({ units: 4, activation: 'relu' }));
  m.add(tf.layers.dense({ units: 1, activation: 'linear' }));

  m.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'meanSquaredError'
  });

  return m;
}

export async function trainRecommender(data: { score: number, duration: number, difficultyReached: number }[]) {
  if (!recommenderModel) recommenderModel = await createModel();

  const xs = tf.tensor2d(data.map(d => [d.score, d.duration]));
  const ys = tf.tensor2d(data.map(d => [d.difficultyReached]));

  await recommenderModel.fit(xs, ys, {
    epochs: 50,
    verbose: 0
  });

  xs.dispose();
  ys.dispose();
}

export async function recommendDifficulty(currentScore: number, currentDuration: number): Promise<number> {
  if (!recommenderModel) {
    // Initial heuristic if no model is trained
    return Math.min(10, Math.max(1, Math.floor(currentScore / 100) + 1));
  }

  const input = tf.tensor2d([[currentScore, currentDuration]]);
  const prediction = recommenderModel.predict(input) as tf.Tensor;
  const result = await prediction.data();

  input.dispose();
  prediction.dispose();

  // Return clamped value between 1 and 10
  return Math.min(10, Math.max(1, Math.round(result[0])));
}

// Mock initial training on export (wrapped in a safer check if needed for the environment)
if (typeof window !== 'undefined') {
  (async () => {
    try {
      const initialData = [
        { score: 10, duration: 10, difficultyReached: 1 },
        { score: 100, duration: 60, difficultyReached: 3 },
        { score: 500, duration: 120, difficultyReached: 7 },
        { score: 1000, duration: 180, difficultyReached: 9 }
      ];
      await trainRecommender(initialData);
    } catch (e) {
      console.warn('TF.js initialization skipped or failed:', e);
    }
  })();
}
