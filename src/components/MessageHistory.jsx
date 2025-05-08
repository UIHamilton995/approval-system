// import { BiMessageDetail, BiTime } from "react-icons/bi";
// import { MdOutlineMarkEmailRead } from "react-icons/md";
// import { FaExternalLinkAlt } from "react-icons/fa";

// const MessageHistory = ({ messages }) => {
//   return (
//     <div className="space-y-4 mt-6">
//       <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
//         <BiMessageDetail className="text-blue-950" />
//         Sent Emails History
//       </h3>

//       {messages.length === 0 ? (
//         <div className="text-center text-gray-500 py-8">
//           No emails sent yet
//         </div>
//       ) : (
//         messages.map((msg) => (
//           <div
//             key={msg.id}
//             className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:border-blue-100 transition-all"
//           >
//             <div className="flex justify-between items-start">
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-2">
//                   <MdOutlineMarkEmailRead className="text-blue-950" />
//                   <span className="font-medium">To: {msg.recipientEmail}</span>
//                 </div>

//                 <div className="flex items-start gap-2 ml-1">
//                   <BiMessageDetail className="text-gray-500 mt-1" />
//                   <p className="text-gray-700">{msg.message}</p>
//                 </div>

//                 <div className="flex items-start gap-2 ml-1 mt-2">
//                   <FaExternalLinkAlt className="text-gray-500 mt-1" />
//                   <a
//                     href={msg.paystackUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-500 hover:underline"
//                   >
//                     Paystack Link
//                   </a>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2 text-sm text-gray-500">
//                 <BiTime />
//                 <span>{new Date(msg.timestamp).toLocaleString()}</span>
//               </div>
//             </div>

//             {msg.status && (
//               <div className="mt-2 flex justify-end">
//                 <span
//                   className={`text-sm px-2 py-1 rounded-full ${
//                     msg.status === "sent"
//                       ? "bg-green-100 text-green-700"
//                       : "bg-yellow-100 text-yellow-700"
//                   }`}
//                 >
//                   {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
//                 </span>
//               </div>
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default MessageHistory;

import { BiMessageDetail, BiTime } from "react-icons/bi";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { FaExternalLinkAlt } from "react-icons/fa";

const MessageHistory = ({ sentEmails }) => {
  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
        <BiMessageDetail className="text-blue-950" />
        Sent Emails History
      </h3>

      {sentEmails.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No emails sent yet
        </div>
      ) : (
        sentEmails.map((email) => (
          <div
            key={email.id}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:border-blue-100 transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MdOutlineMarkEmailRead className="text-blue-950" />
                  <span className="font-medium">To: {email.recipientEmail}</span>
                </div>

                <div className="flex items-start gap-2 ml-1">
                  <BiMessageDetail className="text-gray-500 mt-1" />
                  <p className="text-gray-700">{email.companyName}</p>
                </div>

                <div className="flex items-start gap-2 ml-1 mt-2">
                  <FaExternalLinkAlt className="text-gray-500 mt-1" />
                  <a
                    href={email.paystackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Paystack Link
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <BiTime />
                <span>{new Date(email.timestamp).toLocaleString()}</span>
              </div>
            </div>

            {email.status && (
              <div className="mt-2 flex justify-end">
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    email.status === "sent"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                </span>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MessageHistory;