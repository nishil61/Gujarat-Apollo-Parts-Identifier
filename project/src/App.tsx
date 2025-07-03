import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import DetectionModes from './components/DetectionModes';
import ImageUpload from './components/ImageUpload';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingScreen from './components/LoadingScreen';
import AboutUs from './components/AboutUs';
import HowToUse from './components/HowToUse';
import Navigation from './components/Navigation';
import LiveDetection from '../../src/pages/LiveDetection';
import { DetectionResult } from './types';
import { initializeTensorFlow, loadTeachableMachineModel } from './utils/modelUtils';

type ActiveTab = 'detection' | 'about' | 'howto';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('detection');
  const [activeMode, setActiveMode] = useState<'upload' | 'webcam'>('upload');
  const [uploadResults, setUploadResults] = useState<DetectionResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isModelReady, setIsModelReady] = useState(false);
  const [isNonJawCrusherPart, setIsNonJawCrusherPart] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeTensorFlow();
        await loadTeachableMachineModel();
        setIsModelReady(true);
        // Add a small delay to show the loading screen
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.error('Failed to initialize:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();
  }, []);

  const handleUploadResults = (newResults: DetectionResult[]) => {
    setUploadResults(newResults);
    // Check if it's a non-jaw crusher part based on confidence threshold
    const highestConfidence = Math.max(...newResults.map(r => r.confidence));
    setIsNonJawCrusherPart(highestConfidence < 0.6);
  };

  const handleProcessingChange = (processing: boolean) => {
    setIsProcessing(processing);
  };

  // Clear results when switching modes
  useEffect(() => {
    if (activeMode === 'upload') {
      setUploadResults([]);
      setIsNonJawCrusherPart(false);
    }
  }, [activeMode]);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <AboutUs />;
      case 'howto':
        return <HowToUse />;
      default:
        return (
          <>
            <Hero />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <DetectionModes activeMode={activeMode} onModeChange={setActiveMode} />
              
              <div className="mt-12">
                {activeMode === 'upload' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <ImageUpload 
                        onResults={handleUploadResults}
                        onProcessingChange={handleProcessingChange}
                        isModelReady={isModelReady}
                      />
                    </div>
                    
                    <div className="space-y-6">
                      <ResultsDisplay 
                        results={uploadResults}
                        isProcessing={isProcessing}
                        mode="upload"
                        isNonJawCrusherPart={isNonJawCrusherPart}
                      />
                    </div>
                  </div>
                ) : (
                  <LiveDetection isModelReady={isModelReady} />
                )}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="pt-32">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;