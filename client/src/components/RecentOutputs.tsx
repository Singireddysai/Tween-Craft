import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Play, History, Clock, Download, FileVideo } from "lucide-react";
import { motion } from "framer-motion";

interface VideoItem {
  name: string;
  path: string;
  date: string;
  time: number;
}

const RecentOutputs = () => {
  const { data, isLoading, error } = useQuery<{ videos: VideoItem[] }>({
    queryKey: ['/api/recent-videos'],
  });
  
  // Format the date as relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
    } else if (diffHour > 0) {
      return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'Just now';
    }
  };
  
  // Format processing time in a human-readable way
  const formatProcessingTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  if (isLoading) {
    return (
      <section className="mb-12">
        <motion.div 
          className="glass-panel p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <History className="w-7 h-7 mr-3 text-purple-400" />
            <h2 className="text-3xl font-bold violet-gradient-text">Recent Outputs</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 animate-pulse">
                <div className="aspect-video bg-gray-800"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-800 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    );
  }
  
  if (error || !data) {
    return (
      <section className="mb-12">
        <motion.div 
          className="glass-panel p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <History className="w-7 h-7 mr-3 text-purple-400" />
            <h2 className="text-3xl font-bold violet-gradient-text">Recent Outputs</h2>
          </div>
          
          <div className="text-center py-10 bg-gray-900/30 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-lg">Could not load recent videos</p>
          </div>
        </motion.div>
      </section>
    );
  }
  
  if (data.videos.length === 0) {
    return (
      <section className="mb-12">
        <motion.div 
          className="glass-panel p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <History className="w-7 h-7 mr-3 text-purple-400" />
            <h2 className="text-3xl font-bold violet-gradient-text">Recent Outputs</h2>
          </div>
          
          <div className="text-center py-10 bg-gray-900/30 rounded-xl border border-gray-800">
            <FileVideo className="h-16 w-16 mx-auto text-gray-700 mb-4" />
            <p className="text-gray-400 text-lg">No processed videos yet</p>
            <p className="text-gray-500 mt-2">Your processed videos will appear here</p>
          </div>
        </motion.div>
      </section>
    );
  }
  
  return (
    <section className="mb-12">
      <motion.div 
        className="glass-panel p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-6">
          <History className="w-7 h-7 mr-3 text-purple-400" />
          <h2 className="text-3xl font-bold violet-gradient-text">Recent Outputs</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.videos.map((video, index) => (
            <motion.div 
              key={index} 
              className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-800/40 transition-all duration-300 glow-card"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="aspect-video bg-black relative">
                <video className="w-full h-full object-cover" muted>
                  <source src={video.path} type="video/mp4" />
                </video>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <a 
                    href={video.path} 
                    className="bg-purple-900/80 backdrop-blur-md rounded-full p-4 hover:bg-purple-800 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Play className="h-8 w-8 text-white" />
                  </a>
                </div>
                <div className="absolute top-3 right-3 backdrop-blur-md bg-black/50 text-white text-xs px-3 py-1 rounded-full border border-purple-900/30">
                  <span className="text-purple-400">60 FPS</span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium truncate text-white">{video.name}</h3>
                
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 text-purple-400 mr-1" />
                    <p className="text-xs text-gray-400">{formatRelativeTime(video.date)}</p>
                  </div>
                  
                  <div className="flex items-center justify-end">
                    <span className="text-xs text-gray-400 mr-1">Process: </span>
                    <span className="text-xs text-purple-400">{formatProcessingTime(video.time)}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between">
                  <a 
                    href={video.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white bg-gray-800 hover:bg-gray-700 py-1.5 px-3 rounded-lg flex items-center transition-colors"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Play
                  </a>
                  
                  <a 
                    href={video.path} 
                    download
                    className="text-sm text-white bg-gray-800 hover:bg-gray-700 py-1.5 px-3 rounded-lg flex items-center transition-colors"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default RecentOutputs;
