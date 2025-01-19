"use server";

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { z } from "zod";

interface FormData {
    get: (key: string) => string | null;
}

interface RegisterState {
    errors: Record<string, string>;
    isSubmitting: boolean;
    isValid: boolean;
}

export default async function register(prev: RegisterState, formData: FormData) {
  
    const registerSchema = z.object({
        email: z.string().email("Invalid email format"),
        username: z.string().min(3, "Username is required"),
        shopname: z.string().min(3, "Shop name is required"),
        phone: z.string().regex(/^\+?\d+$/, "Invalid phone number format"),
        password: z.string().min(8, "Password must be at least 8 characters"),
    });

    // Parse and validate the form data
    const validated = registerSchema.safeParse({
        email: formData.get("email"),
        username: formData.get("username"),
        shopname: formData.get("shopname"),
        phone: formData.get("phone"),
        password: formData.get("password"),
    });

    // Handle validation errors
    if (!validated.success) {
        const errors = validated.error.flatten().fieldErrors;

        return {
            ...prev,
            errors,
            email: formData.get("email"),
            username: formData.get("username"),
            shopname: formData.get("shopname"),
            phone: formData.get("phone"),
            password: formData.get("password"),
            isSubmitting: false,
            isValid: false,
        };
        
    }

    const superbase =await createClient();

    // Check if user exists
    const { data: existingUser } = await superbase
        .from('user_profile')
        .select('*')
        .eq('email', validated.data.email)
        .single();

    if (existingUser) {
        return {
            ...prev,
            errors: {
                email: "Email already exists",
            },
            email: formData.get("email"),
            username: formData.get("username"),
            shopname: formData.get("shopname"),
            phone: formData.get("phone"),
            password: formData.get("password"),
            isSubmitting: false,
            isValid: false,
        };
    }

    // Register new user
    const { data, error } = await superbase.auth.signUp({
        email: validated.data.email,
        password: validated.data.password,
    });

    if (error && error.message === 'User already registered') {
        return {
            ...prev,
            errors: {
                email: "Email already exists",
            },
            email: formData.get("email"),
            username: formData.get("username"),
            shopname: formData.get("shopname"),
            phone: formData.get("phone"),
            password: formData.get("password"),
            isSubmitting: false,
            isValid: false,
        };
    } else if (error) {
        throw error;
    }

    const response = await superbase
    .from('user_profile').insert({
        id: data?.user?.id,
        username: validated.data.username,
        shopname: validated.data.shopname,
        phone: validated.data.phone,
    });

    if (response.error) {
        throw Error(response.error.message);
    }

    // Success message display
    console.log('Registration successful, please login to continue');

    // Redirect to login page
    redirect('/login');

    return {
        ...prev,
        errors: {},
        isSubmitting: false,
        isValid: true,
    };
}