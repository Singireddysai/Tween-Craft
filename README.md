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

**Watch the demonstration video to see Tween-Craft by clicking on preview:**

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

### **NOTE:** The maximum GIF FPS supported is 33FPS hence to view the exact high FPS check the [results videos](https://github.com/Singireddysai/Tween-Craft/tree/main/results/results%20videos)

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
   ```

2. Install dependencies:
  ```bash
    rm -rf package-lock.json node_modules
    npm install
  ```

3. Make sure ComfyUI is installed and configured on your system:
  ```bash
  git clone https://github.com/comfyanonymous/ComfyUI.git
  cd ComfyUI
  pip install -r requirements.txt
  ```


4. Start the application:
  ```bash
  npm run dev
  ```

### 💡 Usage

**Upload Video - Select your video file for processing**
<br>
Supported formats: MP4, AVI, MOV, WebM
Max recommended file size: 500MB (depends on your hardware)


**Configure Settings - Choose desired output dimensions and frame rate multiplier**
<br>
Output resolution: (customizable)
Frame rate multiplier: 2x, 4x, 6x, or 8x
<br>

**Process - Start the interpolation process and monitor progress**
<br>
Real-time progress tracking
Process tracking
<br>

**View Results - Preview and download your enhanced video**
<br>
View result in a clean UI
Download and share options
<br>

**History - Access previously processed videos from the history panel**
<br>
Saves recent projects
Allows reloading and downloading of previous configurations
<br>



### 🧠 How It Works

Frame Extraction - Video is split into individual frames
Analysis - Motion vectors calculated between consecutive frames
Interpolation - GMFSS_Fortuna model generates intermediate frames
Reconstruction - New high-frame-rate video is assembled

### 🔗 Resources

[GMFSS_Fortuna GitHub](https://github.com/98mxr/GMFSS_Fortuna)

[ComfyUI GitHub](https://github.com/comfyanonymous/ComfyUI)

[Vimeo Triplet Dataset](https://paperswithcode.com/dataset/vimeo90k-1)




### 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.


<div align="center">
  <p>Developed with ❤️ by <a href="https://github.com/Singireddysai">Singireddysai</a></p>
  <p>Give this project a ⭐ if you found it helpful!</p>
</div>
```
