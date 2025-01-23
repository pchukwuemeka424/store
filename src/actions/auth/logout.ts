"use client";
import { createClient } from "@/utils/supabase/client";

export default async function logout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, message: error.message }; // Return error state
  }
  return { success: true }; // Return success state
}
