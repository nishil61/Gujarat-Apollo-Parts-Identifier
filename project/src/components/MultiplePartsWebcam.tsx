import React from 'react';
import { Camera } from 'lucide-react';
import { DetectionResult } from '../types';

interface MultiplePartsWebcamProps {
  onResults: (results: DetectionResult[]) => void;
  onProcessingChange: (processing: boolean) => void;
}

const MultiplePartsWebcam: React.FC<MultiplePartsWebcamProps> = () => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-lg">
          <Camera className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">Multiple Parts Webcam</h3>
      </div>
      
      <div className="text-center py-12">
        <p className="text-slate-300">Multiple parts webcam detection coming soon...</p>
      </div>
    </div>
  );
};

export default MultiplePartsWebcam;
