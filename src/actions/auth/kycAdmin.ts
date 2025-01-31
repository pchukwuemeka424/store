"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateKYC(data: any) {
  const supabase =await createClient();

  const { error } = await supabase
    .from("kyc")
    .update({
      first_name: data.first_name,
      last_name: data.last_name,
      verification_type: data.verification_type,
      id_number: data.id_number,
      kyc_status: data.kyc_status,
    })
    .eq("id", data.id);

  if (error) return { error: error.message };

  revalidatePath("/admin/kyc", "page"); // Ensure cache refresh
  return { success: true };
}
