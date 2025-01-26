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
  state: any, // Replace `any` with the specific type for `state` if known
  formData: FormData
) {
  const supabase = await createClient();
  const userDetails = await supabase.auth.getUser();

  const user_id = userDetails.data?.user?.id || null;
  const MAX_FILE_SIZE = 15 * 1024 * 1024; // 5 MB

  const formInput: FormInput = {
    name: formData.get("name")?.toString() || "",
    description: formData.get("description")?.toString() || "",
    price: formData.get("price") ? parseFloat(formData.get("price")?.toString() || "0") : 0,
    category: formData.get("category")?.toString() || "",
    stock: formData.get("stock") ? parseInt(formData.get("stock")?.toString() || "0", 10) : 0,
    image: null,
    user_id: user_id,
  };

  console.log("Product data ready to be processed:", formInput);

  const imageFile = formData.get("image") as File | null;
  if (!imageFile) {
    console.error("No image provided.");
    return { errors: { message: "Image file is required." } };
  }

  if (imageFile.size > MAX_FILE_SIZE) {
    console.error("Image file size exceeds the limit.");
    return { errors: { message: `Image must be less than ${MAX_FILE_SIZE / (1024 * 1024)} MB.` } };
  }

  const buffer = await imageFile.arrayBuffer();
  const compressedImage = await sharp(Buffer.from(buffer))
    .resize(400)
    .jpeg({ quality: 40 })
    .toBuffer();

  const fileName = `${Date.now()}-${imageFile.name}`;
  const filePath = `public/${fileName}`;

  const { data, error: uploadError } = await supabase.storage
    .from("products_image")
    .upload(filePath, compressedImage, { contentType: "image/jpeg" });

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    return { errors: { message: "Error uploading image." } };
  }

  console.log("Image uploaded successfully:", data);

  const publicUrlResponse = supabase.storage
    .from("products_image")
    .getPublicUrl(filePath);

  const imageUrl = publicUrlResponse.data?.publicUrl;
  if (!imageUrl) {
    console.error("Error fetching public URL.");
    return { errors: { message: "Error fetching image URL." } };
  }

  formInput.image = imageUrl;

  const { data: productData, error: insertError } = await supabase
    .from("products")
    .insert({
      title: formInput.name,
      description: formInput.description,
      price: formInput.price,
      category: formInput.category,
      stock: formInput.stock,
      image: imageUrl,
      id: user_id,
    });

  if (insertError) {
    console.error("Error inserting product:", insertError);
    return { errors: { message: "Error inserting product." } };
  }

  redirect("/dashboard/productlist");
  return { success: true, data: productData };
}
