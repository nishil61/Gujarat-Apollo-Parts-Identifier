import React from 'react';
import { Camera, Upload } from 'lucide-react';

interface DetectionModesProps {
  activeMode: 'upload' | 'webcam';
  onModeChange: (mode: 'upload' | 'webcam') => void;
}

const DetectionModes: React.FC<DetectionModesProps> = ({ activeMode, onModeChange }) => {
  return (
    <div className="flex justify-center">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-2 border border-slate-700">
        <div className="flex space-x-2">
          <button
            onClick={() => onModeChange('upload')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
              activeMode === 'upload'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Upload className="w-5 h-5" />
            <span className="font-medium">Upload Image</span>
          </button>
          
          <button
            onClick={() => onModeChange('webcam')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
              activeMode === 'webcam'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Camera className="w-5 h-5" />
            <span className="font-medium">Live Webcam</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetectionModes;