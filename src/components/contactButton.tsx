import { FaWhatsapp, FaPhone, FaFacebook, FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';
import { Button } from './ui/button';

const ContactButtons = ({ shopDetails }) => {
  return (
    <div>
      <div className="md:text-3xl font-bold text-white uppercase sm:text-sm text-end">
        {shopDetails.shopname}
      </div>
      <div className="text-white capitalize flex justify-end sm:text-sm">
        <p className="text-white">
          {shopDetails.stat}, {shopDetails.city}
        </p>
      </div>

      <div className="flex space-x-4 my-1 justify-end sm:text-sm">
        <Link href={`https://www.facebook.com/${shopDetails.facebook}`} className="text-white">
          <FaFacebook />
        </Link>
        <Link href={`https://www.twitter.com/${shopDetails.twitter}`} className="text-white">
          <FaTwitter />
        </Link>
        <Link href={`https://www.tiktok.com/@${shopDetails.tiktok}`} className="text-white">
          <FaTiktok />
        </Link>
        <Link href={`https://www.instagram.com/${shopDetails.instagram}`} className="text-white">
          <FaInstagram />
        </Link>
      </div>

      <div className="flex space-x-4j justify-end">
        <Link href={`https://wa.me/${shopDetails.phone}`}>
          <Button className="bg-green-500 text-white py-1 rounded-lg flex items-center space-x-2 mx-1 text-sm sm:text-xs">
            <FaWhatsapp />
            <span>WhatsApp</span>
          </Button>
        </Link>
        <Link href={`tel:${shopDetails.phone}`}>
          <Button className="bg-blue-500 text-white py-1 rounded-lg flex items-center space-x-2 text-sm sm:text-xs">
            <FaPhone />
            <span>Call</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ContactButtons;
