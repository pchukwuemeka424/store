import React from 'react';
import { 
  FaFacebookF, 
  FaInstagram, 
  FaWhatsapp, 
  FaPhone, 
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import { SiAdguard } from "react-icons/si";

const ContactInfo = ({ shopDetails }) => {
  const {
    shopname,
    city,
    stat,
    kyc_status,
    phone,
    socialLinks,
    location,
  } = shopDetails;

  // Set default social links if not provided
  const facebook =`https://www.facebook.com/${shopDetails.facebook}` 
  const instagram= `https://www.instagram.com/${shopDetails.instagram}`
  const whatsapp =  `https://wa.me/${phone}`;

  // Create the Google Maps embed URL using the provided latitude and longitude
  const mapSrc = location && location.lat && location.lng
    ? `https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 flex flex-col items-center justify-center p-6">
      {/* Main Card */}
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden max-w-6xl w-full">
        <div className="md:flex">
          {/* Left Section: Business Info, Social Links, Call Button, Map */}
          <div className="md:w-2/3 p-8 relative">
            {/* Decorative Background Element */}
            <div className="absolute inset-0 bg-[url('/path-to-your-pattern.png')] opacity-10 pointer-events-none"></div>
            <div className="relative">
              {/* Business Header */}
              <div className="mb-6">
                <h1 className="text-4xl font-extrabold text-gray-900">{shopname}</h1>
                <p className="text-xl text-gray-600 flex items-center mt-2">
                  <FaMapMarkerAlt className="mr-2 text-indigo-500" /> {city}, {stat}
                </p>
                <div className="mt-3 flex items-center space-x-2">
                  {kyc_status==="Approved" ? (
                    <>
                      <SiAdguard className="text-green-600" size={20} />
                      <span className="inline-block bg-green-200 text-green-800 text-sm px-4 py-1 rounded-full">
                        Verified
                      </span>
                    </>
                  ) : (
                    <>
                      <SiAdguard className="text-red-600" size={20} />
                      <span className="inline-block bg-red-200 text-red-800 text-sm px-4 py-1 rounded-full">
                        Not Verified
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Social Media Icons */}
              <div className="flex space-x-4 mt-6">
                <a 
                  href={facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-110 text-white"
                >
                  <FaFacebookF size={20} />
                </a>
                <a 
                  href={instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-500 hover:bg-pink-600 transition-all transform hover:scale-110 text-white"
                >
                  <FaInstagram size={20} />
                </a>
                <a 
                  href={whatsapp} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 transition-all transform hover:scale-110 text-white"
                >
                  <FaWhatsapp size={20} />
                </a>
              </div>

              {/* Call Vendor Button */}
              <div className="mt-8">
                <button
                  onClick={() => window.location.href = `tel:${phone || '1234567890'}`}
                  className="flex items-center space-x-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition-colors shadow-lg"
                >
                  <FaPhone size={20} />
                  <span>Call Vendor</span>
                </button>
              </div>

              {/* Map */}
              {mapSrc && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Our Location</h3>
                  <div className="w-full h-64 rounded-lg overflow-hidden shadow-md">
                    <iframe
                      title="Location Map"
                      src={mapSrc}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      aria-hidden="false"
                      tabIndex="0"
                    ></iframe>
                  </div>
                </div>
              )}

              {/* New Section: Why Choose Us */}
              <div className="mt-10">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Us?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-3" size={20} />
                    <span className="text-gray-700">High-quality products and services.</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-3" size={20} />
                    <span className="text-gray-700">Responsive customer support available 24/7.</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-3" size={20} />
                    <span className="text-gray-700">Trusted by thousands of customers.</span>
                  </li>
                  <li className="flex items-center">
                    <FaTimesCircle className="text-red-500 mr-3" size={20} />
                    <span className="text-gray-700">No hidden fees or extra charges.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Section: Additional Info / CTA */}
          <div className="md:w-1/3 bg-indigo-600 p-8 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Get In Touch</h2>
              <p className="text-white mb-6">
                Connect with us for more information about our services and offerings. We are here to help!
              </p>
              <a
                href="#contact"
                className="inline-block bg-white text-indigo-600 font-bold py-2 px-6 rounded-full shadow hover:bg-gray-100 transition-colors transform hover:scale-105"
              >
                Contact Us
              </a>
              {/* Decorative Icon */}
              <div className="mt-8">
                <FaPhone className="text-white mx-auto" size={40} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Additional Information */}
      <footer className="mt-8 text-center text-white">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} {shopname}. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default ContactInfo;
