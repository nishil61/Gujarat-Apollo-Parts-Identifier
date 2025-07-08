import React from 'react';
import { Brain, Camera, Upload } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI-Powered Part Identification
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Revolutionizing manufacturing efficiency with intelligent part recognition. 
            Instantly identify mechanical components with precision and confidence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-500/20 rounded-lg mb-4 mx-auto">
              <Upload className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Image Upload</h3>
            <p className="text-slate-300 text-sm">
              Upload photos of mechanical parts for instant identification and analysis
            </p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mb-4 mx-auto">
              <Camera className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Live Detection</h3>
            <p className="text-slate-300 text-sm">
              Real-time webcam feed with continuous part identification and confidence tracking
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;