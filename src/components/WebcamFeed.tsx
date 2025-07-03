import React from "react";
import Webcam from "react-webcam";

interface WebcamFeedProps {
  active: boolean;
}

const WebcamFeed = ({ active }: WebcamFeedProps) => {
  if (!active) {
    return (
      <div className="bg-gray-200 aspect-video w-full flex items-center justify-center">
        <p className="text-gray-500 text-center">
          Webcam feed inactive
          <br />
          Start the webcam to begin live part detection
        </p>
      </div>
    );
  }

  return <Webcam audio={false} screenshotFormat="image/jpeg" className="w-full" />;
};

export default WebcamFeed;