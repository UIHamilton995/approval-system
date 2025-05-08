import { useState } from 'react';

// Simple Alert Component
const Alert = ({ title, description, propName }) => (
  <div className={`p-4 rounded-lg ${propName}`}>
    <h3 className="font-semibold">{title}</h3>
    <p>{description}</p>
  </div>
);

const BillingRequestForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    requestTitle: '',
    unit: '',
    amount: '',
    paymentLink: '',
    recipientName: '',
    recipientEmail: '',
    description: '',
    mainApprover: '',
    additionalApprovers: [],
    supportingDocs: null
  });

  const [submitted, setSubmitted] = useState(false);

  const approvers = [
    "Dr. Tokunbo Alli",
    "Dr. Temitope Falaiye",
    "Favour Komoni",
    "Oluwatoyin Ogunmoyele",
    "Temilade Daniel-Owo"
  ];

  // Unit options
  const units = [
    "Exclusion Management",
    "MANCO",
    "FSI/Telco",
    "UP-Country", 
    "Commercial",
    "Distribution",
    "Retail/SME",
    "Energy",
    "Case Management",
    "Contact Centre",
    "Client Services"
  ];
  // Determine main approver based on amount
  const determineMainApprover = (amount) => {
    const numericAmount = parseInt(amount.replace(/,/g, ''), 10) || 0;
    
    if (numericAmount <= 500000) {
      return "Favour Komoni";
    } else if (numericAmount <= 5000000) {
      return "Dr. Temitope Falaiye";
    } else {
      return "Dr. Tokunbo Alli";
    }
  };

  // Handle amount change with formatting and approver selection
  const handleAmountChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^\d]/g, '');
    
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
  };

  // Handle additional approvers selection
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
    if (name === 'amount' || name === 'additionalApprovers') return;
    
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const amountWithoutCommas = formData.amount.replace(/,/g, '');
    
    const paymentRequest = {
      ...formData,
      amount: amountWithoutCommas,
      requestDate: new Date().toISOString(),
      status: 'Pending',
      requestId: `PR-${Math.random().toString(36).substr(2, 9)}`.toUpperCase()
    };

    onSubmit?.(paymentRequest);
    setSubmitted(true);

    setTimeout(() => {
      setFormData({
        requestTitle: '',
        unit: '',
        amount: '',
        paymentLink: '',
        recipientName: '',
        recipientEmail: '',
        description: '',
        mainApprover: '',
        additionalApprovers: [],
        supportingDocs: null
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-2">
        Billing Request Approval
      </h2>

      {submitted && (
        <Alert 
          title="Success!"
          description="Payment request has been submitted for approval."
          className="mb-6 bg-green-50 border border-green-200 text-green-800"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
           {/* Added Unit Field */}
           <div>
             <label className="block text-md font-medium text-gray-700 mb-1">
               Unit
             </label>
             <select
               name="unit"
               value={formData.unit}
               onChange={handleChange}
               className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               required
             >
               <option value="">Select Unit</option>
               {units.map((unit, index) => (
                 <option key={index} value={unit}>
                   {unit}
                 </option>
               ))}
             </select>
           </div>

               {/* Request Subject */}
                  <div>
                    <label className="block text-md font-medium text-gray-700 mb-1">
                      Request Subject
                    </label>
                    <input
                      type="text"
                      name="requestTitle"
                      value={formData.requestTitle}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter request subject"
                      required
                    />
                  </div>
                  
         {/* Amount and PayStack Link */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <label className="block text-md font-medium text-gray-700 mb-1">
               Amount (₦)
             </label>
             <input
               type="text"
               name="amount"
               value={formData.amount}
               onChange={handleAmountChange}
               className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               placeholder="0"
               required
             />
           </div>

           <div>
             <label className="block text-md font-medium text-gray-700 mb-1">
               PayStack Payment Link
             </label>
             <input
               type="url"
               name="paymentLink"
               value={formData.paymentLink}
               onChange={handleChange}
               className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               placeholder="https://paystack.com/pay/..."
               required
             />
           </div>
         </div>

         {/* Recipient Details */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <label className="block text-md font-medium text-gray-700 mb-1">
              Client Name
             </label>
             <input
               type="text"
               name="recipientName"
               value={formData.recipientName}
               onChange={handleChange}
               className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               placeholder="Enter client name"
               required
             />
           </div>

           <div>
             <label className="block text-md font-medium text-gray-700 mb-1">
               Client Email
             </label>
             <input
               type="email"
               name="recipientEmail"
               value={formData.recipientEmail}
               onChange={handleChange}
               className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               placeholder="Enter client email"
               required
             />
           </div>
         </div>

         {/* Description */}
         <div>
           <label className="block text-md font-medium text-gray-700 mb-1">
             Payment Description
           </label>
           <textarea
             name="description"
             value={formData.description}
             onChange={handleChange}
             rows={4}
             className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
             placeholder="Enter payment description"
             required
           />
         </div>

         {/* Supporting Documents */}
         <div>
           <label className="block text-md font-medium text-gray-700 mb-1">
             Supporting Documents
           </label>
           <input
             type="file"
             name="supportingDocs"
             onChange={handleChange}
             className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
             accept=".pdf,.doc,.docx,.xls,.xlsx"
           />
           <p className="text-sm text-gray-500 mt-1">
             Upload any relevant documents (invoices, receipts, etc.)
           </p>
         </div>

        {/* Approvers Section */}
        <div className="space-y-4">
          {/* Main Approver Display */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              Main Approver (Auto-selected)
            </label>
            <input
              type="text"
              value={formData.mainApprover}
              className="w-full p-3 border rounded-md shadow-sm bg-gray-50"
              disabled
            />
            <p className="text-sm text-gray-500 mt-1">
              Main approver is automatically selected based on request amount:
              <br />
              • ₦0 - ₦500,000: Favour Komoni
              <br />
              • ₦500,001 - ₦5,000,000: Dr. Temitope Falaiye
              <br />
              • Above ₦5,000,000: Dr. Tokunbo Alli
            </p>
          </div>

          {/* Additional Approvers Selection */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              Additional Approvers (Optional - Max 2)
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
            <p className="text-sm text-gray-500 mt-1">
              Hold Ctrl/Cmd to select up to 2 additional approvers
            </p>
          </div>

          {/* Selected Additional Approvers Display */}
          {formData.additionalApprovers.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm font-medium text-gray-700 mb-2">Selected Additional Approvers:</p>
              <div className="space-y-1">
                {formData.additionalApprovers.map((approver, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <span>• {approver}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-950 text-white rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Submit Credit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillingRequestForm;