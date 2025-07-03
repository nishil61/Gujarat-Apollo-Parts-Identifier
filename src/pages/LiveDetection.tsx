import { useState, useRef, useCallback, useEffect } from "react";
import { Camera } from "lucide-react";
import { DetectionResult } from "../types";

const LiveDetection = () => {
  const [webcamActive, setWebcamActive] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<DetectionResult[]>([]);
  const [isNonJawCrusherPart, setIsNonJawCrusherPart] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isPredicting = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Confidence threshold for determining if it's a jaw crusher part
  const CONFIDENCE_THRESHOLD = 0.6;

  // Load the model using centralized utility
  const loadModel = useCallback(async () => {
    setIsModelLoading(true);
    try {
      // Use the model loading function from local utils
      const modelUtils = await import('../utils/modelUtils');
      await modelUtils.loadModel();
      console.log("Model ready for webcam detection!");
      setError(null);
    } catch (err) {
      console.error("Model loading error for webcam:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to load model: ${errorMessage}`);
    } finally {
      setIsModelLoading(false);
    }
  }, []);

  // Start and stop webcam logic
  const handleStartWebcam = useCallback(async () => {
    setError(null);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
        setWebcamActive(true);
      } catch (err: any) {
        console.error("Error accessing webcam:", err);
        let message = "An error occurred while accessing the webcam.";
        if (err.name === "NotAllowedError") {
          message = "Webcam access was denied. Please allow camera access in your browser settings.";
        } else if (err.name === "NotFoundError") {
          message = "No webcam found. Please ensure a camera is connected and enabled.";
        }
        setError(message);
        setWebcamActive(false);
      }
    } else {
      setError("Your browser does not support webcam access.");
      setWebcamActive(false);
    }
  }, []);

  const handleStopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setWebcamActive(false);
    setPredictions([]); // Clear predictions
    setIsNonJawCrusherPart(false); // Reset non-part detection
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    isPredicting.current = false;
  }, []);

  // Main prediction loop controlled by useEffect
  useEffect(() => {
    const predictLoop = async () => {
      if (!webcamActive || !videoRef.current || isPredicting.current) {
        requestRef.current = requestAnimationFrame(predictLoop);
        return;
      }

      isPredicting.current = true;

      try {
        const modelUtils = await import('../utils/modelUtils');
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas?.getContext('2d');

        if (ctx && video && video.readyState === 4) {
          if (canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);
            
            const prediction = await modelUtils.predict(canvas);
            
            const highestConfidence = Math.max(...prediction.map((p: any) => p.probability));
            setIsNonJawCrusherPart(highestConfidence < CONFIDENCE_THRESHOLD);
            
            const formattedPredictions = prediction.map((p: any) => ({
              label: p.className,
              confidence: p.probability,
            }));
            setPredictions(formattedPredictions);
          }
        }
      } catch (error) {
        console.error('Prediction error:', error);
      } finally {
        isPredicting.current = false;
      }

      requestRef.current = requestAnimationFrame(predictLoop);
    };

    if (webcamActive) {
      requestRef.current = requestAnimationFrame(predictLoop);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [webcamActive]);

  // Attaches the stream to the video element when the webcam becomes active
  useEffect(() => {
    if (webcamActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [webcamActive]);

  useEffect(() => {
    loadModel(); // Load model on component mount
    // Stop webcam on component unmount
    return () => {
      handleStopWebcam();
    };
  }, [handleStopWebcam, loadModel]);

  return (
    <div className="p-4 grid md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <div className="bg-slate-800 border-2 border-slate-500 rounded-lg shadow-lg">
          <div className="p-6 border-b-2 border-slate-500">
            <h2 className="text-xl font-semibold text-white">Webcam Feed</h2>
          </div>
          <div className="p-6">
            <div className="mb-4">
              {webcamActive ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-96 object-cover rounded-md border-2 border-slate-400"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>LIVE</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/70 w-full h-96 flex items-center justify-center rounded-md border-2 border-slate-500">
                  <div className="text-center">
                    {error ? (
                      <p className="text-red-400 max-w-xs text-lg font-medium">{error}</p>
                    ) : (
                      <>
                        <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-white text-lg font-medium mb-2">
                          Webcam feed inactive
                        </p>
                        <p className="text-slate-300 text-base">
                          Start the webcam to begin live part detection
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-slate-800 border-2 border-slate-500 rounded-lg shadow-lg">
          <div className="p-6 border-b-2 border-slate-500">
            <h2 className="text-xl font-semibold text-white">Actions</h2>
          </div>
          <div className="p-6">
            {!webcamActive ? (
              <button
                onClick={handleStartWebcam}
                disabled={isModelLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg"
              >
                {isModelLoading ? "Loading Model..." : "Start Webcam"}
              </button>
            ) : (
              <button
                onClick={handleStopWebcam}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg"
              >
                Stop Webcam
              </button>
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="bg-slate-800 border-2 border-slate-500 rounded-lg shadow-lg">
          <div className="p-6 border-b-2 border-slate-500">
            <h2 className="text-xl font-semibold text-white">Predictions</h2>
          </div>
          <div className="p-6">
            {isNonJawCrusherPart ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-400 text-2xl">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-red-400 mb-2">
                  Not a Jaw Crusher Part
                </h3>
                <p className="text-slate-300">
                  The object in view is not recognized as a jaw crusher component.
                </p>
              </div>
            ) : predictions.length > 0 ? (
              <div className="space-y-4">
                {predictions.map((p, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{p.label}</span>
                      <span className="font-mono text-sm text-slate-300">
                        {(p.confidence * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${
                          p.confidence > 0.7 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                            : p.confidence > 0.4 
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-600' 
                            : 'bg-gradient-to-r from-red-500 to-red-600'
                        }`}
                        style={{ width: `${p.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-300 text-center">
                No predictions yet. Start the webcam to see live results.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDetection;