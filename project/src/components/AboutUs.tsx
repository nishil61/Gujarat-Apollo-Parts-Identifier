import React from 'react';
import { Factory, Award, Users, Target, Globe, Wrench } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          About Gujarat Apollo Industries Ltd
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
          Leading manufacturer of high-quality crushing and screening equipment, 
          revolutionizing the mining and construction industry since decades.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-500/20 rounded-lg mb-4">
            <Factory className="w-6 h-6 text-orange-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Manufacturing Excellence</h3>
          <p className="text-slate-300">
            State-of-the-art manufacturing facilities producing world-class crushing and screening equipment 
            with precision engineering and quality assurance.
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mb-4">
            <Award className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Industry Leadership</h3>
          <p className="text-slate-300">
            Recognized as a pioneer in the crushing equipment industry with numerous awards 
            and certifications for quality and innovation.
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg mb-4">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Expert Team</h3>
          <p className="text-slate-300">
            Skilled engineers, technicians, and professionals dedicated to delivering 
            innovative solutions and exceptional customer service.
          </p>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Target className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Innovation Drive</h4>
                  <p className="text-slate-300">
                    Continuously innovating to provide cutting-edge solutions that enhance 
                    productivity and efficiency in mining and construction operations.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Globe className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Global Reach</h4>
                  <p className="text-slate-300">
                    Serving customers worldwide with reliable equipment and comprehensive 
                    support services, building lasting partnerships across continents.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Wrench className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Quality Commitment</h4>
                  <p className="text-slate-300">
                    Maintaining the highest standards of quality in every product, 
                    ensuring durability, reliability, and superior performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500/10 to-blue-500/10 rounded-xl p-6 border border-slate-600">
            <h3 className="text-2xl font-bold text-white mb-4">Company Highlights</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-1">50+</div>
                <div className="text-slate-300 text-sm">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">1000+</div>
                <div className="text-slate-300 text-sm">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">25+</div>
                <div className="text-slate-300 text-sm">Countries Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">100+</div>
                <div className="text-slate-300 text-sm">Product Variants</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-6">AI-Powered Innovation</h2>
        <p className="text-lg text-slate-300 max-w-4xl mx-auto">
          This part identification system represents our commitment to embracing cutting-edge technology 
          to solve real-world manufacturing challenges. By leveraging artificial intelligence and machine learning, 
          we're streamlining operations, reducing errors, and enhancing productivity for our customers worldwide.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;