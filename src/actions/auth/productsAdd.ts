"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
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
  state: any,
  formData: FormData
) {
  const supabase = await createClient();
  const userDetails = await supabase.auth.getUser();

  const user_id = userDetails.data?.user?.id || null;

  const TARGET_COMPRESSED_SIZE_KB = 200; // Target size for compression
  const MAX_WIDTH = 1000; // Max width for resizing
  const INITIAL_QUALITY = 80; // Initial JPEG compression quality

  const formInput: FormInput = {
    name: formData.get("name")?.toString() || "",
    description: formData.get("description")?.toString() || "",
    price: formData.get("price") ? parseFloat(formData.get("price")?.toString() || "0") : 0,
    category: formData.get("category")?.toString() || "",
    stock: formData.get("stock") ? parseInt(formData.get("stock")?.toString() || "0", 10) : 0,
    image: null,
    user_id: user_id,
  };

  const imageFile = formData.get("image") as File | null;
  if (!imageFile) {
    return { errors: { message: "Image file is required." } };
  }

  // Limit file size for mobile devices
  if (imageFile.size > 2 * 1024 * 1024) { // 2MB limit
    return { errors: { message: "File size exceeds 2MB limit." } };
  }

  const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
  let compressedBuffer = imageBuffer;

  if (imageBuffer.length > TARGET_COMPRESSED_SIZE_KB * 1024) {
    console.log("Compressing large image...");
    compressedBuffer = await sharp(imageBuffer)
      .resize({
        width: MAX_WIDTH,
        withoutEnlargement: true,
      })
      .jpeg({
        quality: INITIAL_QUALITY,
        progressive: true,
      })
      .toBuffer();
  }

  console.log("Final compressed image size:", compressedBuffer.length / 1024, "KB");

  const fileName = `${Date.now()}-${imageFile.name}`;
  const filePath = `public/${fileName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("products_image")
    .upload(filePath, compressedBuffer, { contentType: imageFile.type });

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    return { errors: { message: "Error uploading image." } };
  }

  console.log("Image uploaded successfully:", uploadData);

  formInput.image = filePath;

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

  return redirect("/dashboard/productlist");
}
