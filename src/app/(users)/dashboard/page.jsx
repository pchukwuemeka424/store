import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Dashboard from "@/components/dashboard";
import TopBar from "@/components/topbar";
import { User } from "lucide-react";
import UserDashboard from "@/components/userdashboard";

export default async function DashboardPage() {

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: profile, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  if (profile.stat === null || profile.city === null || profile.phone === null) {
    redirect("/dashboard/profile");
  }

  return (
    <div>
      <Dashboard />
    </div>
  );
}
