"use client";
import React, { useRef, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient(); // Initialize Supabase client

const KycVideoRecording: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [recording, setRecording] = useState(false);

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Media devices are not supported by your browser');
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 360 }, // 360p quality
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream as MediaStream;
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
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
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();

      setTimeout(() => {
        mediaRecorder.stop();
        setRecording(false);
      }, 10000); // 10 seconds
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay muted />
      <button onClick={startRecording} disabled={recording}>
        {recording ? 'Recording...' : 'Start Recording'}
      </button>
    </div>
  );
};

export default KycVideoRecording;
