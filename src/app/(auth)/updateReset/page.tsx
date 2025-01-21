"use client";

import { useActionState } from "react";
import { useState } from "react";
import updatePassword from "@/actions/auth/updatePassword";
import { Button } from "@/components/ui/button";

interface FormData {
    password: string;
    confirmPassword: string;
    token: string;
    errors: Record<string, string>;
    isSubmitting: boolean;
    isValid: boolean;
}

export default function PasswordUpdate() {
    const [prev, action, isPending] = useActionState<FormData>(
        updatePassword,
        {
            password: "",
            confirmPassword: "",
            token: "",
            errors: {},
            isSubmitting: false,
            isValid: true,
        },
        null
    );

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;
        const token = formData.get("token") as string;

        // Client-side validation
        const errors: Record<string, string> = {};
        if (!password) {
            errors.password = "Password is required.";
        } else if (password.length < 8) {
            errors.password = "Password must be at least 8 characters long.";
        }

        if (!confirmPassword) {
            errors.confirmPassword = "Confirmation password is required.";
        } else if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
        }

        if (!token) {
            errors.token = "Invalid or missing reset token.";
        }

        // If there are errors, update state and stop submission
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        // Clear client-side errors and reset success state
        setFormErrors({});
        setIsSuccess(false);

        // Submit to the server
        const result = await action({ password, confirmPassword, token } as FormData);

        // If the submission was successful, display success message
        if (result?.isValid) {
            setIsSuccess(true);
        }
    };

    return (
        <div className="h-screen flex">
            <div className="w-full md:w-1/2 bg-white flex justify-center items-center p-8">
                <form className="w-full max-w-sm" onSubmit={handleSubmit}>
                    <h2 className="text-3xl font-bold text-center mb-6">Update Password</h2>

                    {/* Password Field */}
                    <div className="mb-4 relative">
                        <input
                            type="password"
                            name="password"
                            placeholder="New Password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {formErrors.password && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="mb-4 relative">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {formErrors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {formErrors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* Hidden Token Field */}
                    <input type="hidden" name="token" value={prev?.token || ""} />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full transition"
                    >
                        {isPending ? "Updating..." : "Update Password"}
                    </Button>

                    {/* General Error Message */}
                    {prev?.errors.general && (
                        <p className="text-red-500 text-sm mt-2 text-center">
                            {prev.errors.general}
                        </p>
                    )}

                    {/* Success Message */}
                    {isSuccess && (
                        <p className="text-green-500 text-sm mt-2 text-center">
                            Password updated successfully. You can now{" "}
                            <a href="/login" className="text-blue-800 underline">
                                login
                            </a>.
                        </p>
                    )}
                </form>
            </div>

            <div
                className="hidden md:block w-1/2 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url(/images/Xa.jpg)" }}
            ></div>
        </div>
    );
}
