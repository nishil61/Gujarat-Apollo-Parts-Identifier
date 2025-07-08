import React from 'react';
import { Cog, Brain, Zap } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-6 mx-auto">
            <Cog className="w-12 h-12 text-white animate-spin" />
          </div>
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
            <Brain className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          Apollo Part Identifier
        </h1>
        <p className="text-slate-300 mb-8">
          Initializing AI-powered detection system...
        </p>
        
        <div className="flex items-center justify-center space-x-2 text-slate-400">
          <Zap className="w-4 h-4 animate-pulse" />
          <span className="text-sm">Loading TensorFlow.js Engine</span>
        </div>
        
        <div className="mt-6 w-64 h-2 bg-slate-700 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-500 to-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;