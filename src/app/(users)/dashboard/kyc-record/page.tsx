"use client";

import React, { useRef, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const VideoVerification: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [recorded, setRecorded] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (recording && countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, recording]);

  const startRecording = async () => {
    if (typeof window === "undefined") return;

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
          const blob = new Blob(chunks, { type: "video/mp4" });
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
          if (recorder.state === "recording") {
            recorder.stop();
          }
        }, 10000);
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("An error occurred while accessing your camera.");
    }
  };

  const uploadVideo = async () => {
    if (!videoBlob) {
      alert("No video to upload!");
      return;
    }

    setUploading(true);
    const user = await supabase.auth.getUser();
    const userId = user?.data?.user?.id;

    if (!userId) {
      alert("User not authenticated!");
      setUploading(false);
      return;
    }

    // Generate a unique filename
    const filename = `${userId}-${Date.now()}.mp4`;

    // Upload video to Supabase Storage
    const { data, error } = await supabase.storage.from("videos").upload(filename, videoBlob, {
      contentType: "video/mp4",
    });

    if (error) {
      console.error("Upload error:", error.message);
      alert("Video upload failed!");
      setUploading(false);
      return;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from("videos").getPublicUrl(filename);
    const videoPath = publicUrlData.publicUrl;

    // Insert video path & user ID into database
    const { error: dbError } = await supabase.from("kyc")
    .update([
      { video: videoPath },
    ])
    .eq("user_id", userId);

    if (dbError) {
      console.error("Database update error:", dbError.message);
      alert("Failed to save video data!");
      setUploading(false);
      return;
    }

    alert("Video uploaded successfully!");
    setUploading(false);
  };

  if (!isClient) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-2xl shadow-xl text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-400">
          10-Second Video Verification
        </h1>
        <p className="text-gray-300 mb-4">
          Please clearly state your name and ID number.
        </p>

        <div className="relative mb-4">
          <video ref={videoRef} autoPlay className="w-full max-w-md rounded-lg shadow-lg border border-blue-500" />
          {recording && countdown !== null && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg text-lg">
              {countdown}
            </div>
          )}
        </div>

        {recorded && videoUrl && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Preview</h2>
            <video ref={previewRef} src={videoUrl} controls className="w-full max-w-md rounded-lg shadow-lg border border-green-500" />
          </div>
        )}

        <div className="flex justify-center space-x-4">
          {!recording && !recorded && (
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
            >
              Start Recording
            </button>
          )}

          {recording && (
            <button
              onClick={() => setRecording(false)}
              className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}

          {recorded && (
            <>
              <button
                onClick={uploadVideo}
                disabled={uploading}
                className={`px-6 py-3 ${
                  uploading ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"
                } text-white font-semibold rounded-lg shadow-md transition`}
              >
                {uploading ? "Uploading..." : "Submit"}
              </button>
              <button
                onClick={() => {
                  setRecorded(false);
                  setVideoBlob(null);
                  setVideoUrl(null);
                }}
                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
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

export default VideoVerification;
