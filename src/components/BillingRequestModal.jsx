// import { MdClose, MdDelete, MdDescription, MdEmail } from 'react-icons/md';
// import { FaMoneyBillWave, FaLink, FaUser, FaFileAlt, FaUserTie } from 'react-icons/fa';
// import { BsCalendarDate } from 'react-icons/bs';
// import { BiPurchaseTag } from 'react-icons/bi';

// const BillingRequestModal = ({ billingData, onClose, onDelete }) => {
//   if (!billingData) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl transform transition-all">
//         {/* Modal Header */}
//         <div className="bg-blue-950 text-white p-6 rounded-t-xl flex justify-between items-center">
//           <button
//             onClick={onDelete}
//             className="hover:bg-red-500 p-2 rounded-lg transition-colors duration-200 group"
//           >
//             <MdDelete size={24} className="group-hover:animate-bounce" />
//           </button>
//           <h2 className="text-xl font-semibold">Billing Request Details</h2>
//           <button
//             onClick={onClose}
//             className="hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200 group"
//           >
//             <MdClose size={24} className="group-hover:rotate-180 transition-transform duration-300" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-4">
//           {/* Status Badge */}
//           <div className="flex justify-center">
//             <span className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-4 py-2 rounded-full font-semibold text-sm">
//               {billingData.status}
//             </span>
//           </div>

//           {/* Request Info Section */}
//           <div className="bg-gray-50 p-4 rounded-lg space-y-2">
//             <div className="flex items-start gap-3">
//               <BiPurchaseTag className="text-blue-950 mt-1" size={20} />
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Request Title</h3>
//                 <p className="text-lg font-semibold">{billingData.requestTitle}</p>
//               </div>
//             </div>
//             <div className="flex items-start gap-3">
//               <BsCalendarDate className="text-blue-950 mt-1" size={20} />
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Request Date</h3>
//                 <p className="text-lg font-semibold">
//                   {new Date(billingData.requestDate).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Payment Details */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-gray-50 p-4 rounded-lg space-y-2">
//               <div className="flex items-start gap-3">
//                 <FaMoneyBillWave className="text-blue-950 mt-1" size={20} />
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Amount</h3>
//                   <p className="text-lg font-semibold">{billingData.amount}</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-3">
//                 <FaLink className="text-blue-950 mt-1" size={20} />
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Payment Link</h3>
//                   <a 
//                     href={billingData.paymentLink}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:text-blue-800 underline break-all"
//                   >
//                     {billingData.paymentLink}
//                   </a>
//                 </div>
//               </div>
//             </div>

//             {/* Client Details */}
//             <div className="bg-gray-50 p-4 rounded-lg space-y-2">
//               <div className="flex items-start gap-3">
//                 <FaUser className="text-blue-950 mt-1" size={20} />
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Client Name</h3>
//                   <p className="text-lg font-semibold">{billingData.recipientName}</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-3">
//                 <MdEmail className="text-blue-950 mt-1" size={20} />
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Client Email</h3>
//                   <p className="text-lg font-semibold">{billingData.recipientEmail}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Description and Additional Details */}
//           <div className="bg-gray-50 p-4 rounded-lg space-y-2">
//             <div className="flex items-start gap-3">
//               <MdDescription className="text-blue-950 mt-1" size={20} />
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Description</h3>
//                 <p className="text-lg">{billingData.description}</p>
//               </div>
//             </div>

//             <div className="flex items-start gap-3">
//               <FaFileAlt className="text-blue-950 mt-1" size={20} />
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Supporting Documents</h3>
//                 <p className="text-lg">
//                   {billingData.supportingDocs ? billingData.supportingDocs.name : 'No documents attached'}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-start gap-3">
//               <FaUserTie className="text-blue-950 mt-1" size={20} />
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Approver</h3>
//                 <p className="text-lg font-semibold">{billingData.approver}</p>
//               </div>
//             </div>
//           </div>

//           {/* Request ID */}
//           <div className="flex justify-center">
//             <span className="text-sm text-gray-500">
//               Request ID: {billingData.requestId}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BillingRequestModal;


