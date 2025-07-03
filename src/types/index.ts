export interface DetectionResult {
  label: string;
  confidence: number;
  timestamp: number;
}

export interface ModelPrediction {
  className: string;
  probability: number;
}
