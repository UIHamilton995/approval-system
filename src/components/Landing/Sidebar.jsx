import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/leadway-health-For-Solid-BGs.png";
import { MdAccessTimeFilled } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import { SiTicktick } from "react-icons/si";
import { BsSendPlus } from "react-icons/bs";
import { BiMessageDetail } from "react-icons/bi";
import { FaMoneyBillWave } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();

  const NavItem = ({ to, icon: Icon, label, exact = false }) => {
    const isActive = exact 
      ? location.pathname === to
      : location.pathname.startsWith(to);

    return (
      <NavLink
        to={to}
        className={`block transition-colors duration-200 ${
          isActive ? "bg-[#C61531]" : "hover:bg-[#C61531]"
        }`}
      >
        <div className="mt-2 text-white font-bold flex px-10 cursor-pointer p-2 group items-center">
          <Icon className={`mt-1 ${
            isActive ? "text-white scale-110" : "text-gray-300"
          } transition-all duration-200`} />
          <p className={`ml-2 ${
            isActive ? "text-white" : "text-gray-300"
          } transition-colors duration-200`}>
            {label}
          </p>
        </div>
      </NavLink>
    );
  };

  const IconWithBg = ({ icon: Icon, bgColor }) => (
    <div className={`${bgColor} rounded-full p-1`}>
      <Icon size={14} />
    </div>
  );

  return (
    <div className="bg-blue-950 text-white w-48 border min-h-screen fixed top-0 left-0">
      {/* Header Image */}
      <div className="flex justify-center mb-4">
        <img src={logo} alt="Logo" className="w-48 h-18" />
      </div>

      {/* Tasks Section */}
      <div className="mb-6 border-b border-blue-900 pb-2">
        <NavItem 
          to="/roleDashboard/" 
          icon={BsSendPlus} className="font-extrabold"
          label="REQUESTS"
          exact
        />
        <NavItem 
          to="/roleDashboard/pending" 
          icon={(props) => <IconWithBg icon={MdAccessTimeFilled} bgColor="bg-yellow-600" {...props} />}
          label="Pending"
        />
        <NavItem 
          to="/roleDashboard/approved" 
          icon={(props) => <IconWithBg icon={SiTicktick} bgColor="bg-green-600" {...props} />}
          label="Approved"
        />
        <NavItem 
          to="/roleDashboard/rejected" 
          icon={(props) => <IconWithBg icon={ImCancelCircle} bgColor="bg-red-600" {...props} />}
          label="Rejected"
        />
      </div>

      {/* Billings Section */}
      <div className="border-b border-blue-900 pb-2">
        <NavItem 
          to="/roleDashboard/all-billing-requests" 
          icon={FaMoneyBillWave}
          label="BILLING"
        />
      </div>

      {/* Payments Section */}
      <div className="mb-4 border-b border-blue-900 pb-4">
        <p className="text-gray-300 px-10 text-md font-bold uppercase mt-4">FINANCE</p>
        <NavItem 
          to="/roleDashboard/finance/payroll" 
          icon={SiTicktick}
          label="Payroll"
        />
        <NavItem 
          to="/roleDashboard/finance/reports" 
          icon={MdAccessTimeFilled}
          label="Reports"
        />
      </div>

      {/* Messages Section */}
      <div className="mb-6">
        <NavItem 
          to="/roleDashboard/messages" 
          icon={BiMessageDetail}
          label="MESSAGES"
        />
      </div>
    </div>
  );
};

export default Sidebar;