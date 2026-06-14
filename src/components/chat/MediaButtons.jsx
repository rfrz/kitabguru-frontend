import React, { useState } from 'react';
import { Image as ImageIcon, Video, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { mediaApi } from '../../api/media';
import { useChat } from '../../contexts/ChatContext';

export default function MediaButtons({ messageId, sessionId }) {
  const { currentSessionId, loadSession } = useChat();
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [isGeneratingVid, setIsGeneratingVid] = useState(false);

  const activeSessionId = sessionId || currentSessionId;

  const handleGenerateImage = async () => {
    setIsGeneratingImg(true);
    try {
      await mediaApi.generateImage(activeSessionId, messageId);
      await loadSession(activeSessionId);
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
      await mediaApi.generateVideo(activeSessionId, messageId);
      alert('Video generation queued!');
    } catch (error) {
      console.error(error);
      alert('Failed to generate video');
    } finally {
      setIsGeneratingVid(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2.5">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleGenerateImage}
        disabled={isGeneratingImg || !activeSessionId || !messageId}
        className="gap-2 text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all rounded-full h-8 px-4 text-xs font-medium shadow-sm hover:shadow"
      >
        {isGeneratingImg ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Sparkles size={14} className="text-amber-500" />
        )}
        {isGeneratingImg ? 'Generating...' : 'Generate Image'}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleGenerateVideo}
        disabled={isGeneratingVid || !activeSessionId || !messageId}
        className="gap-2 text-emerald-600 border-emerald-600/20 bg-emerald-500/5 hover:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-400/20 dark:bg-emerald-400/5 dark:hover:bg-emerald-400/10 transition-all rounded-full h-8 px-4 text-xs font-medium shadow-sm hover:shadow"
      >
        {isGeneratingVid ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Video size={14} />
        )}
        Generate Video
      </Button>
    </div>
  );
}
