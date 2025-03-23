import { useState, useEffect } from "react";
import { useNavigate } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
  const navigate = useNavigate();
  
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
        navigate(`/results/${fileId}`);
        
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
              navigate(`/results/${fileId}`);
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
  }, [fileId, filePath, multiplier, socket, toast, navigate, onComplete]);
  
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
        <div className="bg-[#262626] rounded-xl p-6 md:p-8 border border-gray-700">
          <h2 className="text-2xl font-['K2D'] font-semibold mb-4">Processing Error</h2>
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => navigate("/")}
              className="bg-[#1E1E1E] hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="processing-section" className="mb-12">
      <div className="bg-[#262626] rounded-xl p-6 md:p-8 border border-gray-700">
        <h2 className="text-2xl font-['K2D'] font-semibold mb-4">Processing Video</h2>
        
        <div className="flex flex-col items-center py-8">
          <div className="loader mb-6 w-[90px] h-[14px] shadow-[0_3px_0_#fff] bg-[linear-gradient(#fff_0_0)_50%/2px_100%_no-repeat] grid">
            <div className="before:content-[''] before:grid-area-[1/1] before:bg-[radial-gradient(circle_closest-side,#fff_92%,#0000)_0_0_/_calc(100%/4)_100%] before:clip-path-[inset(0_50%_0_0)] before:animate-[loaderWhite_1s_infinite_linear]
                 after:content-[''] after:grid-area-[1/1] after:bg-[radial-gradient(circle_closest-side,#ff6b6b_92%,#0000)_0_0_/_calc(100%/4)_100%] after:clip-path-[inset(0_0_0_50%)] after:animate-[loaderColor_1s_infinite_linear]">
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg mb-2">Enhancing your video with GMFSS Fortuna</p>
            <p className="text-[#9CA3AF] text-sm mb-6">This may take several minutes depending on video length</p>
            
            <div className="w-full max-w-md bg-[#1E1E1E] rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-[#ff6b6b] to-[#4cf977] h-3 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="bg-[#1E1E1E] rounded-lg p-3 font-mono text-xs text-left">
              <p className={stage === "analyzing" ? "text-blue-400 animate-pulse" : "text-green-400"}>
                {stage === "analyzing" ? "⟳" : "✓"} Analyzing video frames
              </p>
              <p className={stage === "upscaling" ? "text-blue-400 animate-pulse" : (progress > 25 ? "text-green-400" : "text-[#9CA3AF]")}>
                {stage === "upscaling" ? "⟳" : (progress > 25 ? "✓" : "□")} Upscaling to target resolution
              </p>
              <p className={stage === "generating" ? "text-blue-400 animate-pulse" : (progress > 50 ? "text-green-400" : "text-[#9CA3AF]")}>
                {stage === "generating" ? "⟳" : (progress > 50 ? "✓" : "□")} Generating intermediate frames ({multiplier}x interpolation)
              </p>
              <p className={stage === "encoding" ? "text-blue-400 animate-pulse" : (progress > 75 ? "text-green-400" : "text-[#9CA3AF]")}>
                {stage === "encoding" ? "⟳" : (progress > 75 ? "✓" : "□")} Encoding final video
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoProcessing;
