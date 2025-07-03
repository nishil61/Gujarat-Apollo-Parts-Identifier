import * as tf from '@tensorflow/tfjs';
import * as tmImage from "@teachablemachine/image";
import { DetectionResult } from '../types';

// --- HMR-safe global state for the model ---
interface GlobalWithModel {
  gapi_tm_model?: tmImage.CustomMobileNet | null;
  gapi_tm_model_promise?: Promise<tmImage.CustomMobileNet | null> | null;
}
const globalWithModel = globalThis as GlobalWithModel;
// ---

const MODEL_URL = "/models/model.json";
const METADATA_URL = "/models/metadata.json";

/**
 * Load the Teachable Machine model, ensuring it's only loaded once.
 */
export const loadTeachableMachineModel = (): Promise<tmImage.CustomMobileNet | null> => {
  // If the model is already loaded, return it.
  if (globalWithModel.gapi_tm_model) {
    return Promise.resolve(globalWithModel.gapi_tm_model);
  }
  // If the model is currently loading, return the existing promise.
  if (globalWithModel.gapi_tm_model_promise) {
    return globalWithModel.gapi_tm_model_promise;
  }

  // Start loading the model and store the promise.
  console.log("Loading Teachable Machine model centrally...");
  globalWithModel.gapi_tm_model_promise = (async () => {
    try {
      const model = await tmImage.load(MODEL_URL, METADATA_URL);
      console.log("Central model loaded successfully!");
      globalWithModel.gapi_tm_model = model;
      return model;
    } catch (error) {
      console.error("Failed to load Teachable Machine model:", error);
      // Set to null on failure so we can retry if needed.
      globalWithModel.gapi_tm_model_promise = null; 
      return null;
    }
  })();
  
  return globalWithModel.gapi_tm_model_promise;
};


/**
 * Process image from canvas (for webcam feed) using the shared model
 */
export const processImageFromCanvas = async (canvas: HTMLCanvasElement): Promise<DetectionResult[]> => {
  const model = await loadTeachableMachineModel();
  if (!model) {
    throw new Error("Model is not available for prediction.");
  }

  try {
    const predictions = await model.predict(canvas);
    
    const results: DetectionResult[] = predictions.map(pred => ({
      label: pred.className,
      confidence: pred.probability,
      timestamp: Date.now()
    }));
    
    results.sort((a, b) => b.confidence - a.confidence);
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