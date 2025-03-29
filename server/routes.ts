import { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";
import multer from "multer";
import { WebSocketServer, WebSocket } from "ws";
import { fileURLToPath } from "url";
import { dirname } from "path";
import tween from "../utils/tween.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure video output directory
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
const OUTPUT_DIR = path.join(__dirname, "..", "output");

// ComfyUI output directory (change this to match your ComfyUI installation path)
// This is where ComfyUI saves the processed videos
const COMFYUI_OUTPUT_DIR = process.env.COMFYUI_OUTPUT_DIR || 
  "C:\\ComfyUI_windows_portable_nvidia_cu121_or_cpu\\ComfyUI_windows_portable\\ComfyUI\\output";

// We'll check both directories for videos
function getVideoOutputDirs(): string[] {
  const dirs = [OUTPUT_DIR];
  
  // Only add ComfyUI dir if it exists and is accessible
  try {
    if (fs.existsSync(COMFYUI_OUTPUT_DIR)) {
      dirs.push(COMFYUI_OUTPUT_DIR);
    } else {
      console.log(`ComfyUI output directory not found at: ${COMFYUI_OUTPUT_DIR}`);
    }
  } catch (error) {
    const err = error as Error;
    console.log(`Cannot access ComfyUI output directory: ${err.message}`);
  }
  
  return dirs;
}

// Create directories if they don't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Configure storage for uploads
const storage_config = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage_config });

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Set up WebSocket server
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: "/ws",
    perMessageDeflate: false
  });
  
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    
    // Send a connection confirmation
    ws.send(JSON.stringify({ 
      type: "connection_established",
      message: "WebSocket connection established successfully" 
    }));
    
    ws.on("message", (message) => {
      console.log("Received message:", message.toString());
      
      // Echo the message back (for testing purposes)
      ws.send(JSON.stringify({ 
        type: "echo", 
        message: message.toString() 
      }));
    });
    
    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });
    
    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  // API endpoints
  app.post("/api/upload", upload.single("videoUpload"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    try {
      const filePath = req.file.path;
      const multiplier = req.body.multiplier || 6;
      
      // Store the file info for processing
      const fileInfo = {
        id: Date.now().toString(),
        path: filePath,
        originalName: req.file.originalname,
        multiplier: parseInt(multiplier, 10)
      };

      // Broadcast processing status to connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === 1) { // WebSocket.OPEN
          client.send(JSON.stringify({
            type: "processing_started",
            fileInfo
          }));
        }
      });
      
      res.status(200).json({ 
        message: "File uploaded successfully", 
        fileId: fileInfo.id, 
        fileName: req.file.originalname,
        filePath: filePath
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  app.post("/api/process/:fileId", async (req, res) => {
    try {
      const { fileId } = req.params;
      const { filePath, multiplier } = req.body;
      
      if (!filePath) {
        return res.status(400).json({ error: "File path is required" });
      }

      // Broadcast processing status to connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === 1) { // WebSocket.OPEN
          client.send(JSON.stringify({
            type: "processing_progress",
            status: "analyzing",
            progress: 25,
            fileId
          }));
        }
      });

      // Process video with GMFSS
      const startTime = Date.now();
      const outputPath = await tween(filePath, multiplier);
      const processingTime = Math.floor((Date.now() - startTime) / 1000);
      
      // Extract just the filename from the output path
      const outputFileName = path.basename(outputPath);
      const webOutputPath = `/videos/${outputFileName}`;

      // Broadcast completion status
      wss.clients.forEach((client) => {
        if (client.readyState === 1) { // WebSocket.OPEN
          client.send(JSON.stringify({
            type: "processing_complete",
            fileId,
            outputPath: webOutputPath,
            processingTime
          }));
        }
      });
      
      res.status(200).json({ 
        message: "Processing complete", 
        outputPath: webOutputPath,
        processingTime
      });
    } catch (error) {
      console.error("Error processing video:", error);
      
      // Broadcast error status
      wss.clients.forEach((client) => {
        if (client.readyState === 1) { // WebSocket.OPEN
          client.send(JSON.stringify({
            type: "processing_error",
            error: "Failed to process video"
          }));
        }
      });
      
      res.status(500).json({ error: "Failed to process video" });
    }
  });

  // Interface for video file info
  interface VideoFileInfo {
    name: string;
    path: string;
    fullPath: string;
    dir: string;
    time: number;
    date: string;
  }

  // Function to get all video files from all output directories
  const getAllVideoFiles = async (): Promise<VideoFileInfo[]> => {
    // Get all video directories to check
    const dirs = getVideoOutputDirs();
    let allVideoFiles: VideoFileInfo[] = [];
    
    // Process each directory
    for (const dir of dirs) {
      try {
        const files = fs.readdirSync(dir);
        const videoFiles = files
          .filter(file => file.endsWith('.mp4'))
          .map((file) => {
            const stats = fs.statSync(path.join(dir, file));
            return {
              name: file,
              path: `/videos/${file}`,
              fullPath: path.join(dir, file),
              dir: dir,
              time: stats.mtime.getTime(),
              date: stats.mtime.toISOString()
            };
          });
        
        allVideoFiles = [...allVideoFiles, ...videoFiles];
      } catch (error) {
        const err = error as Error;
        console.error(`Error reading directory ${dir}:`, err);
      }
    }
    
    // Sort all videos by time
    return allVideoFiles.sort((a, b) => b.time - a.time);
  };

  // Get video results by fileId
  app.get("/api/results/:fileId", async (req, res) => {
    const { fileId } = req.params;
    
    try {
      // Get all video files from all directories
      const videoFiles = await getAllVideoFiles();
      
      if (videoFiles.length === 0) {
        return res.status(404).json({ error: "No videos found" });
      }
      
      // For now, we'll just return the most recent video
      // In a production app, we would match with the fileId
      const videoFile = videoFiles[0];
      
      console.log("Serving video result:", videoFile);
      
      res.json({ 
        outputPath: `/videos/${videoFile.name}`,
        processingTime: Math.floor((Date.now() - parseInt(fileId, 10)) / 1000) || 3
      });
    } catch (error) {
      const err = error as Error;
      console.error("Error getting video results:", err);
      res.status(500).json({ error: "Failed to get video results" });
    }
  });
  
  // Get latest video
  app.get("/api/latest-video", async (req, res) => {
    try {
      // Get all video files from all directories
      const videoFiles = await getAllVideoFiles();
      
      if (videoFiles.length === 0) {
        return res.status(404).json({ error: "No videos found" });
      }
      
      res.json({ video: `/videos/${videoFiles[0].name}` });
    } catch (error) {
      const err = error as Error;
      console.error("Error getting latest video:", err);
      res.status(500).json({ error: "Failed to get latest video" });
    }
  });

  // Get recent videos
  app.get("/api/recent-videos", async (req, res) => {
    try {
      // Get all video files from all directories
      const videoFiles = await getAllVideoFiles();
      
      // Map the video files to the expected format
      const formattedFiles = videoFiles.slice(0, 6).map(file => ({
        name: file.name,
        path: file.path,
        date: file.date,
        time: Math.floor((Date.now() - file.time) / 1000)
      }));
      
      res.json({ videos: formattedFiles });
    } catch (error) {
      const err = error as Error;
      console.error("Error getting recent videos:", err);
      res.status(500).json({ error: "Failed to get recent videos" });
    }
  });
  
  // API health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      message: "API is healthy",
      wsStatus: "active",
      time: new Date().toISOString()
    });
  });

  // Serve video files from multiple directories
  app.use("/videos", (req, res, next) => {
    // Get the requested file name from the path
    const fileName = req.path.split('/').pop();
    if (!fileName) return next();
    
    // Check all possible directories for the file
    const dirs = getVideoOutputDirs();
    
    // Try each directory until we find the file
    for (const dir of dirs) {
      const filePath = path.join(dir, fileName);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return res.sendFile(filePath);
      }
    }
    
    // If we get here, the file wasn't found in any directory
    next();
  });
  
  return httpServer;
}
