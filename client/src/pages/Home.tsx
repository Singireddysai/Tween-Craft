import { useState } from "react";
import VideoUploader from "@/components/VideoUploader";
import VideoProcessing from "@/components/VideoProcessing";
import WorkflowSteps from "@/components/WorkflowSteps";
import RecentOutputs from "@/components/RecentOutputs";

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
  
  return (
    <main className="container mx-auto px-4 py-8 md:py-12 max-w-6xl flex-grow">
      {/* Workflow Steps */}
      <WorkflowSteps activeStep={activeStep} />
      
      {/* Content Section */}
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
      
      {/* Recent Outputs Section */}
      <RecentOutputs />
    </main>
  );
};

export default Home;
