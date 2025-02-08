import { CheckCircle, Menu, XCircle } from 'lucide-react';
import React from 'react';
import { 
  FaFacebookF, 
  FaInstagram, 
  FaWhatsapp, 
  FaTwitter,
  FaPhone, 
  FaMapMarkerAlt
} from 'react-icons/fa';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const ContactInfo = ({ shopDetails }) => {
  const {
    shopname,
    city,
    state,
    kyc_status,
    phone,
    email,
    address,
    created_at,
    dateRegistered,
    verified,
    facebook,
    twitter,
    instagram,
    location,
    aboutUs
  } = shopDetails;

  const whatsapp = `https://wa.me/${phone}`;

  const mapSrc = location?.lat && location?.lng
    ? `https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`
    : null;

  return (
    <div className="flex flex-col min-h-screen p-8 mx-auto max-w-7xl">
      <div className="sm:flex gap-8">
        {/* About Us Section */}
        <Card className="p-8 shadow-xl rounded-lg bg-white text-gray-900 w-full sm:w-1/3">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-6">About Us</h2>
            <p className="text-gray-700">{aboutUs || "No description available."}</p>
          </CardContent>
        </Card>
        
        {/* Contact Information */}
        <Card className="p-8 shadow-xl rounded-lg bg-white text-gray-900 w-full sm:w-2/3">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <div className="grid gap-4">
              <p className="text-gray-700"><strong>Email:</strong> {email}</p>
              <p className="text-gray-700"><strong>Phone:</strong> {phone}</p>
              <p className="text-gray-700"><strong>Address:</strong> {address}</p>
              <p className="text-gray-700"><strong>City:</strong> {city}, <strong>State:</strong> {state}, Nigeria</p>
              <p className="text-gray-700"><strong>Registered:</strong>  
            
              {new Date(created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              </p>
              <div className="mt-4 flex items-center">
  {kyc_status === "Approved" ? (
    <CheckCircle className="text-green-500 w-6 h-6 mr-2" />
  ) : kyc_status === "Pending" || kyc_status === "Rejected" ? (
    <XCircle className="text-yellow-500 w-6 h-6 mr-2" />
  ) : (
    <XCircle className="text-red-500 w-6 h-6 mr-2" />
  )}
  <p className="text-lg font-semibold">
    {kyc_status === "Approved"
      ? "Verified Business"
      : kyc_status === "Pending" || kyc_status === "Rejected"
      ? "Business Not Verified"
      : "Verification Status Unknown"}
  </p>
</div>
              
              {/* Social Icons */}
              <div className="block sm:flex gap-4 mt-6 space-y-2 ">
                {facebook && (
                  <a href={facebook} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-blue-600 text-white p-3 rounded-full shadow-md hover:bg-blue-700">
                      <FaFacebookF className="w-5 h-5" /> Facebook
                    </Button>
                  </a>
                )}
                {twitter && (
                  <a href={twitter} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-blue-400 text-white p-3 rounded-full shadow-md my-2 hover:bg-blue-500">
                      <FaTwitter className="w-5 h-5" /> Twitter
                    </Button>
                  </a>
                )}
                {instagram && (
                  <a href={instagram} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-pink-500 text-white p-3 rounded-full shadow-md hover:bg-pink-600">
                      <FaInstagram className="w-5 h-5" /> Instagram
                    </Button>
                  </a>
                )}
                {phone && (
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-green-500 text-white p-3 rounded-full shadow-md my-2 hover:bg-green-600">
                      <FaWhatsapp className="w-5 h-5" />  WhatsApp
                    </Button>
                  </a>
                )}
              </div>

              <div className="mt-6">
                <Button className="px-6 py-3 text-lg font-semibold bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition">
                  Send a Message
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactInfo;
