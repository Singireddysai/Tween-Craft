import { motion } from "framer-motion";

interface WorkflowStepsProps {
  activeStep: number;
}

const WorkflowSteps: React.FC<WorkflowStepsProps> = ({ activeStep }) => {
  return (
    <div className="glass-panel p-6 mb-10">
      <div className="flex flex-wrap justify-center">
        {/* Step 1 - Upload */}
        <div className="flex flex-col items-center px-4 md:px-8 mb-6 md:mb-0 relative">
          <div className="relative">
            <motion.div 
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold mb-3
                ${activeStep >= 1 ? 'bg-gradient-to-r from-[#9546FF] to-[#6a11cb]' : 'bg-gray-800 border border-gray-700'}`}
              whileHover={{ scale: 1.05 }}
              animate={activeStep >= 1 ? { boxShadow: '0 0 15px rgba(149, 70, 255, 0.6)' } : {}}
            >
              <span className="text-lg">1</span>
            </motion.div>
            {activeStep === 1 && (
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-purple-500 pointer-events-none"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">Upload</p>
            <p className="text-gray-400 text-sm">Select video file</p>
          </div>
        </div>
        
        {/* Connector Line */}
        <div className="hidden md:flex items-center px-2">
          <div className="w-20 h-0.5 bg-gradient-to-r from-[#9546FF]/30 to-[#6a11cb]/30"></div>
        </div>
        
        {/* Step 2 - Process */}
        <div className="flex flex-col items-center px-4 md:px-8 mb-6 md:mb-0 relative">
          <div className="relative">
            <motion.div 
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold mb-3
                ${activeStep >= 2 ? 'bg-gradient-to-r from-[#9546FF] to-[#6a11cb]' : 'bg-gray-800 border border-gray-700'}`}
              whileHover={{ scale: 1.05 }}
              animate={activeStep >= 2 ? { boxShadow: '0 0 15px rgba(149, 70, 255, 0.6)' } : {}}
            >
              <span className="text-lg">2</span>
            </motion.div>
            {activeStep === 2 && (
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-purple-500 pointer-events-none"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">Process</p>
            <p className="text-gray-400 text-sm">Frame interpolation</p>
          </div>
        </div>
        
        {/* Connector Line */}
        <div className="hidden md:flex items-center px-2">
          <div className="w-20 h-0.5 bg-gradient-to-r from-[#9546FF]/30 to-[#6a11cb]/30"></div>
        </div>
        
        {/* Step 3 - Result */}
        <div className="flex flex-col items-center px-4 md:px-8 relative">
          <div className="relative">
            <motion.div 
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold mb-3
                ${activeStep >= 3 ? 'bg-gradient-to-r from-[#9546FF] to-[#6a11cb]' : 'bg-gray-800 border border-gray-700'}`}
              whileHover={{ scale: 1.05 }}
              animate={activeStep >= 3 ? { boxShadow: '0 0 15px rgba(149, 70, 255, 0.6)' } : {}}
            >
              <span className="text-lg">3</span>
            </motion.div>
            {activeStep === 3 && (
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-purple-500 pointer-events-none"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">Result</p>
            <p className="text-gray-400 text-sm">Enhanced video</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowSteps;
