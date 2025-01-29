"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import FlutterWaveClient from "./FlutterWaveClient";

export default async function FlutterWave({ amount }: { amount: number }) {
  const supabase =await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (!user || userError) {
    console.error("User not authenticated:", userError);
    redirect("/");
  }
console.log(user);
  // Fetch user profile from Supabase
  const { data: profile, error: profileError } = await supabase
    .from("user_profile")
    .select("phone_number, username, email")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching user profile:", profileError);
  }

  // Default user data
  const userData = {
    email: profile?.email || user.email || "no-email@example.com",
    phone: profile?.phone_number || "07000000000",
    username: profile?.username || user.user_metadata?.username || "John Doe",
  };

  return <FlutterWaveClient amount={amount} user={userData} />;
}
