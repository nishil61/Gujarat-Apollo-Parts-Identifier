import * as tf from '@tensorflow/tfjs';
import { DetectionResult, ModelPrediction } from '../types';

// Global model variable to store the loaded model
let modelPromise: Promise<tf.LayersModel> | null = null;

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

/**
 * Load the TensorFlow.js model from the models directory
 * This will work with models exported from teachablemachine.withgoogle.com
 */
export const loadModel = (): Promise<tf.LayersModel> => {
  if (!modelPromise) {
    modelPromise = (async () => {
      try {
        // Try to load the actual model first
        console.log('Loading model from /models/model.json...');
        const model = await tf.loadLayersModel('/models/model.json');
        console.log('Model loaded successfully!');
        return model;
      } catch (error) {
        console.log('Real model not found, using demo simulation mode');
        // Create a mock model for demonstration
        return createMockModel();
      }
    })();
  }
  return modelPromise;
};

/**
 * Create a mock model for demonstration purposes
 * This simulates the behavior until the real model is added
 */
const createMockModel = (): tf.LayersModel => {
  const input = tf.input({ shape: [224, 224, 3] });
  const flatten = tf.layers.flatten().apply(input);
  const dense = tf.layers.dense({ units: JAW_CRUSHER_PARTS.length, activation: 'softmax' }).apply(flatten);
  
  return tf.model({ inputs: input, outputs: dense as tf.SymbolicTensor });
};

/**
 * Preprocess image for model prediction
 */
const preprocessImage = (imageElement: HTMLImageElement | HTMLCanvasElement): tf.Tensor => {
  return tf.tidy(() => {
    // Convert to tensor
    let tensor = tf.browser.fromPixels(imageElement);
    
    // Resize to model input size (224x224 is standard for Teachable Machine)
    tensor = tf.image.resizeBilinear(tensor, [224, 224]);
    
    // Normalize pixel values to [0, 1]
    tensor = tensor.div(255.0);
    
    // Add batch dimension
    tensor = tensor.expandDims(0);
    
    return tensor;
  });
};

/**
 * Make prediction using the loaded model
 */
const predict = async (preprocessedImage: tf.Tensor): Promise<ModelPrediction[]> => {
  const model = await loadModel();
  
  try {
    // Check if this is our mock model
    if (model.layers.length === 3) {
      // Mock prediction for demonstration
      return generateMockPrediction();
    }
    
    // Real model prediction
    const prediction = model.predict(preprocessedImage) as tf.Tensor;
    const predictions = await prediction.data();
    
    // Convert to array of predictions with labels
    const results: ModelPrediction[] = Array.from(predictions).map((probability, index) => ({
      className: JAW_CRUSHER_PARTS[index] || `Part ${index + 1}`,
      probability
    }));
    
    // Sort by probability (highest first)
    results.sort((a, b) => b.probability - a.probability);
    
    return results;
  } catch (error) {
    console.error('Prediction error:', error);
    return generateMockPrediction();
  }
};

/**
 * Generate mock prediction for demonstration
 */
const generateMockPrediction = (): ModelPrediction[] => {
  const randomPart = JAW_CRUSHER_PARTS[Math.floor(Math.random() * JAW_CRUSHER_PARTS.length)];
  const baseConfidence = 0.65 + Math.random() * 0.3; // Random confidence between 0.65-0.95
  
  const predictions: ModelPrediction[] = JAW_CRUSHER_PARTS.map(label => ({
    className: label,
    probability: label === randomPart ? baseConfidence : Math.random() * 0.35
  }));
  
  // Ensure probabilities sum to 1
  const sum = predictions.reduce((acc, pred) => acc + pred.probability, 0);
  predictions.forEach(pred => pred.probability /= sum);
  
  return predictions.sort((a, b) => b.probability - a.probability);
};

/**
 * Process uploaded image file
 */
export const processImage = async (file: File): Promise<DetectionResult[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = async () => {
      try {
        const preprocessedImage = preprocessImage(img);
        const predictions = await predict(preprocessedImage);
        
        // Clean up tensor memory
        preprocessedImage.dispose();
        
        // Convert to DetectionResult format
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

/**
 * Process image from canvas (for webcam feed)
 */
export const processImageFromCanvas = async (canvas: HTMLCanvasElement): Promise<DetectionResult[]> => {
  try {
    const preprocessedImage = preprocessImage(canvas);
    const predictions = await predict(preprocessedImage);
    
    // Clean up tensor memory
    preprocessedImage.dispose();
    
    // Convert to DetectionResult format, returning all predictions
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

/**
 * Initialize TensorFlow.js backend
 */
export const initializeTensorFlow = async (): Promise<void> => {
  try {
    // Set backend to webgl for better performance
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

// Initialize TensorFlow.js when the module loads
initializeTensorFlow();