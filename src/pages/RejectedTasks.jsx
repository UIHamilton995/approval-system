import { useState, useEffect } from "react";
import TaskModal from "../components/TaskModal";
import { useUser } from "../contexts/UserContext";
import { formatDateTime } from "../utils/tasksHelper";
import FilterDate from "../components/FilterDate";
import NextPreviousPage from "../components/NextPreviousPage";
import { useTasks } from "../contexts/TasksContext";
import units from '../data/units';

const getStatusStyle = (status) => {
  const baseStyle = "px-4 py-2 border-b font-semibold ";
  const statusColors = {
    Pending: "text-yellow-500",
    Approved: "text-green-500",
    Rejected: "text-red-500"
  };
  return baseStyle + (statusColors[status] || "");
};

const RejectedTasks = () => {
  const { user, isAdmin } = useUser();
  const { tasks, loading, error, fetchTasks } = useTasks();
  const [selectedTask, setSelectedTask] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedUnit, setSelectedUnit] = useState("");

  // Set initial unit selection based on user role
  useEffect(() => {
    if (user) {
      if (isAdmin()) {
        // Admin can view all units by default
        setSelectedUnit("All");
      } else {
        // Regular user is tied to their group_name unit
        setSelectedUnit(user.group_name || "");
      }
    }
  }, [user, isAdmin]);

  const handleDateFilter = (startDate, endDate) => {
    setDateFilter({ startDate, endDate });
    fetchTasks({ startDate, endDate });
    setCurrentPage(1);
  };

  const handleResetDateFilter = () => {
    setDateFilter(null);
    fetchTasks();
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Filter tasks based on status, selected unit, and date range
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = task.status === "Rejected";
    const matchesUnit = selectedUnit === "All" || task.unit === selectedUnit;
    const matchesDate = dateFilter 
      ? new Date(task.created_at) >= new Date(dateFilter.startDate) && 
        new Date(task.created_at) <= new Date(dateFilter.endDate)
      : true;
    return matchesStatus && matchesUnit && matchesDate;
  });

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const handleRowClick = (task) => {
    setSelectedTask({
      ...task,
      trackingCode: task.UniqueId,
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
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div>
            <p className="text-amber-600 font-semibold">Hi, {user.surname} {user.firstname}</p>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isAdmin() ? "Select Unit" : "Your Unit"}
            </label>
            {isAdmin() ? (
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="w-64 p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All Units</option>
                {units.map((unit, index) => (
                  <option key={index} value={unit}>{unit}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={selectedUnit}
                readOnly
                className="w-64 p-2 border rounded-md shadow-sm bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            )}
          </div>
          
          <FilterDate 
            onDateChange={handleDateFilter}
            onReset={handleResetDateFilter}
          />
        </div>
      </div>

      <h1 className="text-2xl text-left font-bold">
        {isAdmin() 
          ? selectedUnit === "Rejected Payment Requests" 
          : `Rejected Payment Requests`}
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-4 py-2 text-left border-b">Request ID</th>
              <th className="px-4 py-2 text-left border-b">Beneficiary Name</th>
              <th className="px-4 py-2 text-left border-b">Bank Acct.No.</th>
              <th className="px-4 py-2 text-left border-b">Amount (₦)</th>
              <th className="px-4 py-2 text-left border-b">Date</th>
              <th className="px-4 py-2 text-left border-b">Time</th>
              {isAdmin() && <th className="px-4 py-2 text-left border-b">Unit</th>}
              <th className="px-4 py-2 text-left border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              [...currentItems]
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((task) => {
                const { date, time } = formatDateTime(task.created_at);
                return (
                  <tr
                    key={task.id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleRowClick(task)}
                  >
                    <td className="px-4 py-2 border-b font-medium">{task.UniqueId}</td>
                    <td className="px-4 py-2 border-b">{task.provider}</td>
                    <td className="px-4 py-2 border-b">{task.provider_account_number}</td>
                    <td className="px-4 py-2 border-b">₦{task.approval_amount?.toLocaleString()}</td>
                    <td className="px-4 py-2 border-b">{date}</td>
                    <td className="px-4 py-2 border-b">{time}</td>
                    {isAdmin() && <td className="px-4 py-2 border-b">{task.unit}</td>}
                    <td className={getStatusStyle(task.status)}>{task.status}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={isAdmin() ? "8" : "7"} className="px-4 py-2 text-center border-b">
                  No rejected payment requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredTasks.length > itemsPerPage && (
        <NextPreviousPage
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-4"
        />
      )}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default RejectedTasks;