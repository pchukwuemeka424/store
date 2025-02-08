import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';

export default function MessageForm({ product, userId, closeModal }: { product: any, userId: string, closeModal: () => void }) {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState(`I am interested in the ${product.title} product. Kindly respond back with more details regarding its features, pricing, and availability. I would appreciate further information to help me make an informed decision. Thank you!`);
  const [notifyByText, setNotifyByText] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle'); // Track form status

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const supabase = createClient();

    try {
      // Insert message into the database
      const { data, error } = await supabase
        .from('messages') // Replace with your table name
        .insert([
          {
            name,
            phone: phoneNumber,
            user_id: product.user_id,
            image: `${process.env.NEXT_PUBLIC_IMAGE_URL}${product.image}`,
            message,
          }
        ]);

      if (error) {
        console.error('Error inserting message:', error.message || error.details || error);
        setFormStatus('error');
      } else {
        console.log('Message submitted successfully:', data);

        // Send SMS if user opted in
        if (notifyByText) {
          const smsResponse = await sendSmsNotification(phoneNumber, message);
          if (smsResponse.status === 'success') {
            console.log('SMS sent successfully');
          } else {
            console.error('Error sending SMS:', smsResponse.error);
          }
        }

        setFormStatus('success');
        setName('');
        setPhoneNumber('');
        setMessage('');
      }

    } catch (error) {
      console.error('Error during form submission:', error);
      setFormStatus('error');
    }
  };
  const sendSmsNotification = async (phone: string, message: string) => {
    const url = `https://portal.nigeriabulksms.com/api/?username=adampekolo31@gmail.com&password=holiday100/&message=${encodeURIComponent(message)}&sender=mdtoad&mobiles=${phone}`;
  
    try {
      const response = await fetch(url, {
        method: 'POST',
      });
  
      const data = await response.json();
  
      if (response.ok) {
        return { status: 'success', data };
      } else {
        return { status: 'error', error: data };
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      return { status: 'error', error };
    }
  };
  
  return (
    <div className="p-2 bg-white rounded-lg">
      <h1 className="text-2xl font-semibold text-center mb-4">Contact Form</h1>
      {formStatus === 'success' && (
        <div className="text-green-600 text-center mb-4">Message sent successfully!</div>
      )}
      {formStatus === 'error' && (
        <div className="text-red-600 text-center mb-4">Something went wrong. Please try again.</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number:</Label>
          <Input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="productImage" className="block text-sm font-medium text-gray-700">Product Image:</label>
          <div className="mt-2">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${product.image}`} 
              alt="Product"
              className="h-20 w-20 rounded-lg"
              width={500}
              height={500}
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="notifyByText"
            checked={notifyByText}
            onChange={() => setNotifyByText(!notifyByText)}
            className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="notifyByText" className="text-sm text-gray-700">Notify me via text message</label>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
