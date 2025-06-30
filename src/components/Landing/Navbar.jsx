// import { useState } from "react";
// import { useSearch } from "../../contexts/SearchContext";
// import searchIcon from "../../assets/Search.svg";
// import alarmIcon from "../../assets/alarmicon.svg";
// import dropdownArrow from "../../assets/vangle.svg";
// import userImage from "../../assets/userimage.svg";

// const Navbar = () => {
//   const { setSearchTerm } = useSearch()
//   const [isDropdownVisible, setIsDropdownVisible] = useState(false);

//   // Handle Search Input
//   const handleSearch = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//   };

//   // Toggle Dropdown Visibility
//   const toggleDropdown = () => {
//     setIsDropdownVisible((prev) => !prev);
//   };

//   return (
//     <div className="flex justify-between items-center w-full p-4 fixed top-0 left-48 bg-white shadow z-20">
//       {/* Search Input */}
//       <div className="relative w-full max-w-md">
//         <input
//           type="text"
//           onChange={handleSearch}
//           placeholder="Search tasks..."
//           className="w-full pl-10 pr-4 py-2 rounded-md border bg-gray-100 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <img
//           src={searchIcon}
//           alt="Search"
//           className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5"
//         />
//       </div>

//       {/* Notification and User Profile */}
//       <div className="flex gap-4 items-center">
//         {/* Notification Icon */}
//         <img src={alarmIcon} alt="Notifications" className="w-6 h-6 cursor-pointer" />

//         {/* User Profile Dropdown */}
//         <div
//           className="relative flex items-center w-[52px] h-[38px] cursor-pointer"
//           onClick={toggleDropdown}
//         >
//           <img src={userImage} alt="User" className="w-8 h-8 rounded-full" />
//           <img
//             src={dropdownArrow}
//             alt="Dropdown Arrow"
//             className="w-4 h-4 ml-1"
//           />
//           {isDropdownVisible && (
//             <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-30">
//               <div className="flex items-center p-2 border-b border-gray-200">
//                 <img
//                   src={userImage}
//                   alt="User"
//                   className="w-10 h-10 rounded-full"
//                 />
//                 <div className="ml-2">
//                   <p className="text-sm font-semibold">Username</p>
//                   <p className="text-xs text-gray-500">Role: UserRole</p>
//                 </div>
//               </div>
//               <div className="p-2">
//                 <p className="text-sm text-gray-700">Additional details here...</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Navbar;


// src/components/Navbar.jsx
import { useState } from "react";
import { useSearch } from "../../contexts/SearchContext";
import searchIcon from "../../assets/Search.svg";
import alarmIcon from "../../assets/alarmicon.svg";
import dropdownArrow from "../../assets/vangle.svg";
import userImage from "../../assets/userimage.svg";

const Navbar = () => {
  const { setSearchTerm } = useSearch();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  return (
    <div className="flex justify-between items-center w-full p-4 fixed top-0 left-48 bg-white shadow z-20">
      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          onChange={handleSearch}
          placeholder="Search tasks..."
          className="w-full pl-10 pr-4 py-2 rounded-md border bg-gray-100 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <img
          src={searchIcon}
          alt="Search"
          className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5"
        />
      </div>

      {/* Notification and User Profile */}
      <div className="flex gap-4 items-center">
        <img src={alarmIcon} alt="Notifications" className="w-6 h-6 cursor-pointer" />

        <div
          className="relative flex items-center w-[52px] h-[38px] cursor-pointer"
          onClick={toggleDropdown}
        >
          <img src={userImage} alt="User" className="w-8 h-8 rounded-full" />
          <img
            src={dropdownArrow}
            alt="Dropdown Arrow"
            className="w-4 h-4 ml-1"
          />
          {isDropdownVisible && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-30">
              <div className="flex items-center p-2 border-b border-gray-200">
                <img
                  src={userImage}
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-2">
                  <p className="text-sm font-semibold">Username</p>
                  <p className="text-xs text-gray-500">Role: UserRole</p>
                </div>
              </div>
              <div className="p-2">
                <p className="text-sm text-gray-700">Additional details here...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;