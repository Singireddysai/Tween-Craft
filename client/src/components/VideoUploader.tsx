import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Upload, FileVideo } from "lucide-react";

interface VideoUploaderProps {
  onUploadSuccess: (data: { fileId: string, fileName: string, filePath: string, multiplier: number }) => void;
  socket: WebSocket | null;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onUploadSuccess, socket }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [multiplier, setMultiplier] = useState<number>(6);
  const [resolution, setResolution] = useState<string>("512");
  const [videoInfo, setVideoInfo] = useState<{ width: number, height: number }>({ width: 0, height: 0 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      handleSelectedFile(file);
    }
  };
  
  // Process the selected file
  const handleSelectedFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(objectUrl);
    
    // Clean up the URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  };
  
  // Handle video metadata loading to get dimensions
  const handleVideoMetadata = () => {
    if (videoRef.current) {
      setVideoInfo({
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight
      });
    }
  };
  
  // Handle drag and drop
  useEffect(() => {
    const dropzone = dropzoneRef.current;
    if (!dropzone) return;
    
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('border-[#4cf977]');
    };
    
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('border-[#4cf977]');
    };
    
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('border-[#4cf977]');
      
      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        handleSelectedFile(file);
      }
    };
    
    dropzone.addEventListener('dragover', handleDragOver);
    dropzone.addEventListener('dragleave', handleDragLeave);
    dropzone.addEventListener('drop', handleDrop);
    
    return () => {
      dropzone.removeEventListener('dragover', handleDragOver);
      dropzone.removeEventListener('dragleave', handleDragLeave);
      dropzone.removeEventListener('drop', handleDrop);
    };
  }, []);
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a video file to upload",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('videoUpload', selectedFile);
      formData.append('multiplier', multiplier.toString());
      formData.append('resolution', resolution);
      
      // Upload the file
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      
      // Notify parent component of successful upload
      onUploadSuccess({
        fileId: data.fileId,
        fileName: selectedFile.name,
        filePath: data.filePath || "",
        multiplier: multiplier
      });
      
      toast({
        title: "Upload successful",
        description: "Your video has been uploaded and is being processed",
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your video. Please try again.",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };
  
  return (
    <section id="upload-section" className="mb-12">
      <div className="bg-[#262626] rounded-xl p-6 md:p-8 border border-gray-700">
        <h2 className="text-2xl font-['K2D'] font-semibold mb-4">Upload Video</h2>
        <p className="text-[#9CA3AF] mb-6">Select a video file to enhance with GMFSS Fortuna frame interpolation</p>
        
        {/* File Upload Area */}
        {!videoPreviewUrl ? (
          <div 
            ref={dropzoneRef}
            className="relative border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-[#ffb86c] transition-colors group"
          >
            <input 
              ref={fileInputRef}
              id="uploadInput" 
              type="file" 
              name="videoUpload" 
              accept="video/*" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={handleFileChange}
            />
            
            <div className="py-6">
              <Upload className="mx-auto h-16 w-16 text-gray-500 group-hover:text-[#ffb86c] transition-colors" />
              <p className="mt-4 text-lg font-medium">Drag & drop your video here</p>
              <p className="mt-2 text-sm text-[#9CA3AF]">or <span className="text-[#ffb86c]">browse files</span></p>
              <p className="mt-1 text-xs text-[#9CA3AF]">Supports MP4, MOV, AVI, WEBM</p>
            </div>
          </div>
        ) : (
          <div id="preview-container" className="mt-8">
            <h3 className="text-lg font-medium mb-4">Preview</h3>
            <div className="bg-black rounded-lg overflow-hidden relative">
              <video 
                ref={videoRef}
                id="videoPreview" 
                controls 
                autoPlay 
                loop 
                onLoadedMetadata={handleVideoMetadata}
                className="w-full max-h-[400px]"
                src={videoPreviewUrl}
              ></video>
              <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                Original: <span id="original-info">{videoInfo.width}x{videoInfo.height}</span>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex-1 min-w-[180px]">
                <label className="block text-sm font-medium mb-1">Interpolation Factor</label>
                <select 
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#ffb86c]" 
                  value={multiplier}
                  onChange={(e) => setMultiplier(parseInt(e.target.value, 10))}
                >
                  <option value={2}>2x (30fps → 60fps)</option>
                  <option value={4}>4x (15fps → 60fps)</option>
                  <option value={6}>6x (10fps → 60fps)</option>
                  <option value={8}>8x (7.5fps → 60fps)</option>
                </select>
              </div>
              
              <div className="flex-1 min-w-[180px]">
                <label className="block text-sm font-medium mb-1">Output Resolution</label>
                <select 
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#ffb86c]"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                >
                  <option value="original">Original Size</option>
                  <option value="512">512px</option>
                  <option value="720">720px</option>
                  <option value="1080">1080px</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <button 
                onClick={handleSubmit}
                disabled={isUploading}
                className="bg-gradient-to-r from-[#ff6b6b] via-[#ffb86c] to-[#4cf977] text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Start Processing'}
              </button>
              <p className="mt-2 text-xs text-[#9CA3AF]">Processing time varies based on video length and complexity</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoUploader;
