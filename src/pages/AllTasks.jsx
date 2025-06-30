import { useState } from "react";
import { Link } from "react-router-dom";
import { MdAddCircle, MdRefresh } from "react-icons/md";
import TaskModal from "../components/TaskModal";
import { useUser } from "../contexts/UserContext";
import { useSearch } from "../contexts/SearchContext";
import { formatDateTime } from "../utils/tasksHelper";
import FilterDate from "../components/FilterDate";
import NextPreviousPage from "../components/NextPreviousPage";
import { useTasks } from "../contexts/TasksContext";
import units from '../data/units'

const getStatusStyle = (status) => {
  const baseStyle = "px-4 py-2 border-b font-semibold ";
  const statusColors = {
    Pending: "text-yellow-500",
    Approved: "text-green-500",
    Rejected: "text-red-500"
  };
  return baseStyle + (statusColors[status] || "");
};

const AllTasks = () => {
  const { user, isAdmin } = useUser();
  const { searchTerm } = useSearch();
  const { tasks, loading, error, fetchTasks } = useTasks();
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState(isAdmin() ? "All" : user?.group_name || "All");
  const [dateFilter, setDateFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchTasks(dateFilter);
      setCurrentPage(1);
    } finally {
      setRefreshing(false);
    }
  };

  // Enhanced filtering with search term
  const filteredTasks = tasks.filter(task => {
    // Unit filter
    const matchesUnit = filter === "All" || task.unit === filter;
    
    // Search term filter - checks multiple fields
    const matchesSearch = !searchTerm || 
      task.UniqueId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.provider_account_number.includes(searchTerm) ||
      task.approval_amount?.toString().includes(searchTerm) ||
      task.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.unit.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesUnit && matchesSearch;
  });

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
              Your Unit
            </label>
            {isAdmin() ? (
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
            ) : (
              <div className="relative">
                <select
                  value={user.group_name || ''}
                  disabled
                  className="w-64 p-2 border rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                >
                  <option>{user.group_name || 'No unit assigned'}</option>
                </select>
              </div>
            )}
          </div>
          
          <FilterDate 
            onDateChange={handleDateFilter}
            onReset={handleResetDateFilter}
          />
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 w-36 bg-green-600 text-white p-2 rounded hover:bg-green-700 mt-8"
            disabled={refreshing || loading}
          >
            <MdRefresh className={refreshing ? "animate-spin" : ""} /> 
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </button>

          <Link to="/roleDashboard/expense-type-selection">
            <button className="flex items-center gap-2 mr-4 w-48 bg-blue-950 text-white p-2 rounded hover:bg-red-700 mt-8">
              <MdAddCircle /> Payment Request
            </button>
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl text-left font-bold">All Payment Requests</h1>
        <p className="text-sm text-gray-500">
          {refreshing ? "Updating..." : `Last updated: ${new Date().toLocaleTimeString()}`}
        </p>
      </div>

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
              .sort((a, b) => new Date (b.created_at) - new Date (a.created_at))
              .map((task) => {
                const { date, time } = formatDateTime(task.created_at);

                // Convert 24-hour time to AM/PM format
                const formatTimeToAMPM = (timeStr) => {
                  const [hours, minutes] = timeStr.split(':');
                  const hour = parseInt(hours, 10);
                  const suffix = hour >= 12 ? 'PM' : 'AM';
                  const hour12 = hour % 12 || 12; // Convert 0 to 12formatTimeToAMPM 
                  const formattedHour = hour12.toString().padStart(2, 0) // Add leading zero for single-digit hours
                  return `${formattedHour}:${minutes} ${suffix}`;
                };

                return (
                  <tr
                    key={task.UniqueId}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleRowClick(task)}
                  >
                    <td className="px-4 py-2 border-b font-medium">{task.UniqueId}</td>
                    <td className="px-4 py-2 border-b">{task.provider}</td>
                    <td className="px-4 py-2 border-b">{task.provider_account_number}</td>
                    <td className="px-4 py-2 border-b">₦{task.approval_amount?.toLocaleString()}</td>
                    <td className="px-4 py-2 border-b">{date}</td>
                    <td className="px-4 py-2 border-b">{formatTimeToAMPM(time)}</td>
                    {isAdmin() && <td className="px-4 py-2 border-b">{task.unit}</td>}
                    <td className={getStatusStyle(task.status)}>{task.status}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={isAdmin() ? "8" : "7"} className="px-4 py-2 text-center border-b">
                  No payment requests found
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

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AllTasks;