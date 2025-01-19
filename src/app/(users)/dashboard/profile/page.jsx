import React from "react";
import Userdashboard from "@/components/userdashboard";
import Topbar from "@/components/topbar";
import profileUpdate from "@/actions/auth/profileUpdate";
import ProfileForm from "@/components/ProfileForm";

// import supabase client
import { createClient } from "@/utils/supabase/server";


import { redirect } from 'next/navigation';  // Import redirect from Next.js

export default async function Profile() {
  // Authenticate the user
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  // Fetch the user's profile
  const { data: profile, error } = await supabase
    .from('user_profile')
    .select('*')
    .eq('id', user.id)
    .single();
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
 

  // Convert profile to JSON
  const profileJson = JSON.parse(JSON.stringify(profile));

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 h-screen">
      {/* Sidebar */}
      <Userdashboard />

      {/* Main Content Area */}
      <div className="col-span-4 p-6 bg-gray-100 grid grid-cols-1 gap-6">
        {/* Topbar */}
        <Topbar />
    
        {/* Profile Form */}
        <ProfileForm handler={profileUpdate} defaultValues={profileJson} />
      </div>
    </div>
  );
}
