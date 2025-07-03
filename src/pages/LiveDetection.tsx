import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { Camera } from "lucide-react";
import { DetectionResult } from "../types";
import { processImageFromCanvas } from "../utils/modelUtils";

interface LiveDetectionProps {
  isModelReady?: boolean;
}

const LiveDetection = ({ isModelReady }: LiveDetectionProps) => {
  const [webcamActive, setWebcamActive] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<DetectionResult[]>([]);
  const [isNonJawCrusherPart, setIsNonJawCrusherPart] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isMobile, setIsMobile] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const CONFIDENCE_THRESHOLD = 0.6;

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
    setIsNonJawCrusherPart(false);
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
        try {
          const results = await processImageFromCanvas(canvas);
          const highestConfidence = Math.max(...results.map((p: any) => p.confidence));
          setIsNonJawCrusherPart(highestConfidence < CONFIDENCE_THRESHOLD);
          setPredictions(results);
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
  }, [webcamActive, facingMode]);

  if (isModelLoading || isModelReady === false) {
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
                  <Webcam
                    key={facingMode + String(webcamActive)}
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      width: 640,
                      height: 480,
                      facingMode: facingMode,
                    }}
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
              <div className="flex flex-col space-y-4">
                <button
                  onClick={handleStopWebcam}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg"
                >
                  Stop Webcam
                </button>
                {isMobile && availableCameras.length > 1 && (
                  <button
                    onClick={handleSwitchCamera}
                    disabled={isModelLoading}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-slate-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg"
                  >
                    {isModelLoading ? "Switching..." : "Switch Camera"}
                  </button>
                )}
              </div>
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