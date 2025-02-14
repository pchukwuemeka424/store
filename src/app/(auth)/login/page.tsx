"use client"; // This tells Next.js to treat this component as a client-side component
import { useActionState } from 'react';
import { AiOutlineLock, AiOutlineMail, AiOutlineArrowLeft } from 'react-icons/ai';
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
        <div className="h-screen flex flex-col md:flex-row md:bg-none  bg-[url('/images/Xa.jpg')] bg-cover bg-center bg-no-repeat">

            {/* Button with Arrow to Return Home */}
            <Link href="/">
                <Button className="absolute top-6 left-6 flex items-center bg-blue-600 text-white hover:bg-blue-700 transition-all focus:ring-4 focus:ring-blue-300 rounded-lg shadow-lg px-6 py-3">
                    <AiOutlineArrowLeft className="mr-2 text-lg" /> Return to Home
                </Button>
            </Link>

            <div className="flex flex-1 justify-center items-center p-8 ">
                <form action={action} className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <h2 className="text-3xl font-semibold text-center text-gray-700">Login</h2>

                    {/* Email Field */}
                    <div className="relative mb-6">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            defaultValue={prev?.email}
                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                        <AiOutlineMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
                        {prev?.errors.email && (
                            <p className="text-red-500 text-sm mt-2">{prev.errors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="relative mb-6">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            defaultValue={prev?.password}
                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                        <AiOutlineLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
                        {prev?.errors.password && (
                            <p className="text-red-500 text-sm mt-2">{prev.errors.password}</p>
                        )}
                    </div>

                    <div className="text-right">
                        <Link href="/forgot" className="text-blue-600 hover:underline text-sm">
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 rounded-lg transition-all"
                    >
                        {isPending ? 'Processing...' : 'Login'}
                    </Button>

                    {/* Additional Links */}
                    <div className="text-center mt-6">
                        <p className="text-gray-600">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-blue-600 hover:underline">
                                Register
                            </Link>
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
