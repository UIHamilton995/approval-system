// import { useState, useEffect } from "react";
// import { useUser } from "../contexts/userContexts";
// import SuccessToast from "../components/SuccessToast";
// import { NotificationService } from "../services/notificationTemplates/notificationService";

// const OperationalExpenseForm = ({ onSubmit }) => {
//   const { user } = useUser();
//   const [formData, setFormData] = useState({
//     beneficiary: '',
//     accountName: '',
//     accountNumber: '',
//     bank: '',
//     email: '',
//     phone: '',
//     amount: '',
//     description: '',
//     mainApprover: '',
//     additionalApprovers: [],
//     supportingDocs: null
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSuccessToast, setShowSuccessToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [hasPermission, setHasPermission] = useState(false);

//   const approvers = [
//     "Dr. Tokunbo Alli",
//     "Dr. Temitope Falaiye",
//     "Dr. Gideon Anumba",
//     "Mr. Adebayo",
//     "Favour Komoni",
//     "Oluwatoyin Ogunmoyele",
//     "Temilade Daniel-Owo",
//   ];

//   useEffect(() => {
//     if (user?.group_name) {
//       setHasPermission(true);
//     } else {
//       setHasPermission(false);
//       setToastMessage("Permission Denied: Your account is not assigned to a required unit/group.");
//       setShowSuccessToast(true);
//     }
//   }, [user]);

//   const determineMainApprover = (amount) => {
//     const numericAmount = parseInt(amount.replace(/,/g, ''), 10) || 0;
    
//     if (numericAmount <= 500000) 
//       return "Dr. Tokunbo Alli";
//   };

//   const handleAmountChange = (e) => {
//     let value = e.target.value.replace(/[^\d]/g, '');
//     if (value) {
//       const numberValue = parseInt(value, 10);
//       if (!isNaN(numberValue)) {
//         value = numberValue.toLocaleString('en-NG');
//         const mainApprover = determineMainApprover(value);
//         setFormData(prev => ({
//           ...prev,
//           amount: value,
//           mainApprover
//         }));
//         return;
//       }
//     }
//     setFormData(prev => ({
//       ...prev,
//       amount: value,
//       mainApprover: ''
//     }));
//   };

//   const handleAdditionalApprovers = (e) => {
//     const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
//     const filteredOptions = selectedOptions.filter(
//       approver => approver !== formData.mainApprover
//     ).slice(0, 2);
//     setFormData(prev => ({
//       ...prev,
//       additionalApprovers: filteredOptions
//     }));
//   };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
    
//     if (name === 'description' && value.length > 70) {
//       setToastMessage("Description cannot exceed 70 characters");
//       setShowSuccessToast(true);
//       return;
//     }

//     setFormData(prev => ({
//       ...prev,
//       [name]: files ? files[0] : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!user?.group_name) {
//       setToastMessage("Submission Failed: You do not have permission or are not logged in correctly.");
//       setShowSuccessToast(true);
//       return;
//     }

//     if (formData.description.length > 70) {
//       setToastMessage("Description cannot exceed 70 characters");
//       setShowSuccessToast(true);
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const amountWithoutCommas = formData.amount.replace(/,/g, '');
      
//       const requestBody = {
//         Provider: formData.beneficiary,
//         RequestType: "Operational",
//         ProviderCode: "",
//         ProviderBank: formData.bank,
//         ProviderAccountNumber: formData.accountNumber,
//         ProviderAccountName: formData.accountName,
//         ProviderContact1: formData.phone,
//         ProviderEmail: formData.email,
//         ClientName: "",
//         EnrolleeID: "",
//         Unit: user.group_name,
//         GroupName: "",
//         ApprovalAmount: parseFloat(amountWithoutCommas) || 0,
//         InvoiceFile: formData.supportingDocs?.name || "",
//         FileType: formData.supportingDocs?.name.split('.').pop().toUpperCase() || "",
//         MainApprover: formData.mainApprover,
//         AlternativeApprover: formData.additionalApprovers.join(", "),
//         BankName: "",
//         BankAccount: "",
//         Reason: formData.description,
//         Status: "Pending",
//         CreatedBy: user?.email || user?.username || "user",
//         vat: "",
//         wht: ""
//       };

//       const response = await fetch(
//         "https://prognosis-api.leadwayhealth.com/api/HealthApproval/InsertHealthApprovalPayment",
//         {
//           method: "POST",
//           headers: { 
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           },
//           body: JSON.stringify(requestBody)
//         }
//       );

