import Link from 'next/link';
import React from 'react';

export default function MidTab() {
    return (
        <div className="mx-auto max-w-7xl px-4 pt-2">
            <div className="grid grid-cols-3 gap-4 md:grid-cols-3">
                <div>
                    <Link href="/vendor" passHref>
                        <div
                            className="h-28 flex items-center justify-center relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-transform transform hover:scale-105 sm:flex sm:flex-col sm:text-center"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://sxkmrpzbtqpraucnmnjm.supabase.co/storage/v1/object/public/web_images//nax.jpg')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white text-xl font-semibold sm:text-lg">Vendors</span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div>
                    <Link href="/product" passHref>
                        <div
                            className="h-28 flex items-center justify-center relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-transform transform hover:scale-105 sm:flex sm:flex-col sm:text-center"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://sxkmrpzbtqpraucnmnjm.supabase.co/storage/v1/object/public/web_images//prpr.jpg')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white text-xl font-semibold sm:text-lg">Products</span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div>
                    <Link href="/create-store" passHref>
                        <div
                            className="h-28 flex items-center justify-center relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-transform transform hover:scale-105 sm:flex sm:flex-col sm:text-center"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://sxkmrpzbtqpraucnmnjm.supabase.co/storage/v1/object/public/web_images//store.jpg')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white text-xl font-semibold sm:text-lg">Create Store</span>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
