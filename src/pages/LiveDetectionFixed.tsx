import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { loadModel } from '../utils/modelUtils';

interface PredictionResult {
  className: string;
  probability: number;
}

const LiveDetection: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<any>(null);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const loadTensorFlowModel = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      console.log('Loading model for webcam...');
      const loadedModel = await loadModel();
      setModel(loadedModel);
      console.log('Model loaded successfully for webcam!');
    } catch (error) {
      console.error('Model loading error for webcam:', error);
      setError('Failed to load the part identification model');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTensorFlowModel();
  }, [loadTensorFlowModel]);

  const detect = useCallback(async () => {
    if (
      model &&
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4 &&
      canvasRef.current &&
      !isDetecting
    ) {
      setIsDetecting(true);
      try {
        const video = webcamRef.current.video;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const predictions = await model.predict(canvas);
          const formattedPredictions: PredictionResult[] = predictions.map((prediction: any) => ({
            className: prediction.className,
            probability: prediction.probability
          }));

          setPredictions(formattedPredictions);
        }
      } catch (error) {
        console.error('Error during detection:', error);
        setError('Error during part detection');
      } finally {
        setIsDetecting(false);
      }
    }
  }, [model, isDetecting]);

  useEffect(() => {
    if (!isLoading && model) {
      const interval = setInterval(detect, 1000);
      return () => clearInterval(interval);
    }
  }, [detect, isLoading, model]);

  const getTopPrediction = () => {
    if (predictions.length === 0) return null;
    return predictions.reduce((prev, current) => 
      (prev.probability > current.probability) ? prev : current
    );
  };

  const topPrediction = getTopPrediction();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading AI model...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <p className="text-xl mb-4">Error: {error}</p>
          <button 
            onClick={loadTensorFlowModel}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Live Parts Detection</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Live Camera Feed</h2>
            <div className="relative">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full rounded-lg"
                videoConstraints={{
                  width: 640,
                  height: 480,
                  facingMode: "user"
                }}
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Detection Results</h2>
            
            {topPrediction && topPrediction.probability > 0.1 ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-green-800">
                    Detected Part: {topPrediction.className}
                  </h3>
                  <p className="text-green-600">
                    Confidence: {(topPrediction.probability * 100).toFixed(1)}%
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">All Predictions:</h4>
                  {predictions
                    .sort((a, b) => b.probability - a.probability)
                    .slice(0, 3)
                    .map((prediction, index) => (
                      <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                        <span>{prediction.className}</span>
                        <span className="font-mono text-sm">
                          {(prediction.probability * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Point camera at a part to begin detection...</p>
                <div className="mt-4">
                  <div className="animate-pulse inline-block w-3 h-3 bg-blue-500 rounded-full mx-1"></div>
                  <div className="animate-pulse inline-block w-3 h-3 bg-blue-500 rounded-full mx-1" style={{animationDelay: '0.2s'}}></div>
                  <div className="animate-pulse inline-block w-3 h-3 bg-blue-500 rounded-full mx-1" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDetection;