# 🔧 Gujarat Apollo Parts Identifier

![Part Identifier](https://img.shields.io/badge/Gujarat%20Apollo-Parts%20Identifier-orange)
![React](https://img.shields.io/badge/React-18.x-brightgreen)
![YOLO](https://img.shields.io/badge/YOLO-Roboflow-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Google Sheets](https://img.shields.io/badge/Google-Sheets%20Integration-green)

🚀 **Next-Generation AI-Powered Jaw Crusher Parts Recognition System**

An intelligent, production-ready web application designed specifically for **Gujarat Apollo Industries Ltd** to revolutionize jaw crusher parts identification. Built with cutting-edge YOLO object detection, real-time webcam processing, and automated data logging - this system transforms traditional manual part identification into a seamless, accurate, and efficient AI-powered workflow.

## 🌟 Why This Matters

In heavy machinery manufacturing, **accurate part identification** is critical for:
- ⚡ **Faster Assembly**: Instant recognition eliminates guesswork
- 🎯 **Zero Errors**: AI precision reduces costly assembly mistakes  
- 📊 **Smart Inventory**: Automated logging tracks part usage patterns
- 🔄 **Workflow Optimization**: Streamlined processes increase productivity
- 💰 **Cost Reduction**: Minimizes manual inspection time and errors

## ✨ Advanced Features

### 🎯 **Dual Detection Modes**
- **📸 Image Upload**: Drag-and-drop or click to upload part images for batch analysis
- **📹 Live Webcam**: Real-time continuous detection with full-screen webcam feed
- **� Instant Processing**: Sub-second analysis with immediate visual feedback

### 🧠 **AI-Powered Recognition**
- **🎯 YOLO Object Detection**: Roboflow-trained model specifically for jaw crusher parts
- **� Multi-Part Detection**: Identifies multiple parts simultaneously with individual bounding boxes
- **🏷️ Smart Labeling**: Automatic part names with confidence percentages
- **🎨 Visual Overlay**: Color-coded bounding boxes with real-time positioning

### 🎛️ **User-Adjustable Confidence Control** 
- **� Dynamic Threshold Slider**: Adjust detection sensitivity from 30% to 95%
- **⚡ Quick Presets**: One-click options for Sensitive (50%), Balanced (70%), or Strict (85%)
- **🎯 Real-time Adjustment**: Changes apply instantly to live detection
- **💡 Smart Guidance**: Built-in explanations help users understand trade-offs

### 📋 **Automated Data Logging**
- **📊 Google Sheets Integration**: Every detection automatically logged with timestamp
- **📈 Detailed Analytics**: Part name, confidence score, detection source, and time
- **🔄 Smart Cooldown**: Prevents spam logging with 5-second intervals per part
- **💾 Persistent Records**: Build comprehensive part usage databases over time

### 🎨 **Premium User Experience**
- **� Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🌓 Modern UI**: Professional dark theme with glass morphism effects
- **⚡ Smooth Animations**: Fluid transitions and micro-interactions
- **🎯 Intuitive Navigation**: Clean, industrial-grade interface design
- **🔧 Professional Controls**: Settings panel with gear icon and clear labeling

## 🚀 Quick Start

### 📋 Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Modern Web Browser** - Chrome, Firefox, Safari, or Edge
- **Webcam** (for live detection feature)
- **Internet Connection** (for Roboflow API and Google Sheets logging)

### ⚡ Installation & Setup

1. **📥 Clone the Repository**
   ```bash
   git clone <repository-url>
   cd Gujarat-Apollo-Parts-Identifier-main/project
   ```

2. **📦 Install Dependencies**
   ```bash
   npm install
   ```

3. **🚀 Start Development Server**
   ```bash
   npm run dev
   ```

4. **🌐 Open Your Browser**
   
   Navigate to `http://localhost:5173` and start identifying parts!

### 🎯 Immediate Use
- **No Setup Required**: The app works immediately with the pre-trained YOLO model
- **Demo Mode**: Test with sample images or your webcam right away
- **Google Sheets**: Logging works out-of-the-box with pre-configured spreadsheet

## 🏗️ Production Deployment

### 📦 Build for Production

Create an optimized production build:

```bash
npm run build
```

The `dist/` folder will contain all optimized files ready for deployment.

### 🌐 Deployment Options

**🚀 Recommended Platforms:**

| Platform | Setup | Features |
|----------|-------|----------|
| **Vercel** | `vercel deploy` | Auto-deploy, edge functions, custom domains |
| **Netlify** | Drag & drop `dist/` | Branch deploys, form handling, CDN |
| **GitHub Pages** | Enable in repo settings | Free hosting, custom domain support |
| **Firebase** | `firebase deploy` | Global CDN, real-time features |

### ⚙️ Environment Configuration

For production, you may want to configure:
- **Custom Google Sheets** endpoint
- **Roboflow API** rate limiting
- **Analytics** integration
- **Error monitoring** (Sentry, LogRocket)

## 🧠 AI Architecture & Detection System

### 🎯 **Primary: YOLO Object Detection (Roboflow)**
**🏆 Industry-Grade Multi-Object Recognition**

- **🔬 Model**: `jaw-crusher-parts-identification/3`
- **🌐 API**: Roboflow Inference API  
- **⚡ Performance**: Real-time detection with sub-second response
- **🎯 Accuracy**: Trained specifically on jaw crusher parts dataset

**✨ Capabilities:**
- 🔍 **Precise Bounding Boxes**: Exact part location and dimensions
- 🏷️ **Multi-Part Detection**: Simultaneous identification of multiple parts
- 📊 **Confidence Scoring**: 0-100% accuracy confidence for each detection
- 🎨 **Visual Overlay**: Real-time bounding box rendering on live feed
- 🔄 **Continuous Processing**: 1-second interval updates for webcam mode

**🎯 Supported Jaw Crusher Parts:**
```
✅ Jaw Plates (Fixed & Movable)    ✅ Eccentric Shaft
✅ Toggle Plates                   ✅ Bearings & Bushings  
✅ Pitman Assembly                 ✅ Springs (Compression)
✅ Cheek Plates                    ✅ Flywheel Assembly
✅ Wedge Blocks                    ✅ Shims & Spacers
```

**🔧 API Configuration:**
```typescript
const ROBOFLOW_CONFIG = {
  apiKey: "k0YqQQHbnNVdI9tnKzL6",
  model: "jaw-crusher-parts-identification/3", 
  confidence: 0.4, // Minimum threshold
  overlap: 0.5     // NMS overlap threshold
};
```

### � **Fallback: Teachable Machine (TensorFlow.js)**
**📚 Local Processing with Grid Simulation**

- **🎯 Purpose**: Offline capability when API unavailable
- **⚙️ Method**: Classification + grid-based pseudo-detection
- **💾 Storage**: Local model files in `/public/models/`
- **🎨 Visualization**: Simulated bounding boxes using 3x3 grid

**📁 Model Files Structure:**
```
public/models/
├── model.json      # TensorFlow.js model architecture
├── metadata.json   # Class labels and preprocessing config  
├── weights.bin     # Pre-trained model weights
```

## � Google Sheets Integration & Data Analytics

### 📈 **Automated Logging System**

Every part detection is automatically logged to Google Sheets for comprehensive analytics:

**📋 Data Points Captured:**
```
📅 Timestamp          🏷️ Part Name
📊 Confidence Score   📱 Detection Source  
🎯 Threshold Used     🔢 Session ID
```

**🔄 Smart Logging Features:**
- **⏱️ Cooldown System**: 5-second intervals prevent spam logging
- **📊 Percentage Formatting**: Confidence automatically formatted (98.70%)
- **🎯 Source Tracking**: Distinguishes between Webcam vs Image Upload
- **💾 Persistent Storage**: Data preserved across browser sessions

**📈 Analytics Dashboard:**
- **📊 Detection Frequency**: Most commonly identified parts
- **🎯 Confidence Trends**: Average accuracy over time
- **📱 Usage Patterns**: Peak detection times and methods
- **🔍 Part Distribution**: Breakdown by part type

### 🔧 **Configuration**

The Google Sheets integration is pre-configured but can be customized:

```typescript
// sheetLogger.ts configuration
const SHEET_CONFIG = {
  url: "https://docs.google.com/forms/d/e/...",
  cooldownDuration: 5000, // 5 seconds
  autoFormat: true        // Percentage formatting
};
```

## 💻 User Guide & Best Practices

### 📸 **Image Upload Mode**
1. **📁 Select File**: Click "Upload Images" tab
2. **🖱️ Drag & Drop**: Drop image files or click to browse
3. **🔍 Analyze**: Click "Identify Parts" for instant analysis
4. **📊 Review Results**: View detected parts with confidence scores
5. **❌ Remove**: Click X button to clear and try another image

**💡 Tips for Best Results:**
- 📷 Use **high-resolution images** (1280x720 or higher)
- 💡 Ensure **good lighting** and clear part visibility
- 🎯 Position parts **clearly in frame** without overlap
- 🔄 Try different **angles** if detection is low

### 📹 **Live Webcam Mode** ⭐ *Recommended*
1. **📹 Start Camera**: Click "Live Detection" tab
2. **🔐 Grant Permissions**: Allow webcam access when prompted
3. **▶️ Begin Detection**: Click "Start Webcam" 
4. **🎛️ Adjust Threshold**: Use slider to set detection sensitivity
5. **🎯 Position Parts**: Hold parts clearly in camera view
6. **📊 View Results**: Real-time detection with confidence scores

**🎛️ Confidence Threshold Control:**
- **🟢 Sensitive (50%)**: Catches more parts, may include false positives
- **🟡 Balanced (70%)**: Good middle ground for most situations  
- **🔴 Strict (85%)**: High confidence only, fewer false positives
- **🎚️ Custom**: Use slider for precise control (30-95%)

### 📱 **Mobile Usage**
- **📱 Portrait Mode**: Optimized mobile interface
- **🔄 Camera Switch**: Toggle front/rear camera on mobile devices
- **👆 Touch Controls**: Tap to adjust settings and thresholds
- **📊 Full Screen**: Webcam uses full width for better visibility

## 🏗️ Technical Architecture

### 🎨 **Frontend Stack**
```typescript
⚛️  React 18           // Modern component architecture
🔷  TypeScript 5.x     // Type-safe development  
🎨  Tailwind CSS       // Utility-first styling
📹  react-webcam       // Camera integration
🎯  Lucide React       // Professional iconography
⚡  Vite              // Lightning-fast dev server
```

### 🧠 **AI/ML Pipeline**
```typescript
🎯  Roboflow YOLO     // Primary object detection
🧠  TensorFlow.js     // Fallback classification  
🖼️  Canvas API        // Image preprocessing
📹  MediaDevices API  // Webcam stream handling
⚡  WebGL Backend     // GPU acceleration
```

### 📁 **Project Structure**
```
Gujarat-Apollo-Parts-Identifier-main/
├── project/                    # 🎯 Main application
│   ├── src/
│   │   ├── components/        # React UI components
│   │   │   ├── Header.tsx     # App header & navigation
│   │   │   ├── Hero.tsx       # Landing section
│   │   │   ├── ImageUpload.tsx # File upload & analysis
│   │   │   ├── Navigation.tsx  # Tab switching
│   │   │   ├── ResultsDisplay.tsx # Detection results
│   │   │   ├── BoundingBoxOverlay.tsx # Visual overlays
│   │   │   └── LoadingScreen.tsx # Initialization UI
│   │   ├── pages/
│   │   │   ├── LiveDetection.tsx # Webcam mode
│   │   │   └── MultiplePartsIdentification.tsx
│   │   ├── services/
│   │   │   └── roboflowService.ts # YOLO API integration
│   │   ├── utils/
│   │   │   ├── modelUtils.ts     # TensorFlow utilities  
│   │   │   └── sheetLogger.ts    # Google Sheets logging
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript definitions
│   │   ├── index.css            # Global styles
│   │   ├── slider-styles.css    # Custom slider styling
│   │   └── App.tsx              # Main app component
│   ├── public/
│   │   └── models/              # TensorFlow.js fallback models
│   ├── package.json             # Dependencies & scripts
│   └── vite.config.ts          # Build configuration
└── vercel.json                 # Deployment config
```

### 🔄 **Data Flow Architecture**
```
📷 Image/Webcam Input
    ↓
🔍 Roboflow YOLO API
    ↓
📦 Detection Results
    ↓
🎨 Bounding Box Overlay
    ↓
📊 Google Sheets Logging
    ↓
📈 Analytics Dashboard
```

## ⚙️ Advanced Configuration & Customization

### 🎯 **Confidence Threshold Tuning**

Adjust detection sensitivity in `LiveDetection.tsx`:

```typescript
// Default settings optimized for jaw crusher parts
const CONFIDENCE_SETTINGS = {
  default: 0.8,        // 80% confidence
  sensitive: 0.5,      // 50% - catches more parts
  balanced: 0.7,       // 70% - good middle ground  
  strict: 0.85,        // 85% - high precision
  range: [0.3, 0.95]   // Slider min/max
};
```

### 📊 **Google Sheets Customization**

Modify logging behavior in `sheetLogger.ts`:

```typescript
const LOGGING_CONFIG = {
  cooldownDuration: 5000,     // 5 seconds between logs
  confidenceFormat: 'decimal', // Send as 0.987, Sheets formats as %
  batchSize: 1,               // Individual vs batch logging
  retryAttempts: 3            // API failure retry count
};
```

### 🎨 **UI Theme Customization**

Update colors and styling in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        apollo: {
          50: '#f0f9ff',   // Light blue
          500: '#3b82f6',  // Primary blue
          900: '#1e293b'   // Dark slate
        }
      }
    }
  }
}
```

### 🔧 **Model Integration**

To integrate your own trained models:

1. **Replace Roboflow Model:**
   ```typescript
   // roboflowService.ts
   const API_KEY = "your-api-key";
   const MODEL_URL = "your-model/version";
   ```

2. **Update TensorFlow.js Model:**
   ```bash
   # Replace files in public/models/
   model.json      # Model architecture
   metadata.json   # Class labels  
   weights.bin     # Trained weights
   ```

## 🚀 Performance & Optimization

### ⚡ **Speed Optimizations**
- **🎯 YOLO Inference**: Sub-second detection response times
- **⚡ Webcam Processing**: 1-second intervals for real-time feel
- **💾 Model Caching**: Roboflow API responses cached locally  
- **🔄 Smart Updates**: Only re-render when detections change
- **📦 Code Splitting**: Lazy loading of heavy components

### 💾 **Memory Management**
- **🧹 Automatic Cleanup**: Canvas and tensor disposal after use
- **⏱️ Cooldown System**: Prevents memory leaks from rapid logging
- **📊 Efficient State**: Minimal re-renders with optimized React hooks
- **🔄 Stream Management**: Proper webcam stream cleanup on unmount

### 📊 **Monitoring & Analytics**
```typescript
// Built-in performance tracking
console.log(`Detection time: ${detectionTime}ms`);
console.log(`Confidence: ${confidence.toFixed(3)}`);
console.log(`Parts found: ${results.length}`);
```

### 🔧 **Browser Compatibility**
| Browser | Webcam | YOLO | Sheets | Status |
|---------|--------|------|--------|--------|
| **Chrome 90+** | ✅ | ✅ | ✅ | Recommended |
| **Firefox 88+** | ✅ | ✅ | ✅ | Fully Supported |
| **Safari 14+** | ✅ | ✅ | ✅ | Supported |
| **Edge 90+** | ✅ | ✅ | ✅ | Supported |

## 🐛 Troubleshooting & Support

### 🔧 **Common Issues & Solutions**

#### 📷 **Webcam Issues**
**Problem**: Camera not working or "Permission denied"
```bash
✅ Solutions:
• Grant camera permissions in browser settings
• Ensure HTTPS connection (required for webcam)
• Close other apps using camera (Zoom, Teams, etc.)
• Try refreshing the page and re-granting permissions
```

#### 🌐 **API Connection Issues**  
**Problem**: "Failed to detect parts" or network errors
```bash
✅ Solutions:
• Check internet connection
• Verify Roboflow API is accessible
• Try again in a few minutes (rate limiting)
• Use image upload mode if webcam fails
```

#### 📊 **Google Sheets Logging Issues**
**Problem**: Detections not appearing in spreadsheet
```bash
✅ Solutions:
• Wait 5 seconds between same part detections (cooldown)
• Check browser console for error messages
• Verify Google Sheets URL is accessible
• Try with higher confidence threshold (>50%)
```

#### 🎯 **Low Detection Accuracy**
**Problem**: Parts not being recognized or low confidence
```bash
✅ Solutions:
• Improve lighting conditions
• Clean camera lens or use higher resolution images
• Lower confidence threshold (30-50%)
• Try different angles and distances
• Ensure parts are clearly visible and unobstructed
```

#### 📱 **Mobile Performance Issues**
**Problem**: Slow performance on mobile devices
```bash
✅ Solutions:
• Close other browser tabs/apps
• Use image upload instead of live webcam
• Lower image resolution if possible
• Try in Chrome or Safari (best mobile support)
```

### 📋 **Debug Information**

Enable debug mode by opening browser console (F12) to see:
- Detection timing information
- Confidence scores for all parts
- API response details
- Error messages and stack traces

### 📞 **Getting Help**

1. **🐛 Check Console**: Open browser DevTools (F12) for error details
2. **📖 Documentation**: Review this README for configuration options
3. **🔄 Try Different Settings**: Adjust confidence threshold and detection mode
4. **📧 Report Issues**: Create detailed bug reports with:
   - Browser version and OS
   - Console error messages
   - Steps to reproduce the problem
   - Screenshots or videos if helpful

### ⚡ **Performance Tips**

**For Best Results:**
- 💡 Use **good lighting** (avoid shadows and glare)
- 📏 **Optimal distance**: 30-50cm from camera
- 🎯 **Clear background**: Minimize visual distractions  
- 🔄 **Steady positioning**: Hold parts still for 2-3 seconds
- 📱 **Use landscape mode** on mobile devices

## 🤝 Contributing & Development

### 🔧 **Development Setup**

```bash
# 1. Fork and clone the repository
git clone <your-fork-url>
cd Gujarat-Apollo-Parts-Identifier-main/project

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:5173
```

### 📋 **Development Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run preview      # Preview production build
npm run lint         # Run ESLint checks
npm type-check       # TypeScript type checking
```

