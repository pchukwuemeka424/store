import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';

export default function MessageForm({ product}) {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState(`I am interested in the ${product.title} product. Kindly respond back with more details regarding its features, pricing, and availability.`);
  const [notifyByText, setNotifyByText] = useState(false);
  const [formStatus, setFormStatus] = useState('idle');

  const sendSmsNotification = async (phone, messageContent) => {
    const url = `https://portal.nigeriabulksms.com/api/?username=adampekolo31@gmail.com&password=holiday100/&message=${encodeURIComponent(messageContent)}&sender=mdtoad&mobiles=234${phone}`;
    try {
      const response = await fetch(url);
      const result = await response.text();
      console.log('SMS Response:', result);
      return { status: 'success' };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return { status: 'error', error };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const supabase = createClient();

    try {
      const { data, error } = await supabase.from('messages').insert([
        {
          name,
          phone: phoneNumber,
          user_id: product.user_id,
          image: `${process.env.NEXT_PUBLIC_IMAGE_URL}${product.image}`,
          message,
        }
      ]);

      if (error) {
        console.error('Error inserting message:', error);
        setFormStatus('error');
      } else {
        console.log('Message submitted successfully:', data);

        if (notifyByText) {
          const smsResponse = await sendSmsNotification(phoneNumber, message);
          if (smsResponse.status !== 'success') {
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

  return (
    <div className="p-2 bg-white rounded-lg">
      <h1 className="text-2xl font-semibold text-center mb-4">Contact Form</h1>
      {formStatus === 'success' && <div className="text-green-600 text-center mb-4">Message sent successfully!</div>}
      {formStatus === 'error' && <div className="text-red-600 text-center mb-4">Something went wrong. Please try again.</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="name">Name:</Label>
          <Input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-4">
          <Label htmlFor="phoneNumber">Phone Number:</Label>
          <Input type="text" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
        </div>
        <div className="mb-4">
          <Label htmlFor="productImage">Product Image:</Label>
          <Image src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${product.image}`} alt="Product" width={100} height={100} />
        </div>
        <div className="mb-4">
          <Label htmlFor="message">Message:</Label>
          <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required className="w-full p-2 border rounded" />
        </div>
        <div className="flex items-center mb-4">
          <input type="checkbox" id="notifyByText" checked={notifyByText} onChange={() => setNotifyByText(!notifyByText)} />
          <Label htmlFor="notifyByText" className="ml-2">Notify me via text message</Label>
        </div>
        <Button type="submit" className="w-full bg-indigo-600 text-white">Submit</Button>
      </form>
    </div>
  );
}
