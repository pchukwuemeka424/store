// AddCat.ts
"use server";

import { createClient } from "@/utils/supabase/server";

export default async function AddCat(state: any, formData: FormData) {
  const supabase = await createClient();
  const cat_name = formData.get("title")?.toString() || "";

  const { error } = await supabase.from("category").insert([{ title: cat_name }]);

  if (error) {
    console.error(error.message);
    return { success: false };
  }

  return { success: true };
}
