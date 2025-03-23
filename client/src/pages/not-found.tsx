import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      {/* Glowing Orb Effect */}
      <div className="fixed -bottom-20 right-10 w-60 h-60 rounded-full bg-purple-600/20 blur-3xl pointer-events-none"></div>
      
      <motion.div 
        className="glass-panel p-8 w-full max-w-md mx-4 glow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-6">
          <AlertCircle className="h-8 w-8 mr-3 text-purple-400" />
          <h1 className="text-3xl font-bold violet-gradient-text">404 Not Found</h1>
        </div>

        <div className="p-6 glass-nav rounded-xl mb-8 border border-purple-500/20 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-purple-700/10 blur-2xl"></div>
          <p className="text-gray-200 text-lg mb-3 relative z-10">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-gray-300 opacity-80 relative z-10">
            Please check the URL or navigate back to the home page.
          </p>
        </div>
        
        <div className="flex justify-center">
          <motion.button 
            onClick={() => setLocation("/")}
            className="btn-gradient py-3 px-8 flex items-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Home className="h-5 w-5 mr-2" />
            Return Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
