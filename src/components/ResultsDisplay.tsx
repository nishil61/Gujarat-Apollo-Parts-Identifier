import React from 'react';
import { BarChart, Clock, Zap, AlertTriangle } from 'lucide-react';
import { DetectionResult } from '../types';

interface ResultsDisplayProps {
  results: DetectionResult[];
  isProcessing: boolean;
  mode: 'upload' | 'webcam';
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, isProcessing, mode }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return 'from-green-500 to-emerald-600';
    if (confidence >= 0.4) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.7) return 'High Confidence';
    if (confidence >= 0.4) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 h-full">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-purple-500/20 rounded-lg">
          <BarChart className="w-5 h-5 text-purple-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">Detection Results</h3>
        {isProcessing && (
          <div className="ml-auto">
            <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>
        )}
      </div>

      {results.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-400" />
          </div>
          <p className="text-white text-lg font-medium mb-2">No results yet</p>
          <p className="text-slate-300 text-base">
            {mode === 'webcam' 
              ? 'Aim camera at a part to begin detection'
              : 'Upload an image to identify parts'}
          </p>
        </div>
      ) : mode === 'webcam' ? (
        <div className="space-y-4">
          {results.slice(0, 5).map((result, index) => (
            <div key={index} className="bg-slate-900/80 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-semibold text-lg" title={result.label}>
                  {result.label}
                </span>
                <span className="text-white font-mono text-lg font-bold bg-slate-700/80 px-3 py-1 rounded border border-slate-500">
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>
              
              <div className="w-full bg-slate-600 rounded-full h-4 mb-3 border border-slate-500">
                <div
                  className={`h-4 rounded-full bg-gradient-to-r ${getConfidenceColor(result.confidence)} transition-all duration-300 ease-in-out shadow-lg`}
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
              
              <div className="flex justify-start">
                <span className={`text-sm px-3 py-1 rounded-full font-semibold text-white ${
                  result.confidence >= 0.7 ? 'bg-green-700/60 border border-green-400/60' :
                  result.confidence >= 0.4 ? 'bg-yellow-700/60 border border-yellow-400/60' :
                  'bg-red-700/60 border border-red-400/60'
                }`}>
                  {getConfidenceText(result.confidence)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {results.slice(0, 8).map((result, index) => (
            <div key={`${result.label}-${index}`} className="bg-slate-900/60 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium text-base truncate pr-2" title={result.label}>
                  {result.label}
                </span>
                <span className="text-white font-mono text-base font-bold whitespace-nowrap bg-slate-700/60 px-2 py-1 rounded">
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>
              
              <div className="w-full bg-slate-600 rounded-full h-3 overflow-hidden border border-slate-500">
                <div
                  className={`h-full bg-gradient-to-r ${getConfidenceColor(result.confidence)} transition-all duration-700 ease-out`}
                  style={{ 
                    width: `${result.confidence * 100}%`
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <span className={`text-sm px-2 py-1 rounded-full font-medium text-white ${
                  result.confidence >= 0.7 ? 'bg-green-700/50 border border-green-400/50' :
                  result.confidence >= 0.4 ? 'bg-yellow-700/50 border border-yellow-400/50' :
                  'bg-red-700/50 border border-red-400/50'
                }`}>
                  {getConfidenceText(result.confidence)}
                </span>
                
                {mode === 'upload' && (
                  <div className="flex items-center space-x-1 text-slate-300 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
