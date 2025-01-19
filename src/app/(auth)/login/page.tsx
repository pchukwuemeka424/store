"use client"; // This tells Next.js to treat this component as a client-side component

import { useActionState } from 'react';
import { AiOutlineLock, AiOutlineMail } from 'react-icons/ai';
import login from '@/actions/auth/login';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


interface FormData {
    email: string;
    password: string;
    errors: Record<string, string>;
    isSubmitting: boolean;
    isValid: boolean;
}

export default function Register() {
    const [prev, action, isPending] = useActionState<FormData>(login, {
        email: "",
        password: "",
        errors: {},
        isSubmitting: false,
        isValid: true,
    }, null);

    return (
        <div className="h-screen flex">
            <div className="w-full md:w-1/2 bg-white flex justify-center items-center p-8">
                <form className="w-full max-w-sm" action={action}>
                    <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

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
                        {isPending ? 'Processing...' : 'Login'}
                    </Button>

                    {/* Additional Links */}
                    <div className="mt-4 text-center">
                        <p className="text-gray-600">
                            Don&apos;t have an account?
                            <Link className="text-blue-800 text-primary underline-offset-4 hover:underline" href="/register">Register</Link>
                        </p>
                    </div>

                    {/* General Error Message */}
                    {prev?.errors.general && (
                        <p className="text-red-500 text-sm mt-2 text-center">
                            {prev.errors.general}
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
