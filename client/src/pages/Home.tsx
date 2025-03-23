import { useState, useEffect } from "react";
import VideoUploader from "@/components/VideoUploader";
import VideoProcessing from "@/components/VideoProcessing";
import WorkflowSteps from "@/components/WorkflowSteps";
import RecentOutputs from "@/components/RecentOutputs";
import { motion } from "framer-motion";

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
        <h1 className="text-4xl md:text-6xl font-bold violet-gradient-text mb-4">
          GMFSS Video Enhancer
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Transform your videos with state-of-the-art frame interpolation using GMFSS Fortuna
        </p>
      </motion.div>
      
      {/* Glowing Orb Effect */}
      <div className="fixed -top-20 right-10 w-60 h-60 rounded-full bg-purple-600/20 blur-3xl pointer-events-none"></div>
      
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
        <h2 className="text-2xl font-bold mb-6 violet-gradient-text">Recent Outputs</h2>
        <RecentOutputs />
      </motion.div>
      
      {/* Footer */}
      <motion.footer 
        className="mt-20 border-t border-purple-900/30 pt-8 text-center text-gray-400 text-sm"
        variants={itemVariants}
      >
        <p>© 2025 GMFSS Video Enhancer - Powered by GMFSS Fortuna</p>
      </motion.footer>
    </motion.main>
  );
};

export default Home;
