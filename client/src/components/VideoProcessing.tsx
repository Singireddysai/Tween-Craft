import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { BarChart3, RefreshCw, Film, Zap, AlertTriangle, ArrowLeft } from "lucide-react";

interface VideoProcessingProps {
  fileId: string;
  fileName: string;
  filePath: string;
  multiplier: number;
  onComplete: () => void;
  socket: WebSocket | null;
}

const VideoProcessing: React.FC<VideoProcessingProps> = ({ 
  fileId, 
  fileName, 
  filePath,
  multiplier,
  onComplete, 
  socket 
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [stage, setStage] = useState<string>("analyzing");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // Start processing the video
    const processVideo = async () => {
      try {
        setProgress(10);
        setStage("analyzing");
        
        const response = await apiRequest("POST", `/api/process/${fileId}`, {
          filePath,
          multiplier
        });
        
        if (!response.ok) {
          throw new Error("Failed to process video");
        }
        
        const data = await response.json();
        
        // Navigate to results page
        setLocation(`/results/${fileId}`);
        
      } catch (error) {
        console.error("Processing error:", error);
        setError("Failed to process video. Please try again.");
        
        toast({
          title: "Processing error",
          description: "There was an error processing your video",
          variant: "destructive"
        });
      }
    };
    
    processVideo();
    
    // Listen for WebSocket messages
    if (socket) {
      const handleMessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.fileId !== fileId) return;
          
          switch (data.type) {
            case 'processing_progress':
              setProgress(data.progress);
              setStage(data.status);
              break;
              
            case 'processing_complete':
              setProgress(100);
              setStage("complete");
              onComplete();
              setLocation(`/results/${fileId}`);
              break;
              
            case 'processing_error':
              setError(data.error);
              toast({
                title: "Processing error",
                description: data.error,
                variant: "destructive"
              });
              break;
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
      
      socket.addEventListener("message", handleMessage);
      
      return () => {
        socket.removeEventListener("message", handleMessage);
      };
    }
  }, [fileId, filePath, multiplier, socket, toast, setLocation, onComplete]);
  
  // Simulate progress for better UX
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Don't go beyond 95% as we wait for actual completion
        if (prev < 95) {
          return prev + 1;
        }
        return prev;
      });
      
      // Update processing stage based on progress
      if (progress < 25) {
        setStage("analyzing");
      } else if (progress < 50) {
        setStage("upscaling");
      } else if (progress < 75) {
        setStage("generating");
      } else {
        setStage("encoding");
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [progress]);
  
  if (error) {
    return (
      <section className="mb-12">
        <motion.div 
          className="glass-panel p-8 glow-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-7 h-7 mr-3 text-red-400" />
            <h2 className="text-3xl font-bold text-red-400">Processing Error</h2>
          </div>
          
          <div className="mt-6 text-center py-8 bg-gray-900/50 rounded-xl p-6">
            <p className="text-gray-300 mb-8 text-lg">{error}</p>
            
            <motion.button 
              onClick={() => setLocation("/")}
              className="bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium flex items-center mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Try Again
            </motion.button>
          </div>
        </motion.div>
      </section>
    );
  }
  
  return (
    <section id="processing-section" className="mb-12">
      <motion.div 
        className="glass-panel p-8 glow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center mb-6">
          <RefreshCw className="w-7 h-7 mr-3 text-purple-400 animate-spin" />
          <h2 className="text-3xl font-bold violet-gradient-text">Processing Video</h2>
        </div>
        
        <div className="mt-8 flex flex-col items-center">
          {/* File info card */}
          <div className="mb-8 bg-gray-900/50 p-4 rounded-lg w-full max-w-lg flex items-center border border-gray-800">
            <div className="bg-purple-900/30 p-3 rounded-lg mr-4">
              <Film className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium text-white">{fileName}</h3>
              <p className="text-gray-400 text-sm">Applying {multiplier}x frame interpolation</p>
            </div>
          </div>
          
          {/* Processing indicator and animation */}
          <div className="relative mb-8">
            <motion.div 
              className="w-32 h-32 rounded-full border-4 border-purple-800/30 flex items-center justify-center"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <motion.div 
                className="absolute w-4 h-4 rounded-full bg-purple-600"
                style={{ top: 0, left: "calc(50% - 8px)" }}
              />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-3xl font-bold text-white">{progress}%</div>
            </div>
          </div>
          
          <div className="text-center max-w-xl">
            <p className="text-xl mb-2 font-medium">Enhancing your video with GMFSS Fortuna</p>
            <p className="text-gray-400 mb-8">This may take several minutes depending on video length and complexity</p>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-800 rounded-full h-3 mb-6 overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-purple-700 to-purple-400 h-3"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            {/* Processing steps */}
            <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800 text-left">
              <div className="grid grid-cols-1 gap-4">
                <div className={`flex items-center ${stage === "analyzing" ? "text-purple-400" : (progress > 25 ? "text-green-400" : "text-gray-500")}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 
                    ${stage === "analyzing" ? "bg-purple-900/50 animate-pulse" : (progress > 25 ? "bg-green-900/20" : "bg-gray-800")}`}>
                    {stage === "analyzing" ? (
                      <BarChart3 className="h-4 w-4" />
                    ) : progress > 25 ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.div>
                    ) : "1"}
                  </div>
                  <div>
                    <p className="font-medium">Analyzing video frames</p>
                    {stage === "analyzing" && <p className="text-xs text-gray-400">Extracting frames and analyzing content</p>}
                  </div>
                </div>
                
                <div className={`flex items-center ${stage === "upscaling" ? "text-purple-400" : (progress > 50 ? "text-green-400" : "text-gray-500")}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 
                    ${stage === "upscaling" ? "bg-purple-900/50 animate-pulse" : (progress > 50 ? "bg-green-900/20" : "bg-gray-800")}`}>
                    {stage === "upscaling" ? (
                      <Zap className="h-4 w-4" />
                    ) : progress > 50 ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.div>
                    ) : "2"}
                  </div>
                  <div>
                    <p className="font-medium">Upscaling to target resolution</p>
                    {stage === "upscaling" && <p className="text-xs text-gray-400">Enhancing image quality and detail</p>}
                  </div>
                </div>
                
                <div className={`flex items-center ${stage === "generating" ? "text-purple-400" : (progress > 75 ? "text-green-400" : "text-gray-500")}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 
                    ${stage === "generating" ? "bg-purple-900/50 animate-pulse" : (progress > 75 ? "bg-green-900/20" : "bg-gray-800")}`}>
                    {stage === "generating" ? (
                      <RefreshCw className="h-4 w-4" />
                    ) : progress > 75 ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.div>
                    ) : "3"}
                  </div>
                  <div>
                    <p className="font-medium">Generating intermediate frames ({multiplier}x interpolation)</p>
                    {stage === "generating" && <p className="text-xs text-gray-400">Creating smooth motion between existing frames</p>}
                  </div>
                </div>
                
                <div className={`flex items-center ${stage === "encoding" ? "text-purple-400" : (progress === 100 ? "text-green-400" : "text-gray-500")}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 
                    ${stage === "encoding" ? "bg-purple-900/50 animate-pulse" : (progress === 100 ? "bg-green-900/20" : "bg-gray-800")}`}>
                    {stage === "encoding" ? (
                      <Film className="h-4 w-4" />
                    ) : progress === 100 ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.div>
                    ) : "4"}
                  </div>
                  <div>
                    <p className="font-medium">Encoding final video</p>
                    {stage === "encoding" && <p className="text-xs text-gray-400">Combining frames into a smooth 60fps video</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default VideoProcessing;
