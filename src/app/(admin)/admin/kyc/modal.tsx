"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaEye } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

const supabase = createClient();

export default function ModalEdit({ product }: { product: any }) {
  // Initialize state with default values from the product
  const [formData, setFormData] = useState({
    first_name: product.first_name || "N/A",
    last_name: product.last_name || "N/A",
    verification_type: product.verification_type || "N/A",
    id_number: product.id_number || "N/A",
    document: product.document || "N/A",
    kyc_status: product.kyc_status || "Pending",
    id: product.id,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("kyc") // Replace with your actual KYC table name
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          verification_type: formData.verification_type,
          id_number: formData.id_number,
          kyc_status: formData.kyc_status,
        })
        .eq("id", product.id);

      if (error) {
        console.error("Error updating KYC data:", error.message);
      } else {
        alert("KYC data updated successfully!");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span>
          <Button>
            <FaEye className="mr-1" />
            View
          </Button>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit KYC Data</DialogTitle>
          <DialogDescription>
            Update KYC details and save the changes.
          </DialogDescription>
        </DialogHeader>
 
        <div>
         <Image
           src={`${process.env.NEXT_PUBLIC_IMAGE_URL_KYC}${product.document}`}
           alt="Product"
           width={100}
           height={100}
           className="rounded w-full h-full"
         />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 grid-cols-2 ">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="Enter first name"
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Enter last name"
              />
            </div>
            <div>
              <Label htmlFor="verification_type">Verification Type</Label>
              <Input
                id="verification_type"
                name="verification_type"
                value={formData.verification_type}
                onChange={handleInputChange}
                placeholder="Enter verification type"
              />
            </div>
            <div>
              <Label htmlFor="id_number">ID Number</Label>
              <Input
                id="id_number"
                name="id_number"
                value={formData.id_number}
                onChange={handleInputChange}
                placeholder="Enter ID number"
              />
            </div>
            <div>
              <Label htmlFor="kyc_status">KYC Status</Label>
              <select
                id="kyc_status"
                name="kyc_status"
                value={formData.kyc_status}
                onChange={handleInputChange}
                className="border w-full border-gray-300 rounded p-2"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
