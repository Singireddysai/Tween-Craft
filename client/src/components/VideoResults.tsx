import { useEffect, useState } from "react";
import { useNavigate } from "wouter";
import { Download, Share } from "lucide-react";

interface VideoResultsProps {
  videoPath: string;
  processingTime: number;
}

const VideoResults: React.FC<VideoResultsProps> = ({ videoPath, processingTime }) => {
  const navigate = useNavigate();
  const [videoInfo, setVideoInfo] = useState({ width: 0, height: 0 });
  
  // Get video dimensions when loaded
  const handleVideoMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    setVideoInfo({
      width: video.videoWidth,
      height: video.videoHeight
    });
  };
  
  const formatProcessingTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  return (
    <section id="result-section" className="mb-12">
      <div className="bg-[#262626] rounded-xl p-6 md:p-8 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-['K2D'] font-semibold">Result</h2>
          <div className="flex space-x-3">
            <a 
              href={videoPath}
              download
              className="text-[#9CA3AF] hover:text-white bg-[#1E1E1E] p-2 rounded-md"
              title="Download Video"
            >
              <Download className="h-5 w-5" />
            </a>
            <button 
              className="text-[#9CA3AF] hover:text-white bg-[#1E1E1E] p-2 rounded-md"
              title="Share"
              onClick={() => {
                // Copy the video URL to clipboard
                const videoUrl = window.location.origin + videoPath;
                navigator.clipboard.writeText(videoUrl);
                alert("Video URL copied to clipboard");
              }}
            >
              <Share className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="bg-black rounded-lg overflow-hidden">
          <div className="relative">
            <video 
              id="resultVideo" 
              controls 
              autoPlay 
              loop 
              className="w-full"
              onLoadedMetadata={handleVideoMetadata}
            >
              <source src={videoPath} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
              Enhanced: <span>{videoInfo.width}x{videoInfo.height}, 60fps</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button 
            className="bg-[#1E1E1E] text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            onClick={() => navigate("/")}
          >
            Process Another Video
          </button>
        </div>
        
        <div className="mt-6 bg-[#1E1E1E] rounded-lg p-4">
          <h4 className="font-medium mb-2">Processing Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-[#9CA3AF]">Method</p>
              <p>GMFSS Fortuna VFI</p>
            </div>
            <div>
              <p className="text-[#9CA3AF]">Frame Rate</p>
              <p>10fps → 60fps (6x)</p>
            </div>
            <div>
              <p className="text-[#9CA3AF]">Processing Time</p>
              <p>{formatProcessingTime(processingTime)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoResults;
