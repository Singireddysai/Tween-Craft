import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Download, Share, CheckCircle, ArrowLeft, Clock, Film, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface VideoResultsProps {
  videoPath: string;
  processingTime: number;
}

const VideoResults: React.FC<VideoResultsProps> = ({ videoPath, processingTime }) => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
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
  
  const handleCopyShareLink = () => {
    const videoUrl = window.location.origin + videoPath;
    navigator.clipboard.writeText(videoUrl);
    
    toast({
      title: "Link copied!",
      description: "Video URL has been copied to clipboard"
    });
  };
  
  return (
    <section id="result-section" className="mb-12">
      <motion.div 
        className="glass-panel p-8 glow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-8">
          <CheckCircle className="w-7 h-7 mr-3 text-purple-400" />
          <h2 className="text-3xl font-bold violet-gradient-text">Processing Complete</h2>
        </div>
        
        <div className="p-6 bg-gray-900/50 rounded-xl border border-purple-900/20 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Enhanced Video</h3>
            <div className="flex space-x-3">
              <motion.a 
                href={videoPath}
                download
                className="text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 p-3 rounded-lg flex items-center transition-all duration-300"
                title="Download Video"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Download</span>
              </motion.a>
              <motion.button 
                className="text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 p-3 rounded-lg flex items-center transition-all duration-300"
                title="Share"
                onClick={handleCopyShareLink}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Share</span>
              </motion.button>
            </div>
          </div>
          
          <motion.div 
            className="bg-black rounded-xl overflow-hidden glow-card"
            whileHover={{ scale: 1.01 }}
          >
            <div className="relative">
              <video 
                id="resultVideo" 
                controls 
                autoPlay 
                loop 
                className="w-full max-h-[600px]"
                onLoadedMetadata={handleVideoMetadata}
              >
                <source src={videoPath} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute top-4 left-4 backdrop-blur-md bg-black/50 text-white text-xs px-3 py-2 rounded-full font-medium border border-purple-900/30">
                <span className="text-purple-400">Enhanced: </span> 
                <span>{videoInfo.width}x{videoInfo.height}, 60fps</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Processing Details */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Cpu className="w-5 h-5 mr-2 text-purple-400" />
            <h3 className="text-xl font-bold">Processing Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-900/30 rounded-xl p-6 border border-gray-800">
            <div className="flex">
              <div className="bg-purple-900/20 p-3 rounded-lg mr-4">
                <Film className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Method</p>
                <p className="font-medium text-white">GMFSS Fortuna VFI</p>
                <p className="text-xs text-gray-500 mt-1">State-of-the-art frame interpolation</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="bg-purple-900/20 p-3 rounded-lg mr-4">
                <svg className="h-5 w-5 text-purple-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 10H7C9 10 10 9 10 7V5C10 3 9 2 7 2H5C3 2 2 3 2 5V7C2 9 3 10 5 10Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 10H19C21 10 22 9 22 7V5C22 3 21 2 19 2H17C15 2 14 3 14 5V7C14 9 15 10 17 10Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 22H19C21 22 22 21 22 19V17C22 15 21 14 19 14H17C15 14 14 15 14 17V19C14 21 15 22 17 22Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 22H7C9 22 10 21 10 19V17C10 15 9 14 7 14H5C3 14 2 15 2 17V19C2 21 3 22 5 22Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Frame Rate</p>
                <p className="font-medium text-white">10fps → 60fps (6x)</p>
                <p className="text-xs text-gray-500 mt-1">6x frame multiplication</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="bg-purple-900/20 p-3 rounded-lg mr-4">
                <Clock className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Processing Time</p>
                <p className="font-medium text-white">{formatProcessingTime(processingTime)}</p>
                <p className="text-xs text-gray-500 mt-1">Total processing duration</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <motion.button 
            className="btn-gradient py-3 px-8 flex items-center"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Process Another Video
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default VideoResults;
