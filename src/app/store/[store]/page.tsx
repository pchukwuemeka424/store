import React from 'react';

import Shop from './shop';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { store: string } }): Promise<Metadata> {
  return {
    title: `${process.env.APP_NAME} - ${params.store}`,
    description: process.env.APP_DESCRIPTION || '',
  };
}

export default function Page() {
  return (
    <div>
      <Shop />
    </div>
  );
}
