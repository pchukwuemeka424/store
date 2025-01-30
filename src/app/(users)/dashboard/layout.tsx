import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

// Add metadata
export const metadata: Metadata = {
  title: process.env.APP_NAME || 'Default Title',
  description: process.env.APP_DESCRIPTION || 'Default Description',
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect('/');
    }
  } catch (error) {
    console.error('Error fetching user:', error);
  }

  return(
    <div>{children}</div>
  )
}
