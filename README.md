# 🔧 Gujarat Apollo Parts Identifier

![Part Identifier](https://img.shields.io/badge/Gujarat%20Apollo-Parts%20Identifier-orange)
![React](https://img.shields.io/badge/React-18.x-brightgreen)
![YOLO](https://img.shields.io/badge/YOLO-Roboflow-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Google Sheets](https://img.shields.io/badge/Google-Sheets%20Integration-green)

## Next-Generation AI-Powered Jaw Crusher Parts Recognition System

This is a production-ready web application created for **Gujarat Apollo Industries Ltd** to streamline jaw crusher parts identification. Leveraging advanced YOLO object detection, real-time webcam analysis, and automated data logging, the system modernizes traditional manual identification into an efficient, AI-driven workflow.

## Why This Matters

For heavy machinery manufacturing, correct part identification is critical for:

- Fast assembly: Instant recognition speeds up the process
- Fewer errors: AI accuracy prevents costly mistakes  
- Automated inventory: Usage patterns tracked automatically
- Improved workflow: Streamlined identification increases productivity
- Reduced costs: Less manual inspection saves time and money

## Advanced Features

### Dual Detection Modes

- Image upload: Drag and drop or click to upload images for batch analysis
- Live webcam: Continuous real-time detection with full-screen camera feed
- Instant processing: Immediate feedback in less than a second

### AI-Powered Recognition

- YOLO object detection: Roboflow-trained model tuned for jaw crusher parts
- Multi-part detection: Identifies several parts at once with bounding boxes
- Smart labeling: Automatic part names and confidence percentages
- Visual overlay: Color-coded boxes show detection position

### User-Adjustable Confidence Control

- Adjustable threshold slider: Sensitivity configurable from 30% to 95%
- Quick presets: Sensitive (50%), Balanced (70%), Strict (85%)
- Real-time adjustment: Changes apply immediately
- Guidance: Built-in explanations about sensitivity levels

### Automated Data Logging

- Google Sheets integration: Detections logged automatically with timestamps
- Detailed analytics: Records part name, confidence, detection method, and time
- Smart cooldown: Avoids duplicate logs with 5-second intervals per part
- Persistent records: Building a long-term parts usage database

### Premium User Experience

- Responsive design optimized for desktop, mobile, and tablet
- Modern UI: Professional dark theme with glass morphism effects
- Smooth animations: Fluid transitions and subtle interactions
- Intuitive navigation: Clean layout, clear labeling, and a well-organized controls panel

## Quick Start

### Prerequisites

- Node.js 18+
- Web browser (Chrome, Firefox, Safari, or Edge)
- Webcam for live detection
- Internet connection (for Roboflow API and Google Sheets logging)

### Installation & Setup

1. Clone the repository
   ```
   git clone <repository-url>
   cd Gujarat-Apollo-Parts-Identifier-main/project
   ```
2. Install dependencies
   ```
   npm install
   ```
3. Start the development server
   ```
   npm run dev
   ```
4. Open your browser and visit `http://localhost:5173` to start identifying parts

### Immediate Use

- Works instantly with a pre-trained YOLO model
- Demo mode: Test with sample images or webcam
- Google Sheets logging is functional out-of-the-box

## Production Deployment

### Build for Production

Create an optimized build:
```
npm run build
```
Deploy files from the `dist/` folder.

### Deployment Options

| Platform      | Setup                 | Features                              |
|---------------|----------------------|---------------------------------------|
| Vercel        | `vercel deploy`      | Auto-deploy, edge functions, domains  |
| Netlify       | Drag & drop `dist/`  | Branch deploys, CDN, form handling    |
| GitHub Pages  | Enable in settings   | Free hosting, custom domains          |
| Firebase      | `firebase deploy`    | Global CDN, real-time features        |

### Environment Configuration

Configurable for production:
- Custom Google Sheets API endpoints
- Roboflow rate limiting
- Analytics integration
- Error monitoring tools

## AI Architecture & Detection System

### Primary: YOLO Object Detection (Roboflow)

**Industry-Grade Multi-Object Recognition**

- Model: `jaw-crusher-parts-identification/3`
- API: Roboflow Inference
- Real-time detection: sub-second response
- Trained on jaw crusher parts dataset

**Capabilities:**
- Precise bounding boxes
- Multiple part identification at once
- Confidence scoring for each part
- Visual overlays on live feed
- Updates every second in webcam mode

**Supported Jaw Crusher Parts:**
```
Jaw Plates, Eccentric Shaft, Toggle Plates, Bearings, Pitman, Springs, Cheek Plates, Flywheel
```

**API Configuration:**
```
const ROBOFLOW_CONFIG = {
  apiKey: "k0YqQQHbnNVdI9tnKzL6",
  model: "jaw-crusher-parts-identification/3", 
  confidence: 0.4,
  overlap: 0.5
};
```

### Fallback: Teachable Machine (TensorFlow.js)

**Local Processing with Grid Simulation**

- Purpose: Offline use when API is unavailable
- Classification and simulated bounding boxes with 3x3 visual grid
- Model files stored in `/public/models/`

**Model Files Structure:**
```
public/models/
├── model.json
├── metadata.json
├── weights.bin
```

## Google Sheets Integration & Data Analytics

### Automated Logging System

Every detection is automatically logged for analysis:

**Data Points Captured:**
```
Timestamp, Part Name, Confidence Score, Detection Source, Threshold Used, Session ID
```

**Logging Features:**
- 5-second cooldown prevents spam
- Confidence scores formatted as percentages
- Tracks source (webcam vs image upload)
- Persistent across browser sessions

**Analytics Dashboard:**
- Detection frequency (most common parts)
- Confidence trends (average over time)
- Usage patterns (peak times, methods)
- Part distribution

### Configuration

Can be customized:
```
const SHEET_CONFIG = {
  url: "https://docs.google.com/forms/d/e/...",
  cooldownDuration: 5000,
  autoFormat: true
};
```

## User Guide & Best Practices

### Image Upload Mode
1. Click "Upload Images"
2. Drag-and-drop or browse files
3. Click "Identify Parts"
4. Review detected results
5. Remove and retry if needed

**Tips for Best Results:**
- Use high-resolution images (1280x720 or better)
- Good lighting and part visibility
- Parts positioned clearly, avoid overlap
- Try varied angles

### Live Webcam Mode (Recommended)
1. Click "Live Detection"
2. Allow webcam access
3. Click "Start Webcam"
4. Adjust detection threshold if needed
5. Hold part in front of camera
6. View results in real time

**Threshold Control:**
- Sensitive (50%): more results, possible false positives
- Balanced (70%): recommended for most uses
- Strict (85%): very high confidence
- Custom slider (30–95%)

### Mobile Usage

- Portrait mode support
- Switch cameras (front/rear)
- Touch controls for settings
- Full screen webcam

## Technical Architecture

### Frontend Stack
```
React 18         // Component framework
TypeScript 5.x   // Type-safe programming
Tailwind CSS     // Styling
react-webcam     // Webcam integration
Lucide React     // Icons
Vite             // Build tool
```

### AI/ML Pipeline
```
Roboflow YOLO    // Primary object detection
TensorFlow.js    // Fallback model
Canvas API       // Image preprocessing
MediaDevices API // Webcam handling
WebGL Backend    // GPU acceleration
```

### Project Structure
```
Gujarat-Apollo-Parts-Identifier-main/
├── project/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── ImageUpload.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── ResultsDisplay.tsx
│   │   │   ├── BoundingBoxOverlay.tsx
│   │   │   └── LoadingScreen.tsx
│   │   ├── pages/
│   │   │   ├── LiveDetection.tsx
│   │   │   └── MultiplePartsIdentification.tsx
│   │   ├── services/
│   │   │   └── roboflowService.ts
│   │   ├── utils/
│   │   │   ├── modelUtils.ts
│   │   │   └── sheetLogger.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── index.css
│   │   ├── slider-styles.css
│   │   └── App.tsx
│   ├── public/
│   │   └── models/
│   ├── package.json
│   └── vite.config.ts
└── vercel.json
```

### Data Flow Architecture
```
Image/Webcam Input
      ↓
Roboflow YOLO API
      ↓
Detection Results
      ↓
Bounding Box Overlay
      ↓
Google Sheets Logging
      ↓
Analytics Dashboard
```

## Advanced Configuration & Customization

### Confidence Threshold Tuning

Adjust sensitivity in `LiveDetection.tsx`:
```
const CONFIDENCE_SETTINGS = {
  default: 0.8,
  sensitive: 0.5,
  balanced: 0.7,
  strict: 0.85,
  range: [0.3, 0.95]
};
```

### Google Sheets Customization

Configure in `sheetLogger.ts`:
```
const LOGGING_CONFIG = {
  cooldownDuration: 5000,
  confidenceFormat: 'decimal',
  batchSize: 1,
  retryAttempts: 3
};
```

### UI Theme Customization

Edit `tailwind.config.js`:
```
module.exports = {
  theme: {
    extend: {
      colors: {
        apollo: {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e293b'
        }
      }
    }
  }
}
```

### Model Integration

To use a custom-trained model:
```
// roboflowService.ts
const API_KEY = "your-api-key";
const MODEL_URL = "your-model/version";
```
Replace TensorFlow files in `/public/models/` as needed.

## Performance & Optimization

### Speed Optimizations

- YOLO inference responds in under a second
- Webcam processes at 1-second intervals
- Model responses cached locally
- Efficient rendering updates only when changes detected
- Lazy load heavy components for faster initial load

### Memory Management

- Automatic cleanup of unused tensors and canvases
- Smart logging cooldown for efficiency
- Optimized React state and hooks
- Proper disposal of webcam streams

### Monitoring & Analytics
```
console.log(`Detection time: ${detectionTime}ms`);
console.log(`Confidence: ${confidence.toFixed(3)}`);
console.log(`Parts found: ${results.length}`);
```

### Browser Compatibility

| Browser        | Webcam | YOLO | Sheets | Status      |
|----------------|--------|------|--------|-------------|
| Chrome 90+     | Yes    | Yes  | Yes    | Recommended |
| Firefox 88+    | Yes    | Yes  | Yes    | Supported   |
| Safari 14+     | Yes    | Yes  | Yes    | Supported   |
| Edge 90+       | Yes    | Yes  | Yes    | Supported   |

## Troubleshooting & Support

### Common Issues & Solutions

#### Webcam
*Problem*: Camera not working or permission denied
```
-  Grant camera access
-  Use HTTPS
-  Close other apps using the camera
-  Refresh and retry
```

#### API Connection
*Problem*: Detection fails or network errors
```
-  Check internet connection
-  Verify API accessibility
-  Retry after some time
-  Use image upload if webcam fails
```

#### Sheets Logging
*Problem*: Data not appearing in Sheets
```
-  Wait 5 seconds between detections
-  Check console for errors
-  Verify Google Sheets URL
-  Raise confidence threshold
```

#### Detection Accuracy
*Problem*: Parts not recognized or low confidence
```
-  Improve lighting
-  Clean lens, use high-res images
-  Lower confidence threshold
-  Adjust angle and distance
-  Make parts clearly visible
```

#### Mobile Performance
*Problem*: Slow on mobile
```
-  Close other browser tabs
-  Use image upload mode
-  Lower image resolution
-  Prefer Chrome or Safari
```

### Debug Information

Open browser console for:
- Detection timing
- Confidence scores
- API details
- Errors or stack traces

### Getting Help

1. Check console logs (F12)
2. Review documentation (README, code comments)
3. Adjust detection settings if needed
4. Report issues with browser, OS, screenshots, and reproduction steps

### Performance Tips

- Good lighting, avoid shadows
- Position 30-50cm from camera
- Keep background clear
- Hold item steady for 2-3 seconds
- Use landscape mode on mobile

## Contributing & Development

### Development Setup
```
git clone <your-fork-url>
cd Gujarat-Apollo-Parts-Identifier-main/project
npm install
npm run dev
# Visit http://localhost:5173
```

### Development Scripts
```
npm run dev       # Development server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Lint checks
npm type-check    # Type checks
```

### Contributing Guidelines

1. Bug reports: Include browser, OS, and steps
2. Feature requests: Clearly describe use case
3. Pull requests: 
   - Match code style
   - Include tests
   - Update docs
   - Pass all builds

### Architecture Principles

- Component-based React
- Strong TypeScript typing
- Optimized for real-time detection
- Mobile-first design
- Accessibility standards followed

## License & Legal

### MIT License

Licensed under MIT — see the [LICENSE](LICENSE) file.

### Third-Party Services

- Roboflow: Object detection API ([Terms of Service](https://roboflow.com/terms))
- Google Sheets: Data logging ([Privacy Policy](https://policies.google.com/privacy))
- TensorFlow.js: ML framework ([Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0))

### Industrial Usage

Designed for Gujarat Apollo Industries Ltd.  
Contact developers for commercial/enterprise support.

## Acknowledgements & Credits

### Industry Partner
- [Gujarat Apollo Industries Ltd](https://www.apollo.co.in/) — problem definition and testing

### AI & Machine Learning  
- [Roboflow](https://roboflow.com/) — YOLO training and inference
- [Google Teachable Machine](https://teachablemachine.withgoogle.com/) — ML training
- [TensorFlow.js](https://www.tensorflow.org/js) — client-side implementation

### Frontend Technologies
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Lucide](https://lucide.dev/)

### Open Source Community
- [TypeScript](https://www.typescriptlang.org/)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [MediaDevices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)

## Contact & Support

### Industrial Inquiries
- Gujarat Apollo Industries Ltd
- Email: info@apollo.co.in
- Website: www.apollo.co.in
- Location: Mehsana, Gujarat, India

### Technical Support
- GitHub Issues: Create bug reports and feature requests
- Documentation: README and inline code comments
- Community: GitHub Discussions

### Show Your Support

If this project helps your workflow:
- Star the repository
- Fork and contribute
- Share with peers in manufacturing
- Write about your experience

---

<div align="center">

**Built for Gujarat Apollo Industries Ltd, Mehsana**

*Transforming Industrial Manufacturing with AI-Powered Part Recognition*

![Made in India](https://img.shields.io/badge/Made%20in-India-orange)
![For Manufacturing](https://img.shields.io/badge/For-Manufacturing-blue)
![Open Source](https://img.shields.io/badge/Open-Source-green)

</div>