### 🎯 **Contributing Guidelines**

1. **🐛 Bug Reports**: Include browser, OS, and reproduction steps
2. **✨ Feature Requests**: Describe use case and expected behavior  
3. **🔧 Pull Requests**: 
   - Follow existing code style
   - Add tests for new features
   - Update documentation as needed
   - Ensure all builds pass

### 🏗️ **Architecture Principles**

- **🎯 Component-First**: Reusable, testable React components
- **📝 Type Safety**: Comprehensive TypeScript coverage
- **⚡ Performance**: Optimize for real-time detection use cases
- **📱 Mobile-First**: Responsive design for all devices
- **🎨 Accessibility**: WCAG guidelines for inclusive design

## 📜 License & Legal

### 📄 **MIT License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### ⚖️ **Third-Party Services**

- **Roboflow**: Object detection API - [Terms of Service](https://roboflow.com/terms)
- **Google Sheets**: Data logging - [Privacy Policy](https://policies.google.com/privacy)
- **TensorFlow.js**: ML framework - [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0)

### 🏭 **Industrial Usage**

This software is designed for industrial use at Gujarat Apollo Industries Ltd. For commercial licensing or enterprise support, please contact the development team.

## 🙏 Acknowledgements & Credits

### 🏭 **Industry Partner**
- **[Gujarat Apollo Industries Ltd](https://www.apollo.co.in/)** - Problem definition, domain expertise, and real-world testing environment

### 🤖 **AI & Machine Learning**  
- **[Roboflow](https://roboflow.com/)** - YOLO model training platform and inference API
- **[Google Teachable Machine](https://teachablemachine.withgoogle.com/)** - Accessible ML model training
- **[TensorFlow.js](https://www.tensorflow.org/js)** - Client-side machine learning framework

### 🎨 **Frontend Technologies**
- **[React](https://reactjs.org/)** - Component-based UI framework
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework  
- **[Vite](https://vitejs.dev/)** - Next-generation build tool
- **[Lucide](https://lucide.dev/)** - Beautiful icon library

### 👥 **Open Source Community**
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript development
- **[Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)** - Image processing capabilities
- **[MediaDevices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)** - Webcam access

## � Contact & Support

### 🏭 **Industrial Inquiries**
- **Gujarat Apollo Industries Ltd**
- **Email**: [info@apollo.co.in](mailto:info@apollo.co.in)
- **Website**: [www.apollo.co.in](https://www.apollo.co.in/)
- **Location**: Mehsana, Gujarat, India

### 👨‍💻 **Technical Support**
- **GitHub Issues**: [Create an issue](../../issues) for bugs and feature requests
- **Documentation**: This README and inline code comments
- **Community**: Join discussions in GitHub Discussions

### 🌟 **Show Your Support**

If this project helps your manufacturing workflow:
- ⭐ **Star this repository** on GitHub
- 🍴 **Fork and contribute** improvements  
- 📢 **Share with others** in the manufacturing industry
- 📝 **Write about your experience** using the system

---

<div align="center">

**🔧 Built with ❤️ for Gujarat Apollo Industries Ltd, Mehsana**

*Transforming Industrial Manufacturing with AI-Powered Part Recognition*

![Made in India](https://img.shields.io/badge/Made%20in-India-orange)
![For Manufacturing](https://img.shields.io/badge/For-Manufacturing-blue)
![Open Source](https://img.shields.io/badge/Open-Source-green)

</div>