import React, { useState, useEffect } from 'react';
import { mediaApi } from '../../api/media';
import ImageViewer from './ImageViewer';
import VideoPlayer from './VideoPlayer';

export default function MediaGallery() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const data = await mediaApi.getUserMedia();
        setMediaList(data || []);
      } catch (error) {
        console.error("Failed to fetch media:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
    
    // Simple polling for processing items
    const interval = setInterval(() => {
      setMediaList(currentList => {
        const hasProcessing = currentList.some(m => m.status === 'processing' || m.status === 'queued');
        if (hasProcessing) {
          fetchMedia(); // Refetch if anything is processing
        }
        return currentList;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-4 text-center text-gray-500">Loading media...</div>;
  if (mediaList.length === 0) return <div className="p-4 text-center text-gray-500">No media generated yet.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {mediaList.map((media) => (
        <div key={media.id}>
          {media.media_type === 'image' ? (
            <ImageViewer media={media} />
          ) : (
            <VideoPlayer media={media} />
          )}
        </div>
      ))}
    </div>
  );
}
