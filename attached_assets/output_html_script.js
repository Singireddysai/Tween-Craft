import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = 3001;
const VIDEO_DIR =
  "C:/ComfyUI_windows_portable_nvidia_cu121_or_cpu/ComfyUI_windows_portable/ComfyUI/output";

// app.use(express.static("public"));

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

app.use("/videos", express.static(VIDEO_DIR));

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
