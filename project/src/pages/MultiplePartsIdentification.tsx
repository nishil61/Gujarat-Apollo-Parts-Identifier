import React, { useState } from 'react';
import DetectionModes from '../components/DetectionModes';
import MultiplePartsUpload from '../components/MultiplePartsUpload';
import MultiplePartsWebcam from '../components/MultiplePartsWebcam';
import ResultsDisplay from '../components/ResultsDisplay';
import { DetectionResult } from '../types';

const MultiplePartsIdentification: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'upload' | 'webcam'>('upload');
  const [results, setResults] = useState<DetectionResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
        Multiple Parts Identification
      </h1>
      <DetectionModes activeMode={activeMode} onModeChange={mode => {
        setActiveMode(mode);
        setResults([]);
      }} />
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {activeMode === 'upload' ? (
            <MultiplePartsUpload
              onResults={setResults}
              onProcessingChange={setIsProcessing}
            />
          ) : (
            <MultiplePartsWebcam
              onResults={setResults}
              onProcessingChange={setIsProcessing}
            />
          )}
        </div>
        <div>
          <ResultsDisplay
            results={results}
            isProcessing={isProcessing}
            mode={activeMode}
            isNonJawCrusherPart={false}
          />
        </div>
      </div>
    </div>
  );
};

export default MultiplePartsIdentification;
