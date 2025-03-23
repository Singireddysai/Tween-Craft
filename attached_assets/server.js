import express from "express";
import path from "path";
import multer from "multer";
import { dirname } from "path";
import { fileURLToPath } from "url";
import tween from "./utils/tween.js";
import fs from "fs";

const VIDEO_DIR =
  "C:/ComfyUI_windows_portable_nvidia_cu121_or_cpu/ComfyUI_windows_portable/ComfyUI/output"; // Change this to your video directory

const port = 3001;
const __dirname = dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/latest-video", (req, res) => {
  fs.readdir(VIDEO_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read directory" });
    }

    const videoFiles = files
      .map((file) => ({
        name: file,
        time: fs.statSync(path.join(VIDEO_DIR, file)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time); // Sort by most recent

    if (videoFiles.length === 0) {
      return res.status(404).json({ error: "No videos found" });
    }

    res.json({ video: `/videos/${videoFiles[0].name}` }); // Send most recent video URL
  });
});

app.post("/upload", upload.single("videoUpload"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  console.log("Uploaded file path:", req.file.path);

  try {
    const safePath = path.resolve(req.file.path);
    console.log(safePath);

    await tween(safePath);
    res.sendFile(path.join(__dirname, "output.html"));
  } catch (error) {
    console.error("Error processing video:", error);
    res.status(500).send("Error processing video.");
  }
});

app.use("/videos", express.static(VIDEO_DIR));

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
