import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Upload, FileVideo, Info, Zap, Settings } from "lucide-react";
import { motion } from "framer-motion";

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
      dropzone.classList.add('border-purple-500');
      dropzone.classList.add('bg-purple-900/10');
    };
    
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('border-purple-500');
      dropzone.classList.remove('bg-purple-900/10');
    };
    
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('border-purple-500');
      dropzone.classList.remove('bg-purple-900/10');
      
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
      <motion.div 
        className="glass-panel p-8 glow-card hover-scale"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-6">
          <FileVideo className="w-7 h-7 mr-3 text-purple-400" />
          <h2 className="text-3xl font-bold violet-gradient-text">Upload Video</h2>
        </div>
        <p className="text-gray-300 mb-8 text-lg">Select a video file to enhance with GMFSS Fortuna frame interpolation</p>
        
        {/* File Upload Area */}
        {!videoPreviewUrl ? (
          <motion.div 
            ref={dropzoneRef}
            className="relative border-2 border-dashed border-gray-600 rounded-xl p-10 text-center cursor-pointer hover:border-purple-500 transition-all duration-300 group"
            whileHover={{ boxShadow: "0 0 20px rgba(149, 70, 255, 0.2)" }}
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
            
            <div className="py-8">
              <motion.div 
                className="mx-auto h-20 w-20 bg-purple-900/20 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <Upload className="h-10 w-10 text-purple-400 group-hover:text-purple-300 transition-colors" />
              </motion.div>
              <h3 className="mt-6 text-xl font-medium">Drag & drop your video here</h3>
              <p className="mt-3 text-base text-gray-400">or <span className="text-purple-400 font-medium">browse files</span></p>
              <p className="mt-2 text-sm text-gray-500">Supports MP4, MOV, AVI, WEBM</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            id="preview-container" 
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <Info className="w-5 h-5 mr-2 text-purple-400" />
              <h3 className="text-xl font-semibold">Preview</h3>
            </div>
            
            <motion.div 
              className="bg-black rounded-xl overflow-hidden relative glow-card"
              whileHover={{ scale: 1.01 }}
            >
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
              <div className="absolute top-3 left-3 backdrop-blur-md bg-black/50 text-white text-xs px-3 py-2 rounded-full font-medium border border-gray-700">
                <span className="text-purple-400">Original: </span> 
                <span id="original-info">{videoInfo.width}x{videoInfo.height}</span>
              </div>
            </motion.div>
            
            <div className="mt-8 p-6 bg-gray-900/50 rounded-xl backdrop-blur-sm border border-gray-800">
              <div className="flex items-center mb-4">
                <Settings className="w-5 h-5 mr-2 text-purple-400" />
                <h3 className="text-lg font-semibold">Processing Options</h3>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Interpolation Factor</label>
                  <select 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                    value={multiplier}
                    onChange={(e) => setMultiplier(parseInt(e.target.value, 10))}
                  >
                    <option value={2}>2x (30fps → 60fps)</option>
                    <option value={4}>4x (15fps → 60fps)</option>
                    <option value={6}>6x (10fps → 60fps)</option>
                    <option value={8}>8x (7.5fps → 60fps)</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Higher values generate more intermediate frames</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Output Resolution</label>
                  <select 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                  >
                    <option value="original">Original Size</option>
                    <option value="512">512px</option>
                    <option value="720">720px</option>
                    <option value="1080">1080px</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Higher resolution increases processing time</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <motion.button 
                onClick={handleSubmit}
                disabled={isUploading}
                className="btn-gradient py-3 px-8 flex items-center sparkle"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Zap className="w-5 h-5 mr-2" />
                {isUploading ? 'Uploading...' : 'Start Processing'}
              </motion.button>
            </div>
            <p className="mt-2 text-sm text-right text-gray-500">Processing time varies based on video length and settings</p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default VideoUploader;
