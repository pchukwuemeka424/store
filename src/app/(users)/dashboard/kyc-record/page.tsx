"use client";
import React, { useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient(); // Initialize Supabase client

const KycVideoRecording: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [recorded, setRecorded] = useState(false);

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Media devices are not supported by your browser");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 360 },
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

          if (previewRef.current) {
            previewRef.current.src = url;
            previewRef.current.load();
          }

          stream.getTracks().forEach((track) => track.stop());
        };

        recorder.start();
        setRecording(true);

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

  const submitRecording = async () => {
    if (!videoBlob) {
      alert("No video recorded to submit.");
      return;
    }

    const fileName = `kyc/${Date.now()}.mp4`;
    const file = new File([videoBlob], fileName, { type: "video/mp4" });

    console.log("Uploading file:", fileName, file);

    try {
      const { data, error } = await supabase.storage
        .from("banners") // Ensure "videos" is the correct bucket name
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Supabase Upload Error:", error);
        alert("Error uploading video: " + error.message);
      } else {
        console.log("Video uploaded successfully:", data);
        alert("Video submitted successfully!");
      }
    } catch (error) {
      console.error("Upload Failed:", error);
      alert("Failed to upload video.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          KYC Video Recording
        </h1>

        <div className="flex justify-center mb-4">
          <video ref={videoRef} autoPlay muted className="w-full max-w-md rounded-lg shadow-lg" />
        </div>

        {recorded && videoUrl && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
              Preview Recorded Video
            </h2>
            <video
              ref={previewRef}
              src={videoUrl}
              controls
              className="w-full max-w-md rounded-lg shadow-lg"
            />
          </div>
        )}

        <div className="flex justify-center space-x-4">
          {!recording && !recorded && (
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Start Recording
            </button>
          )}

          {recording && (
            <button
              onClick={() => setRecording(false)}
              className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel Recording
            </button>
          )}

          {recorded && (
            <>
              <button
                onClick={submitRecording}
                className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setRecorded(false);
                  setVideoBlob(null);
                  setVideoUrl(null);
                }}
                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
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
