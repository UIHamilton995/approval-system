// import { useState, useEffect, useRef } from "react";
// import { BiMessageDetail, BiSend } from "react-icons/bi";
// import { FaUserCircle, FaPlus } from "react-icons/fa";
// import MessageHistory from "../components/MessageHistory";
// import EmailTemplate from "../components/EmailTemplate"; 

// const Messages = () => {
//   const [companies, setCompanies] = useState([]);
//   const [filteredCompanies, setFilteredCompanies] = useState([]);
//   const [selectedEmail, setSelectedEmail] = useState("");
//   const [paystackUrl, setPaystackUrl] = useState("");
//   const [companySearchTerm, setCompanySearchTerm] = useState("");
//   const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [sentEmails, setSentEmails] = useState([]);
//   const [isManualEmail, setIsManualEmail] = useState(false);
//   const [emailError, setEmailError] = useState("");
//   const dropdownRef = useRef(null);

//   // Fetch companies from API
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const response = await fetch(
//           "https://prognosis-api.leadwayhealth.com/API/listvalues/getgroups"
//         );
//         if (!response.ok) throw new Error("Network response was not ok");
//         const data = await response.json();
//         setCompanies(data.result || []);
//         setFilteredCompanies(data.result || []);
//       } catch (error) {
//         console.error("Error fetching companies:", error);
//       }
//     };

//     fetchCompanies();
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowCompanySuggestions(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Modal handlers
//   useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === 'Escape') {
//         setIsModalOpen(false);
//       }
//     };

//     const handleClickOutside = (e) => {
//       if (isModalOpen && e.target.classList.contains('modal-overlay')) {
//         setIsModalOpen(false);
//       }
//     };

//     document.addEventListener('keydown', handleEscape);
//     document.addEventListener('click', handleClickOutside);

//     return () => {
//       document.removeEventListener('keydown', handleEscape);
//       document.removeEventListener('click', handleClickOutside);
//     };
//   }, [isModalOpen]);

//   const handleCompanySearch = (e) => {
//     const value = e.target.value;
//     setCompanySearchTerm(value);
    
//     if (isManualEmail) {
//       setSelectedEmail(value);
//       return;
//     }

//     const filtered = companies.filter((company) =>
//       company.GROUP_NAME.toLowerCase().includes(value.toLowerCase())
//     ).slice(0, 10);
//     setFilteredCompanies(filtered);
//     setShowCompanySuggestions(true);
//   };

//   const handleCompanySelect = (company) => {
//     setSelectedEmail(company.Company_Email1 || company.EMAIL || company.email || ""); 
//     setCompanySearchTerm(company.GROUP_NAME || company.name || "");
//     setShowCompanySuggestions(false);
//     setIsManualEmail(false);
//     setEmailError("");
//   };

//   const toggleManualEmail = () => {
//     setIsManualEmail(!isManualEmail);
//     setSelectedEmail("");
//     setCompanySearchTerm("");
//     setShowCompanySuggestions(false);
//     setEmailError("");
//   };

//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };

//   const sendNotification = async () => {
//     setEmailError("");
    
//     if (!selectedEmail || !validateEmail(selectedEmail)) {
//       setEmailError("Please enter a valid email address");
//       return;
//     }

//     if (!paystackUrl) {
//       setEmailError("Please enter a Paystack URL");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:3000/send-email", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           recipientEmail: selectedEmail,
//           companyName: isManualEmail ? "Customer" : companySearchTerm,
//           paystackUrl: paystackUrl,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to send email");
//       }

//       setSentEmails((prev) => [
//         ...prev,
//         {
//           id: Date.now(),
//           recipientEmail: selectedEmail,
//           companyName: isManualEmail ? "Manual Entry" : companySearchTerm,
//           paystackUrl,
//           timestamp: new Date().toISOString(),
//           status: "sent",
//           messageId: data.messageId,
//         },
//       ]);

//       setPaystackUrl("");
//       setSelectedEmail("");
//       setCompanySearchTerm("");
//       setIsManualEmail(false);
//     } catch (error) {
//       console.error("Error sending notification:", error);
//       setEmailError(error.message);
      
//       setSentEmails((prev) => [
//         ...prev,
//         {
//           id: Date.now(),
//           recipientEmail: selectedEmail,
//           companyName: isManualEmail ? "Manual Entry" : companySearchTerm,
//           paystackUrl,
//           timestamp: new Date().toISOString(),
//           status: "failed",
//           error: error.message,
//         },
//       ]);
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
//         <BiMessageDetail className="text-blue-950" />
//         Send Payment Notifications
//       </h2>

//       <div className="bg-white rounded-lg shadow p-6 relative" ref={dropdownRef}>
//         {/* Recipient Selection */}
//         <div className="mb-4">
//           <div className="flex justify-between items-center mb-2">
//             <label className="flex items-center gap-2 text-sm font-medium">
//               <FaUserCircle />
//               {isManualEmail ? "Enter Email Address" : "Select Recipient"}
//             </label>
//             <button
//               onClick={toggleManualEmail}
//               className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800"
//             >
//               <FaPlus size={10} />
//               {isManualEmail ? "Select from list" : "Enter email manually"}
//             </button>
//           </div>

//           <input
//             type={isManualEmail ? "email" : "text"}
//             value={isManualEmail ? selectedEmail : companySearchTerm}
//             onChange={handleCompanySearch}
//             onFocus={() => !isManualEmail && setShowCompanySuggestions(true)}
//             className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             placeholder={
//               isManualEmail 
//                 ? "Enter recipient email address" 
//                 : "Search by company name..."
//             }
//             required
//           />

//           {!isManualEmail && showCompanySuggestions && (
//             <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
//               {filteredCompanies.length > 0 ? (
//                 filteredCompanies.map((company, index) => (
//                   <div
//                     key={index}
//                     className="p-3 hover:bg-gray-100 cursor-pointer border-b"
//                     onClick={() => handleCompanySelect(company)}
//                   >
//                     <div className="font-medium">{company.GROUP_NAME}</div>
//                     <div className="text-sm text-gray-500">{company.Company_Email1}</div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="p-3 text-gray-500">No matching companies found</div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Selected Recipient Display */}
//         {selectedEmail && (
//           <div className="mb-4 bg-blue-50 p-3 rounded-md">
//             <div className="text-sm font-medium text-gray-700">Selected Recipient:</div>
//             <div className="font-semibold">
//               {isManualEmail ? selectedEmail : `${companySearchTerm} (${selectedEmail})`}
//             </div>
//           </div>
//         )}

//         {/* Paystack URL Input */}
//         <div className="mb-4">
//           <label className="flex items-center gap-2 text-sm font-medium mb-2">
//             <BiMessageDetail />
//             Paystack URL
//           </label>
//           <input
//             type="url"
//             value={paystackUrl}
//             onChange={(e) => setPaystackUrl(e.target.value)}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-950 focus:border-blue-950 outline-none"
//             placeholder="Enter Paystack payment link"
//             required
//           />
//         </div>

//         {/* Error Message */}
//         {emailError && (
//           <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
//             {emailError}
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex gap-3">
//           <button
//             onClick={() => setIsModalOpen(true)}
//             disabled={!selectedEmail || !paystackUrl}
//             className="bg-gray-200 text-gray-800 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-300 transition-colors disabled:opacity-50"
//           >
//             Preview Email
//           </button>

//           <button
//             onClick={sendNotification}
//             disabled={!selectedEmail || !paystackUrl}
//             className="bg-blue-950 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-red-500 transition-colors disabled:opacity-50 disabled:hover:bg-blue-950 flex-1 justify-center"
//           >
//             <BiSend />
//             Send Notification
//           </button>
//         </div>
//       </div>

//       {/* Message History */}
//       <MessageHistory sentEmails={sentEmails} />

//       {/* Email Preview Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-overlay">
//           <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               ✕
//             </button>
//             <h3 className="text-lg font-semibold mb-4">Email Preview</h3>
//             <EmailTemplate 
//               companyName={isManualEmail ? companySearchTerm.toUpperCase() : "Customer" } 
//               paystackUrl={paystackUrl} 
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Messages;

import { useState, useEffect, useRef } from "react";
import { BiMessageDetail, BiSend } from "react-icons/bi";
import { FaUserCircle, FaPlus } from "react-icons/fa";
import MessageHistory from "../components/MessageHistory";
import EmailTemplate from "../components/EmailTemplate"; 
import { sendEmail } from "../services/emailService";

const Messages = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [paystackUrl, setPaystackUrl] = useState("");
  const [companySearchTerm, setCompanySearchTerm] = useState("");
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sentEmails, setSentEmails] = useState([]);
  const [isManualEmail, setIsManualEmail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const dropdownRef = useRef(null);

  // Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(
          "https://prognosis-api.leadwayhealth.com/API/listvalues/getgroups"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setCompanies(data.result || []);
        setFilteredCompanies(data.result || []);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCompanySuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Modal handlers
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (isModalOpen && e.target.classList.contains('modal-overlay')) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isModalOpen]);

  const handleCompanySearch = (e) => {
    const value = e.target.value;
    setCompanySearchTerm(value);
    
    if (isManualEmail) {
      setSelectedEmail(value);
      return;
    }

    const filtered = companies.filter((company) =>
      company.GROUP_NAME.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 10);
    setFilteredCompanies(filtered);
    setShowCompanySuggestions(true);
  };

  const handleCompanySelect = (company) => {
    setSelectedEmail(company.Company_Email1 || company.EMAIL || company.email || ""); 
    setCompanySearchTerm(company.GROUP_NAME || company.name || "");
    setShowCompanySuggestions(false);
    setIsManualEmail(false);
    setEmailError("");
  };

  const toggleManualEmail = () => {
    setIsManualEmail(!isManualEmail);
    setSelectedEmail("");
    setCompanySearchTerm("");
    setShowCompanySuggestions(false);
    setEmailError("");
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const generateEmailHtml = (companyName, paystackUrl) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Renew Your Premium</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#EE8D00" style="padding: 20px;">
              <img src="https://drive.google.com/uc?id=1WviGJXLcRDlITy-kFQmbe3e99m3O43gg" alt="Leadway Health Limited Logo on the header" width="150" style="display: block;" />
              <p style="color: #fff; font-size: 20px; margin: 0;">${companyName}</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 20px;">
              <p style="font-size: 16px; font-weight: bold; margin: 0 0 10px;">Dear Valued Customer,</p>
              <p style="font-size: 14px; color: #333; margin: 0 0 20px;">
                To ensure uninterrupted access to your comprehensive health coverage, we kindly remind you to renew your premium. <br>Your continued protection is our priority.
              </p>
              <a href="${paystackUrl}" style="display: inline-block; background-color: #EE8D00; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; align-items: center; font-weight: bold;">
                Click 🖲️ to Renew Now
              </a>
              <p style="font-size: 14px; color: #333; margin-top: 20px;">
                For assistance, contact our support team at :
                <a href="mailto:healthcare@leadway.com" style="color: #007bff; text-decoration: none;">📧 healthcare@leadway.com</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td bgcolor="#333" style="padding: 10px; text-align: center;">
              <table align="center" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 0 5px;">
                    <a href="https://www.instagram.com/leadwayhealth/" style="text-decoration: none;">
                      <img src="https://drive.google.com/uc?id=1Vyh8afj9jF-bWZ3eS273rDfO8_vCgDTK" alt="Instagram icon on the footer for linking to Leadway instagram account and page" width="24" height="24" style="display: block;" />
                    </a>
                  </td>
                  <td style="padding: 0 5px;">
                    <a href="https://www.youtube.com/@leadwayassurance" style="text-decoration: none;">
                      <img src="https://drive.google.com/uc?id=1ZK8V8ArRJPF9t8UY25-6NhFHJRyCTfN5" alt="YouTube icon on the footer for linking to Leadway YouTube account and page" width="24" height="24" style="display: block;" />
                    </a>
                  </td>
                  <td style="padding: 0 5px;">
                    <a href="https://www.facebook.com/LeadwayHealth/" style="text-decoration: none;">
                      <img src="https://drive.google.com/uc?id=1xr5Bgj_WcUBSfPPV2saJ56VwTtrxm5TZ" alt="Facebook icon on the footer for linking to Leadway Facebook account and page" width="24" height="24" style="display: block;" />
                    </a>
                  </td>
                  <td style="padding: 0 5px;">
                    <a href="https://x.com/LeadwayHealthng?s=20&t=Z-DYfMoKhofknVs9VU_ihg" style="text-decoration: none;">
                      <img src="https://drive.google.com/uc?id=12yz1JJioDwhGlAiFZjpHbH-GLJPZtpHR" alt="Twitter icon on the footer for linking to Leadway X (formerly Twitter) account and page" width="24" height="24" style="display: block;" />
                    </a>
                  </td>
                </tr>
              </table>
              <p style="font-size: 12px; color: #ccc; margin: 10px 0 0;">
                <u><a href="#" style="color: #ccc; text-decoration: underline;">Unsubscribe</a></u> | From Sales Department <br />
                📍121/123, Funso Williams Avenue, Iponri, Surulere Lagos.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  };

  const sendNotification = async () => {
    setEmailError("");
    
    if (!selectedEmail || !validateEmail(selectedEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (!paystackUrl) {
      setEmailError("Please enter a Paystack URL");
      return;
    }

    try {
      const companyName = isManualEmail ? "Customer" : companySearchTerm;
      const emailHtml = generateEmailHtml(companyName, paystackUrl);

      // Use the emailService to send the email
      const result = await sendEmail({
        recipient: selectedEmail,
        subject: `Payment Request Notification - ${companyName}`,
        message: emailHtml,
        category: "Payment Reminder"
      });

      setSentEmails((prev) => [
        ...prev,
        {
          id: Date.now(),
          recipientEmail: selectedEmail,
          companyName: isManualEmail ? "Manual Entry" : companySearchTerm,
          paystackUrl,
          timestamp: new Date().toISOString(),
          status: "sent",
          messageId: result.messageId,
        },
      ]);

      setPaystackUrl("");
      setSelectedEmail("");
      setCompanySearchTerm("");
      setIsManualEmail(false);
    } catch (error) {
      console.error("Error sending notification:", error);
      setEmailError(error.message);
      
      setSentEmails((prev) => [
        ...prev,
        {
          id: Date.now(),
          recipientEmail: selectedEmail,
          companyName: isManualEmail ? "Manual Entry" : companySearchTerm,
          paystackUrl,
          timestamp: new Date().toISOString(),
          status: "failed",
          error: error.message,
        },
      ]);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <BiMessageDetail className="text-blue-950" />
        Send Payment Notifications
      </h2>

      <div className="bg-white rounded-lg shadow p-6 relative" ref={dropdownRef}>
        {/* Recipient Selection */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <FaUserCircle />
              {isManualEmail ? "Enter Email Address" : "Select Recipient"}
            </label>
            <button
              onClick={toggleManualEmail}
              className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <FaPlus size={10} />
              {isManualEmail ? "Select from list" : "Enter email manually"}
            </button>
          </div>

          <input
            type={isManualEmail ? "email" : "text"}
            value={isManualEmail ? selectedEmail : companySearchTerm}
            onChange={handleCompanySearch}
            onFocus={() => !isManualEmail && setShowCompanySuggestions(true)}
            className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={
              isManualEmail 
                ? "Enter recipient email address" 
                : "Search by company name..."
            }
            required
          />

          {!isManualEmail && showCompanySuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                    onClick={() => handleCompanySelect(company)}
                  >
                    <div className="font-medium">{company.GROUP_NAME}</div>
                    <div className="text-sm text-gray-500">{company.Company_Email1}</div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-500">No matching companies found</div>
              )}
            </div>
          )}
        </div>

        {/* Selected Recipient Display */}
        {selectedEmail && (
          <div className="mb-4 bg-blue-50 p-3 rounded-md">
            <div className="text-sm font-medium text-gray-700">Selected Recipient:</div>
            <div className="font-semibold">
              {isManualEmail ? selectedEmail : `${companySearchTerm} (${selectedEmail})`}
            </div>
          </div>
        )}

        {/* Paystack URL Input */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <BiMessageDetail />
            Paystack URL
          </label>
          <input
            type="url"
            value={paystackUrl}
            onChange={(e) => setPaystackUrl(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-950 focus:border-blue-950 outline-none"
            placeholder="Enter Paystack payment link"
            required
          />
        </div>

        {/* Error Message */}
        {emailError && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {emailError}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={!selectedEmail || !paystackUrl}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Preview Email
          </button>

          <button
            onClick={sendNotification}
            disabled={!selectedEmail || !paystackUrl}
            className="bg-blue-950 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-red-500 transition-colors disabled:opacity-50 disabled:hover:bg-blue-950 flex-1 justify-center"
          >
            <BiSend />
            Send Notification
          </button>
        </div>
      </div>

      {/* Message History */}
      <MessageHistory sentEmails={sentEmails} />

      {/* Email Preview Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-overlay">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4">Email Preview</h3>
            <EmailTemplate 
              companyName={isManualEmail ? companySearchTerm.toUpperCase() : "Customer" } 
              paystackUrl={paystackUrl} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;