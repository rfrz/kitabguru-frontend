import React, { useState } from 'react';
import { Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { mediaApi } from '../../api/media';

export default function MediaButtons({ sessionId }) {
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [isGeneratingVid, setIsGeneratingVid] = useState(false);

  const handleGenerateImage = async () => {
    setIsGeneratingImg(true);
    try {
      await mediaApi.generateImage(sessionId);
      alert('Image generation started!');
    } catch (error) {
      console.error(error);
      alert('Failed to generate image');
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const handleGenerateVideo = async () => {
    setIsGeneratingVid(true);
    try {
      await mediaApi.generateVideo(sessionId);
      alert('Video generation started!');
    } catch (error) {
      console.error(error);
      alert('Failed to generate video');
    } finally {
      setIsGeneratingVid(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleGenerateImage}
        disabled={isGeneratingImg || !sessionId}
        className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
      >
        {isGeneratingImg ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
        Generate Image
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleGenerateVideo}
        disabled={isGeneratingVid || !sessionId}
        className="gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
      >
        {isGeneratingVid ? <Loader2 size={16} className="animate-spin" /> : <Video size={16} />}
        Generate Video
      </Button>
    </div>
  );
}
