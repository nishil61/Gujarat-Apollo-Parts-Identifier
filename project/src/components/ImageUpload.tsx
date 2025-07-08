import React, { useState, useCallback } from 'react';
import { Upload, Image, Loader, AlertCircle, X } from 'lucide-react';
import { DetectionResult } from '../types';
import { processUploadedImageWithYOLO } from '../utils/modelUtils';
import { logDetectionToSheet } from '../utils/sheetLogger';
import BoundingBoxOverlay from './BoundingBoxOverlay';

interface ImageUploadProps {
  onResults: (results: DetectionResult[]) => void;
  onProcessingChange: (processing: boolean) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onResults, onProcessingChange }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<DetectionResult[]>([]);
  const [imageDimensions, setImageDimensions] = useState({ width: 640, height: 480 });

  // Remove the model loading effect since we use Roboflow API
  // No need to pre-load models
  
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        // Clean up previous URL if exists
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        
        setSelectedFile(file);
        const newPreviewUrl = URL.createObjectURL(file);
        setPreviewUrl(newPreviewUrl);
        setError(null);
        setPredictions([]); // Clear previous predictions
        
        // Get image dimensions for bounding box overlay
        const img = new window.Image();
        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height });
          URL.revokeObjectURL(img.src); // Clean up this temp URL
        };
        img.src = URL.createObjectURL(file);
      } else {
        setError('Please select a valid image file');
      }
    }
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    } else {
      setError('Please drop a valid image file');
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile || isProcessing) {
      return;
    }

    setIsProcessing(true);
    onProcessingChange(true);
    setError(null);

    try {
      // Always use YOLO for object detection (best performance)
      const results = await processUploadedImageWithYOLO(selectedFile);
        
      setPredictions(results);
      onResults(results);

      // Log each detected part to Google Sheets
      console.log('Processing results for Google Sheets logging:', results);
      
      for (const result of results) {
        // Only log if confidence is reasonably high
        if (result.confidence > 0.5) {
          // Send original decimal confidence (e.g., 0.987) - let Google Sheets handle percentage formatting
          console.log(`Logging detection: ${result.label} (confidence: ${result.confidence})`);
          try {
            await logDetectionToSheet({
              part: result.label,
              confidence: result.confidence, // Send as decimal, Google Sheets will format as percentage
              source: 'Upload',
            });
          } catch (logError) {
            console.error('Failed to log individual detection:', logError);
          }
        }
      }
    } catch (err) {
      console.error('Image processing error:', err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Processing failed: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
      onProcessingChange(false);
    }
  };

  const handleClearImage = useCallback(() => {
    // Clean up URLs to prevent memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setSelectedFile(null);
    setPreviewUrl(null);
    setPredictions([]);
    setError(null);
    setImageDimensions({ width: 640, height: 480 });
    
    // Clear results in parent component
    onResults([]);
  }, [previewUrl, onResults]);

  return (
    <div className="bg-slate-800 border-2 border-slate-500 rounded-lg shadow-lg">
      <div className="p-6 border-b-2 border-slate-500">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-orange-500/20 rounded-lg">
            <Upload className="w-5 h-5 text-orange-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">Image Upload</h3>
        </div>
      </div>

      <div className="p-6">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-slate-500 transition-colors duration-200"
        >
          {previewUrl ? (
            <div className="space-y-4 relative">
              {/* Remove Image Button - positioned outside the image area */}
              <button
                onClick={handleClearImage}
                className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors duration-200 shadow-lg z-50 border-2 border-slate-800"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Selected part"
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
                />
                
                {/* Bounding Box Overlay */}
                {predictions.length > 0 && (
                  <BoundingBoxOverlay
                    detections={predictions}
                    containerWidth={Math.min(imageDimensions.width, 512)}
                    containerHeight={Math.min(imageDimensions.height, 256)}
                    imageWidth={imageDimensions.width}
                    imageHeight={imageDimensions.height}
                    className="rounded-lg"
                  />
                )}
              </div>
              
              <div className="flex items-center justify-center">
                <p className="text-slate-300 text-sm">
                  {selectedFile?.name}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center w-16 h-16 bg-slate-700/50 rounded-full mx-auto">
                <Image className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <p className="text-slate-300 mb-2">
                  Drag and drop an image here, or click to select
                </p>
                <p className="text-slate-500 text-sm">
                  Supports JPG, PNG, and other image formats
                </p>
              </div>
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />

        <div className="flex space-x-4 mt-6">
          <label
            htmlFor="file-upload"
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 cursor-pointer text-center font-bold shadow-lg"
          >
            Choose Image
          </label>
          
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || isProcessing}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-500 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 font-bold shadow-lg"
          >
            {isProcessing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Loading Model...</span>
              </>
            ) : isProcessing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Identify Part</span>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;