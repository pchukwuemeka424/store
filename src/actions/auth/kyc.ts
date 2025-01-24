"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import sharp from "sharp";

interface KYCFormInput {
  firstName: string;
  lastName: string;
  idNumber: string;
  verificationType: string;
  document: string | null;
  user_id: string | null;
}

export default async function handleKYCSubmission(state: any, formData: FormData) {
  const supabase = await createClient();
  const userDetails = await supabase.auth.getUser();
  const user_id = userDetails.data?.user?.id || null;
  
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
  const allowedVerificationTypes = ["bank_statement", "international_passport", "nin"];
  
  // Parse form data
  const formInput: KYCFormInput = {
    firstName: formData.get("firstName")?.toString() || "",
    lastName: formData.get("lastName")?.toString() || "",
    idNumber: formData.get("idNumber")?.toString() || "",
    verificationType: formData.get("verificationType")?.toString() || "",
    document: null,
    user_id: user_id,
  };
  
  const errors: Record<string, string> = {};
  if (!formInput.firstName) errors.firstName = "First name is required.";
  if (!formInput.lastName) errors.lastName = "Last name is required.";
  if (!formInput.idNumber) errors.idNumber = "ID number is required.";
  if (!allowedVerificationTypes.includes(formInput.verificationType)) {
    errors.verificationType = "Invalid verification type.";
  }
  
  const documentFile = formData.get("document") as File | null;
  if (!documentFile) {
    errors.document = "Document is required.";
  } else if (documentFile.size > MAX_FILE_SIZE) {
    errors.document = `Document must be less than ${MAX_FILE_SIZE / (1024 * 1024)} MB.`;
  }
  
  if (Object.keys(errors).length > 0) {
    return { errors };
  }
  
  // Efficiently process and compress the document
  const buffer = await documentFile.arrayBuffer();
  const compressedDocument = await sharp(Buffer.from(buffer))
    .resize({ width: 1000, height: 1000, fit: "inside" }) // Resize to fit within 1000x1000 if larger
    .jpeg({ quality: 50 }) // Adjust quality as needed
    .toBuffer();
  
  const fileName = `kyc_${Date.now()}_${documentFile.name}`;
  const filePath = `kyc_documents/${fileName}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("kyc_documents")
    .upload(filePath, compressedDocument, { contentType: "image/jpeg" });
  
  if (uploadError) {
    console.error("Error uploading document:", uploadError);
    return { errors: { document: "Error uploading document." } };
  }
  
  formInput.document = filePath;
  
  const { data: kycData, error: insertError } = await supabase
    .from("kyc")
    .insert({
      first_name: formInput.firstName,
      last_name: formInput.lastName,
      id_number: formInput.idNumber,
      verification_type: formInput.verificationType,
      document: filePath,
      user_id: user_id,
    });
  
  if (insertError) {
    console.error("Error inserting KYC data:", insertError);
    return { errors: { message: "Error submitting KYC data." } };
  }
  
  redirect("/dashboard/kyc-success");
  return { success: true, data: kycData };
}
