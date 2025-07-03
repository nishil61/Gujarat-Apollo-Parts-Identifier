import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Video, VideoOff, Loader, AlertCircle, RotateCcw } from 'lucide-react';
import { DetectionResult } from '../types';
import { processImageFromCanvas } from '../utils/modelUtils';

interface WebcamFeedProps {
  onResults: (results: DetectionResult[]) => void;
  onProcessingChange: (processing: boolean) => void;
}

const WebcamFeed: React.FC<WebcamFeedProps> = ({ onResults, onProcessingChange }) => {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check for available cameras on component mount
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
  }, []);

  const startWebcam = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: facingMode
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        await videoRef.current.play();
        
        setIsActive(true);
        
        // Start processing frames every 2 seconds
        intervalRef.current = setInterval(processFrame, 2000);
      }
    } catch (err) {
      setError('Failed to access webcam. Please check your permissions and try again.');
      console.error('Webcam access error:', err);
      setIsActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    onProcessingChange(false);
  };

  const switchCamera = async () => {
    if (availableCameras.length > 1) {
      const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
      setFacingMode(newFacingMode);
      
      if (isActive) {
        stopWebcam();
        // Small delay to ensure cleanup
        setTimeout(() => {
          startWebcam();
        }, 500);
      }
    }
  };

  const processFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isActive) return;

    onProcessingChange(true);
    
    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        const results = await processImageFromCanvas(canvas);
        onResults(results);
      }
    } catch (err) {
      console.error('Frame processing error:', err);
    } finally {
      onProcessingChange(false);
    }
  }, [isActive, onResults, onProcessingChange]);

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-lg">
            <Camera className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">Live Webcam Feed</h3>
        </div>
        
        {isMobile && availableCameras.length > 1 && (
          <button
            onClick={switchCamera}
            disabled={isLoading}
            className="flex items-center space-x-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm">Switch</span>
          </button>
        )}
      </div>

      <div className="relative bg-slate-900 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-64 object-cover"
          style={{ display: isActive ? 'block' : 'none' }}
        />
        {!isActive && (
          <div className="w-full h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-slate-700/50 rounded-full mx-auto mb-4">
                <Video className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-300 mb-2">Webcam feed inactive</p>
              <p className="text-slate-500 text-sm">
                Start the webcam to begin live part detection
              </p>
            </div>
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
        
        {isActive && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={isActive ? stopWebcam : startWebcam}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
            isActive
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
          } disabled:opacity-50`}
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : isActive ? (
            <VideoOff className="w-5 h-5" />
          ) : (
            <Video className="w-5 h-5" />
          )}
          <span>
            {isLoading
              ? "Starting..."
              : isActive
              ? "Stop Webcam"
              : "Start Webcam"}
          </span>
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-300 text-sm">{error}</span>
        </div>
      )}
      
      {isMobile && (
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
          <p className="text-blue-300 text-sm">
            💡 Tip: Use the Switch button to toggle between front and rear cameras for better part positioning.
          </p>
        </div>
      )}
    </div>
  );
};

export default WebcamFeed;