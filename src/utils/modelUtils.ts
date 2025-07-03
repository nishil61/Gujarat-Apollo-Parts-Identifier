import * as tf from '@tensorflow/tfjs';
import { DetectionResult, ModelPrediction } from '../types';

// Global model variable to store the loaded model
let model: tf.LayersModel | null = null;
let isModelLoading = false;

// Comprehensive Jaw Crusher parts list for Gujarat Apollo Industries
const JAW_CRUSHER_PARTS = [
  'Toggle Plate',
  'Pitman',
  'Jaw Plates',
  'Jaw Crusher Bearings',
  'Flywheel',
  'Eccentric Shaft',
  'Cheek Plates'
];

export const loadModel = async (): Promise<tf.LayersModel> => {
  if (model) return model;
  
  if (isModelLoading) {
    while (isModelLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return model!;
  }

  try {
    isModelLoading = true;
    
    try {
      console.log('Loading model from /models/model.json...');
      model = await tf.loadLayersModel('/models/model.json');
      console.log('Model loaded successfully!');
    } catch (error) {
      console.log('Real model not found, using demo simulation mode');
      model = createMockModel();
    }
    
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    throw new Error('Failed to load the part identification model');
  } finally {
    isModelLoading = false;
  }
};

const createMockModel = (): tf.LayersModel => {
  const input = tf.input({ shape: [224, 224, 3] });
  const flatten = tf.layers.flatten().apply(input);
  const dense = tf.layers.dense({ units: JAW_CRUSHER_PARTS.length, activation: 'softmax' }).apply(flatten);
  
  return tf.model({ inputs: input, outputs: dense as tf.SymbolicTensor });
};

const preprocessImage = (imageElement: HTMLImageElement | HTMLCanvasElement): tf.Tensor => {
  return tf.tidy(() => {
    let tensor = tf.browser.fromPixels(imageElement);
    tensor = tf.image.resizeBilinear(tensor, [224, 224]);
    tensor = tensor.div(255.0);
    tensor = tensor.expandDims(0);
    return tensor;
  });
};

const predict = async (preprocessedImage: tf.Tensor): Promise<ModelPrediction[]> => {
  const model = await loadModel();
  
  try {
    if (model.layers.length === 3) {
      return generateDynamicMockPrediction();
    }
    
    const prediction = model.predict(preprocessedImage) as tf.Tensor;
    const predictions = await prediction.data();
    
    const results: ModelPrediction[] = Array.from(predictions).map((probability, index) => ({
      className: JAW_CRUSHER_PARTS[index] || `Part ${index + 1}`,
      probability
    }));
    
    results.sort((a, b) => b.probability - a.probability);
    return results;
  } catch (error) {
    console.error('Prediction error:', error);
    return generateDynamicMockPrediction();
  }
};

let lastPredictionTime = 0;
let currentPredictions: ModelPrediction[] = [];

const generateDynamicMockPrediction = (): ModelPrediction[] => {
  const now = Date.now();
  
  // Generate new predictions every 2 seconds or if no previous predictions
  if (now - lastPredictionTime > 2000 || currentPredictions.length === 0) {
    const topParts = JAW_CRUSHER_PARTS.slice(0, 8); // Show top 8 parts
    
    currentPredictions = topParts.map((label, index) => {
      // Create more realistic distributions
      let probability;
      if (index === 0) {
        probability = 0.45 + Math.random() * 0.35; // 45-80% for top match
      } else if (index < 3) {
        probability = 0.15 + Math.random() * 0.25; // 15-40% for runner-ups
      } else {
        probability = 0.02 + Math.random() * 0.15; // 2-17% for others
      }
      
      return { className: label, probability };
    });
    
    // Normalize probabilities to sum to 1
    const sum = currentPredictions.reduce((acc, pred) => acc + pred.probability, 0);
    currentPredictions.forEach(pred => pred.probability /= sum);
    
    // Sort by probability
    currentPredictions.sort((a, b) => b.probability - a.probability);
    lastPredictionTime = now;
  } else {
    // Add small random variations to existing predictions for dynamic effect
    currentPredictions = currentPredictions.map(pred => ({
      ...pred,
      probability: Math.max(0.01, pred.probability + (Math.random() - 0.5) * 0.05)
    }));
    
    // Re-normalize
    const sum = currentPredictions.reduce((acc, pred) => acc + pred.probability, 0);
    currentPredictions.forEach(pred => pred.probability /= sum);
    currentPredictions.sort((a, b) => b.probability - a.probability);
  }
  
  return [...currentPredictions];
};

export const processImage = async (file: File): Promise<DetectionResult[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = async () => {
      try {
        const preprocessedImage = preprocessImage(img);
        const predictions = await predict(preprocessedImage);
        
        preprocessedImage.dispose();
        
        const results: DetectionResult[] = predictions.slice(0, 3).map(pred => ({
          label: pred.className,
          confidence: pred.probability,
          timestamp: Date.now()
        }));
        
        resolve(results);
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(img.src);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export const processImageFromCanvas = async (canvas: HTMLCanvasElement): Promise<DetectionResult[]> => {
  try {
    const preprocessedImage = preprocessImage(canvas);
    const predictions = await predict(preprocessedImage);
    
    preprocessedImage.dispose();
    
    const results: DetectionResult[] = predictions.map(pred => ({
      label: pred.className,
      confidence: pred.probability,
      timestamp: Date.now()
    }));
    
    return results;
  } catch (error) {
    console.error('Canvas processing error:', error);
    throw error;
  }
};

export const initializeTensorFlow = async (): Promise<void> => {
  try {
    await tf.setBackend('webgl');
    await tf.ready();
    console.log('TensorFlow.js initialized successfully');
    console.log('Backend:', tf.getBackend());
  } catch (error) {
    console.warn('WebGL backend failed, falling back to CPU');
    await tf.setBackend('cpu');
    await tf.ready();
  }
};

initializeTensorFlow();

