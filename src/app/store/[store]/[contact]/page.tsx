"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';
import Header from '@/components/headerUser';
import ContactInfo from '@/components/contactInfo';

export default function Page() {
  const [shopDetails, setShopDetails] = useState(null);
  const [error, setError] = useState(null);
  const supabase = createClient();
  const { contact } = useParams();

  useEffect(() => {
    async function fetchShopDetails() {
      const { data, error } = await supabase
        .from('user_profile')
        .select("*")
        .eq('username', contact)
        .single();

      if (error) {
        console.error('Error fetching shop details:', error);
        setError(error);
      } else {
        setShopDetails(data);
      }
    }

    if (contact) {
      fetchShopDetails();
    }
  }, [contact, supabase]);

  if (error) {
    return <div>Error loading shop details.</div>;
  }

  return (
    <div>
      {shopDetails && (
        <>
          <Header shopDetails={shopDetails} />
          <ContactInfo shopDetails={shopDetails} />
        </>
      )}
    </div>
  );
}
