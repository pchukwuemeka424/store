import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';


// add metaData
export const metadata: Metadata = {
  title: `${process.env.APP_NAME}`,
  description: `${process.env.APP_DESCRIPTION}`,
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase =await createClient();



  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/");
  }

 // select * from user_profile


  return <div>

    {children}</div>;
}
