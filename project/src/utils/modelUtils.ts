import * as tf from '@tensorflow/tfjs';
import * as tmImage from "@teachablemachine/image";
import { DetectionResult, YOLODetection } from '../types';
import { roboflowService } from '../services/roboflowService';

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
 * Simulate multiple object detection by dividing image into grid sections
 * This is a workaround since Teachable Machine doesn't support true object detection
 */
export const detectMultipleObjects = async (canvas: HTMLCanvasElement): Promise<DetectionResult[]> => {
  const model = await loadTeachableMachineModel();
  if (!model) {
    throw new Error("Model is not available for prediction.");
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error("Cannot get canvas context");
  }

  const detections: DetectionResult[] = [];
  const gridSize = 3; // 3x3 grid for better coverage
  const stepX = canvas.width / gridSize;
  const stepY = canvas.height / gridSize;
  const overlapFactor = 0.3; // 30% overlap between sections

  try {
    // Process overlapping sections to catch parts at boundaries
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = Math.max(0, col * stepX - stepX * overlapFactor);
        const y = Math.max(0, row * stepY - stepY * overlapFactor);
        const width = Math.min(stepX * (1 + overlapFactor), canvas.width - x);
        const height = Math.min(stepY * (1 + overlapFactor), canvas.height - y);

        // Create section canvas
        const sectionCanvas = document.createElement('canvas');
        const sectionCtx = sectionCanvas.getContext('2d');
        if (!sectionCtx) continue;

        sectionCanvas.width = width;
        sectionCanvas.height = height;

        // Draw section of original image
        sectionCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);

        // Predict on section
        const predictions = await model.predict(sectionCanvas);
        
        // Filter high-confidence predictions
        const highConfidencePredictions = predictions.filter(pred => pred.probability > 0.7);
        
        for (const pred of highConfidencePredictions) {
          detections.push({
            label: pred.className,
            confidence: pred.probability,
            timestamp: Date.now(),
            bbox: {
              x: x,
              y: y,
              width: width,
              height: height
            }
          });
        }
      }
    }

    // Also analyze the full image
    const fullImagePredictions = await model.predict(canvas);
    const highConfidenceFullImage = fullImagePredictions.filter(pred => pred.probability > 0.6);
    
    for (const pred of highConfidenceFullImage) {
      detections.push({
        label: pred.className,
        confidence: pred.probability,
        timestamp: Date.now()
      });
    }

    // Remove duplicate detections and sort by confidence
    const uniqueDetections = removeDuplicateDetections(detections);
    return uniqueDetections.sort((a, b) => b.confidence - a.confidence);

  } catch (error) {
    console.error('Multiple object detection error:', error);
    throw error;
  }
};

/**
 * Remove duplicate detections based on label and confidence similarity
 */
const removeDuplicateDetections = (detections: DetectionResult[]): DetectionResult[] => {
  const unique: DetectionResult[] = [];
  const confidenceThreshold = 0.1; // Consider detections with confidence within 10% as duplicates

  for (const detection of detections) {
    const isDuplicate = unique.some(existing => 
      existing.label === detection.label && 
      Math.abs(existing.confidence - detection.confidence) < confidenceThreshold
    );

    if (!isDuplicate) {
      unique.push(detection);
    }
  }

  return unique;
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

/**
 * Process image using Roboflow YOLO for true object detection with bounding boxes
 */
export const processImageWithYOLO = async (canvas: HTMLCanvasElement): Promise<DetectionResult[]> => {
  try {
    console.log('Processing image with Roboflow YOLO...');
    const yoloOutput = await roboflowService.detectFromCanvas(canvas, 0.8);
    
    const results: DetectionResult[] = yoloOutput.detections.map((detection: YOLODetection) => ({
      label: detection.label,
      confidence: detection.confidence,
      timestamp: Date.now(),
      bbox: detection.bbox
    }));
    
    console.log(`YOLO detected ${results.length} objects:`, results);
    return results.sort((a, b) => b.confidence - a.confidence);
  } catch (error) {
    console.error('YOLO processing error:', error);
    // Fallback to Teachable Machine if YOLO fails
    console.log('Falling back to Teachable Machine classification...');
    return processImageFromCanvas(canvas);
  }
};

/**
 * Process uploaded image file with Roboflow YOLO
 */
export const processUploadedImageWithYOLO = async (imageFile: File): Promise<DetectionResult[]> => {
  try {
    console.log('Processing uploaded image with Roboflow YOLO...');
    const yoloOutput = await roboflowService.detectObjects(imageFile);
    
    const results: DetectionResult[] = yoloOutput.detections.map((detection: YOLODetection) => ({
      label: detection.label,
      confidence: detection.confidence,
      timestamp: Date.now(),
      bbox: detection.bbox
    }));
    
    console.log(`YOLO detected ${results.length} objects in uploaded image:`, results);
    return results.sort((a, b) => b.confidence - a.confidence);
  } catch (error) {
    console.error('YOLO upload processing error:', error);
    throw error;
  }
};

/**
 * Test Roboflow connection
 */
export const testRoboflowConnection = async (): Promise<boolean> => {
  try {
    return await roboflowService.testConnection();
  } catch (error) {
    console.error('Failed to test Roboflow connection:', error);
    return false;
  }
};