import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { Camera, Settings } from "lucide-react";
import { DetectionResult } from "../types";
import { processImageWithYOLO } from "../utils/modelUtils";
import { logDetectionToSheet } from "../utils/sheetLogger";
import BoundingBoxOverlay from "../components/BoundingBoxOverlay";
import ResultsDisplay from "../components/ResultsDisplay";

interface LiveDetectionProps {
  isModelReady?: boolean;
}

const LiveDetection = ({ isModelReady }: LiveDetectionProps) => {
  const [webcamActive, setWebcamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<DetectionResult[]>([]);
  const [isNonJawCrusherPart, setIsNonJawCrusherPart] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isMobile, setIsMobile] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [lastLoggedPredictions, setLastLoggedPredictions] = useState<Map<string, number>>(new Map());
  const [partCooldowns, setPartCooldowns] = useState<Set<string>>(new Set());
  const [webcamDimensions, setWebcamDimensions] = useState({ width: 640, height: 480 });
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.8); // Dynamic threshold
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(cameras);
      } catch (err) {
        console.error('Error enumerating devices:', err);
      }
    };
    checkCameras();
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(mobile);
  }, []);

  const handleStartWebcam = useCallback(() => {
    setWebcamActive(true);
    setError(null);
  }, []);

  const handleStopWebcam = useCallback(() => {
    setWebcamActive(false);
    setPredictions([]);
    setIsNonJawCrusherPart(false); // Reset to false when stopping webcam
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleSwitchCamera = useCallback(() => {
    if (!isMobile || availableCameras.length < 2 || !webcamActive) return;
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, [isMobile, availableCameras.length, webcamActive]);

  // Main prediction loop using setInterval
  useEffect(() => {
    if (webcamActive && webcamRef.current) {
      intervalRef.current = setInterval(async () => {
        const webcam = webcamRef.current;
        const canvas = canvasRef.current;
        if (!webcam || !canvas) return;
        const video = webcam.video as HTMLVideoElement;
        if (!video || video.readyState !== 4) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Update webcam dimensions
        setWebcamDimensions({ width: video.videoWidth, height: video.videoHeight });
        
        try {
          // Always use YOLO for object detection (best performance)
          // Get all results first to check overall confidence
          const allResults = await processImageWithYOLO(canvas);
          const highestOverallConfidence = allResults.length > 0 ? Math.max(...allResults.map((p: any) => p.confidence)) : 0;
          
          // Filter results by threshold
          let results = allResults.filter((p: any) => p.confidence >= confidenceThreshold);
          
          // If no detections at all, or highest confidence is below threshold, it's not a jaw crusher part
          setIsNonJawCrusherPart(highestOverallConfidence < confidenceThreshold);
          console.log(`Total detections: ${allResults.length}, filtered: ${results.length}, highest confidence: ${highestOverallConfidence.toFixed(3)}, threshold: ${confidenceThreshold}, isNonJaw: ${highestOverallConfidence < confidenceThreshold}`);
          
          setPredictions(results);

          // Log all detected parts above confidence threshold to Google Sheets
          if (results.length > 0) {
            const currentTime = Date.now();
            const COOLDOWN_DURATION = 5000; // 5 seconds cooldown per part
            
            for (const prediction of results) {
              if (prediction.confidence > 0.5) {
                const partKey = prediction.label;
                const lastLoggedTime = lastLoggedPredictions.get(partKey) || 0;
                
                // Check if enough time has passed since last log for this specific part
                if (currentTime - lastLoggedTime >= COOLDOWN_DURATION && 
                    !partCooldowns.has(partKey)) {
                  
                  try {
                    // Send original decimal confidence (e.g., 0.987) - let Google Sheets handle percentage formatting
                    console.log(`Logging webcam detection: ${prediction.label} (confidence: ${prediction.confidence})`);
                    
                    await logDetectionToSheet({
                      part: prediction.label,
                      confidence: prediction.confidence, // Send as decimal, Google Sheets will format as percentage
                      source: 'Webcam'
                    });
                    
                    // Update last logged time for this specific part
                    setLastLoggedPredictions(prev => new Map(prev.set(partKey, currentTime)));
                    setPartCooldowns(prev => new Set(prev.add(partKey)));
                    
                    // Remove from cooldown after duration
                    setTimeout(() => {
                      setPartCooldowns(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(partKey);
                        return newSet;
                      });
                    }, COOLDOWN_DURATION);
                    
                    console.log(`Logged detection: ${prediction.label} with confidence ${(prediction.confidence * 100).toFixed(2)}%`);
                  } catch (error) {
                    console.error('Error logging webcam detection:', error);
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('Prediction error:', error);
        }
      }, 1000);
      
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [webcamActive, facingMode, lastLoggedPredictions, partCooldowns, confidenceThreshold]);

  if (isModelReady === false) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading AI model...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Webcam Feed Section - Full Width */}
      <div className="bg-slate-800 border-2 border-slate-500 rounded-lg shadow-lg">
        <div className="p-6 border-b-2 border-slate-500">
          <h2 className="text-xl font-semibold text-white">Live Webcam Detection</h2>
        </div>
        <div className="p-6">
          {/* Webcam Display */}
          <div className="mb-6">
            {webcamActive ? (
              <div className="relative">
                <Webcam
                  key={facingMode + String(webcamActive)}
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    width: 1280,
                    height: 720,
                    facingMode: facingMode,
                  }}
                  className="w-full h-[500px] object-cover rounded-md border-2 border-slate-400"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Bounding Box Overlay */}
                <BoundingBoxOverlay
                  detections={predictions}
                  containerWidth={1280}
                  containerHeight={500}
                  imageWidth={webcamDimensions.width}
                  imageHeight={webcamDimensions.height}
                  className="rounded-md"
                />
                
                {/* Live Indicator */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>LIVE</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/70 w-full h-[500px] flex items-center justify-center rounded-md border-2 border-slate-500">
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

          {/* Confidence Threshold Control */}
          <div className="mb-6 bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-blue-400" />
                <label className="text-white font-medium">Confidence Threshold</label>
              </div>
              <span className="text-blue-400 font-mono text-sm bg-slate-800 px-2 py-1 rounded">
                {(confidenceThreshold * 100).toFixed(0)}%
              </span>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min="0.3"
                max="0.95"
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-full h-3 bg-slate-600 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #f59e0b ${(confidenceThreshold - 0.3) / 0.65 * 50}%, #ef4444 ${(confidenceThreshold - 0.3) / 0.65 * 100}%, #64748b ${(confidenceThreshold - 0.3) / 0.65 * 100}%, #64748b 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>30% (Sensitive)</span>
                <span>95% (Strict)</span>
              </div>
              <p className="text-xs text-slate-300 mt-2">
                Lower values detect more parts but may include false positives. Higher values are more strict but may miss some parts.
              </p>
              
              {/* Preset Buttons */}
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => setConfidenceThreshold(0.5)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    Math.abs(confidenceThreshold - 0.5) < 0.05 
                      ? 'bg-green-600 text-white' 
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                >
                  Sensitive (50%)
                </button>
                <button
                  onClick={() => setConfidenceThreshold(0.7)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    Math.abs(confidenceThreshold - 0.7) < 0.05 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                >
                  Balanced (70%)
                </button>
                <button
                  onClick={() => setConfidenceThreshold(0.85)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    Math.abs(confidenceThreshold - 0.85) < 0.05 
                      ? 'bg-red-600 text-white' 
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                >
                  Strict (85%)
                </button>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col space-y-4">
            {!webcamActive ? (
              <button
                onClick={handleStartWebcam}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg"
              >
                Start Webcam
              </button>
            ) : (
              <>
                <button
                  onClick={handleStopWebcam}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg"
                >
                  Stop Webcam
                </button>
                {isMobile && availableCameras.length > 1 && (
                  <button
                    onClick={handleSwitchCamera}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg"
                  >
                    Switch Camera
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Predictions Section - Below Webcam */}
      <ResultsDisplay 
        results={predictions}
        isProcessing={webcamActive && predictions.length === 0 && !isNonJawCrusherPart}
        mode="webcam"
        isNonJawCrusherPart={isNonJawCrusherPart && webcamActive}
      />
    </div>
  );
};

export default LiveDetection;
