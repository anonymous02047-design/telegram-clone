'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2 } from 'lucide-react';

interface VoiceRecorderProps {
  onSendVoiceMessage: (audioBlob: Blob) => void;
  onCancel: () => void;
}

export default function VoiceRecorder({ onSendVoiceMessage, onCancel }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playRecording = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };

  const sendRecording = () => {
    if (audioBlob) {
      onSendVoiceMessage(audioBlob);
      deleteRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {!audioBlob ? (
            <>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-3 rounded-full transition-colors ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isRecording ? <Square size={20} /> : <Mic size={20} />}
              </button>
              
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {isRecording ? 'Recording...' : 'Tap to record'}
                </span>
              </div>
              
              {isRecording && (
                <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                  {formatTime(recordingTime)}
                </span>
              )}
            </>
          ) : (
            <>
              <button
                onClick={playRecording}
                className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatTime(recordingTime)}
              </span>
              
              <button
                onClick={deleteRecording}
                className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Cancel
          </button>
          
          {audioBlob && (
            <button
              onClick={sendRecording}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              Send
            </button>
          )}
        </div>
      </div>
      
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          className="hidden"
        />
      )}
    </div>
  );
}
