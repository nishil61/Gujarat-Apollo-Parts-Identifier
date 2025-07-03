import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';

// Global variables to store models and prevent re-registration
let globalModel: tmImage.CustomMobileNet | null = null;
let globalMetadata: any = null;
let isModelLoading = false;

// Initialize TensorFlow.js with backend configuration
const initializeTensorFlow = async () => {
  try {
    // Only set backend if not already set
    if (tf.getBackend() !== 'webgl') {
      await tf.setBackend('webgl');
    }
    await tf.ready();
    console.log('TensorFlow.js initialized successfully');
    console.log('Backend:', tf.getBackend());
  } catch (error) {
    console.warn('WebGL backend failed, falling back to CPU:', error);
    await tf.setBackend('cpu');
    await tf.ready();
    console.log('TensorFlow.js initialized with CPU backend');
  }
};

// Load the model with proper error handling and singleton pattern
export const loadModel = async (): Promise<tmImage.CustomMobileNet | null> => {
  // Return existing model if already loaded
  if (globalModel && globalMetadata) {
    console.log('Using existing loaded model');
    return globalModel;
  }

  // Prevent multiple simultaneous loading attempts
  if (isModelLoading) {
    console.log('Model loading already in progress, waiting...');
    // Wait for existing loading to complete
    while (isModelLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return globalModel;
  }

  isModelLoading = true;

  try {
    // Initialize TensorFlow.js first
    await initializeTensorFlow();

    const modelURL = '/models/model.json';
    const metadataURL = '/models/metadata.json';
    
    console.log('Loading model from', modelURL, '...');

    // Check if model files exist
    try {
      const modelResponse = await fetch(modelURL);
      const metadataResponse = await fetch(metadataURL);
      
      if (!modelResponse.ok || !metadataResponse.ok) {
        throw new Error('Model files not found');
      }
    } catch (error) {
      console.log('Real model not found, using demo simulation mode');
      isModelLoading = false;
      throw new Error('Failed to load the part identification model');
    }

    // Dispose any existing models to prevent variable conflicts
    if (globalModel) {
      globalModel.dispose();
      globalModel = null;
    }

    // Clear any existing TensorFlow variables
    tf.disposeVariables();

    // Load the model
    globalModel = await tmImage.load(modelURL, metadataURL);
    
    // Load metadata separately for reference
    const metadataResponse = await fetch(metadataURL);
    globalMetadata = await metadataResponse.json();
    
    console.log('Model loaded successfully!');
    console.log('Available classes:', globalMetadata.labels);
    
    isModelLoading = false;
    return globalModel;
    
  } catch (error) {
    isModelLoading = false;
    console.error('Error loading model:', error);
    throw error;
  }
};

// Predict function with proper error handling
export const predict = async (imageElement: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement): Promise<any[]> => {
  if (!globalModel) {
    throw new Error('Model not loaded. Please load the model first.');
  }

  try {
    const predictions = await globalModel.predict(imageElement);
    return predictions;
  } catch (error) {
    console.error('Error during prediction:', error);
    throw error;
  }
};

// Clean up resources
export const disposeModel = () => {
  if (globalModel) {
    globalModel.dispose();
    globalModel = null;
    globalMetadata = null;
    console.log('Model disposed successfully');
  }
};

// Get class labels
export const getClassLabels = (): string[] => {
  if (!globalMetadata || !globalMetadata.labels) {
    return ['Cheek Plates', 'Eccentric Shaft', 'Flywheel', 'Jaw Crusher Bearings', 'Jaw Plates', 'Pitman', 'Toggle Plate'];
  }
  return globalMetadata.labels;
};

