import { Link } from 'react-router-dom';
import { FaUserMd, FaBuilding } from 'react-icons/fa';
// import { MdMiscellaneousServices } from 'react-icons/md';

const ExpenseTypeSelection = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Select Expense Type</h2>
        
        <div className="space-y-4">
          {/* Provider-Client Expense Option */}
          <Link 
            to="/roleDashboard/exclusions" 
            className="block group"
          >
            <div className="flex items-center p-4 border rounded-lg hover:ring-2 hover:ring-red-500 hover:border-transparent transition-all">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FaUserMd className="text-red-600 text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-red-600">Provider-Client Expense</h3>
                <p className="text-gray-600">Expenses related to client services and provider payments</p>
              </div>
            </div>
          </Link>
          
          {/* Operational Expense Option */}
          <Link 
            to="/roleDashboard/operational-expense" 
            className="block group"
          >
            <div className="flex items-center p-4 border rounded-lg hover:ring-2 hover:ring-red-500 hover:border-transparent transition-all">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaBuilding className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600">Operational Expense</h3>
                <p className="text-gray-600">Internal operational costs and business expenses</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTypeSelection;