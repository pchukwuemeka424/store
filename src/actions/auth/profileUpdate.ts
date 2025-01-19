"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

type ProfileUpdateForm = {
  username: string;
  shopname: string;
  phone: string;
  address?: string;
  stat: string;
  city: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
};

export default async function profileUpdate(state: Record<string, any>, formData: FormData) {
  const supabase = await createClient();

  // Fetch the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error("Authentication error:", authError?.message);
    return { errors: { message: "Authentication error" } };
  }

  // Define the validation schema
  const ProfileSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters long." }),
    shopname: z.string().min(3, { message: "Shop name must be at least 3 characters long." }),
    phone: z.string().regex(/^\d{11}$/, { message: "Phone number must be 11 digits." }),
    address: z.string().optional(),
    stat: z.string().min(2, { message: "State must be at least 2 characters long." }),
    city: z.string().min(2, { message: "City must be at least 2 characters long." }),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    tiktok: z.string().optional(),
    twitter: z.string().optional(),
  });

  // Extract and validate the form data
  const formInput: ProfileUpdateForm = {
    username: formData.get("username")?.toString() || "",
    shopname: formData.get("shopname")?.toString() || "",
    phone: formData.get("phone")?.toString() || "",
    address: formData.get("address")?.toString() || "",
    stat: formData.get("stat")?.toString() || "",
    city: formData.get("city")?.toString() || "",
    facebook: formData.get("facebook")?.toString() || "",
    instagram: formData.get("instagram")?.toString() || "",
    tiktok: formData.get("tiktok")?.toString() || "",
    twitter: formData.get("twitter")?.toString() || "",
  };

  const parseResult = ProfileSchema.safeParse(formInput);
  if (!parseResult.success) {
    console.log("Validation errors:", parseResult.error.flatten().fieldErrors);
    return { errors: parseResult.error.flatten().fieldErrors, ...formInput };
  }

  const { username, shopname, phone, address, stat, city, facebook, instagram, tiktok, twitter } = parseResult.data;

  // Update the user's profile in the database
  const { error: updateError } = await supabase
    .from("user_profile")
    .update({ username, shopname, phone, address, stat, city, facebook, instagram, tiktok, twitter })
    .eq("id", user.id)
    .single();

  if (updateError) {
    console.error("Error updating profile:", updateError.message);
    return { errors: { message: "Error updating profile" }, ...formInput };
  }

  return redirect("/dashboard/profile");
}
