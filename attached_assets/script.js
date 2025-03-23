// for making the video preview
document
  .getElementById("uploadInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    const videoPreview = document.getElementById("videoPreview");

    if (file) {
      const videoURL = URL.createObjectURL(file);
      videoPreview.src = videoURL;
      videoPreview.style.display = "block";
      videoPreview.play();
    } else {
      alert("Please select a valid video file.");
    }
  });

document
  .getElementById("videoUploadBtn")
  .addEventListener("click", async function () {
    const loadingContainer = document.getElementById("loader-container");
    loadingContainer.style.display = "block";
  });
