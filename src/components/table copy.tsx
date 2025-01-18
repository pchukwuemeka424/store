"use client";

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import Image from 'next/image';
import DeleteButton from '../app/(users)/dashboard/productlist/DeleteButton';
import Pagination from './Pagination';
import supabaseDb from '@/utils/supabase-db';

export default function TableComponent() {
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 5;

  const fetchProducts = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const supabase = supabaseDb
      const { data: userDetail } = await supabase.auth.getUser();

      // Fetch total number of products to calculate totalPages
      const { count: totalCount } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('id', userDetail?.user?.id);

      setTotalPages(Math.ceil(totalCount / itemsPerPage));

      // Fetch products for the current page
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', userDetail?.user?.id)
        .order('id', { ascending: true })
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

      if (error) {
        setError('Error fetching products');
        return;
      }

      setProducts(data);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

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
            {products?.map((product) => (
              <TableRow key={product.user_id}>
                <TableCell className="font-medium">
                  <Image src={product.image} alt={product.title} width={20} height={20} />
                </TableCell>
                <TableCell className="font-medium">{product.title}</TableCell>
                <TableCell className="font-medium">{product.price}</TableCell>
                <TableCell className="font-medium">{product.category}</TableCell>
                <TableCell className="font-medium">{product.stock}</TableCell>
                <TableCell className="font-medium">
                  <DeleteButton productId={product.user_id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
