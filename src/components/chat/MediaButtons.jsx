import React, { useState } from 'react';
import { Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { mediaApi } from '../../api/media';
import { useChat } from '../../contexts/ChatContext';

export default function MediaButtons({ messageId }) {
  const { currentSessionId, loadSession } = useChat();
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [isGeneratingVid, setIsGeneratingVid] = useState(false);

  const handleGenerateImage = async () => {
    setIsGeneratingImg(true);
    try {
      await mediaApi.generateImage(currentSessionId, messageId);
      await loadSession(currentSessionId);
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
      await mediaApi.generateVideo(currentSessionId, messageId);
      alert('Video generation queued!');
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
        disabled={isGeneratingImg || !currentSessionId || !messageId}
        className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
      >
        {isGeneratingImg ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
        Generate Image
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleGenerateVideo}
        disabled={isGeneratingVid || !currentSessionId || !messageId}
        className="gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
      >
        {isGeneratingVid ? <Loader2 size={16} className="animate-spin" /> : <Video size={16} />}
        Generate Video
      </Button>
    </div>
  );
}
