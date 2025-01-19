import React, { ReactNode } from 'react';
import Topnav from '@/components/topnav';
import Head from 'next/head';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${process.env.APP_NAME}`,
  description: `${process.env.APP_DESCRIPTION}`,
};

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <>
      <Head>
        <title>My Store</title>
      </Head>

      <div className='mx-auto max-w-7xl'>
        <Topnav />

        <div>{children}</div>
      </div>
    </>
  );
}
