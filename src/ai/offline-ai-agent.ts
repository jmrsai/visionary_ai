import * as tf from '@tensorflow/tfjs';

// Define a simple model for demonstration purposes
let model: tf.LayersModel | null = null;

async function loadModel() {
  if (model) {
    return model;
  }

  // Define a simple sequential model: input layer, dense layer, output layer
  model = tf.sequential();
  model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [1] }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' })); // Output between 0 and 1

  // Compile the model
  model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

  // For demonstration, we'll "train" it with some dummy data to make it return
  // 'positive' for longer texts and 'negative' for shorter ones.
  // In a real scenario, this would be a pre-trained model loaded from storage.
  const xs = tf.tensor2d([10, 20, 30, 40, 50, 5, 15, 25, 35, 45], [10, 1]); // Text lengths
  const ys = tf.tensor2d([1, 1, 1, 1, 1, 0, 0, 0, 0, 0], [10, 1]); // 1 for 'positive', 0 for 'negative'

  await model.fit(xs, ys, { epochs: 100, verbose: 0 });

  return model;
}

export async function analyzeTextOffline(text: string): Promise<string> {
  const loadedModel = await loadModel();

  // Convert text length to a tensor
  const inputTensor = tf.tensor2d([text.length], [1, 1]);

  // Make a prediction
  const prediction = loadedModel.predict(inputTensor) as tf.Tensor;
  const predictionValue = (await prediction.data())[0];

  let sentiment = '';
  if (predictionValue > 0.5) {
    sentiment = 'positive';
  } else {
    sentiment = 'negative';
  }

  prediction.dispose(); // Clean up tensor from memory
  inputTensor.dispose(); // Clean up tensor from memory

  return `Offline AI analysis (TensorFlow.js): Text length ${text.length} classified as '${sentiment}' (raw prediction: ${predictionValue.toFixed(4)}).`;
}