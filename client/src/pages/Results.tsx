import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import VideoResults from "@/components/VideoResults";
import { Loader, AlertCircle, Home } from "lucide-react";
import { motion } from "framer-motion";

interface VideoResult {
  outputPath: string;
  processingTime: number;
}

const Results = () => {
  const [, params] = useRoute<{ fileId: string }>("/results/:fileId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const fileId = params?.fileId;
  
  // Fetch the processed video results
  const { data, isLoading, error } = useQuery<VideoResult>({
    queryKey: [`/api/results/${fileId}`],
    enabled: !!fileId
  });
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load video results. Please try again.",
        variant: "destructive"
      });
    }
  }, [error, toast]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <motion.div 
          className="flex flex-col items-center p-8 glass-panel rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative w-16 h-16 mb-6">
            <motion.div 
              className="absolute inset-0 rounded-full border-4 border-purple-400/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader className="h-8 w-8 text-purple-400 animate-pulse" />
            </div>
          </div>
          <h3 className="text-xl font-medium mb-2">Loading video results</h3>
          <p className="text-gray-400">Please wait while we fetch your processed video</p>
        </motion.div>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <motion.div 
          className="glass-panel p-8 max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center mb-6">
            <AlertCircle className="h-7 w-7 mr-3 text-purple-400" />
            <h2 className="text-2xl font-bold violet-gradient-text">No Results Found</h2>
          </div>
          
          <div className="p-6 bg-gray-900/50 rounded-xl mb-6">
            <p className="text-gray-300 mb-2">The requested video results could not be found.</p>
            <p className="text-gray-400 text-sm">The video might still be processing or the file ID may be invalid.</p>
          </div>
          
          <div className="flex justify-center">
            <motion.button 
              onClick={() => setLocation("/")}
              className="btn-gradient py-3 px-6 flex items-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  // Animation variants
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
      className="container mx-auto px-4 py-8 md:py-12 max-w-6xl flex-grow"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Glowing Orb Effect */}
      <div className="fixed -top-20 right-10 w-60 h-60 rounded-full bg-purple-600/20 blur-3xl pointer-events-none"></div>
      
      {/* Hero Section */}
      <motion.div 
        className="mb-12 text-center" 
        variants={itemVariants}
      >
        <h1 className="text-4xl md:text-5xl font-bold violet-gradient-text mb-4">
          Processing Complete
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Your enhanced video is ready to view and download
        </p>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <VideoResults 
          videoPath={data.outputPath}
          processingTime={data.processingTime}
        />
      </motion.div>
    </motion.main>
  );
};

export default Results;
