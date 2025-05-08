import logo from '../assets/leadway-logo.png'
import insta from '../assets/insta-icon.png'
import youtube from '../assets/youtube-icon.png'
import fb from '../assets/meta-icon.png'
import x from '../assets/x-icon.png'

const EmailTemplate = ({ companyName, paystackUrl }) => {
  return (
    <div className="email-template bg-white p-4 rounded-lg shadow-lg max-w-md mx-auto">
      {/* Header */}
      <div className="header text-center">
        <img
          src={logo}
          alt="Leadway Logo"
          className="w-28 mx-auto"
        />
        <p className="text-gray-500 text-sm">{companyName}</p>
      </div>

      {/* Body */}
      <div className="content mt-4">
        <p className="font-semibold">Dear Esteemed Customer,</p>
        <p className="text-gray-700">
          In accordance with the agreed-upon terms of service, payment for excluded services is now overdue. We require immediate payment. Thanks for your continuous compliance.
        </p>
        <a
          href={paystackUrl}
          className="block mt-4 bg-amber-600 text-black font-bold py-2 px-4 rounded-lg text-center hover:bg-amber-700 transition-colors"
        >
          Click 🖲️ to Pay Now
        </a>
        <p className="mt-4 text-gray-600">
          For further information, please contact us:
          <a href="mailto:healthcare@leadway.com" className="text-blue-600 ml-1">
            📧 healthcare@leadway.com
          </a>
        </p>
      </div>

      {/* Footer */}
      <div className="bg-amber-700 footer mt-6 grid grid-cols-4 p-2 -m-4 text-center">
        <a href="https://www.instagram.com/leadwayhealth/" className="text-gray-500 hover:text-gray-700">
          <img
            src={insta}
            alt="Instagram"
            className="w-6 h-6 mx-auto"
          />
        </a>
        <a href="https://www.youtube.com/@leadwayassurance" className="text-gray-500 hover:text-gray-700">
          <img
            src={youtube}
            alt="YouTube"
            className="w-6 h-6 mx-auto"
          />
        </a>
        <a href="https://www.facebook.com/LeadwayHealth/" className="text-gray-500 hover:text-gray-700">
          <img
            src={fb}
            alt="Facebook"
            className="w-6 h-6 mx-auto"
          />
        </a>
        <a href="https://x.com/LeadwayHealthng?s=20&t=Z-DYfMoKhofknVs9VU_ihg" className="text-gray-500 hover:text-gray-700">
          <img
            src={x}
            alt="Twitter"
            className="w-6 h-6 mx-auto"
          />
        </a>
      </div>
    </div>
  );
};

export default EmailTemplate;