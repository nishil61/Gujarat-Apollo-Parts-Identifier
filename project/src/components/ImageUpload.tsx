import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, Image, Loader, AlertCircle } from 'lucide-react';
import { DetectionResult } from '../types';
import * as tmImage from "@teachablemachine/image";

interface ImageUploadProps {
  onResults: (results: DetectionResult[]) => void;
  onProcessingChange: (processing: boolean) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onResults, onProcessingChange }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isNonJawCrusherPart, setIsNonJawCrusherPart] = useState(false);
  const modelRef = useRef<tmImage.CustomMobileNet | null>(null);

  // Confidence threshold for determining if it's a jaw crusher part
  const CONFIDENCE_THRESHOLD = 0.6; // Same as LiveDetection

  // Load the model using Teachable Machine library
  const loadModel = useCallback(async () => {
    setIsModelLoading(true);
    try {
      // Update paths to match your model location in public/models/
      const modelURL = "/models/model.json";
      const metadataURL = "/models/metadata.json";
      
      console.log("Loading Teachable Machine model for image upload...");
      console.log("Model URL:", modelURL);
      console.log("Metadata URL:", metadataURL);
      
      // Test file accessibility first
      try {
        const modelResponse = await fetch(modelURL);
        const metadataResponse = await fetch(metadataURL);
        
        if (!modelResponse.ok) {
          throw new Error(`Model file not accessible: ${modelResponse.status}`);
        }
        if (!metadataResponse.ok) {
          throw new Error(`Metadata file not accessible: ${metadataResponse.status}`);
        }
      } catch (fetchError) {
        console.error("Model files not accessible:", fetchError);
        throw new Error("Model files not found. Please ensure they are in public/models/");
      }
      
      const model = await tmImage.load(modelURL, metadataURL);
      modelRef.current = model;
      console.log("Model loaded successfully for image upload!");
      console.log("Available classes:", model.getClassLabels());
    } catch (err) {
      console.error("Model loading error in ImageUpload:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to load model: ${errorMessage}`);
    } finally {
      setIsModelLoading(false);
    }
  }, []);

  useEffect(() => {
    loadModel();
  }, [loadModel]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setError(null);
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

  const processImageWithModel = async (imageElement: HTMLImageElement): Promise<DetectionResult[]> => {
    if (!modelRef.current) {
      throw new Error("Model not loaded");
    }

    try {
      console.log("Starting prediction with image:", imageElement.width, "x", imageElement.height);
      
      // Ensure image is loaded
      if (!imageElement.complete || imageElement.naturalHeight === 0) {
        throw new Error("Image not properly loaded");
      }
      
      const predictions = await modelRef.current.predict(imageElement);
      console.log("Raw predictions:", predictions);
      
      // Check if the highest confidence prediction is below threshold
      const highestConfidence = Math.max(...predictions.map(p => p.probability));
      const isNonPart = highestConfidence < CONFIDENCE_THRESHOLD;
      setIsNonJawCrusherPart(isNonPart);
      
      // Convert to DetectionResult format
      const results: DetectionResult[] = predictions.map(pred => ({
        label: pred.className,
        confidence: pred.probability,
        timestamp: Date.now()
      }));

      // Sort by confidence (highest first)
      results.sort((a, b) => b.confidence - a.confidence);
      
      console.log("Processed results:", results);
      return results;
    } catch (error) {
      console.error('Prediction error:', error);
      const errorMessage = error instanceof Error ? error.message : "Unknown prediction error";
      throw new Error(`Failed to analyze image: ${errorMessage}`);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !modelRef.current) {
      console.log("Submit blocked - file:", !!selectedFile, "model:", !!modelRef.current);
      return;
    }

    setIsProcessing(true);
    onProcessingChange(true);
    setError(null);

    try {
      console.log("Processing file:", selectedFile.name, selectedFile.type);
      
      // Create image element for prediction
      const img = new window.Image();
      img.crossOrigin = "anonymous"; // Add CORS support
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          console.log("Image loaded for prediction:", img.width, "x", img.height);
          resolve();
        };
        img.onerror = (e) => {
          console.error("Image load error:", e);
          reject(new Error('Failed to load image for processing'));
        };
        img.src = URL.createObjectURL(selectedFile);
      });

      const results = await processImageWithModel(img);
      console.log("Final results:", results);
      onResults(results);
      
      // Clean up
      URL.revokeObjectURL(img.src);
    } catch (err) {
      console.error('Image processing error:', err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Processing failed: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
      onProcessingChange(false);
    }
  };

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
            <div className="space-y-4">
              <img
                src={previewUrl}
                alt="Selected part"
                className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
              />
              <p className="text-slate-300 text-sm">
                {selectedFile?.name}
              </p>
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
            disabled={!selectedFile || isProcessing || isModelLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-500 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 font-bold shadow-lg"
          >
            {isModelLoading ? (
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