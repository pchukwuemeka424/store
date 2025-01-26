"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import sharp from "sharp";

interface FormInput {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string | null;
  user_id: string | null;
}

export default async function addProduct(
  state: any, // Replace `any` with the specific type for `state` if known
  formData: FormData
) {
  const supabase = await createClient();
  const userDetails = await supabase.auth.getUser();

  const user_id = userDetails.data?.user?.id || null;

  const TARGET_COMPRESSED_SIZE_KB = 200; // Target compressed size in KB
  const MAX_WIDTH = 1000; // Max width for resizing
  const INITIAL_QUALITY = 80; // Initial JPEG compression quality
  const MIN_QUALITY = 30; // Minimum quality to avoid over-compression

  const formInput: FormInput = {
    name: formData.get("name")?.toString() || "",
    description: formData.get("description")?.toString() || "",
    price: formData.get("price") ? parseFloat(formData.get("price")?.toString() || "0") : 0,
    category: formData.get("category")?.toString() || "",
    stock: formData.get("stock") ? parseInt(formData.get("stock")?.toString() || "0", 10) : 0,
    image: null,
    user_id: user_id,
  };

  // Validate if an image file is provided
  const imageFile = formData.get("image") as File | null;
  if (!imageFile) {
    return { errors: { message: "Image file is required." } };
  }

  // Read the image file into a buffer
  const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
  let compressedBuffer = imageBuffer;
  let quality = INITIAL_QUALITY;

  // Compress image only if it exceeds the target size
  if (imageBuffer.length > TARGET_COMPRESSED_SIZE_KB * 1024) {
    console.log("Compressing large image...");
    while (
      compressedBuffer.length > TARGET_COMPRESSED_SIZE_KB * 1024 &&
      quality >= MIN_QUALITY
    ) {
      compressedBuffer = await sharp(imageBuffer)
        .resize({ width: MAX_WIDTH }) // Resize to max width of 1000px
        .jpeg({ quality }) // Compress to target quality
        .toBuffer();

      console.log(
        `Compression attempt with quality ${quality}: ${compressedBuffer.length / 1024} KB`
      );
      quality -= 10; // Reduce quality for further compression
    }
  }

  console.log("Final compressed image size:", compressedBuffer.length / 1024, "KB");

  // Generate a file name and upload the compressed image
  const fileName = `${Date.now()}-${imageFile.name}`;
  const filePath = `public/${fileName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("products_image")
    .upload(filePath, compressedBuffer, { contentType: "image/jpeg" });

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    return { errors: { message: "Error uploading image." } };
  }

  console.log("Image uploaded successfully:", uploadData);

  formInput.image = filePath;

  // Insert product details into the database
  const { data: productData, error: insertError } = await supabase
    .from("products")
    .insert({
      title: formInput.name,
      description: formInput.description,
      price: formInput.price,
      category: formInput.category,
      stock: formInput.stock,
      image: filePath,
      id: user_id,
    });

  if (insertError) {
    console.error("Error inserting product:", insertError);
    return { errors: { message: "Error inserting product." } };
  }

  console.log("Product added successfully:", productData);

  // Redirect to the product list dashboard
  return redirect("/dashboard/productlist");
}
