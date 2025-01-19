"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client"; // Ensure this is correct

const supabase = createClient();

export default function TableComponent() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: userDetail, error: userError } = await supabase.auth.getUser();
      if (userError || !userDetail?.user) {
        setError("User authentication failed.");
        return;
      }

      // Fetch all products for the user
      const { data, error: dataError } = await supabase
        .from("products")
        .select("*")
        .eq("id", userDetail.user.id)
     

      if (dataError) {
        setError("Error fetching products.");
        return;
      }

      setProducts(data || []);
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.user_id}>
                <TableCell className="font-medium">
                  <Image src={product.image} alt={product.title} width={50} height={50} />
                </TableCell>
                <TableCell className="font-medium">{product.title}</TableCell>
                <TableCell className="font-medium">{product.price}</TableCell>
                <TableCell className="font-medium">{product.category}</TableCell>
                <TableCell className="font-medium">{product.stock}</TableCell>
                <TableCell className="font-medium">
                  {/* <DeleteButton productId={product.id} /> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