//       const responseData = await response.json();
      
//       if (!response.ok || responseData.status !== 200) {
//         throw new Error(responseData.message || "Failed to submit request");
//       }

//       // Send notifications to approvers
//       await NotificationService.sendApprovalNotifications(formData, user);

//       setToastMessage("Operational expense request submitted successfully!");
//       setShowSuccessToast(true);

//       if (typeof onSubmit === 'function') {
//         onSubmit({
//           ...formData,
//           amount: amountWithoutCommas,
//           requestDate: new Date().toISOString(),
//           status: 'Pending',
//           requestId: `OP-${Math.random().toString(36).substr(2, 9)}`.toUpperCase(),
//           unit: user.group_name
//         });
//       }

//       // Reset form
//       setFormData({
//         beneficiary: '',
//         accountName: '',
//         accountNumber: '',
//         bank: '',
//         email: '',
//         phone: '',
//         amount: '',
//         description: '',
//         mainApprover: '',
//         additionalApprovers: [],
//         supportingDocs: null
//       });

//     } catch (error) {
//       console.error("Error submitting form:", error);
//       setToastMessage(`Submission Failed: ${error.message}`);
//       setShowSuccessToast(true);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!hasPermission) {
//     return (
//       <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto">
//         <h2 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-2">
//           Operational Expense Payment Request
//         </h2>
//         <div className="bg-red-50 border-l-4 border-red-500 p-4">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-red-700">
//                 Permission Denied: Your account is not assigned to a required unit/group.
//                 Please contact your administrator.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto">
//       <h2 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-2">
//         Operational Expense Payment Request
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Unit Field */}
//         <div>
//           <label className="block text-md font-medium text-gray-700 mb-1">
//             Unit
//           </label>
//           <input
//             type="text"
//             value={user?.group_name || ''}
//             className="w-full p-3 border rounded-md shadow-sm bg-gray-100 text-gray-600 cursor-not-allowed"
//             readOnly
//           />
//         </div>

//         {/* Beneficiary Fields */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-md font-medium text-gray-700 mb-1">
//               Beneficiary <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="beneficiary"
//               value={formData.beneficiary}
//               onChange={handleChange}
//               className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter beneficiary name"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-md font-medium text-gray-700 mb-1">
//               Account Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="accountName"
//               value={formData.accountName}
//               onChange={handleChange}
//               className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter account name"
//               required
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div>
//             <label className="block text-md font-medium text-gray-700 mb-1">
//               Account Number <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="accountNumber"
//               value={formData.accountNumber}
//               onChange={handleChange}
//               className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter account number"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-md font-medium text-gray-700 mb-1">
//               Bank <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="bank"
//               value={formData.bank}
//               onChange={handleChange}
//               className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter bank name"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-md font-medium text-gray-700 mb-1">
//               Amount (₦) <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="amount"
//               value={formData.amount}
//               onChange={handleAmountChange}
//               className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter amount"
//               required
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-md font-medium text-gray-700 mb-1">
//               Email <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter email address"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-md font-medium text-gray-700 mb-1">
//               Phone <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter phone number"
//               required
//             />
//           </div>
//         </div>

//         {/* Description */}
//         <div>
//           <label className="block text-md font-medium text-gray-700 mb-1">
//             Description (Max 70 characters) <span className="text-red-500">*</span>
//           </label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             rows={3}
//             maxLength={70}
//             className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             placeholder="Brief description of the expense"
//             required
//           />
//           <p className="text-sm text-gray-500 mt-1">
//             {formData.description.length}/70 characters
//           </p>
//         </div>

//         {/* Supporting Documents */}
//         <div>
//           <label className="block text-md font-medium text-gray-700 mb-1">
//             Supporting Documents <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="file"
//             name="supportingDocs"
//             onChange={handleChange}
//             className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             accept=".pdf,.jpg,.jpeg,.png"
//             required
//           />
//         </div>

//         {/* Approvers Section */}
//         <div className="space-y-4">
//           <div>
//             <label className="block text-md font-medium text-gray-700 mb-1">
//               Main Approver
//             </label>
//             <input
//               type="text"
//               value={formData.mainApprover}
//               className="w-full p-3 border rounded-md shadow-sm bg-gray-50"
//               disabled
//             />
//           </div>

