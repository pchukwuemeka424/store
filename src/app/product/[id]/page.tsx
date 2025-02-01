
import React from 'react';
import FetchSingleProduct from './fetchSingle';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `${process.env.APP_NAME} - ${params.id}`,
    description: process.env.APP_DESCRIPTION || '',
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
