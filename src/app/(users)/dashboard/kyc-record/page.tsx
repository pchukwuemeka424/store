"use client";
import React, { useRef, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient(); // Initialize Supabase client

const KycVideoRecording: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Media devices are not supported by your browser');
      return;
    }

    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 360 }, // 360p quality
      });

      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
        const recorder = new MediaRecorder(userStream);
        const chunks: BlobPart[] = [];

        recorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        recorder.onstop = async () => {
          const blob = new Blob(chunks, { type: 'video/mp4' });
          const videoUrl = URL.createObjectURL(blob);

          // Save video to Supabase
          const { data, error } = await supabase
            .storage
            .from('videos')
            .upload(`kyc/${Date.now()}.mp4`, blob, {
              cacheControl: '3600',
              upsert: false,
            });

          if (error) {
            console.error('Error uploading video: ', error);
          } else {
            console.log('Video uploaded successfully: ', data);
          }

          // Stop all tracks of the stream to release the camera
          userStream.getTracks().forEach(track => track.stop());
        };

        recorder.start();
        setMediaRecorder(recorder);
        setStream(userStream);
        setRecording(true);
      }
    } catch (error) {
      console.error('Error accessing media devices: ', error);
      alert('An error occurred while accessing your camera. Please check your camera settings or try a different browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && stream) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">KYC Video Recording</h1>
        
        <div className="flex justify-center mb-4">
          <video ref={videoRef} autoPlay muted className="w-full max-w-md rounded-lg shadow-lg" />
        </div>

        <div className="flex justify-center">
          {!recording ? (
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Stop Recording
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KycVideoRecording;
