const submitRecording = async () => {
    if (!videoBlob) {
      alert("No video recorded to submit.");
      return;
    }
  
    const fileName = `kyc/${Date.now()}.mp4`;
    const file = new File([videoBlob], fileName, { type: "video/mp4" });
  
    console.log("Uploading file:", file.name, file.size, file.type);  // Confirm file details
  
    try {
      // Upload the video file to Supabase
      const { data, error } = await supabase.storage
        .from("videos")  // Ensure "videos" is the correct bucket name
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
  