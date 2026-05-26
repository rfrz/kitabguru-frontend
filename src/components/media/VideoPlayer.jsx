import React from 'react';

const API_URL = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '') : 'http://localhost:8001';

export default function VideoPlayer({ media }) {
  if (media.status !== 'completed') {
    return (
      <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <span className="text-gray-500 text-sm mb-2">{media.status}...</span>
          {media.progress_pct !== undefined && (
            <div className="w-32 h-2 bg-gray-300 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${media.progress_pct}%` }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  const url = `${API_URL}/${media.file_path}`;

  return (
    <div className="rounded-lg overflow-hidden border bg-black shadow-sm">
      <video 
        src={url} 
        controls 
        className="w-full h-auto aspect-video"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
