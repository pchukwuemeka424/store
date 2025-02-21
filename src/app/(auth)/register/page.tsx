"use client";

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AiOutlineShop,
  AiOutlineUser,
  AiOutlinePhone,
  AiOutlineLock,
  AiOutlineMail,
  AiOutlineArrowLeft,
  AiOutlineGlobal, // used for IP and location
} from 'react-icons/ai';
import register from '@/actions/auth/register';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    shopname: "",
    username: "",
    phone: "",
    email: "",
    password: "",
    ip: "",
    location: "",
  });

  const [prev, action, isPending] = useActionState(register, {});

  // Fetch user's IP address and location
  useEffect(() => {
    fetch("https://ipinfo.io/json?token=12cd8ad23daa0d")
      .then((res) => res.json())
      .then((data) => {
        setFormData((prevData) => ({
          ...prevData,
          ip: data.ip,
          location: `${data.city}, ${data.region}, ${data.country} (${data.loc})`,
        }));
      })
      .catch((err) => console.error("Error fetching IP:", err));
  }, []);

  useEffect(() => {
    if (prev?.successMessage) {
      setMessage(prev.successMessage);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  }, [prev?.successMessage, router]);

  // Update form values when there's an error response (keeps already filled data)
  useEffect(() => {
    if (prev?.data) {
      setFormData((prevData) => ({ ...prevData, ...prev.data }));
    }
  }, [prev?.data]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent spaces and special characters in the username field
    if (name === "username") {
      const validUsername = /^[a-zA-Z0-9_]*$/; // Allows only letters, numbers, and underscores
      if (!validUsername.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="h-screen flex">
      <Link href="/">
        <Button className="absolute top-4 left-4 flex items-center text-white bg-blue-500 hover:bg-blue-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-800">
          <AiOutlineArrowLeft className="mr-2" /> Return to Home
        </Button>
      </Link>

      <div className="w-full md:w-1/2 bg-white flex justify-center items-center p-8">
        <form className="w-full max-w-sm" action={action}>
          <div className="text-2xl font-bold text-center mb-2"> Launch Your Online Store with Afrivendor.ng – Free & Easy</div>
          <div className="text-center mb-2">
          Join thousands of entrepreneurs who have started their journey on Afrivendor.ng with just a few clicks!
          </div>

          {/* Success Message */}
          {message && (
            <p className="text-green-600 text-center mt-2">
              {message}
            </p>
          )}

          <InputField
            type="text"
            name="shopname"
            value={formData.shopname}
            onChange={handleChange}
            icon={AiOutlineShop}
            placeholder="Shop Name"
            error={prev?.errors?.shopname}
          />
          <InputField
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            icon={AiOutlineUser}
            placeholder="Username (Only letters, numbers, and underscores)"
            error={prev?.errors?.username}
          />
          <InputField
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            icon={AiOutlinePhone}
            placeholder="Phone Number"
            error={prev?.errors?.phone}
          />
          <InputField
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            icon={AiOutlineMail}
            placeholder="Email"
            error={prev?.errors?.email}
          />
          <InputField
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            icon={AiOutlineLock}
            placeholder="Password"
            error={prev?.errors?.password}
          />

          {/* IP Address and Location Fields (Read-only) */}
          <InputField
            type="hidden"
            name="ip"
            value={formData.ip}
            onChange={handleChange}
    
            placeholder="IP Address"
            error={prev?.errors?.ip}
           
          />
          <InputField
            type="hidden"
            name="location"
            value={formData.location}
            onChange={handleChange}
           
            placeholder="Location"
            error={prev?.errors?.location}
          
          />

          <Button type="submit" disabled={isPending} className="w-full transition">
            {isPending ? 'Registering...' : 'Register'}
          </Button>

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link className="text-blue-800 text-primary underline-offset-4 hover:underline" href="/login">
                Login
              </Link>
            </p>
          </div>

          {/* General Error Message */}
          {prev?.errors?.general && (
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

function InputField({ type, name, icon: Icon, placeholder, error, value, onChange, disabled }) {
  return (
    <div className="mb-4 relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        }`}
      />
    
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
