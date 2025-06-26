import { useState } from "react";
import TaskModal from "../components/TaskModal";
import SuccessToast from "../components/SuccessToast";
import { useUser } from "../contexts/UserContext";
import { formatDateTime } from "../utils/tasksHelper";
import { FaMoneyBillWave, FaCheckCircle, FaTimes } from "react-icons/fa";
import { BsBank2 } from "react-icons/bs";
import FilterDate from "../components/FilterDate";
import NextPreviousPage from "../components/NextPreviousPage";
import { useTasks } from "../contexts/TasksContext";
import units from '../data/units'

const getStatusStyle = (status) => {
  const baseStyle = "px-4 py-3 border-b font-semibold ";
  const statusColors = {
    Pending: "text-yellow-500",
    Approved: "text-green-500",
    Rejected: "text-red-500"
  };
  return baseStyle + (statusColors[status] || "");
};

const extractNumericalDigits = (value) => {
  if (typeof value === 'string') {
    const numericalValue = value.replace(/[^0-9.]/g, "");
    return parseFloat(numericalValue);
  }
  return value;
};

const Payroll = () => {
  const { user } = useUser();
  const { tasks, loading, error, fetchTasks } = useTasks();
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isDisburseModalOpen, setIsDisburseModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(1);
  const [transactionRef, setTransactionRef] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [filter, setFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Filter tasks based on status, unit, and date range
  const approvedTasks = tasks.filter((task) => {
    const matchesStatus = task.status === "Approved";
    const matchesUnit = filter === "All" || task.unit === filter;
    const matchesDate = dateFilter 
      ? new Date(task.created_at) >= new Date(dateFilter.startDate) && 
        new Date(task.created_at) <= new Date(dateFilter.endDate)
      : true;
    return matchesStatus && matchesUnit && matchesDate;
  });

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = approvedTasks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(approvedTasks.length / itemsPerPage);

  const handleDateFilter = (startDate, endDate) => {
    setDateFilter({ startDate, endDate });
    fetchTasks({ startDate, endDate });
    setCurrentPage(1);
    setSelectedTasks([]);
    setSelectAll(false);
  };

  const handleResetDateFilter = () => {
    setDateFilter(null);
    fetchTasks();
    setCurrentPage(1);
    setSelectedTasks([]);
    setSelectAll(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const generateTransactionRef = () => {
    return `TRX-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  };

  const handleRowClick = (task) => {
    setSelectedTask({
      ...task,
      trackingCode: task.id,
      providerName: task.provider,
      companyName: task.group_name,
      approvalRequestAmount: task.approval_amount,
      requestDate: task.created_at,
      status: task.status,
      mainApprover: task.main_approver,
      invoiceFile: task.invoice_file,
      fileType: task.file_type,
      providerBankName: task.ProviderBank,
      providerAccountNumber: task.provider_account_number,
      reasonForExclusion: task.Reason
    });
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const handleTaskSelection = (task) => {
    setSelectedTasks((prev) =>
      prev.includes(task) ? prev.filter((t) => t !== task) : [...prev, task]
    );
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedTasks(selectAll ? [] : [...currentItems]);
  };

  const handleDisburse = () => {
    setIsDisburseModalOpen(true);
    setTransactionRef(generateTransactionRef());
    setConfirmationStep(1);
  };

  const handleCloseDisburseModal = () => {
    setIsDisburseModalOpen(false);
    setSelectedBank("");
    setConfirmationStep(1);
    setIsAgreed(false);
  };

  const proceedToConfirmation = () => {
    if (selectedBank) {
      setConfirmationStep(2);
    }
  };

  const handlePay = () => {
    // Simulate API call
    setTimeout(() => {
      // Show success toast
      setToastMessage(`Payment of ${formattedTotalAmount} successfully disbursed!`);
      setShowToast(true);
      
      // Reset states
      setSelectedTasks([]);
      setIsDisburseModalOpen(false);
      setSelectedBank("");
      setSelectAll(false);
      setConfirmationStep(1);
      setIsAgreed(false);
    }, 1500);
  };

  const totalAmount = selectedTasks.reduce((sum, task) => {
    return sum + extractNumericalDigits(task.approval_amount || 0);
  }, 0);

  const formattedTotalAmount = `₦${totalAmount.toLocaleString()}`;

  if (!user) {
    return <div className="p-4">Please log in to view payment requests.</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col space-y-4 mt-2">
      {/* Success Toast Component */}
      <SuccessToast 
        message={toastMessage} 
        show={showToast} 
        duration={6000}
        onClose={() => setShowToast(false)} 
      />
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div>
            <p className="text-amber-600 font-semibold">Hi, {user.surname} {user.firstname}</p>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Choose Unit
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-64 p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Units</option>
              {units.map((unit, index) => (
                <option key={index} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
          
          <FilterDate 
            onDateChange={handleDateFilter}
            onReset={handleResetDateFilter}
          />
        </div>
      </div>

      <h1 className="text-2xl text-left font-bold">Approved Payment Requests</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-4 py-3 text-left border-b">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 rounded"
                />
              </th>
              <th className="px-4 py-3 text-left border-b font-medium text-gray-700">Batch Number</th>
              <th className="px-4 py-3 text-left border-b font-medium text-gray-700">Beneficiary Name</th>
              <th className="px-4 py-3 text-left border-b font-medium text-gray-700">Bank Account</th>
              <th className="px-4 py-3 text-left border-b font-medium text-gray-700">Amount</th>
              <th className="px-4 py-3 text-left border-b font-medium text-gray-700">Date</th>
              <th className="px-4 py-3 text-left border-b font-medium text-gray-700">Time</th>
              <th className="px-4 py-3 text-left border-b font-medium text-gray-700">Unit</th>
              <th className="px-4 py-3 text-left border-b font-medium text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((task) => {
                const { date, time } = formatDateTime(task.created_at);
                return (
                  <tr
                    key={task.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 border-b">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task)}
                        onChange={() => handleTaskSelection(task)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    </td>
                    <td 
                      className="px-4 py-3 border-b font-medium text-gray-900"
                      onClick={() => handleRowClick(task)}
                    >
                      {task.id}
                    </td>
                    <td 
                      className="px-4 py-3 border-b text-gray-700"
                      onClick={() => handleRowClick(task)}
                    >
                      {task.provider}
                    </td>
                    <td 
                      className="px-4 py-3 border-b text-gray-700"
                      onClick={() => handleRowClick(task)}
                    >
                      {task.provider_account_number}
                    </td>
                    <td 
                      className="px-4 py-3 border-b text-gray-700 font-medium"
                      onClick={() => handleRowClick(task)}
                    >
                      ₦{task.approval_amount?.toLocaleString()}
                    </td>
                    <td 
                      className="px-4 py-3 border-b text-gray-700"
                      onClick={() => handleRowClick(task)}
                    >
                      {date}
                    </td>
                    <td 
                      className="px-4 py-3 border-b text-gray-700"
                      onClick={() => handleRowClick(task)}
                    >
                      {time}
                    </td>
                    <td 
                      className="px-4 py-3 border-b text-gray-700"
                      onClick={() => handleRowClick(task)}
                    >
                      {task.unit}
                    </td>
                    <td 
                      className={getStatusStyle(task.status)}
                      onClick={() => handleRowClick(task)}
                    >
                      {task.status}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="px-4 py-3 text-center border-b text-gray-500">
                  No approved tasks available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <NextPreviousPage
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="mt-4"
      />

      {selectedTasks.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleDisburse}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            <FaMoneyBillWave className="text-white" />
            Disburse Funds
          </button>
        </div>
      )}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={handleCloseModal}
          onDisburse={handleDisburse}
          enableDisburse={true}  
        />
      )}

      {isDisburseModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {confirmationStep === 1 ? "Fund Disbursement" : "Confirm Transaction"}
              </h2>
              <button
                onClick={handleCloseDisburseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            {confirmationStep === 1 ? (
              <>
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-blue-800">{formattedTotalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of Transactions:</span>
                    <span className="font-medium">{selectedTasks.length}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Bank Channel
                  </label>
                  <div className="relative">
                    <BsBank2 className="absolute left-3 top-3 text-gray-400" />
                    <select
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                    >
                      <option value="">Select bank channel</option>
                      <option value="GTBank">GTBank - Corporate Account</option>
                      <option value="First Bank">First Bank - Bulk Payments</option>
                      <option value="Providus">Providus - Direct Debit</option>
                      <option value="Zenith">Zenith - Dollar Account</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCloseDisburseModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={proceedToConfirmation}
                    disabled={!selectedBank}
                    className={`px-4 py-2 rounded-md text-white ${selectedBank ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
                  >
                    Continue
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                  <div className="flex items-center text-yellow-700 mb-2">
                    <FaCheckCircle className="mr-2" />
                    <span className="font-medium">Transaction Summary</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank Channel:</span>
                      <span className="font-medium">{selectedBank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold">{formattedTotalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transactions:</span>
                      <span>{selectedTasks.length} payments</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reference:</span>
                      <span className="font-mono text-blue-600">{transactionRef}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-4">
                    You are about to initiate a bulk payment transaction. Please confirm all details are correct before proceeding.
                  </p>
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="confirmCheckbox"
                      checked={isAgreed}
                      onChange={(e) => setIsAgreed(e.target.checked)}
                      className="mt-1 mr-2"
                    />
                    <label htmlFor="confirmCheckbox" className="text-sm text-gray-700">
                      I confirm that all payment details are accurate and I am authorized to perform this transaction.
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setConfirmationStep(1)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePay}
                    disabled={!isAgreed}
                    className={`px-4 py-2 text-white rounded-md flex items-center ${
                      isAgreed ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <FaCheckCircle className="mr-2" />
                    Confirm Payment
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll;