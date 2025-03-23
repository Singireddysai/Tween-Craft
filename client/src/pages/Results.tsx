import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import VideoResults from "@/components/VideoResults";
import { apiRequest } from "@/lib/queryClient";
import { Loader } from "lucide-react";

interface VideoResult {
  outputPath: string;
  processingTime: number;
}

const Results = () => {
  const [, params] = useRoute<{ fileId: string }>("/results/:fileId");
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
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <Loader className="h-8 w-8 animate-spin text-[#ffb86c] mb-4" />
          <p>Loading video results...</p>
        </div>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-['K2D'] font-semibold mb-4">No Results Found</h2>
        <p className="text-[#9CA3AF] mb-6">The requested video results could not be found.</p>
        <a href="/" className="bg-gradient-to-r from-[#ff6b6b] via-[#ffb86c] to-[#4cf977] text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity">
          Return Home
        </a>
      </div>
    );
  }
  
  return (
    <main className="container mx-auto px-4 py-8 md:py-12 max-w-6xl flex-grow">
      <VideoResults 
        videoPath={data.outputPath}
        processingTime={data.processingTime}
      />
    </main>
  );
};

export default Results;
