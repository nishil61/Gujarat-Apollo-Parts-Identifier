export interface DetectionResult {
  label: string;
  confidence: number;
  timestamp: number;
  bbox?: BoundingBox; // Optional for object detection
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ModelPrediction {
  className: string;
  probability: number;
}

export interface ObjectDetection {
  label: string;
  confidence: number;
  bbox: BoundingBox;
}

export interface YOLODetection {
  label: string;
  confidence: number;
  bbox: BoundingBox;
  class_id: number;
}

export interface YOLOOutput {
  detections: YOLODetection[];
  modelWidth: number;
  modelHeight: number;
}