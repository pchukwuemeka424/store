"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

interface FormData {
    get: (key: string) => string | null;
}

interface UpdateState {
    errors: Record<string, string>;
    isSubmitting: boolean;
    isValid: boolean;
}

export default async function updatePassword(
    prev: UpdateState,
    formData: FormData
): Promise<UpdateState> {
    // Define schema for password validation
    const updateSchema = z.object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long"),
        confirmPassword: z.string(),
        token: z.string().min(1, "Invalid or missing reset token"),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

    // Extract form data
    const password = formData.get("password") || "";
    const confirmPassword = formData.get("confirmPassword") || "";
    const token = formData.get("token") || "";

    // Validate the input
    const validation = updateSchema.safeParse({ password, confirmPassword, token });

    if (!validation.success) {
        const errors = Object.fromEntries(
            Object.entries(validation.error.flatten().fieldErrors).map(([key, value]) => [
                key,
                value.join(", "),
            ])
        );

        return {
            ...prev,
            errors,
            isSubmitting: false,
            isValid: false,
        };
    }

    const supabase = await createClient();

    // Attempt to update the password
    try {
        const { error } = await supabase.auth.updateUser({
            password: validation.data.password,
            token: validation.data.token,
        });

        if (error) {
            return {
                ...prev,
                errors: { general: error.message || "Failed to update password." },
                isSubmitting: false,
                isValid: false,
            };
        }

        // Password update was successful
        return {
            ...prev,
            errors: {},
            isSubmitting: false,
            isValid: true,
        };
    } catch (err) {
        return {
            ...prev,
            errors: { general: "An unexpected error occurred. Please try again later." },
            isSubmitting: false,
            isValid: false,
        };
    }
}
