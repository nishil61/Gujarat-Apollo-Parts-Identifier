# ⚙️ Apollo Part Identifier

![Part Identifier](https://img.shields.io/badge/Apollo-Part%20Identifier-blue)
![React](https://img.shields.io/badge/React-18.x-brightgreen)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.x-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

An AI-powered image processing system to automate the recognition and classification of mechanical parts for Gujarat Apollo Industries Ltd. This modern web application streamlines inventory management, reduces human error, and improves assembly accuracy with an intuitive, production-ready interface for real-time part identification.

## ✨ Features

- **🎯 Dual Input Methods**: Upload images or use live webcam feed for real-time identification
- **🚀 Real-time Analysis**: Instant feedback with confidence scores and animated progress bars
- **💎 Modern UI/UX**: Beautiful, professional interface with glass morphism effects
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🧠 AI-Powered**: Custom TensorFlow.js model integration with Teachable Machine support
- **⚡ High Performance**: Optimized WebGL backend for fast inference
- **🔄 Live Processing**: Continuous webcam analysis with dynamic results updating

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Modern web browser with WebGL support
- Webcam (for live detection feature)

### Installation

1. **Clone this repository**
   ```bash
   git clone <repository-url>
   cd apollo-part-identifier
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your trained model** (Optional - runs in demo mode without it)
   
   Train your model at [teachablemachine.withgoogle.com](https://teachablemachine.withgoogle.com/) and place the exported files in the `models/` directory:
   - `model.json`
   - `metadata.json` 
   - `weights.bin`

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to use the application.

## 🏗️ Building for Production

Create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 📱 Deployment Options

This application can be easily deployed to various free platforms:

- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repository  
- **GitHub Pages**: Enable in repository settings
- **Firebase Hosting**: Use Firebase CLI

## 🧠 Creating Your Custom Model

### Using Teachable Machine (Recommended)

1. **Visit Teachable Machine**
   - Go to [teachablemachine.withgoogle.com](https://teachablemachine.withgoogle.com/)
   - Select "Image Project" → "Standard Image Model"

2. **Prepare Your Dataset**
   - Create classes for each part type (e.g., "Jaw Plate", "Toggle Plate", etc.)
   - Upload 50+ high-quality images per class
   - Include varied angles, lighting conditions, and backgrounds

3. **Training Tips**
   - Use consistent image dimensions
   - Ensure good lighting in training images
   - Include images from different angles
   - Add background variations for robustness

4. **Export Your Model**
   - Click "Export Model" → "TensorFlow.js"
   - Download the model files
   - Extract and place in the `models/` directory

5. **Update Labels** (Optional)
   - Modify `DEMO_LABELS` in `src/utils/modelUtils.ts` with your actual part names

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript for robust component architecture
- **Tailwind CSS** for responsive, utility-first styling
- **Lucide React** for consistent iconography
- **Vite** for fast development and optimized builds

### AI/ML Stack  
- **TensorFlow.js** for client-side machine learning
- **WebGL Backend** for GPU-accelerated inference
- **Canvas API** for image preprocessing
- **MediaDevices API** for webcam access

### Project Structure
```
src/
├── components/         # React components
│   ├── Header.tsx     # Application header
│   ├── Hero.tsx       # Hero section
│   ├── DetectionModes.tsx  # Mode switcher
│   ├── ImageUpload.tsx     # File upload component
│   ├── WebcamFeed.tsx      # Live camera feed
│   ├── ResultsDisplay.tsx  # Results visualization
│   └── LoadingScreen.tsx   # Initialization screen
├── utils/
│   └── modelUtils.ts  # TensorFlow.js model utilities
├── types/
│   └── index.ts       # TypeScript type definitions
└── App.tsx           # Main application component
```

## 💻 Usage Guide

### Image Upload Mode
1. Click "Upload Image" tab
2. Drag & drop or select an image file
3. Click "Identify Part" to analyze
4. View results with confidence scores

### Live Webcam Mode  
1. Click "Live Webcam" tab
2. Grant camera permissions when prompted
3. Click "Start Webcam" to begin detection
4. Position parts in camera view for identification
5. View real-time results with confidence meters

## 🎨 Design Features

- **Glass Morphism Effects**: Modern translucent cards with backdrop blur
- **Gradient Backgrounds**: Dynamic color transitions matching Apollo branding
- **Animated Elements**: Smooth transitions and micro-interactions
- **Responsive Layout**: Mobile-first design with breakpoint optimization
- **Professional Typography**: Hierarchical text system with proper contrast
- **Color System**: Comprehensive palette with semantic color usage

## 🔧 Customization

### Styling
- Modify `tailwind.config.js` for design system changes
- Update CSS custom properties in `src/index.css`
- Customize component styles in individual component files

### Functionality
- Update model labels in `src/utils/modelUtils.ts`
- Modify confidence thresholds and display logic
- Customize preprocessing parameters for your use case

## 🚀 Performance Optimization

- **Model Optimization**: Uses WebGL backend for GPU acceleration
- **Memory Management**: Automatic tensor cleanup to prevent memory leaks
- **Lazy Loading**: Model loaded on-demand with caching
- **Bundle Optimization**: Tree shaking and code splitting enabled

## 🐛 Troubleshooting

### Common Issues

1. **Model Loading Errors**
   - Ensure model files are in the correct `models/` directory
   - Check browser console for detailed error messages
   - Verify model files aren't corrupted

2. **Webcam Access Issues**
   - Grant camera permissions in browser settings
   - Ensure you're accessing via HTTPS (required for webcam)
   - Check if other applications are using the camera

3. **Performance Issues**
   - Update to a modern browser with WebGL 2.0 support
   - Close other resource-intensive applications
   - Try reducing image resolution

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- **Gujarat Apollo Industries Ltd** for the industry problem statement
- **Google Teachable Machine** for accessible ML model training
- **TensorFlow.js Team** for client-side ML capabilities
- **React Community** for robust frontend framework
- **Tailwind CSS** for utility-first styling approach

## 📧 Contact & Support

For questions, feedback, or support:
- Create an issue in this repository
- Contact the development team
- Visit [Apollo Industries](https://www.apollo.co.in/) for industry context

---

**Built with ❤️ for Gujarat Apollo Industries Ltd, Mehsana**