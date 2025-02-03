"use server";

import { createClient } from '@/utils/supabase/server';
import { z } from "zod";
import { Resend } from 'resend';

interface FormData {
    get: (key: string) => string | null;
}

interface RegisterState {
    errors: Record<string, string>;
    isSubmitting: boolean;
    isValid: boolean;
    successMessage?: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function register(prev: RegisterState, formData: FormData) {
    const registerSchema = z.object({
        email: z.string().email("Invalid email format"),
        username: z.string().min(3, "Username is required"),
        shopname: z.string().min(3, "Shop name is required"),
        phone: z.string().regex(/^\+?\d+$/, "Invalid phone number format"),
        password: z.string().min(8, "Password must be at least 8 characters"),
    });

    const validated = registerSchema.safeParse({
        email: formData.get("email"),
        username: formData.get("username"),
        shopname: formData.get("shopname"),
        phone: formData.get("phone"),
        password: formData.get("password"),
    });

    if (!validated.success) {
        return {
            ...prev,
            errors: validated.error.flatten().fieldErrors,
            isSubmitting: false,
            isValid: false,
        };
    }

    const supabase = await createClient();

    const { data: existingUser } = await supabase
        .from('user_profile')
        .select('*')
        .eq('email', validated.data.email)
        .single();

    if (existingUser) {
        return {
            ...prev,
            errors: { email: "Email already exists" },
            isSubmitting: false,
            isValid: false,
        };
    }

    const { data, error } = await supabase.auth.signUp({
        email: validated.data.email,
        password: validated.data.password,
    });

    if (error) {
        return {
            ...prev,
            errors: { general: "Error registering user. Please try again." },
            isSubmitting: false,
            isValid: false,
        };
    }

    const response = await supabase
        .from('user_profile')
        .insert({
            id: data?.user?.id,
            username: validated.data.username,
            shopname: validated.data.shopname,
            phone: validated.data.phone,
        });

    if (response.error) {
        return {
            ...prev,
            errors: { general: "Error creating profile. Please try again." },
            isSubmitting: false,
            isValid: false,
        };
    }

    try {
        await resend.emails.send({
            from: 'MStore <team@tslinkinternational.com>',
            to: validated.data.email,
            subject: '🎉 Welcome to MStore!',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h1 style="color: #007bff;">Welcome to MStore! 🎉</h1>
                    <p>Hi <strong>${validated.data.username}</strong>,</p>
                    <p>Thanks for registering with <strong>MStore</strong>. Here are your details:</p>
                    <ul>
                        <li><strong>Username:</strong> ${validated.data.username}</li>
                        <li><strong>Shop Name:</strong> ${validated.data.shopname}</li>
                        <li><strong>Phone:</strong> ${validated.data.phone}</li>
                    </ul>
                    <p>We’re excited to have you on board! If you have any questions, feel free to reach out.</p>
                    <p>Best Regards,</p>
                    <p><strong>The MStore Team</strong></p>
                </div>
            `,
        });
        
    } catch (error) {
        console.error('Error sending email:', error);
    }

    return {
        ...prev,
        errors: {},
        isSubmitting: false,
        isValid: true,
        successMessage: "Registration successful! Redirecting to login...",
    };
}
