"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { createClient } from "@/utils/supabase/client";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          console.error("Authentication error:", authError?.message);
          return { errors: { message: "Authentication error" } };
        }

        // Fetch user profile details
        const { data, error: dataError } = await supabase
          .from("user_profile")
          .select("*")
          .eq("id", user.id)
          .single();  // Add .single() to return only one row

        if (dataError) throw dataError;
        setUserDetails(data);
      } catch (error) {
        setError(error.message || "Something went wrong while fetching user data.");
      }
    };

    fetchUser();

    // Dynamically load the Rave payment script
    const script = document.createElement("script");
    script.src = "https://api.ravepay.co/flwv3-pug/getpaidx/api/flwpbf-inline.js";
    script.async = true;
    script.onload = () => console.log("Rave Payment Script Loaded");
    document.body.appendChild(script);

    // Cleanup the script after the component is unmounted
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!userDetails) {
      setError("User details are not available.");
      return;
    }

    setLoading(true);
    setError(""); // Clear any previous error

    const API_publicKey = "FLWPUBK-9fbfe594212abb645780903215b7cc5a-X";

    try {
      const x = getpaidSetup({
        PBFPubKey: API_publicKey,
        customer_email: userDetails?.email || "user@example.com",
        amount: 2000,
        customer_phone: "234099940409",
        currency: "NGN",
        txref: "rave-123456",
        meta: [
          {
            metaname: "flightID",
            metavalue: "AP1234",
          },
        ],
        onclose: function () {},
        callback: function (response) {
          var txref = response.data.txRef;
          console.log("This is the response returned after a charge", response);
          if (
            response.data.chargeResponseCode === "00" ||
            response.data.chargeResponseCode === "0"
          ) {
            // redirect to a success page
          } else {
            // redirect to a failure page
          }

          x.close();
          setLoading(false);
        },
      });
    } catch (paymentError) {
      setError(paymentError.message || "Payment processing failed.");
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <script src="https://api.ravepay.co/flwv3-pug/getpaidx/api/flwpbf-inline.js"></script>
      </Head>

      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
          <h2 className="text-2xl font-semibold text-center mb-6">Upgrade Your Plan</h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-2">Pro Plan</h3>
            <p className="text-gray-700 mb-4">Upgrade to the Pro Plan and enjoy more features!</p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>Advanced Features</li>
              <li>Priority Support</li>
              <li>Access to Beta Features</li>
            </ul>
            <div className="text-center">
              <button
                onClick={handlePayment}
                disabled={loading}
                className={`bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Processing..." : "Upgrade Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
