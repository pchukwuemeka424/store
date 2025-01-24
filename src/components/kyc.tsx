"use client";
import React, { useState, useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";

export default function KYCForm({ handler, kycData }) {
  const [state, action, isPending] = useActionState(handler, undefined);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      setUploadSuccess(true);
      router.push("/dashboard/kyc-success");  // Redirect after success
    }
  }, [state, router]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md col-span-full">
      <form action={action}>
        {/* First Name */}
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Enter your first name"
            defaultValue={kycData?.firstName || ""}
            className="w-full px-4 py-2 border rounded-lg mt-2"
          />
          {state?.errors?.firstName && (
            <p className="text-red-500 text-sm mt-1">{state.errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Enter your last name"
            defaultValue={kycData?.lastName || ""}
            className="w-full px-4 py-2 border rounded-lg mt-2"
          />
          {state?.errors?.lastName && (
            <p className="text-red-500 text-sm mt-1">{state.errors.lastName}</p>
          )}
        </div>

        {/* ID Number */}
        <div className="mb-4">
          <label htmlFor="idNumber" className="block text-sm font-semibold text-gray-700">
            ID Number
          </label>
          <input
            type="text"
            id="idNumber"
            name="idNumber"
            placeholder="Enter your ID number"
            defaultValue={kycData?.idNumber || ""}
            className="w-full px-4 py-2 border rounded-lg mt-2"
          />
          {state?.errors?.idNumber && (
            <p className="text-red-500 text-sm mt-1">{state.errors.idNumber}</p>
          )}
        </div>

        {/* Type of Verification */}
        <div className="mb-4">
          <label htmlFor="verificationType" className="block text-sm font-semibold text-gray-700">
            Type of Verification
          </label>
          <select
            id="verificationType"
            name="verificationType"
            defaultValue={kycData?.verificationType || ""}
            className="w-full px-4 py-2 border rounded-lg mt-2"
          >
            <option value="">Select Verification Type</option>
            <option value="bank_statement">Bank Statement</option>
            <option value="international_passport">International Passport</option>
            <option value="nin">NIN (National Identification Number)</option>
          </select>
          {state?.errors?.verificationType && (
            <p className="text-red-500 text-sm mt-1">{state.errors.verificationType}</p>
          )}
        </div>

        {/* Document Upload */}
        <div className="mb-4">
          <label htmlFor="document" className="block text-sm font-semibold text-gray-700">
            Upload Document
          </label>
          <input
            type="file"
            id="document"
            name="document"
            accept="image/*"
            className="w-full px-4 py-2 border rounded-lg mt-2"
          />
          {state?.errors?.document && (
            <p className="text-red-500 text-sm mt-1">{state.errors.document}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`bg-blue-500 text-white px-6 py-2 rounded-lg w-26 mt-4 ${
            isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
          disabled={isPending}
        >
          {isPending ? "Processing..." : "Submit KYC"}
        </button>
      </form>
    </div>
  );
}
