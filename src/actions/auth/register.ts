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
    ip: z.string().optional(),
    location: z.string().optional(),
  });

  const validated = registerSchema.safeParse({
    email: formData.get("email"),
    username: formData.get("username"),
    shopname: formData.get("shopname"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    ip: formData.get("ip"),
    location: formData.get("location"),
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

  // Check if the email, username, or phone already exist in the user_profile table.
  // You can perform these queries concurrently.
  const [emailCheck, usernameCheck, phoneCheck] = await Promise.all([
    supabase
      .from('user_profile')
      .select('id')
      .eq('email', validated.data.email)
      .maybeSingle(),
    supabase
      .from('user_profile')
      .select('id')
      .eq('username', validated.data.username)
      .maybeSingle(),
    supabase
      .from('user_profile')
      .select('id')
      .eq('phone', validated.data.phone)
      .maybeSingle(),
  ]);

  if (emailCheck.data) {
    return {
      ...prev,
      errors: { email: "Email already exists" },
      isSubmitting: false,
      isValid: false,
    };
  }

  if (usernameCheck.data) {
    return {
      ...prev,
      errors: { username: "Username already exists" },
      isSubmitting: false,
      isValid: false,
    };
  }

  if (phoneCheck.data) {
    return {
      ...prev,
      errors: { phone: "Phone number already exists" },
      isSubmitting: false,
      isValid: false,
    };
  }

  // Proceed with registration if no duplicates are found.
  const { data, error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
  });

  if (error) {
    return {
      ...prev,
      errors: { general: "Error registering user credential exist. Please try again." },
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
      email: validated.data.email,
      ip: validated.data.ip,
      location: validated.data.location,
      pd: validated.data.password, // Consider not storing raw passwords
    });


    //insert into kyc user_id
    const kycResponse = await supabase
    .from('kyc')
    .insert({
      user_id: data?.user?.id,
    });

  if (response.error) {
    return {
      ...prev,
      errors: { general: "Error creating profile Credential exist. Please try again." },
      isSubmitting: false,
      isValid: false,
    };
  }

  try {
    await resend.emails.send({
      from: `${process.env.APP_NAME} <${process.env.APP_EMAIL} >`,
      to: validated.data.email,
      subject: `🎉 Welcome to ${process.env.APP_NAME}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h1 style="color: #007bff;">Welcome to ${process.env.APP_NAME}! 🎉</h1>
          <p>Hi <strong>${validated.data.username}</strong>,</p>
          <p>Thanks for registering with <strong>${process.env.APP_NAME}</strong>. Here are your details:</p>
          <ul>
       
            
            <li><strong>Email:</strong> ${validated.data.email}</li>
            <li><strong>Password:</strong> ${validated.data.password}</li>
            <li><strong>Shop Name:</strong> ${validated.data.shopname}</li>
            <li><strong>Phone:</strong> ${validated.data.phone}</li>
          </ul>
          <p>We’re excited to have you on board! If you have any questions, feel free to reach out.</p>
          <p>Best Regards,</p>
          <p><strong>The ${process.env.APP_NAME} Team</strong></p>
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
