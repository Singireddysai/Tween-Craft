import { apiRequest } from "./queryClient";

export interface UploadResponse {
  fileId: string;
  fileName: string;
  filePath: string;
}

export interface ProcessingResponse {
  outputPath: string;
  processingTime: number;
}

export interface VideoInfo {
  video: string;
}

export interface RecentVideosResponse {
  videos: {
    name: string;
    path: string;
    date: string;
    time: number;
  }[];
}

/**
 * Upload a video file
 */
export const uploadVideo = async (
  file: File,
  multiplier: number = 6
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("videoUpload", file);
  formData.append("multiplier", multiplier.toString());
  
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error("Failed to upload video");
  }
  
  return response.json();
};

/**
 * Process a video file
 */
export const processVideo = async (
  fileId: string,
  filePath: string,
  multiplier: number = 6
): Promise<ProcessingResponse> => {
  const response = await apiRequest("POST", `/api/process/${fileId}`, {
    filePath,
    multiplier,
  });
  
  if (!response.ok) {
    throw new Error("Failed to process video");
  }
  
  return response.json();
};

/**
 * Get the latest processed video
 */
export const getLatestVideo = async (): Promise<VideoInfo> => {
  const response = await apiRequest("GET", "/api/latest-video", undefined);
  
  if (!response.ok) {
    throw new Error("Failed to get latest video");
  }
  
  return response.json();
};

/**
 * Get recent processed videos
 */
export const getRecentVideos = async (): Promise<RecentVideosResponse> => {
  const response = await apiRequest("GET", "/api/recent-videos", undefined);
  
  if (!response.ok) {
    throw new Error("Failed to get recent videos");
  }
  
  return response.json();
};
