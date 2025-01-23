import React from 'react';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  // Fetch the current session (or user) on the server side
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect if no user is logged in
  if (!session?.user) {
    redirect('/');
  }

  return <div>{children}</div>;
}
