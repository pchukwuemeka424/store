"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";

interface FlutterWaveClientProps {
  amount: number;
  user: {
    email: string;
    phone?: string;
    username?: string;
  };
}

export default function FlutterWaveClient({ amount, user }: FlutterWaveClientProps) {
  const publicKey = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY;

  if (!publicKey) {
    console.error("Flutterwave public key is missing!");
    return null;
  }

  const handleFlutterPayment = useFlutterwave({
    public_key: publicKey,
    tx_ref: `TX-${Date.now()}`,
    amount: amount,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: user.email || "no-email@example.com",
      phone_number: user.phone || "07000000000",
      name: user.username || "John Doe",
    },
    customizations: {
      title: "ExShop",
      description: `Payment for upgrade ($${amount / 10})`,
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  });

  return (
    <Button
      onClick={() => {
        handleFlutterPayment({
          callback: (response) => {
            console.log("Payment response:", response);
            closePaymentModal();
          },
          onClose: () => {
            console.log("Payment closed by user.");
          },
        });
      }}
      className="mt-2 bg-white text-purple-600 hover:bg-gray-200"
    >
      Upgrade Now
    </Button>
  );
}
