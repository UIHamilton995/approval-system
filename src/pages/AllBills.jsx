import { useState } from 'react';
import { Link } from "react-router-dom";
import { MdAddCircle } from "react-icons/md";
import BillingRequestModal from '../components/BillingRequestModal';
import units from '../data/units'

// Utility function for date formatting
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }),
    time: date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
};

// Updated billing data to include department
export const billingsData = [
  {
    requestId: "PR-X8H2Y9K4M",
    requestTitle: "Annual Software License Renewal",
    recipientName: "Tech Solutions Ltd",
    recipientEmail: "billing@techsolutions.com",
    amount: "₦450,000",
    paymentLink: "https://paystack.com/pay/techsolutions2025",
    description: "Renewal of enterprise software licenses for 2025 fiscal year",
    approver: "Dr. Tokunbo Alli",
    requestDate: "2025-01-15T10:30:00Z",
    status: "Pending",
    supportingDocs: null,
    unit: "Commercial"
  },
  {
    requestId: "PR-M7N5P2Q8R",
    requestTitle: "Office Equipment Purchase",
    recipientName: "Global Office Supplies",
    recipientEmail: "sales@globalsupplies.com",
    amount: "₦275,000",
    paymentLink: "https://paystack.com/pay/officesupplies",
    description: "Purchase of new office equipment including printers and scanners",
    approver: "Dr. Temitope Falaiye",
    requestDate: "2025-01-12T14:20:00Z",
    status: "Approved",
    supportingDocs: null,
    unit: "Distribution"
  },
  {
    requestId: "PR-K9L4J7H2P",
    requestTitle: "Training Program Payment",
    recipientName: "Professional Training Corp",
    recipientEmail: "finance@protraining.com",
    amount: "₦850,000",
    paymentLink: "https://paystack.com/pay/training2025",
    description: "Staff training program for Q1 2025",
    approver: "Favour Komoni",
    requestDate: "2025-01-10T09:15:00Z",
    status: "Rejected",
    supportingDocs: null,
    unit: "Exclusion Management"
  },
  {
    requestId: "PR-W3E6R9T5Y",
    requestTitle: "Marketing Campaign Fees",
    recipientName: "Digital Marketing Pro",
    recipientEmail: "accounts@dmpro.com",
    amount: "₦650,000",
    paymentLink: "https://paystack.com/pay/marketingq1",
    description: "Q1 2025 Digital Marketing Campaign Execution",
    approver: "Oluwatoyin Ogunmoyele",
    requestDate: "2025-01-08T16:45:00Z",
    status: "Pending",
    supportingDocs: null,
    unit: "Retail/SME"
  },
  {
    requestId: "PR-B8V5C2X9Z",
    requestTitle: "Maintenance Service Contract",
    recipientName: "Facility Masters",
    recipientEmail: "payments@facilitymasters.com",
    amount: "₦320,000",
    paymentLink: "https://paystack.com/pay/maintenance25",
    description: "Monthly facility maintenance service contract renewal",
    approver: "Temilade Daniel-Owo",
    requestDate: "2025-01-05T11:30:00Z",
    status: "Approved",
    supportingDocs: null,
    unit: "Case Management"
  }
];

const getStatusStyle = (status) => {
  const baseStyle = "px-4 py-2 border-b font-semibold ";
  const statusColors = {
    Pending: "text-yellow-500",
    Approved: "text-green-500",
    Rejected: "text-red-500"
  };
  return baseStyle + (statusColors[status] || "");
};

const AllBills = () => {
  const [selectedBill, setSelectedBill] = useState(null);
  const [filter, setFilter] = useState("All");

  const handleRowClick = (bill) => {
    setSelectedBill(bill);
  };

  const handleCloseModal = () => {
    setSelectedBill(null);
  };

  const handleDeleteBill = () => {
    console.log("Deleting bill:", selectedBill?.requestId);
    setSelectedBill(null);
  };

  const handleApproveBill = () => {
    console.log("Approving bill:", selectedBill?.requestId);
    setSelectedBill(null);
  };

  const handleRevalidateBill = () => {
    console.log("Revalidating bill:", selectedBill?.requestId);
    setSelectedBill(null);
  };

  // Filter bills based on selected department
  const filteredBills = filter === "All" 
    ? billingsData 
    : billingsData.filter(bill => bill.unit === filter);

  return (
    <div className="flex flex-col space-y-4 mt-10">
      <div className="flex justify-between items-center">
        {/* Department Filter */}
        <div className="ml-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit Filter
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-64 p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Units</option>
            {units.map((unit, index) => (
              <option key={index} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        <Link to="/roleDashboard/billing-request">
          <button
            type="button"
            className="flex items-center gap-2 mr-4 w-48 bg-blue-950 text-white p-2 rounded hover:bg-red-700 transition-colors"
          >
            <MdAddCircle />
            New Billing Request
          </button>
        </Link>
      </div>

      <h1 className="text-2xl text-left font-bold mt-4">All Billing Requests</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-4 py-2 text-left border-b">Request ID</th>
              <th className="px-4 py-2 text-left border-b">Title</th>
              <th className="px-4 py-2 text-left border-b">Client Name</th>
              <th className="px-4 py-2 text-left border-b">Amount</th>
              <th className="px-4 py-2 text-left border-b">Date</th>
              <th className="px-4 py-2 text-left border-b">Time</th>
              <th className="px-4 py-2 text-left border-b">Approver</th>
              <th className="px-4 py-2 text-left border-b">Unit</th>
              <th className="px-4 py-2 text-left border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill) => {
              const { date, time } = formatDateTime(bill.requestDate);
              return (
                <tr
                  key={bill.requestId}
                  className="hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(bill)}
                >
                  <td className="px-4 py-2 border-b font-medium">{bill.requestId}</td>
                  <td className="px-4 py-2 border-b">{bill.requestTitle}</td>
                  <td className="px-4 py-2 border-b">{bill.recipientName}</td>
                  <td className="px-4 py-2 border-b">{bill.amount}</td>
                  <td className="px-4 py-2 border-b">{date}</td>
                  <td className="px-4 py-2 border-b">{time}</td>
                  <td className="px-4 py-2 border-b">{bill.approver}</td>
                  <td className="px-4 py-2 border-b">{bill.unit}</td>
                  <td className={getStatusStyle(bill.status)}>{bill.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedBill && (
        <BillingRequestModal
          billingData={selectedBill}
          onClose={handleCloseModal}
          onDelete={handleDeleteBill}
          onApprove={handleApproveBill}
          onRevalidate={handleRevalidateBill}
        />
      )}
    </div>
  );
};

export default AllBills;