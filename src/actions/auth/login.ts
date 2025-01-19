"use server";

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { z } from "zod";

interface FormData {
    get: (key: string) => string | null;
}

interface LoginState {
    errors: Record<string, string>;
    isSubmitting: boolean;
    isValid: boolean;
}

export default async function login(prev: LoginState, formData: FormData) {
    const loginSchema = z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(8, "Password must be at least 8 characters"),
    });

    // Parse and validate the form data
    const validated = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    // Handle validation errors
    if (!validated.success) {
        const errors = validated.error.flatten().fieldErrors;

        return {
            ...prev,
            errors,
            email: formData.get("email"),
            password: formData.get("password"),
            isSubmitting: false,
            isValid: false,
        };
    }

    const superbase = await createClient();

    // Authenticate the user
    const { data, error } = await superbase.auth.signInWithPassword({
        email: validated.data.email,
        password: validated.data.password,
    });

    if (error) {
        return {
            ...prev,
            errors: {
                general: error.message || "Invalid credentials",
            },
            email: formData.get("email"),
            password: formData.get("password"),
            isSubmitting: false,
            isValid: false,
        };
    }

    // Redirect to the home page or dashboard
    redirect('/dashboard');

    return {
        ...prev,
        errors: {},
        isSubmitting: false,
        isValid: true,
    };
}
