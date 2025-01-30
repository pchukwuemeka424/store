"use client";  // This tells Next.js to treat this component as a client-side component

import { useActionState, useEffect } from 'react';
import { AiOutlineShop, AiOutlineUser, AiOutlinePhone, AiOutlineLock, AiOutlineMail, AiOutlineArrowLeft } from 'react-icons/ai';
import register from '@/actions/auth/register';
import { Button } from '@/components/ui/button';
import  Link from 'next/link';
import { redirect } from 'next/navigation';
interface FormData {
    email: string;
    username: string;
    shopname: string;
    phone: string;
    password: string;
    errors: Record<string, string>;
    isSubmitting: boolean;
    isValid: boolean;
    successMessage?: string;
}

export default function Register() {
    const [prev, action, isPending] = useActionState<FormData>(register, {
        email: "",
        username: "",
        shopname: "",
        phone: "",
        password: "",
        errors: {},
        isSubmitting: false,
        isValid: true,
        successMessage: "",
        
    }, null);

       // Redirect to login after showing success message
       useEffect(() => {
        if (prev?.successMessage) {
            setTimeout(() => {
                redirect('/login');
            }, 3000);
        }
    }, [prev?.successMessage]);


    return (
        <div className="h-screen flex">
                      {/* Button with Arrow to Return Home */}
                      <Link href="/">
                <Button className="absolute top-4 left-4 flex items-center text-white bg-blue-500 hover:bg-blue-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-800">
                    <AiOutlineArrowLeft className="mr-2" /> Return to Home
                </Button>
            </Link>
            <div className="w-full md:w-1/2 bg-white flex justify-center items-center p-8">
                <form className="w-full max-w-sm" action={action}>
                    <h2 className="text-3xl font-bold text-center mb-6">Register</h2>

                    {/* Shop Name Field */}
                    <div className="mb-4 relative">
                        <input
                            type="text"
                            name="shopname"
                            placeholder="Shop Name"
                            defaultValue={prev?.shopname}
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <AiOutlineShop className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        {prev?.errors.shopname && (
                            
                            <p className="text-red-500 text-sm mt-1">
                                {prev.errors.shopname}
                            </p>
                        )}
                    </div>

                    {/* Username Field */}
                    <div className="mb-4 relative">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            defaultValue={prev?.username}
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <AiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        {prev?.errors.username && (
                            <p className="text-red-500 text-sm mt-1">
                                {prev.errors.username}
                            </p>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div className="mb-4 relative">
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            defaultValue={prev?.phone}
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <AiOutlinePhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        {prev?.errors.phone && (
                            <p className="text-red-500 text-sm mt-1">
                                {prev.errors.phone}
                            </p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="mb-4 relative">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            defaultValue={prev?.email}
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <AiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        {prev?.errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {prev.errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="mb-6 relative">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            defaultValue={prev?.password}
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <AiOutlineLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        {prev?.errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {prev.errors.password}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                       
                        type="submit"
                        disabled={isPending}
                        className="w-full transition"
                    >
                        {isPending ? 'Registering...' : 'Register'}
                    </Button>

                    {/* Additional Links */}
                    <div className="mt-4 text-center">
                        <p className="text-gray-600">
                            Already have an account?
                            <Link className="text-blue-800 text-primary underline-offset-4 hover:underline" href="/login">Login</Link>
                        </p>
                    </div>

                    {/* General Error Message */}
                    {prev?.errors.general && (
                        <p className="text-red-500 text-sm mt-2 text-center">
                            {prev.errors.general}
                        </p>
                    )}
                        {/* Success Message */}
                        {prev?.successMessage && (
                        <p className="text-green-600 text-center mt-2">
                            {prev.successMessage}
                        </p>
                    )}
                </form>
            </div>

            <div
                className="hidden md:block w-1/2 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/images/Xa.jpg)' }}
            ></div>
        </div>
    );
}
