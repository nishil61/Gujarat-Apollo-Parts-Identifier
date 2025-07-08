import { YOLOOutput, YOLODetection } from '../types';

const API_KEY = "k0YqQQHbnNVdI9tnKzL6";
const MODEL_URL = "jaw-crusher-parts-identification/3";
const ROBOFLOW_API_URL = `https://detect.roboflow.com/${MODEL_URL}`;

interface RoboflowPrediction {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: string;
  class_id: number;
}

interface RoboflowResponse {
  predictions: RoboflowPrediction[];
  image: {
    width: number;
    height: number;
  };
}

export class RoboflowService {
  /**
   * Detect objects using the Roboflow YOLO model
   */
  async detectObjects(imageFile: File | Blob): Promise<YOLOOutput> {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const response = await fetch(`${ROBOFLOW_API_URL}?api_key=${API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Roboflow API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: RoboflowResponse = await response.json();
      
      return this.parseRoboflowResponse(data);
    } catch (error) {
      console.error('Error detecting objects with Roboflow:', error);
      throw error;
    }
  }

  /**
   * Detect objects from a canvas element
   */
  async detectFromCanvas(canvas: HTMLCanvasElement, quality: number = 0.8): Promise<YOLOOutput> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          reject(new Error('Failed to convert canvas to blob'));
          return;
        }
        
        try {
          const result = await this.detectObjects(blob);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, 'image/jpeg', quality);
    });
  }

  /**
   * Detect objects from an image element
   */
  async detectFromImageElement(imageElement: HTMLImageElement): Promise<YOLOOutput> {
    // Create a canvas to convert the image to blob
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    ctx.drawImage(imageElement, 0, 0);

    return this.detectFromCanvas(canvas);
  }

  /**
   * Parse the Roboflow API response into our standard format
   */
  private parseRoboflowResponse(data: RoboflowResponse): YOLOOutput {
    const detections: YOLODetection[] = data.predictions?.map((pred: RoboflowPrediction) => ({
      label: pred.class,
      confidence: pred.confidence,
      bbox: {
        x: pred.x - pred.width / 2,  // Roboflow returns center coordinates
        y: pred.y - pred.height / 2,
        width: pred.width,
        height: pred.height,
      },
      class_id: pred.class_id || 0,
    })) || [];

    return {
      detections,
      modelWidth: data.image?.width || 640,
      modelHeight: data.image?.height || 640,
    };
  }

  /**
   * Test the connection to Roboflow API
   */
  async testConnection(): Promise<boolean> {
    try {
      // Create a small test canvas
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 100, 100);
      }

      await this.detectFromCanvas(canvas);
      return true;
    } catch (error) {
      console.error('Roboflow connection test failed:', error);
      return false;
    }
  }
}

// Create a singleton instance
export const roboflowService = new RoboflowService();
