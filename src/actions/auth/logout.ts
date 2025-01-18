import { createClient } from "@/utils/supabase/client";

export default async function logout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error logging out:', error.message);
    return { success: false, message: error.message }; // Return error state
  } else {
    console.log('Logged out successfully');
    return { success: true }; // Return success state
  }
}