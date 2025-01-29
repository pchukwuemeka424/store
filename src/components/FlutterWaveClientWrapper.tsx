"use client";
import React from "react";
import FlutterWaveClient from "./FlutterWaveClient";

interface FlutterWaveClientWrapperProps {
  amount: number;
  user: {
    email: string;
    phone?: string;
    username?: string;
  };
}

export default function FlutterWaveClientWrapper({ amount, user }: FlutterWaveClientWrapperProps) {
  return <FlutterWaveClient amount={amount} user={user} />;
}
