# Tween-Craft 🎬✨

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/Singireddysai/Tween-Craft?style=social)
![GitHub forks](https://img.shields.io/github/forks/Singireddysai/Tween-Craft?style=social)
![GitHub license](https://img.shields.io/github/license/Singireddysai/Tween-Craft)
  
**Enhance video frame rates up to 8x with state-of-the-art VFI technology**

[Features](#features) • [Demo](#demo) • [Results](#results) • [Installation](#installation) • [Usage](#usage) • [Technology](#technology)

</div>

## 🚀 Features

- **High-Quality Frame Interpolation** - Powered by retrained GMFSS_Fortuna model
- **Privacy-Focused** - All processing runs locally, ensuring data privacy
- **Customizable Output** - Choose dimensions and frame rate multiplier (up to 8x)
- **Interactive UI** - Clean, modern interface with processing history
- **Open Source** - Built on proven technologies and models

## 🎥 Demo

Watch the demonstration video to see Tween-Craft in action:

<div align="center">
  <a href="https://youtu.be/fvoIUiUS2yI">
    <img src="https://img.youtube.com/vi/fvoIUiUS2yI/0.jpg" alt="Tween-Craft Demo Video" width="600">
  </a>
</div>

## ✨ Results

### Animation Enhancement
<p align="center">
  <img src="https://github.com/Singireddysai/Tween-Craft/blob/main/results/result_gifs/animation%20Lfps_gif.gif?raw=true" width="400" height="450" alt="Low FPS Animation">
  <img src="https://github.com/Singireddysai/Tween-Craft/blob/main/results/result_gifs/animation%20Hfps_gif.gif?raw=true" width="400" height="450" alt="High FPS Animation">
  <br>
  <em>Original (Left) vs Enhanced 8x (Right)</em>
</p>

### Speaking Scene
<p align="center">
  <img src="https://github.com/Singireddysai/Tween-Craft/blob/main/results/result_gifs/deal%20wit%20it%20Lfps_gif.gif?raw=true" width="400" alt="Low FPS Speaking">
  <img src="https://github.com/Singireddysai/Tween-Craft/blob/main/results/result_gifs/deal%20wit%20it%20Hfps_gif.gif?raw=true" width="400" alt="High FPS Speaking">
  <br>
  <em>Original (Left) vs Enhanced 8x (Right)</em>
</p>

### Motion Sequence
<p align="center">
  <img src="https://github.com/Singireddysai/Tween-Craft/blob/main/results/result_gifs/lingo%20Lfps_gif.gif" width="400" alt="Low FPS Motion">
  <img src="https://github.com/Singireddysai/Tween-Craft/blob/main/results/result_gifs/lingo%20Hfps_gif.gif" width="400" alt="High FPS Motion">
  <br>
  <em>Original (Left) vs Enhanced 8x (Right)</em>
</p>

## 🛠️ Technology

Tween-Craft leverages advanced frame interpolation technology:

- **GMFSS_Fortuna Model** - Retrained on Vimeo Triplet dataset with ~30,000 triplet image sequences
- **ComfyUI Integration** - Enables seamless workflow and performance tracking
- **React + TypeScript Frontend** - Modern, responsive user interface with Tailwind CSS
- **Local Processing** - All computations done on your hardware for maximum privacy

## 📋 Installation

### Prerequisites
- Node.js and npm
- ComfyUI installed on your local system
- Python 3.10+ (for ComfyUI)
- CUDA-compatible GPU recommended for optimal performance

### Setup Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/Singireddysai/Tween-Craft.git
   cd Tween-Craft

Install dependencies:
bashrm -rf package-lock.json node_modules
npm install

Make sure ComfyUI is installed and configured on your system:
bashgit clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
pip install -r requirements.txt

Download and set up GMFSS_Fortuna model:
bash# Follow the installation instructions from:
# https://github.com/98mxr/GMFSS_Fortuna

Start the application:
bashnpm run dev


💡 Usage

Upload Video - Select your video file for processing

Supported formats: MP4, AVI, MOV, WebM
Max recommended file size: 500MB (depends on your hardware)


Configure Settings - Choose desired output dimensions and frame rate multiplier

Output resolution: 480p to 4K (customizable)
Frame rate multiplier: 2x, 4x, 6x, or 8x
Quality settings: Fast, Standard, High (affects processing time)


Process - Start the interpolation process and monitor progress

Real-time progress tracking
Estimated time remaining
Cancel option available


View Results - Preview and download your enhanced video

Side-by-side comparison with original
Before/after frame rate display
Download in various formats


History - Access previously processed videos from the history panel

Saves recent projects
Allows reloading previous configurations
Export/import project settings



🧠 How It Works

Frame Extraction - Video is split into individual frames
Analysis - Motion vectors calculated between consecutive frames
Interpolation - GMFSS_Fortuna model generates intermediate frames
Reconstruction - New high-frame-rate video is assembled

⚙️ Advanced Configuration
Edit the config.json file to customize:
json{
  "comfyui_path": "/path/to/comfyui",
  "model_path": "/path/to/model/weights",
  "default_settings": {
    "resolution": "1080p",
    "frame_multiplier": 4,
    "quality": "standard"
  },
  "performance": {
    "gpu_memory_limit": 4096,
    "threads": 4
  }
}
🔗 Resources

GMFSS_Fortuna GitHub
ComfyUI GitHub
Vimeo Triplet Dataset
Frame Interpolation Research Paper

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
🙏 Acknowledgments

GMFSS_Fortuna team for the original model
ComfyUI for the workflow interface
Vimeo Triplet Dataset for training data
All open-source contributors


<div align="center">
  <p>Developed with ❤️ by <a href="https://github.com/Singireddysai">Singireddysai</a></p>
  <p>Give this project a ⭐ if you found it helpful!</p>
</div>
```