//           <div>
//             <label className="block text-md font-medium text-gray-700 mb-1">
//               Additional Approvers (Max 2)
//             </label>
//             <select
//               multiple
//               value={formData.additionalApprovers}
//               onChange={handleAdditionalApprovers}
//               className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               {approvers
//                 .filter(approver => approver !== formData.mainApprover)
//                 .map((approver, index) => (
//                   <option key={index} value={approver}>
//                     {approver}
//                   </option>
//                 ))}
//             </select>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-end pt-6">
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className={`px-8 py-3 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
//               isSubmitting ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-950 hover:bg-red-500'
//             }`}
//           >
//             {isSubmitting ? 'Submitting...' : 'Submit Request'}
//           </button>
//         </div>
//       </form>

//       <SuccessToast
//         message={toastMessage}
//         show={showSuccessToast}
//         onClose={() => setShowSuccessToast(false)}
//       />
//     </div>
//   );
// };

// export default OperationalExpenseForm;

import { useState, useEffect } from "react";
import { useUser } from "../contexts/userContexts";
import SuccessToast from "../components/SuccessToast";
import { NotificationService } from "../services/notificationTemplates/notificationService";

const OperationalExpenseForm = ({ onSubmit }) => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    beneficiary: '',
    accountName: '',
    accountNumber: '',
    bank: '',
    email: '',
    phone: '',
    amount: '',
    description: '',
    mainApprover: '',
    additionalApprovers: [],
    supportingDocs: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [hasPermission, setHasPermission] = useState(false);
  const [showApproverDropdown, setShowApproverDropdown] = useState(false);

  const approvers = [
    "Dr. Tokunbo Alli",
    "Dr. Temitope Falaiye",
    "Dr. Gideon Anumba",
    "Mr. Adebayo",
    "Favour Komoni",
    "Oluwatoyin Ogunmoyele",
    "Temilade Daniel-Owo",
  ];

  useEffect(() => {
    if (user?.group_name) {
      setHasPermission(true);
    } else {
      setHasPermission(false);
      setToastMessage("Permission Denied: Your account is not assigned to a required unit/group.");
      setShowSuccessToast(true);
    }
  }, [user]);

  const determineMainApprover = (amount) => {
    const numericAmount = parseInt(amount.replace(/,/g, ''), 10) || 0;
    
    if (numericAmount > 500000) {
      // Auto-select Dr. Tokunbo Alli for amounts > 500k
      setShowApproverDropdown(false);
      return "Dr. Tokunbo Alli";
    } else {
      // Show dropdown for manual selection for amounts <= 500k
      setShowApproverDropdown(true);
      return '';
    }
  };

  const handleAmountChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value) {
      const numberValue = parseInt(value, 10);
      if (!isNaN(numberValue)) {
        value = numberValue.toLocaleString('en-NG');
        const mainApprover = determineMainApprover(value);
        setFormData(prev => ({
          ...prev,
          amount: value,
          mainApprover
        }));
        return;
      }
    }
    setFormData(prev => ({
      ...prev,
      amount: value,
      mainApprover: ''
    }));
    setShowApproverDropdown(false);
  };

  const handleMainApproverChange = (e) => {
    setFormData(prev => ({
      ...prev,
      mainApprover: e.target.value
    }));
  };

  const handleAdditionalApprovers = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    const filteredOptions = selectedOptions.filter(
      approver => approver !== formData.mainApprover
    ).slice(0, 2);
    setFormData(prev => ({
      ...prev,
      additionalApprovers: filteredOptions
    }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'description' && value.length > 70) {
      setToastMessage("Description cannot exceed 70 characters");
      setShowSuccessToast(true);
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.group_name) {
      setToastMessage("Submission Failed: You do not have permission or are not logged in correctly.");
      setShowSuccessToast(true);
      return;
    }

    if (formData.description.length > 70) {
      setToastMessage("Description cannot exceed 70 characters");
      setShowSuccessToast(true);
      return;
    }

    if (!formData.mainApprover) {
      setToastMessage("Please select a main approver");
      setShowSuccessToast(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const amountWithoutCommas = formData.amount.replace(/,/g, '');
      
      const requestBody = {
        Provider: formData.beneficiary,
        RequestType: "Operational",
        ProviderCode: "",
        ProviderBank: formData.bank,
        ProviderAccountNumber: formData.accountNumber,
        ProviderAccountName: formData.accountName,
        ProviderContact1: formData.phone,
        ProviderEmail: formData.email,
        ClientName: "",
        EnrolleeID: "",
        Unit: user.group_name,
        GroupName: "",
        ApprovalAmount: parseFloat(amountWithoutCommas) || 0,
        InvoiceFile: formData.supportingDocs?.name || "",
        FileType: formData.supportingDocs?.name.split('.').pop().toUpperCase() || "",
        MainApprover: formData.mainApprover,
        AlternativeApprover: formData.additionalApprovers.join(", "),
        BankName: "",
        BankAccount: "",
        Reason: formData.description,
        Status: "Pending",
        CreatedBy: user?.email || user?.username || "user",
        vat: "",
        wht: ""
      };

      const response = await fetch(
        "https://prognosis-api.leadwayhealth.com/api/HealthApproval/InsertHealthApprovalPayment",
        {
          method: "POST",
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );

      const responseData = await response.json();
      
      if (!response.ok || responseData.status !== 200) {
        throw new Error(responseData.message || "Failed to submit request");
      }

      // Send notifications to approvers
      await NotificationService.sendApprovalNotifications(formData, user);

      setToastMessage("Operational expense request submitted successfully!");
      setShowSuccessToast(true);

      if (typeof onSubmit === 'function') {
        onSubmit({
          ...formData,
          amount: amountWithoutCommas,
          requestDate: new Date().toISOString(),
          status: 'Pending',
          requestId: `OP-${Math.random().toString(36).substr(2, 9)}`.toUpperCase(),
          unit: user.group_name
        });
      }

      // Reset form
      setFormData({
        beneficiary: '',
        accountName: '',
        accountNumber: '',
        bank: '',
        email: '',
        phone: '',
        amount: '',
        description: '',
        mainApprover: '',
        additionalApprovers: [],
        supportingDocs: null
      });
      setShowApproverDropdown(false);

    } catch (error) {
      console.error("Error submitting form:", error);
      setToastMessage(`Submission Failed: ${error.message}`);
      setShowSuccessToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasPermission) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-2">
          Operational Expense Payment Request
        </h2>
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Permission Denied: Your account is not assigned to a required unit/group.
                Please contact your administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-2">
        Operational Expense Payment Request
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Unit Field */}
        <div>
          <label className="block text-md font-medium text-gray-700 mb-1">
            Unit
          </label>
          <input
            type="text"
            value={user?.group_name || ''}
            className="w-full p-3 border rounded-md shadow-sm bg-gray-100 text-gray-600 cursor-not-allowed"
            readOnly
          />
        </div>

        {/* Beneficiary Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              Beneficiary <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="beneficiary"
              value={formData.beneficiary}
              onChange={handleChange}
              className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter beneficiary name"
              required
            />
          </div>
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              Account Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
              className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter account name"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter account number"
              required
            />
          </div>
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              Bank <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="bank"
              value={formData.bank}
              onChange={handleChange}
              className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter bank name"
              required
            />
          </div>
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              Amount (₦) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleAmountChange}
              className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter amount"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email address"
              required
            />
          </div>
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-md font-medium text-gray-700 mb-1">
            Description (Max 70 characters) <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            maxLength={70}
            className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Brief description of the expense"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.description.length}/70 characters
          </p>
        </div>

        {/* Supporting Documents */}
        <div>
          <label className="block text-md font-medium text-gray-700 mb-1">
            Supporting Documents <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name="supportingDocs"
            onChange={handleChange}
            className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            accept=".pdf,.jpg,.jpeg,.png"
            required
          />
        </div>

        {/* Approvers Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              Main Approver
            </label>
            {showApproverDropdown ? (
              <select
                name="mainApprover"
                value={formData.mainApprover}
                onChange={handleMainApproverChange}
                className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Main Approver</option>
                {approvers.map((approver, index) => (
                  <option key={index} value={approver}>
                    {approver}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={formData.mainApprover}
                className="w-full p-3 border rounded-md shadow-sm bg-gray-50"
                disabled
              />
            )}
          </div>

          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              Select an alternative Approver
            </label>
            <select
              multiple
              value={formData.additionalApprovers}
              onChange={handleAdditionalApprovers}
              className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {approvers
                .filter(approver => approver !== formData.mainApprover)
                .map((approver, index) => (
                  <option key={index} value={approver}>
                    {approver}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              isSubmitting ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-950 hover:bg-red-500'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>

      <SuccessToast
        message={toastMessage}
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
    </div>
  );
};

export default OperationalExpenseForm;