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

      // Broadcast completion status
      wss.clients.forEach((client) => {
        if (client.readyState === 1) { // WebSocket.OPEN
          client.send(JSON.stringify({
            type: "processing_complete",
            fileId,
            outputPath,
            processingTime
          }));
        }
      });
      
      res.status(200).json({ 
        message: "Processing complete", 
        outputPath,
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

  // Get latest video
  app.get("/api/latest-video", (req, res) => {
    fs.readdir(OUTPUT_DIR, (err, files) => {
      if (err) {
        return res.status(500).json({ error: "Failed to read directory" });
      }

      const videoFiles = files
        .filter(file => file.endsWith('.mp4'))
        .map((file) => ({
          name: file,
          time: fs.statSync(path.join(OUTPUT_DIR, file)).mtime.getTime(),
        }))
        .sort((a, b) => b.time - a.time); // Sort by most recent

      if (videoFiles.length === 0) {
        return res.status(404).json({ error: "No videos found" });
      }

      res.json({ video: `/videos/${videoFiles[0].name}` });
    });
  });

  // Get recent videos
  app.get("/api/recent-videos", (req, res) => {
    fs.readdir(OUTPUT_DIR, (err, files) => {
      if (err) {
        return res.status(500).json({ error: "Failed to read directory" });
      }

      const videoFiles = files
        .filter(file => file.endsWith('.mp4'))
        .map((file) => {
          const stats = fs.statSync(path.join(OUTPUT_DIR, file));
          return {
            name: file,
            path: `/videos/${file}`,
            time: stats.mtime.getTime(),
            date: stats.mtime.toISOString()
          };
        })
        .sort((a, b) => b.time - a.time) // Sort by most recent
        .slice(0, 6); // Get only the 6 most recent

      res.json({ videos: videoFiles });
    });
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
  
  // Configuration endpoint to update ComfyUI server address
  app.post("/api/config", (req, res) => {
    try {
      const { comfyuiServer } = req.body;
      
      if (!comfyuiServer) {
        return res.status(400).json({ error: "ComfyUI server URL is required" });
      }
      
      // Validate the URL
      try {
        new URL(comfyuiServer);
      } catch (error) {
        return res.status(400).json({ error: "Invalid URL format" });
      }
      
      // Store in process.env
      process.env.COMFYUI_SERVER = comfyuiServer;
      
      res.status(200).json({ 
        message: "Configuration updated successfully", 
        config: { comfyuiServer }
      });
    } catch (error) {
      console.error("Error updating configuration:", error);
      res.status(500).json({ error: "Failed to update configuration" });
    }
  });
  
  // Test ComfyUI connection
  app.post("/api/test-comfyui", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: "ComfyUI server URL is required" });
      }
      
      // Validate the URL
      try {
        new URL(url);
      } catch (error) {
        return res.status(400).json({ error: "Invalid URL format" });
      }
      
      // Test connection to ComfyUI server
      const axios = (await import('axios')).default;
      
      // Determine protocol
      const protocol = url.startsWith('https://') ? 'https://' : 'http://';
      const address = url.replace(/^https?:\/\//, '');
      const systemStatsUrl = `${protocol}${address}/system_stats`;
      
      try {
        const response = await axios.get(systemStatsUrl, { timeout: 5000 });
        
        if (response.status === 200) {
          res.status(200).json({ 
            message: "Connection successful", 
            status: "connected",
            systemInfo: response.data
          });
        } else {
          throw new Error(`Received status code: ${response.status}`);
        }
      } catch (error) {
        console.error("Error connecting to ComfyUI:", error);
        res.status(502).json({ 
          error: "Failed to connect to ComfyUI server", 
          details: error instanceof Error ? error.message : "Unknown error"
        });
      }
    } catch (error) {
      console.error("Error testing ComfyUI connection:", error);
      res.status(500).json({ error: "Failed to process request" });
    }
  });

  // Serve video files
  app.use("/videos", (req, res, next) => {
    // Create a simple static file server
    const filePath = path.join(OUTPUT_DIR, req.path);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      res.sendFile(filePath);
    } else {
      next();
    }
  });
  
  return httpServer;
}
