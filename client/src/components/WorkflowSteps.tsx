interface WorkflowStepsProps {
  activeStep: number;
}

const WorkflowSteps: React.FC<WorkflowStepsProps> = ({ activeStep }) => {
  return (
    <div className="flex flex-wrap mb-10 justify-center">
      <div className="flex flex-col items-center px-4 md:px-6 mb-6 md:mb-0">
        <div className={`w-10 h-10 rounded-full ${activeStep >= 1 ? 'bg-[#ff6b6b]' : 'bg-gray-700'} flex items-center justify-center text-white font-semibold mb-2`}>1</div>
        <div className="text-center">
          <p className="font-semibold">Upload</p>
          <p className="text-[#9CA3AF] text-sm">Select video file</p>
        </div>
      </div>
      <div className="w-10 h-1 bg-gray-700 self-center mt-4 hidden md:block"></div>
      <div className="flex flex-col items-center px-4 md:px-6 mb-6 md:mb-0">
        <div className={`w-10 h-10 rounded-full ${activeStep >= 2 ? 'bg-[#ffb86c]' : 'bg-gray-700'} flex items-center justify-center text-white font-semibold mb-2`}>2</div>
        <div className="text-center">
          <p className="font-semibold">Process</p>
          <p className="text-[#9CA3AF] text-sm">Frame interpolation</p>
        </div>
      </div>
      <div className="w-10 h-1 bg-gray-700 self-center mt-4 hidden md:block"></div>
      <div className="flex flex-col items-center px-4 md:px-6">
        <div className={`w-10 h-10 rounded-full ${activeStep >= 3 ? 'bg-[#4cf977]' : 'bg-gray-700'} flex items-center justify-center text-white font-semibold mb-2`}>3</div>
        <div className="text-center">
          <p className="font-semibold">Result</p>
          <p className="text-[#9CA3AF] text-sm">Enjoy smooth video</p>
        </div>
      </div>
    </div>
  );
};

export default WorkflowSteps;
