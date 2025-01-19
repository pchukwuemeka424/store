// actions/search.ts
"use server";

import { redirect } from "next/navigation";

export async function search(formData: FormData) {
  const searchQuery = formData.get("search");
  // redirect to product page
  console.log(searchQuery);
  redirect(`/search/?q=${searchQuery}`);

  return searchQuery;
}

