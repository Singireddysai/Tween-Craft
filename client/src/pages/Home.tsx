import { useState, useEffect } from "react";
import VideoUploader from "@/components/VideoUploader";
import VideoProcessing from "@/components/VideoProcessing";
import WorkflowSteps from "@/components/WorkflowSteps";
import RecentOutputs from "@/components/RecentOutputs";
import { motion } from "framer-motion";
import { Zap, Code, Info } from "lucide-react";

interface HomeProps {
  socket: WebSocket | null;
}

const Home: React.FC<HomeProps> = ({ socket }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [fileInfo, setFileInfo] = useState<{
    id: string;
    path: string;
    name: string;
    multiplier: number;
  } | null>(null);
  
  const handleUploadSuccess = (data: { fileId: string, fileName: string, filePath: string, multiplier: number }) => {
    setFileInfo({
      id: data.fileId,
      path: data.filePath,
      name: data.fileName,
      multiplier: data.multiplier
    });
    setActiveStep(2);
    setIsProcessing(true);
  };
  
  const handleProcessingComplete = () => {
    setIsProcessing(false);
    setActiveStep(3);
  };
  
  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.main 
      className="container mx-auto px-6 py-8 md:py-12 max-w-6xl flex-grow"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Hero Section */}
      <motion.div 
        className="mb-12 text-center" 
        variants={itemVariants}
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
          <span className="violet-gradient-text">TWEEN</span> CRAFT
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto opacity-90">
          Professional video frame interpolation with GMFSS Fortuna technology
        </p>
        
        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <div className="glass-nav px-4 py-2 rounded-full border border-purple-500/20 flex items-center shadow-sm">
            <Zap className="h-4 w-4 text-purple-400 mr-2" />
            <span className="text-sm">6x frame rate</span>
          </div>
          <div className="glass-nav px-4 py-2 rounded-full border border-purple-500/20 flex items-center shadow-sm">
            <svg className="h-4 w-4 text-purple-400 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 14H8" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 18H10" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 14H19" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 18H19" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 9C8.10457 9 9 8.10457 9 7C9 5.89543 8.10457 5 7 5C5.89543 5 5 5.89543 5 7C5 8.10457 5.89543 9 7 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 9C18.1046 9 19 8.10457 19 7C19 5.89543 18.1046 5 17 5C15.8954 5 15 5.89543 15 7C15 8.10457 15.8954 9 17 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm">Smooth motion</span>
          </div>
          <div className="glass-nav px-4 py-2 rounded-full border border-purple-500/20 flex items-center shadow-sm">
            <Code className="h-4 w-4 text-purple-400 mr-2" />
            <span className="text-sm">ComfyUI powered</span>
          </div>
        </div>
      </motion.div>
      
      {/* Glowing Orb Effects */}
      <div className="fixed -top-20 right-10 w-60 h-60 rounded-full bg-purple-600/20 blur-3xl pointer-events-none"></div>
      <div className="fixed -bottom-40 left-10 w-80 h-80 rounded-full bg-purple-900/20 blur-3xl pointer-events-none"></div>
      
      {/* Workflow Steps */}
      <motion.div variants={itemVariants}>
        <WorkflowSteps activeStep={activeStep} />
      </motion.div>
      
      {/* Content Section */}
      <motion.div 
        className="my-10"
        variants={itemVariants}
      >
        {activeStep === 1 && (
          <VideoUploader 
            onUploadSuccess={handleUploadSuccess}
            socket={socket}
          />
        )}
        
        {activeStep === 2 && isProcessing && fileInfo && (
          <VideoProcessing
            fileId={fileInfo.id}
            fileName={fileInfo.name}
            filePath={fileInfo.path}
            multiplier={fileInfo.multiplier}
            onComplete={handleProcessingComplete}
            socket={socket}
          />
        )}
      </motion.div>
      
      {/* Recent Outputs Section */}
      <motion.div variants={itemVariants}>
        <RecentOutputs />
      </motion.div>
      
      {/* Info Section */}
      <motion.div 
        className="mb-16" 
        variants={itemVariants}
      >
        <div className="glass-panel p-8 border border-purple-500/20 rounded-xl backdrop-blur-md bg-opacity-60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-purple-700/10 blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="flex items-center mb-6 relative z-10">
            <Info className="w-6 h-6 mr-3 text-purple-400" />
            <h2 className="text-2xl font-bold violet-gradient-text">About TWEEN CRAFT</h2>
          </div>
          
          <div className="text-gray-300 space-y-4 relative z-10">
            <p className="leading-relaxed">
              TWEEN CRAFT is a professional video frame interpolation application that enhances your videos with smooth, 
              fluid motion using state-of-the-art GMFSS Fortuna technology.
            </p>
            <p className="leading-relaxed">
              Whether you're a content creator, filmmaker, or video enthusiast, TWEEN CRAFT provides a straightforward 
              interface to transform standard videos into high frame-rate content with exceptional quality and minimal artifacts.
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Footer */}
      <motion.footer 
        className="mt-16 pt-8 text-center text-gray-300 text-sm"
        variants={itemVariants}
      >
        <div className="glass-nav py-4 rounded-lg">
          <p className="opacity-80">© 2025 TWEEN CRAFT - Professional Video Interpolation</p>
          <div className="mt-3 flex justify-center space-x-6">
            <a href="#" className="nav-link">About</a>
            <a href="#" className="nav-link">Documentation</a>
            <a href="https://github.com/topics/gmfss" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub</a>
          </div>
        </div>
      </motion.footer>
    </motion.main>
  );
};

export default Home;
