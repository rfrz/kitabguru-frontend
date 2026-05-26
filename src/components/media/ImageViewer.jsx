import React from 'react';

const API_URL = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '') : 'http://localhost:8001';

export default function ImageViewer({ media }) {
  if (media.status !== 'completed') {
    return (
      <div className="w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center animate-pulse">
        <span className="text-gray-500 text-sm">{media.status}...</span>
      </div>
    );
  }

  const url = `${API_URL}/${media.file_path}`;

  return (
    <div className="rounded-lg overflow-hidden border bg-white shadow-sm hover:shadow-md transition-shadow">
      <img src={url} alt="Generated UI" className="w-full h-auto object-cover aspect-square" />
      <div className="p-3 text-xs text-gray-500 truncate" title={media.prompt_used}>
        {media.prompt_used || 'Generated Image'}
      </div>
    </div>
  );
}
