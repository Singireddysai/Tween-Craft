import WebSocket from "ws";
import axios from "axios";
import fs from "fs";
import path from "path";
import pathModule from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverAddress = "127.0.0.1:8188";
const clientId = uuidv4();

async function queuePrompt(prompt) {
  const response = await axios.post(`http://${serverAddress}/prompt`, {
    prompt: prompt,
    client_id: clientId,
  });
  return response.data;
}

async function getFile(filename, subfolder, folderType) {
  const params = new URLSearchParams({ filename, subfolder, type: folderType });
  const response = await axios.get(
    `http://${serverAddress}/view?${params.toString()}`,
    { responseType: "arraybuffer" }
  );
  return response.data;
}

async function getHistory(promptId) {
  const response = await axios.get(
    `http://${serverAddress}/history/${promptId}`
  );
  return response.data;
}

function getMedia(ws, prompt) {
  return new Promise(async (resolve) => {
    const promptResponse = await queuePrompt(prompt);
    const promptId = promptResponse.prompt_id;
    const outputMedia = {};

    ws.on("message", async (data) => {
      const message = JSON.parse(data.toString());
      console.log("Received WebSocket message:", message);

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
                videosOutput.push(videoData);
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

function saveVideo(videoData, filename) {
  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, videoData);
  console.log(`Video saved to ${filePath}`);
}

const tween = async (videoPath) => {
  const workflowData = fs.readFileSync("utils\\gmfss_workflow.json", "utf-8");
  const prompt = JSON.parse(workflowData);

  prompt["1"].inputs.video = videoPath;

  const ws = new WebSocket(`ws://${serverAddress}/ws?clientId=${clientId}`);

  return new Promise((resolve, reject) => {
    ws.on("open", async () => {
      console.log("WebSocket connection opened.");

      try {
        const media = await getMedia(ws, prompt); // Waits for processing to complete

        const inputFilename = path.basename(videoPath, path.extname(videoPath));
        const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");

        for (const nodeId in media) {
          media[nodeId].forEach((videoData, index) => {
            const videoFilename = `${inputFilename}_converted_${timestamp}.mp4`;
            saveVideo(videoData, videoFilename);
          });
        }

        ws.close(); // Close WebSocket after processing
        resolve(); // Resolve the promise to indicate completion
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
      console.log("WebSocket connection closed.");
    });
  });
};

// Wrap the tween call in an async IIFE
// (async () => {
//   await tween(
//     "C:\\Users\\acer\\Documents\\TWEEN CRAFT\\test_vid\\horse low_fps.mp4"
//   );
// })();

export default tween;
