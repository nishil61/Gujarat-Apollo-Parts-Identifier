import React from 'react';
import { DetectionResult } from '../types';

interface BoundingBoxOverlayProps {
  detections: DetectionResult[];
  containerWidth: number;
  containerHeight: number;
  imageWidth: number;
  imageHeight: number;
  className?: string;
}

const BoundingBoxOverlay: React.FC<BoundingBoxOverlayProps> = ({
  detections,
  containerWidth,
  containerHeight,
  imageWidth,
  imageHeight,
  className = ''
}) => {
  // Calculate scale factors to map from image coordinates to container coordinates
  const scaleX = containerWidth / imageWidth;
  const scaleY = containerHeight / imageHeight;

  // Color palette for different part types
  const getBoxColor = (label: string, index: number): string => {
    const colorMap: { [key: string]: string } = {
      'jaw_plate': '#ef4444',      // red
      'toggle_plate': '#3b82f6',   // blue
      'eccentric_shaft': '#10b981', // green
      'bearing': '#f59e0b',        // yellow
      'spring': '#8b5cf6',         // purple
      'pitman': '#06b6d4',         // cyan
      'cheek_plate': '#f97316',    // orange
      'flywheel': '#84cc16',       // lime
    };
    
    return colorMap[label] || `hsl(${(index * 60) % 360}, 70%, 50%)`;
  };

  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: containerWidth, height: containerHeight }}
    >
      {detections
        .filter(detection => detection.bbox) // Only show detections with bounding boxes
        .map((detection, index) => {
          const bbox = detection.bbox!;
          const color = getBoxColor(detection.label, index);
          
          // Count how many of the same part type exist in total
          const samePartCount = detections.filter(d => d.label === detection.label && d.bbox).length;
          const samePartsBefore = detections.slice(0, index).filter(d => d.label === detection.label && d.bbox).length;
          const partNumber = samePartsBefore + 1;
          
          // Only add numbering if there are multiple of the same part type
          const displayLabel = samePartCount > 1 
            ? `${detection.label.replace(/_/g, ' ')} #${partNumber}` 
            : detection.label.replace(/_/g, ' ');
          
          // Scale bounding box coordinates
          const scaledX = bbox.x * scaleX;
          const scaledY = bbox.y * scaleY;
          const scaledWidth = bbox.width * scaleX;
          const scaledHeight = bbox.height * scaleY;
          
          // Ensure bounds are within container
          const clampedX = Math.max(0, Math.min(scaledX, containerWidth - scaledWidth));
          const clampedY = Math.max(0, Math.min(scaledY, containerHeight - scaledHeight));
          const clampedWidth = Math.min(scaledWidth, containerWidth - clampedX);
          const clampedHeight = Math.min(scaledHeight, containerHeight - clampedY);
          
          return (
            <div key={`${detection.label}-${index}-${detection.timestamp}`}>
              {/* Bounding box */}
              <div
                className="absolute border-2 rounded-sm transition-all duration-300"
                style={{
                  left: clampedX,
                  top: clampedY,
                  width: clampedWidth,
                  height: clampedHeight,
                  borderColor: color,
                  boxShadow: `0 0 10px ${color}40`,
                  backgroundColor: `${color}10`
                }}
              />
              
              {/* Label with confidence */}
              <div
                className="absolute text-white text-xs font-bold px-2 py-1 rounded-sm shadow-lg z-10"
                style={{
                  left: clampedX,
                  top: Math.max(0, clampedY - 28),
                  backgroundColor: color,
                  fontSize: '11px',
                  lineHeight: '1.2',
                  minWidth: 'max-content',
                  maxWidth: clampedWidth
                }}
              >
                <div className="truncate">
                  {displayLabel}
                </div>
                <div>
                  {(detection.confidence * 100).toFixed(1)}%
                </div>
              </div>
              
              {/* Confidence indicator dot */}
              <div
                className="absolute w-2 h-2 rounded-full animate-pulse"
                style={{
                  right: Math.max(0, containerWidth - clampedX - clampedWidth + 4),
                  top: clampedY + 4,
                  backgroundColor: color,
                  opacity: detection.confidence
                }}
              />
            </div>
          );
        })}
        
      {/* Detection count indicator - positioned in bottom-right to avoid all overlaps */}
      {detections.length > 0 && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
          {detections.length} part{detections.length !== 1 ? 's' : ''} detected
        </div>
      )}
    </div>
  );
};

export default BoundingBoxOverlay;
