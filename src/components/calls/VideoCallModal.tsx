'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Volume2, 
  VolumeX,
  Users,
  Settings,
  Maximize,
  Minimize
} from 'lucide-react';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  callType: 'voice' | 'video';
  isIncoming?: boolean;
  callerName?: string;
  callerAvatar?: string;
}

export default function VideoCallModal({ 
  isOpen, 
  onClose, 
  callType, 
  isIncoming = false, 
  callerName = 'John Doe',
  callerAvatar 
}: VideoCallModalProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [participants, setParticipants] = useState(1);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (isOpen && !isIncoming) {
      startCall();
    }
  }, [isOpen, isIncoming]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const startCall = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callType === 'video',
        audio: true
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Initialize peer connection
      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      
      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnectionRef.current?.addTrack(track, stream);
      });
      
      // Handle remote stream
      peerConnectionRef.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
      
      setIsConnected(true);
    } catch (error) {
      console.error('Error starting call:', error);
    }
  }, [callType]);

  const handleAnswer = () => {
    startCall();
    setIsConnected(true);
  };

  const handleEndCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    onClose();
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOff(!isSpeakerOff);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black z-50 ${isFullscreen ? '' : 'flex items-center justify-center'}`}>
      <div className={`${isFullscreen ? 'w-full h-full' : 'w-full max-w-4xl mx-4'} bg-gray-900 rounded-lg overflow-hidden`}>
        {/* Video Container */}
        <div className="relative w-full h-full min-h-[500px]">
          {/* Remote Video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Local Video */}
          {callType === 'video' && (
            <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Call Info */}
          <div className="absolute top-4 left-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                {callerAvatar ? (
                  <img src={callerAvatar} alt="Caller" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-lg font-medium text-white">
                    {callerName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{callerName}</h3>
                {isConnected && (
                  <p className="text-sm text-gray-300">{formatDuration(callDuration)}</p>
                )}
              </div>
            </div>
          </div>

          {/* Participants Count */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full">
              <Users size={16} />
              <span>{participants}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-4">
              {/* Mute/Unmute */}
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full transition-colors ${
                  isMuted 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isMuted ? <MicOff size={24} className="text-white" /> : <Mic size={24} className="text-white" />}
              </button>

              {/* Video On/Off */}
              {callType === 'video' && (
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full transition-colors ${
                    isVideoOff 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {isVideoOff ? <VideoOff size={24} className="text-white" /> : <Video size={24} className="text-white" />}
                </button>
              )}

              {/* Speaker */}
              <button
                onClick={toggleSpeaker}
                className={`p-3 rounded-full transition-colors ${
                  isSpeakerOff 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isSpeakerOff ? <VolumeX size={24} className="text-white" /> : <Volume2 size={24} className="text-white" />}
              </button>

              {/* End Call */}
              <button
                onClick={handleEndCall}
                className="p-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
              >
                <PhoneOff size={24} className="text-white" />
              </button>
            </div>
          </div>

          {/* Incoming Call Overlay */}
          {!isConnected && isIncoming && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  {callerAvatar ? (
                    <img src={callerAvatar} alt="Caller" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-2xl font-medium text-white">
                      {callerName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-semibold mb-2">{callerName}</h3>
                <p className="text-gray-300 mb-6">
                  {callType === 'video' ? 'Incoming video call' : 'Incoming voice call'}
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={handleEndCall}
                    className="p-4 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                  >
                    <PhoneOff size={24} className="text-white" />
                  </button>
                  <button
                    onClick={handleAnswer}
                    className="p-4 bg-green-500 hover:bg-green-600 rounded-full transition-colors"
                  >
                    <Phone size={24} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
