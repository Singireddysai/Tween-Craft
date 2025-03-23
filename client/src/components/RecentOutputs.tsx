import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Play } from "lucide-react";

interface VideoItem {
  name: string;
  path: string;
  date: string;
  time: number;
}

const RecentOutputs = () => {
  const { data, isLoading, error } = useQuery<{ videos: VideoItem[] }>({
    queryKey: ['/api/recent-videos'],
  });
  
  // Format the date as relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return `Processed ${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
    } else if (diffHour > 0) {
      return `Processed ${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffMin > 0) {
      return `Processed ${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'Processed just now';
    }
  };
  
  if (isLoading) {
    return (
      <section>
        <h2 className="text-2xl font-['K2D'] font-semibold mb-4">Recent Outputs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-[#262626] rounded-lg overflow-hidden border border-gray-700 animate-pulse">
              <div className="aspect-video bg-[#1E1E1E]"></div>
              <div className="p-3">
                <div className="h-5 bg-[#1E1E1E] rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-[#1E1E1E] rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  if (error || !data) {
    return (
      <section>
        <h2 className="text-2xl font-['K2D'] font-semibold mb-4">Recent Outputs</h2>
        <p className="text-[#9CA3AF]">Could not load recent videos</p>
      </section>
    );
  }
  
  if (data.videos.length === 0) {
    return (
      <section>
        <h2 className="text-2xl font-['K2D'] font-semibold mb-4">Recent Outputs</h2>
        <p className="text-[#9CA3AF]">No processed videos yet</p>
      </section>
    );
  }
  
  return (
    <section>
      <h2 className="text-2xl font-['K2D'] font-semibold mb-4">Recent Outputs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.videos.map((video, index) => (
          <div key={index} className="bg-[#262626] rounded-lg overflow-hidden border border-gray-700 hover:border-gray-500 transition-colors">
            <div className="aspect-video bg-black relative">
              <video className="w-full h-full object-cover">
                <source src={video.path} type="video/mp4" />
              </video>
              <div className="absolute inset-0 flex items-center justify-center">
                <a href={video.path} className="bg-black/70 rounded-full p-3 hover:bg-black/90 transition-colors">
                  <Play className="h-8 w-8 text-white" />
                </a>
              </div>
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">60 FPS</div>
            </div>
            <div className="p-3">
              <h3 className="font-medium truncate">{video.name}</h3>
              <p className="text-xs text-[#9CA3AF]">{formatRelativeTime(video.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentOutputs;
