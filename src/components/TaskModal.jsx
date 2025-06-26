import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdClose, MdDelete, MdMoreVert, MdHistory, MdDownload, MdRemoveRedEye } from 'react-icons/md';
import { FaCheck, FaHospital, FaBuilding, FaPiggyBank, FaMoneyBillWave, FaIdCard, FaPercentage, FaPhone, FaEnvelope } from 'react-icons/fa';
import { BsBank2 } from 'react-icons/bs';
import toast from 'react-hot-toast';
import { useUser } from "../contexts/UserContext";

const TaskModal = ({ task, onClose, onDelete, onApprove, onRevalidate, onDisburse, enableDisburse = false }) => {
  const { user, isAdmin } = useUser();
  const [isHospitalMenuOpen, setIsHospitalMenuOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  if (!task) return null;
  const isOperational = task.request_type === "Operational";

  const toggleHospitalMenu = () => {
    setIsHospitalMenuOpen(!isHospitalMenuOpen);
  };

  const handleViewHistory = () => {
    onClose();
    navigate(`/roleDashboard/history/${encodeURIComponent(task.provider)}`);
  };

  const handleViewFile = () => {
    if (!task.DocumentBase64) return;

    try {
      // Convert base64 to Blob
      const byteCharacters = atob(task.DocumentBase64);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }

      // Get MIME type with fallback
      const mimeTypeMap = {
        'PDF': 'application/pdf',
        'JPG': 'image/jpeg',
        'JPEG': 'image/jpeg',
        'PNG': 'image/png',
        // Add other MIME types as needed
      };
      const mimeType = mimeTypeMap[task.file_type.toUpperCase()] || 'application/octet-stream';

      const blob = new Blob(byteArrays, { type: mimeType });
      const url = URL.createObjectURL(blob);

      // Open in new window and revoke URL after
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error viewing file:', error);
      toast.error('Failed to view file. Check console for details.');
    }
  };

  const handleDownloadFile = () => {
    if (!task.DocumentBase64) return;
    const mimeType = getMimeType(task.file_type);
    const byteCharacters = atob(task.DocumentBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = task.invoice_file || 'file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getMimeType = (fileType) => {
    switch (fileType.toUpperCase()) {
      case 'PDF':
        return 'application/pdf';
      case 'PNG':
        return 'image/png';
      case 'JPG':
      case 'JPEG':
        return 'image/jpeg';
      default:
        return 'application/octet-stream';
    }
  };

  const shouldDisplay = (value) => {
    return value !== undefined && value !== null && value !== "" && value !== 0;
  };

  const displayTask = {
    trackingCode: task.UniqueId || "N/A",
    status: task.status || "N/A",
    providerName: task.provider || "N/A",
    companyName: task.group_name || "N/A",
    approvalRequestAmount: task.approval_amount ? `₦${task.approval_amount.toLocaleString()}` : "N/A",
    providerBankName: task.provider_bank || "N/A",
    providerAccountNumber: task.provider_account_number || "N/A",
    providerAccountName: task.provider_account_name || "N/A",
    providerContact1: task.provider_contact1 || "N/A",
    providerEmail: task.provider_email || "N/A",
    invoiceFile: task.invoice_file || "N/A",
    fileType: task.file_type || "N/A",
    fileSize: task.file_size || 0,
    documentBase64: task.DocumentBase64 || null,
    reasonForExclusion: task.reason || "N/A",
    requester: task.createdby || "N/A",
    requestDate: task.created_at || "N/A",
  };

  const handleAction = async (action) => {
    setIsProcessing(true);
    try {
      const status = action === "approve" ? "Approved" : "Rejected";
      const response = await fetch("https://prognosis-api.leadwayhealth.com/api/HealthApproval/InsertHealthApprovalPaymentUpdate",  {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          id: task.id,
          Status: status,
          ApproverEmail: user.email,
          ApproverName: `${user.surname} ${user.firstname}`
        })
      });
      if (!response.ok) {
        throw new Error(`Failed to ${action} task`);
      }
      const result = await response.json();
      if (result.status !== 200) {
        throw new Error(result.message || `Failed to ${action} task`);
      }
      toast.success(`Request successfully ${status.toLowerCase()}!`);
      if (action === "approve" && onApprove) onApprove();
      if (action === "reject" && onRevalidate) onRevalidate();
      onClose();
    } catch (error) {
      toast.error(error.message || `An error occurred while ${action}ing the request`);
      console.error("Action error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed h-screen inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-blue-950 text-white p-6 rounded-t-xl flex justify-between items-center sticky top-0 z-10">
          {isAdmin() && (
            <button
              onClick={onDelete}
              className="hover:bg-red-500 p-2 rounded-lg transition-colors duration-200 group"
              disabled={isProcessing}
            >
              <MdDelete size={24} className="group-hover:animate-bounce" />
            </button>
          )}
          <h2 className="text-xl font-semibold">Payment Request Details</h2>
          <button
            onClick={onClose}
            className="hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200 group"
            disabled={isProcessing}
          >
            <MdClose size={24} className="group-hover:rotate-180 transition-transform duration-300" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <span className={`px-4 py-2 rounded-full font-semibold text-sm ${displayTask.status === "Pending"
              ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
              : displayTask.status === "Approved"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"}`}
            >
              {displayTask.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {isOperational ? (
                <>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <FaBuilding className="text-blue-950 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Beneficiary/Company</h3>
                        <p className="text-lg font-semibold">{displayTask.providerName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <FaPiggyBank className="text-blue-950 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Account Name</h3>
                        <p className="text-lg font-semibold">{displayTask.providerAccountName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <FaPhone className="text-blue-950 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                        <p className="text-lg font-semibold">{displayTask.providerContact1}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <FaEnvelope className="text-blue-950 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p className="text-lg font-semibold">{displayTask.providerEmail}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 relative">
                      <FaHospital className="text-blue-950 mt-1 flex-shrink-0" size={20} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-500">Provider Name</h3>
                          <div className="relative">
                            <button
                              onClick={toggleHospitalMenu}
                              className="hover:bg-gray-200 rounded-full p-1 transition-colors"
                              disabled={isProcessing}
                            >
                              <MdMoreVert size={20} className="text-gray-600" />
                            </button>
                            {isHospitalMenuOpen && (
                              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                                <button
                                  onClick={handleViewHistory}
                                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                                >
                                  <MdHistory className="text-blue-950" size={20} />
                                  View History
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-lg font-semibold">{displayTask.providerName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <FaBuilding className="text-blue-950 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Company/Group</h3>
                        <p className="text-lg font-semibold">{displayTask.companyName}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <BsBank2 className="text-blue-950 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Bank Name</h3>
                    <p className="text-lg font-semibold">{displayTask.providerBankName}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <FaPiggyBank className="text-blue-950 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Account Number</h3>
                    <p className="text-lg font-semibold">{displayTask.providerAccountNumber}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaPiggyBank className="text-blue-950 mt-1 flex-shrink-0" size={20} />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-500">Invoice File</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold">{displayTask.invoiceFile}</p>
                        <p className="text-sm text-gray-500">{displayTask.fileType} - {(displayTask.fileSize / 1024).toFixed(2)} KB</p>
                      </div>
                      <div className="flex gap-2">
                        {displayTask.documentBase64 && (
                          <>
                            <button
                              onClick={handleViewFile}
                              className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                              title="View file"
                            >
                              <MdRemoveRedEye className="text-blue-600" size={20} />
                            </button>
                            <button
                              onClick={handleDownloadFile}
                              className="p-2 bg-green-50 rounded-full hover:bg-green-100 transition-colors"
                              title="Download file"
                            >
                              <MdDownload className="text-green-600" size={20} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <FaMoneyBillWave className="text-blue-950 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Request Amount</h3>
                  <p className="text-lg font-semibold">{displayTask.approvalRequestAmount}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-500">Reason for Request</h3>
                  <p className="text-lg font-semibold">{displayTask.reasonForExclusion}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Request ID and Date */}
          <div className="flex justify-between text-sm text-gray-500">
            <span>Request ID: {displayTask.trackingCode}</span>
            <span>Created by: {displayTask.requester}</span>
            <span>Date: {new Date(displayTask.requestDate).toLocaleDateString()}</span>
            {isOperational && <span>Type: Operational</span>}
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="border-t p-6 bg-gray-50 rounded-b-xl sticky bottom-0">
          <div className="flex justify-end gap-4">
            {displayTask.status === "Pending" && (
              <>
                {isAdmin() && (
                  <>
                    <button
                      onClick={() => handleAction("approve")}
                      disabled={isProcessing}
                      className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white transition-colors duration-200 group ${isProcessing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'}`}
                    >
                      <FaCheck className="group-hover:scale-110 transition-transform duration-200" />
                      {isProcessing ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleAction("reject")}
                      disabled={isProcessing}
                      className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white transition-colors duration-200 group ${isProcessing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'}`}
                    >
                      <MdDelete className="group-hover:scale-110 transition-transform duration-200" />
                      {isProcessing ? 'Processing...' : 'Reject'}
                    </button>
                  </>
                )}
                {!isAdmin() && (
                  <div className="text-gray-500 italic">Only administrators can approve or reject requests</div>
                )}
              </>
            )}
            {displayTask.status === "Approved" && enableDisburse && isAdmin() && (
              <button
                onClick={onDisburse}
                disabled={isProcessing}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white transition-colors duration-200 group ${isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                <FaMoneyBillWave className="group-hover:scale-110 transition-transform duration-200" />
                {isProcessing ? 'Processing...' : 'Disburse Fund(s)'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;