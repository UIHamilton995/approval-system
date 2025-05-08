import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { allTaskData } from '../data/tasks';
import { formatDateTime } from '../utils/tasksHelper';

const getStatusStyle = (status) => {
  const baseStyle = "px-4 py-2 border-b font-semibold ";
  const statusColors = {
    Pending: "text-yellow-500",
    Approved: "text-green-500",
    Rejected: "text-red-500"
  };
  return baseStyle + (statusColors[status] || "");
};

const ViewHistory = () => {
  const { hospitalName } = useParams();
  const [filteredTasks, setFilteredTasks] = useState([]);
  const decodedHospitalName = decodeURIComponent(hospitalName);

  useEffect(() => {
    // Filter tasks for the specific hospital
    const hospitalTasks = allTaskData.filter(
      task => task.hospitalName === decodedHospitalName
    );
    
    // Sort by date (most recent first)
    const sortedTasks = [...hospitalTasks].sort((a, b) => 
      new Date(b.requestDate) - new Date(a.requestDate)
    );
    
    setFilteredTasks(sortedTasks);
  }, [decodedHospitalName]);

  return (
    <div className="flex flex-col space-y-4 p-6">
      <div className="flex items-center justify-between">
        <Link 
          to="/roleDashboard" 
          className="flex items-center gap-2 text-blue-950 hover:text-blue-700 transition-colors"
        >
          <MdArrowBack size={24} />
          <span>Back to All Requests</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">
          Request History for {decodedHospitalName}
        </h1>
        
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <p className="text-gray-600">
            Total Requests: {filteredTasks.length}
          </p>
          <p className="text-gray-600">
            Approved: {filteredTasks.filter(task => task.status === "Approved").length}
          </p>
          <p className="text-gray-600">
            Pending: {filteredTasks.filter(task => task.status === "Pending").length}
          </p>
          <p className="text-gray-600">
            Rejected: {filteredTasks.filter(task => task.status === "Rejected").length}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-4 py-2 text-left border-b">Tracking Code</th>
                <th className="px-4 py-2 text-left border-b">Company</th>
                <th className="px-4 py-2 text-left border-b">Amount</th>
                <th className="px-4 py-2 text-left border-b">Date</th>
                <th className="px-4 py-2 text-left border-b">Time</th>
                <th className="px-4 py-2 text-left border-b">Reason</th>
                <th className="px-4 py-2 text-left border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => {
                const { date, time } = formatDateTime(task.requestDate);
                return (
                  <tr 
                    key={task.trackingCode}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2 border-b font-medium">
                      {task.trackingCode}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {task.companyName}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {task.approvalRequestAmount}
                    </td>
                    <td className="px-4 py-2 border-b">{date}</td>
                    <td className="px-4 py-2 border-b">{time}</td>
                    <td className="px-4 py-2 border-b">
                      {task.reasonForExclusion}
                    </td>
                    <td className={getStatusStyle(task.status)}>
                      {task.status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewHistory;