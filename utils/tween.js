import WebSocket from "ws";
import axios from "axios";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ComfyUI server address - typically running locally
const serverAddress = "127.0.0.1:8188";
const clientId = uuidv4();

// Output directory
const outputDir = path.join(__dirname, "..", "output");

// Load the workflow template
const workflowPath = path.join(__dirname, "gmfss_workflow.json");

/**
 * Queue a prompt to the ComfyUI server
 */
async function queuePrompt(prompt) {
  try {
    const response = await axios.post(`http://${serverAddress}/prompt`, {
      prompt: prompt,
      client_id: clientId,
    });
    return response.data;
  } catch (error) {
    console.error("Error queuing prompt:", error.message);
    throw new Error("Failed to communicate with ComfyUI server. Make sure it's running.");
  }
}

/**
 * Get a file from the ComfyUI server
 */
async function getFile(filename, subfolder, folderType) {
  const params = new URLSearchParams({ filename, subfolder, type: folderType });
  try {
    const response = await axios.get(
      `http://${serverAddress}/view?${params.toString()}`,
      { responseType: "arraybuffer" }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching file:", error.message);
    throw new Error("Failed to retrieve processed file from ComfyUI server");
  }
}

/**
 * Get execution history for a prompt
 */
async function getHistory(promptId) {
  try {
    const response = await axios.get(
      `http://${serverAddress}/history/${promptId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching history:", error.message);
    throw new Error("Failed to retrieve execution history from ComfyUI server");
  }
}

/**
 * Process media from ComfyUI
 */
function getMedia(ws, prompt) {
  return new Promise(async (resolve) => {
    const promptResponse = await queuePrompt(prompt);
    const promptId = promptResponse.prompt_id;
    const outputMedia = {};

    ws.on("message", async (data) => {
      const message = JSON.parse(data.toString());
      console.log("Received WebSocket message:", message.type);

      if (message.type === "executing" && message.data.prompt_id === promptId) {
        if (message.data.node === null) {
          console.log("Execution completed for prompt ID:", promptId);
          const history = (await getHistory(promptId))[promptId];

          for (const nodeId in history.outputs) {
            const nodeOutput = history.outputs[nodeId];
            if (nodeOutput.videos) {
              const videosOutput = [];
              for (const video of nodeOutput.videos) {
                const videoData = await getFile(
                  video.filename,
                  video.subfolder,
                  video.type
                );
                videosOutput.push({
                  data: videoData,
                  filename: video.filename
                });
              }
              outputMedia[nodeId] = videosOutput;
            }
          }
          resolve(outputMedia);
        }
      }
    });
  });
}

/**
 * Save a video to a file
 */
function saveVideo(videoData, outputDir) {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const timestamp = Date.now();
  const filename = `processed_${timestamp}.mp4`;
  const filePath = path.join(outputDir, filename);
  
  fs.writeFileSync(filePath, videoData.data);
  console.log(`Video saved to ${filePath}`);
  return filePath;
}

/**
 * Main tween function that processes a video using GMFSS Fortuna
 */
const tween = async (videoPath, multiplier = 6) => {
  try {
    // Load the workflow template
    const workflowData = fs.readFileSync(workflowPath, "utf-8");
    const prompt = JSON.parse(workflowData);

    // Update workflow with input video path and multiplier
    prompt["1"].inputs.video = videoPath;
    prompt["6"].inputs.multiplier = parseInt(multiplier, 10);

    // Connect to ComfyUI WebSocket
    const ws = new WebSocket(`ws://${serverAddress}/ws?clientId=${clientId}`);

    return new Promise((resolve, reject) => {
      ws.on("open", async () => {
        console.log("WebSocket connection opened to ComfyUI");

        try {
          // Process the video
          const media = await getMedia(ws, prompt);

          let savedFilePath = "";
          
          // Save all output videos
          for (const nodeId in media) {
            media[nodeId].forEach((videoData) => {
              const filePath = saveVideo(videoData, outputDir);
              savedFilePath = filePath; // Keep track of last saved file
            });
          }

          ws.close();
          resolve(savedFilePath);
        } catch (error) {
          console.error("Error during tween execution:", error);
          ws.close();
          reject(error);
        }
      });

      ws.on("error", (err) => {
        console.error("WebSocket error:", err);
        reject(err);
      });

      ws.on("close", () => {
        console.log("WebSocket connection closed");
      });
    });
  } catch (error) {
    console.error("Error in tween function:", error);
    throw error;
  }
};

export default tween;
