
import React from 'react';
import FetchSingleProduct from './fetchSingle';
import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/client';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const supabase = createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', params.id)
    .single();

  const user = data ?? {};
  return {
    title: `${process.env.APP_NAME} - ${user.title || 'Store'}`,
    description: `${user.description || ''}`,
    openGraph: {
      title: `${process.env.APP_NAME} - ${user.title || 'Store'}`,
      description: `${user.description || ''}`,
      images: [
        {
          url: `${user.image}`,
          width: 800,
          height: 600,
          alt: 'Og Image Alt',
        },
      ],
    },
  };
}
// Page Component
export default function Page() {


  return (
    <div>
      <FetchSingleProduct/>
    </div>
  );
}
