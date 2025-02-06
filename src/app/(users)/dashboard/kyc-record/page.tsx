"use client";
import React, { useRef, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

const KycVideoRecording: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [recorded, setRecorded] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (recording && countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, recording]);

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Media devices are not supported by your browser');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 360 },
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        const recorder = new MediaRecorder(stream);
        const chunks: BlobPart[] = [];

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/mp4' });
          setVideoBlob(blob);
          const url = URL.createObjectURL(blob);
          setVideoUrl(url);
          setRecorded(true);
          setRecording(false);
          setCountdown(null);

          if (previewRef.current) {
            previewRef.current.src = url;
            previewRef.current.load();
          }

          stream.getTracks().forEach((track) => track.stop());
        };

        recorder.start();
        setRecording(true);
        setCountdown(10);

        setTimeout(() => {
          if (recorder.state === 'recording') {
            recorder.stop();
          }
        }, 10000);
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('An error occurred while accessing your camera.');
    }
  };

  const submitRecording = async () => {
    if (!videoBlob) {
      alert('No video recorded to submit.');
      return;
    }

    const fileName = `${Date.now()}.mp4`;
    const file = new File([videoBlob], fileName, { type: 'video/mp4' });

    try {
      const { data, error } = await supabase.storage
        .from('videos')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (error) {
        alert('Error uploading video: ' + error.message);
      } else {
        alert('Video submitted successfully!');
        setRecorded(false);
        setVideoBlob(null);
        setVideoUrl(null);
      }
    } catch (error) {
      alert('Failed to upload video.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">KYC Video Recording</h1>
        <p className="text-gray-600 mb-4">State your name and ID number clearly.</p>

        <div className="flex justify-center mb-4 relative">
          <video ref={videoRef} autoPlay className="w-full max-w-md rounded-lg shadow-lg" />
          {recording && countdown !== null && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg text-lg">
              {countdown}
            </div>
          )}
        </div>

        {recorded && videoUrl && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Preview</h2>
            <video ref={previewRef} src={videoUrl} controls className="w-full max-w-md rounded-lg shadow-lg" />
          </div>
        )}

        <div className="flex justify-center space-x-4">
          {!recording && !recorded && (
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
            >
              Start Recording
            </button>
          )}

          {recording && (
            <button
              onClick={() => setRecording(false)}
              className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600"
            >
              Cancel
            </button>
          )}

          {recorded && (
            <>
              <button
                onClick={submitRecording}
                className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setRecorded(false);
                  setVideoBlob(null);
                  setVideoUrl(null);
                }}
                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600"
              >
                Rerecord
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default KycVideoRecording;
