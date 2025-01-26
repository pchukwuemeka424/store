import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import sharp from "sharp";  // Import sharp for image processing

interface FormInput {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string | null;
  user_id: string | null;
}

export default async function addProduct(state: any, formData: FormData) {
  const supabase = await createClient();
  const userDetails = await supabase.auth.getUser();

  const user_id = userDetails.data?.user?.id || null;

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

  // Convert the File object to a Buffer (needed for sharp)
  const imageBuffer = await imageFile.arrayBuffer();  // Convert File to ArrayBuffer
  const buffer = Buffer.from(imageBuffer);  // Convert ArrayBuffer to Buffer

  // Compress the image using sharp
  const compressedImageBuffer = await sharp(buffer)
    .resize(800)  // Resize the image (adjust size as needed)
    .jpeg({ quality: 80 })  // Compress to JPEG with 80% quality (you can adjust this value)
    .toBuffer();

  const fileName = `${Date.now()}-${imageFile.name}`;
  const filePath = `public/${fileName}`;

  // Upload the compressed image directly to Supabase storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("products_image")
    .upload(filePath, compressedImageBuffer, {
      contentType: "image/jpeg",  // Set content type to JPEG
    });

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    return { errors: { message: "Error uploading image." } };
  }

  console.log("Image uploaded successfully");

  formInput.image = filePath;

  // Insert product into database
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
