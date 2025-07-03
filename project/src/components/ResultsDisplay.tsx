import React from 'react';
import { BarChart, Clock, Zap, AlertTriangle } from 'lucide-react';
import { DetectionResult } from '../types';

interface ResultsDisplayProps {
  results: DetectionResult[];
  isProcessing: boolean;
  mode: 'upload' | 'webcam';
  isNonJawCrusherPart?: boolean; // Add this prop
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, isProcessing, mode, isNonJawCrusherPart = false }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'from-green-500 to-emerald-600';
    if (confidence >= 0.6) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  const latestResult = results[0];

  return (
    <div className="bg-slate-800 border-2 border-slate-500 rounded-lg shadow-lg h-full">
      <div className="p-6 border-b-2 border-slate-500">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-500/20 rounded-lg">
            <BarChart className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">Detection Results</h3>
        </div>
      </div>

      <div className="p-6">
        {isProcessing && results.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex items-center justify-center w-16 h-16 bg-slate-700/50 rounded-full mx-auto mb-4">
              <Zap className="w-8 h-8 text-yellow-400 animate-pulse" />
            </div>
            <p className="text-slate-300 mb-2">Processing...</p>
            <p className="text-slate-500 text-sm">
              {mode === 'webcam' ? 'Analyzing live feed' : 'Identifying parts in image'}
            </p>
          </div>
        ) : isNonJawCrusherPart ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-red-400 mb-2">
              Not a Jaw Crusher Part
            </h3>
            <p className="text-slate-300">
              The {mode === 'webcam' ? 'object in view' : 'uploaded image'} is not recognized as a jaw crusher component.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex items-center justify-center w-16 h-16 bg-slate-700/50 rounded-full mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-300 mb-2">No results yet</p>
            <p className="text-slate-500 text-sm">
              {mode === 'webcam' ? 'Aim camera at a part to begin detection' : 'Upload an image to identify parts'}
            </p>
          </div>
        ) : mode === 'webcam' ? (
          <div className="space-y-3">
            {results.slice(0, 7).map((result, index) => (
              <div key={index} className="grid grid-cols-5 items-center gap-3">
                <span className="col-span-2 text-slate-300 text-sm truncate" title={result.label}>
                  {result.label}
                </span>
                <div className="col-span-3 flex items-center">
                  <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full bg-gradient-to-r ${getConfidenceColor(result.confidence)} transition-all duration-300 ease-in-out`}
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-white font-mono text-sm ml-3 w-16 text-right">
                    {(result.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Latest Result Highlight for Upload */}
            {latestResult && (
              <div className="bg-slate-900/50 rounded-lg p-4 border-2 border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-white">
                    {latestResult.label}
                  </h4>
                  <span className="text-sm text-slate-400">
                    Latest
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Confidence</span>
                    <span className="text-white font-semibold">
                      {(latestResult.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getConfidenceColor(latestResult.confidence)} transition-all duration-500 ease-out`}
                      style={{ width: `${latestResult.confidence * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      latestResult.confidence >= 0.8 ? 'bg-green-900/20 text-green-400' :
                      latestResult.confidence >= 0.6 ? 'bg-yellow-900/20 text-yellow-400' :
                      'bg-red-900/20 text-red-400'
                    }`}>
                      {getConfidenceText(latestResult.confidence)}
                    </span>
                    
                    <div className="flex items-center space-x-1 text-slate-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(latestResult.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;