import { MdClose, MdDelete, MdDescription, MdEmail } from 'react-icons/md';
import { FaMoneyBillWave, FaLink, FaUser, FaFileAlt, FaUserTie, FaCheck } from 'react-icons/fa';
import { BsCalendarDate } from 'react-icons/bs';
import { BiPurchaseTag, BiReset } from 'react-icons/bi';

const BillingRequestModal = ({ billingData, onClose, onDelete, onApprove, onRevalidate }) => {
  if (!billingData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl transform transition-all">
        {/* Modal Header - No changes */}
        <div className="bg-blue-950 text-white p-6 rounded-t-xl flex justify-between items-center">
          <button
            onClick={onDelete}
            className="hover:bg-red-500 p-2 rounded-lg transition-colors duration-200 group"
          >
            <MdDelete size={24} className="group-hover:animate-bounce" />
          </button>
          <h2 className="text-xl font-semibold">Billing Request Details</h2>
          <button
            onClick={onClose}
            className="hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200 group"
          >
            <MdClose size={24} className="group-hover:rotate-180 transition-transform duration-300" />
          </button>
        </div>

        {/* Content - Keep all existing content */}
        <div className="p-4">
          {/* Status Badge */}
          <div className="flex justify-center">
            <span className={`px-4 py-2 rounded-full font-semibold text-sm ${
              billingData.status === "Pending"
                ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                : billingData.status === "Approved"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}>
              {billingData.status}
            </span>
          </div>

          {/* Keep all other existing sections unchanged */}
          {/* ... Request Info Section ... */}
          {/* ... Payment Details ... */}
          {/* ... Client Details ... */}
          {/* ... Description and Additional Details ... */}
          {/* Previous content remains exactly the same */}
          
          {/* Request Info Section */}
          <div className="bg-gray-50 p-4 rounded-lg mt-2">
            <div className="flex items-start gap-3">
              <BiPurchaseTag className="text-blue-950 mt-1" size={20} />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Request Title</h3>
                <p className="text-lg font-semibold">{billingData.requestTitle}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BsCalendarDate className="text-blue-950 mt-1" size={20} />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Request Date</h3>
                <p className="text-lg font-semibold">
                  {new Date(billingData.requestDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <FaMoneyBillWave className="text-blue-950 mt-1" size={20} />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                  <p className="text-lg font-semibold">{billingData.amount}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaLink className="text-blue-950 mt-1" size={20} />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Payment Link</h3>
                  <a 
                    href={billingData.paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {billingData.paymentLink}
                  </a>
                </div>
              </div>
            </div>

            {/* Client Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <FaUser className="text-blue-950 mt-1" size={20} />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Client Name</h3>
                  <p className="text-lg font-semibold">{billingData.recipientName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MdEmail className="text-blue-950 mt-1" size={20} />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Client Email</h3>
                  <p className="text-lg font-semibold">{billingData.recipientEmail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description and Additional Details */}
          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <div className="flex items-start gap-3">
              <MdDescription className="text-blue-950 mt-1" size={20} />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="text-lg">{billingData.description}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaFileAlt className="text-blue-950 mt-1" size={20} />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Supporting Documents</h3>
                <p className="text-lg">
                  {billingData.supportingDocs ? billingData.supportingDocs.name : 'No documents attached'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaUserTie className="text-blue-950 mt-1" size={20} />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Approver</h3>
                <p className="text-lg font-semibold">{billingData.approver}</p>
              </div>
            </div>
          </div>

          {/* Request ID */}
          <div className="flex justify-center mt-4">
            <span className="text-sm text-gray-500">
              Request ID: {billingData.requestId}
            </span>
          </div>

          {/* New Action Buttons Section */}
          <div className="border-t mt-4 pt-4 flex justify-end gap-4">
            {billingData.status === "Pending" && (
              <button
                onClick={onApprove}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <FaCheck className="text-lg" />
                Approve Request
              </button>
            )}
            {billingData.status === "Rejected" && (
              <button
                onClick={onRevalidate}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 group"
              >
                <BiReset className="text-lg group-hover:rotate-180 transition-transform duration-300" />
                Revalidate Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingRequestModal;