import React from 'react';
import Topnav from '@/components/topnav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl">
      <Topnav />
      <div>{children}</div>
    </div>
  );
}
