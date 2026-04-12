import { useState, useRef, useCallback } from 'react';
import { speakText } from '../utils/api';

export function useTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const urlRef = useRef(null);

  const speak = useCallback(async (text) => {
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }

    setIsPlaying(true);
    try {
      const url = await speakText(text);
      urlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;

      await new Promise((resolve, reject) => {
        audio.onended = resolve;
        audio.onerror = reject;
        audio.play();
      });
    } catch (err) {
      console.error('TTS error:', err);
    } finally {
      setIsPlaying(false);
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  return { speak, stop, isPlaying };
}
