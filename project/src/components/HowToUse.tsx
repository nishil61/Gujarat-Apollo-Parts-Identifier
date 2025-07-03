import React from 'react';
import { Upload, Camera, Zap, CheckCircle, AlertTriangle, Smartphone } from 'lucide-react';

const HowToUse: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          How to Use Apollo Part Identifier
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
          Follow these simple steps to identify mechanical parts with AI-powered precision
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-500/20 rounded-lg">
              <Upload className="w-6 h-6 text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Image Upload Mode</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-sm font-bold mt-1">1</div>
              <div>
                <h4 className="font-semibold text-white mb-1">Select Upload Mode</h4>
                <p className="text-slate-300 text-sm">Click on the "Upload Image" tab to activate image upload mode</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-sm font-bold mt-1">2</div>
              <div>
                <h4 className="font-semibold text-white mb-1">Choose Your Image</h4>
                <p className="text-slate-300 text-sm">Drag & drop an image or click "Choose Image" to select from your device</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-sm font-bold mt-1">3</div>
              <div>
                <h4 className="font-semibold text-white mb-1">Identify Parts</h4>
                <p className="text-slate-300 text-sm">Click "Identify Part" to analyze the image and get instant results</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg">
              <Camera className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Live Webcam Mode</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm font-bold mt-1">1</div>
              <div>
                <h4 className="font-semibold text-white mb-1">Select Webcam Mode</h4>
                <p className="text-slate-300 text-sm">Click on the "Live Webcam" tab to activate real-time detection</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm font-bold mt-1">2</div>
              <div>
                <h4 className="font-semibold text-white mb-1">Start Camera</h4>
                <p className="text-slate-300 text-sm">Click "Start Webcam" and allow camera permissions when prompted</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm font-bold mt-1">3</div>
              <div>
                <h4 className="font-semibold text-white mb-1">Position Parts</h4>
                <p className="text-slate-300 text-sm">Hold parts in front of the camera for continuous real-time identification</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Features */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 mb-12">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg">
            <Smartphone className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Mobile & Tablet Features</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-white">Camera Switching</h4>
            <p className="text-slate-300 text-sm">
              On mobile devices, you can switch between front and rear cameras for optimal part positioning and lighting.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-white">Touch Optimized</h4>
            <p className="text-slate-300 text-sm">
              The interface is fully optimized for touch interactions with large buttons and intuitive gestures.
            </p>
          </div>
        </div>
      </div>

      {/* Supported Parts */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Supported Jaw Crusher Parts</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'Toggle Plate',
            'Pitman',
            'Jaw Plates',
            'Jaw Crusher Bearings',
            'Flywheel',
            'Eccentric Shaft',
            'Cheek Plates'
          ].map((part, index) => (
            <div key={index} className="bg-slate-900/50 rounded-lg p-3 text-center">
              <span className="text-slate-300 text-sm">{part}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tips & Best Practices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
          <div className="flex items-center space-x-3 mb-6">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-bold text-white">Best Practices</h3>
          </div>
          
          <ul className="space-y-3">
            <li className="flex items-start space-x-2">
              <Zap className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
              <span className="text-slate-300 text-sm">Use good lighting for better accuracy</span>
            </li>
            <li className="flex items-start space-x-2">
              <Zap className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
              <span className="text-slate-300 text-sm">Clean parts before identification</span>
            </li>
            <li className="flex items-start space-x-2">
              <Zap className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
              <span className="text-slate-300 text-sm">Position parts clearly in frame</span>
            </li>
            <li className="flex items-start space-x-2">
              <Zap className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
              <span className="text-slate-300 text-sm">Use multiple angles for verification</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Troubleshooting</h3>
          </div>
          
          <ul className="space-y-3">
            <li className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
              <span className="text-slate-300 text-sm">Grant camera permissions for webcam mode</span>
            </li>
            <li className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
              <span className="text-slate-300 text-sm">Use HTTPS for webcam access</span>
            </li>
            <li className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
              <span className="text-slate-300 text-sm">Refresh page if camera doesn't start</span>
            </li>
            <li className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
              <span className="text-slate-300 text-sm">Check browser compatibility</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HowToUse;