import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-20">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img 
                src="../img.jpg" 
                alt="Apollo Logo" 
                className="h-16 w-16 object-contain rounded-lg shadow-lg ring-2 ring-slate-600/30" 
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur opacity-75"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-white leading-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Part Identifier
              </h1>
              <p className="text-base text-slate-300 leading-tight font-medium">Gujarat Apollo Industries Ltd.</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;