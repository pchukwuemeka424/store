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
    <div className="flex flex-col md:flex-row h-screen">
   

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-50 space-y-6 overflow-y-auto">
        {/* Topbar */}
        <Userdashboard />
        <Topbar />
    
    
        {/* Profile Form */}
        <ProfileForm handler={profileUpdate} defaultValues={profileJson} />
      </div>
    </div>
  );
}
