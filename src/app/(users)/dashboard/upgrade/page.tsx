"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import { FaCrown } from "react-icons/fa6";
import { PaystackButton } from 'react-paystack';


const config = {
  reference: (new Date()).getTime().toString(),
  email: "user@example.com",
  amount: 20000, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
  publicKey: 'pk_test_dsdfghuytfd2345678gvxxxxxxxxxx',
};




const UpgradePage = async () => {
  // you can call this function anything
  const handlePaystackSuccessAction = (reference) => {
    // Implementation for whatever you want to do with reference and after success call.
    console.log(reference);
  };

  // you can call this function anything
  const handlePaystackCloseAction = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log('closed')
  }

  const componentProps = {
      ...config,
      text: 'Paystack Button Implementation',
      onSuccess: (reference) => handlePaystackSuccessAction(reference),
      onClose: handlePaystackCloseAction,
  };
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user: userInfo } } = await supabase.auth.getUser();
  
    if (!userInfo) {
        console.error("User not authenticated");
        return redirect('/login'); // Redirect if user is not authenticated
    }
  
    // Fetch user profile from Supabase
    const { data: profile, error } = await supabase
      .from("user_profile")
      .select("*")
      .eq("id", userInfo.id)
      .single();
  
    if (error) {
      console.error("Error fetching user profile:", error);
    }
  
    // Format user data correctly
    const user = {
      email: profile?.email || userInfo.email || "no-email@example.com",
      phone: profile?.phone_number || "07000000000",
      username: profile?.username || userInfo.user_metadata?.username || "John Doe",
    };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <FaCrown size={50} className="text-yellow-500 mx-auto" />
        <h2 className="text-2xl font-bold mt-4">Upgrade Your Plan</h2>
        <p className="text-gray-600 mt-2">
          Unlock premium features by upgrading to a Standard or Premium plan.
          <PaystackButton {...componentProps} />
        </p>

        <div className="mt-6 space-y-4">
          <div className="bg-blue-500 text-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-semibold">Standard Plan</h3>
            <p className="text-sm">$10/month</p>
     
          </div>

          <div className="bg-purple-600 text-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-semibold">Premium Plan</h3>
            <p className="text-sm">$25/month</p>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
