// import { useState } from "react";
// import { useUser } from "../contexts/userContexts";
// import { formatDateTime } from "../utils/tasksHelper";
// import FilterDate from "../components/FilterDate";
// import NextPreviousPage from "../components/NextPreviousPage";
// import ReportModal from "../components/ReportModal";
// import reportData from "../data/reportData";
// import { getStatusColor } from "../utils/getStatusColor";

// const units = [
//   "All Units",
//   "Exclusion Management",
//   "MANCO",
//   "FSI/Telco",
//   "UP-Country",
//   "Commercial",
//   "Distribution",
//   "Retail/SME",
//   "Energy",
//   "Case Management",
//   "Contact Centre",
//   "Client Services"
// ];

// const Reports = () => {
//   const { user } = useUser();
//   const [selectedUnit, setSelectedUnit] = useState("All Units");
//   const [dateFilter, setDateFilter] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedReport, setSelectedReport] = useState(null);
//   const [itemsPerPage] = useState(8);

//   // Filter reports based on unit and date range
//   const filteredReports = reportData.filter((report) => {
//     const matchesUnit = selectedUnit === "All Units" || report.unit === selectedUnit;
//     const matchesDate = dateFilter 
//       ? new Date(report.datePrepared) >= new Date(dateFilter.startDate) && 
//         new Date(report.datePrepared) <= new Date(dateFilter.endDate)
//       : true;
//     return matchesUnit && matchesDate;
//   });

//   // Pagination calculations
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

//   const handleDateFilter = (startDate, endDate) => {
//     setDateFilter({ startDate, endDate });
//     setCurrentPage(1);
//   };

//   const handleResetDateFilter = () => {
//     setDateFilter(null);
//     setCurrentPage(1);
//   };

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleUnitChange = (unit) => {
//     setSelectedUnit(unit);
//     setCurrentPage(1);
//   };

//   const handleRowClick = (report) => {
//     setSelectedReport(report);
//   };

//   const handleCloseModal = () => {
//     setSelectedReport(null);
//   };

//   if (!user) {
//     return <div className="p-4">Please log in to view reports.</div>;
//   }

//   return (
//     <div className="flex flex-col space-y-4 mt-2">
//       <div className="flex justify-between items-center">
//         <div className="flex space-x-4">
//           <div>
//             <p className="text-amber-600 font-semibold">Hi, {user.surname} {user.firstname}</p>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Choose Unit
//             </label>
//             <select
//               value={selectedUnit}
//               onChange={(e) => handleUnitChange(e.target.value)}
//               className="w-64 p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               {units.map((unit, index) => (
//                 <option key={index} value={unit}>{unit}</option>
//               ))}
//             </select>
//           </div>
          
//           <FilterDate 
//             onDateChange={handleDateFilter}
//             onReset={handleResetDateFilter}
//           />
//         </div>
//       </div>

//       <h1 className="text-2xl text-left font-bold mt-4">Financial Reports</h1>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200 shadow-md">
//           <thead className="bg-gray-300">
//             <tr>
//               <th className="px-4 py-2 text-left border-b">Report ID</th>
//               <th className="px-4 py-2 text-left border-b">Unit</th>
//               <th className="px-4 py-2 text-left border-b">Type</th>
//               <th className="px-4 py-2 text-left border-b">Beneficiary</th>
//               <th className="px-4 py-2 text-left border-b">Amount</th>
//               <th className="px-4 py-2 text-left border-b">Date</th>
//               <th className="px-4 py-2 text-left border-b">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentItems.length > 0 ? (
//               currentItems.map((report) => {
//                 const { date } = formatDateTime(report.datePrepared);
//                 return (
//                   <tr
//                     key={report.id}
//                     className="hover:bg-gray-50 cursor-pointer transition-colors"
//                     onClick={() => handleRowClick(report)}
//                   >
//                     <td className="px-4 py-3 border-b font-medium">{report.id}</td>
//                     <td className="px-4 py-3 border-b">{report.unit}</td>
//                     <td className="px-4 py-3 border-b">{report.reportType}</td>
//                     <td className="px-4 py-3 border-b">{report.beneficiary}</td>
//                     <td className="px-4 py-3 border-b">₦{report.amount.toLocaleString()}</td>
//                     <td className="px-4 py-3 border-b">{date}</td>
//                     <td className="px-4 py-3 border-b">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
//                         {report.status}
//                       </span>
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan="7" className="px-4 py-2 text-center border-b">
//                   No reports found for the selected criteria
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <NextPreviousPage
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={handlePageChange}
//         className="mt-4"
//       />

//       <ReportModal 
//         report={selectedReport} 
//         onClose={handleCloseModal} 
//       />
//     </div>
//   );
// };

// export default Reports;

import { useState, useRef } from "react";
import { useUser } from "../contexts/userContexts";
import { formatDateTime } from "../utils/tasksHelper";
import FilterDate from "../components/FilterDate";
import NextPreviousPage from "../components/NextPreviousPage";
import ReportModal from "../components/ReportModal";
import reportData from "../data/reportData";
import { getStatusColor } from "../utils/getStatusColor";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import units from '../data/units'

const Reports = () => {
  const { user } = useUser();
  const [selectedUnit, setSelectedUnit] = useState("All Units");
  const [dateFilter, setDateFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [itemsPerPage] = useState(8);
  const [isPrinting, setIsPrinting] = useState(false);
  const tableRef = useRef(null);

  // Filter reports based on unit and date range
  const filteredReports = reportData.filter((report) => {
    const matchesUnit = selectedUnit === "All Units" || report.unit === selectedUnit;
    const matchesDate = dateFilter 
      ? new Date(report.datePrepared) >= new Date(dateFilter.startDate) && 
        new Date(report.datePrepared) <= new Date(dateFilter.endDate)
      : true;
    return matchesUnit && matchesDate;
  });

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const handleDateFilter = (startDate, endDate) => {
    setDateFilter({ startDate, endDate });
    setCurrentPage(1);
  };

  const handleResetDateFilter = () => {
    setDateFilter(null);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleUnitChange = (unit) => {
    setSelectedUnit(unit);
    setCurrentPage(1);
  };

  const handleRowClick = (report) => {
    setSelectedReport(report);
  };

  const handleCloseModal = () => {
    setSelectedReport(null);
  };

  const handlePrint = async () => {
    if (!tableRef.current) return;
    
    setIsPrinting(true);
    
    try {
      // Create a title for the PDF
      const title = document.createElement('div');
      title.innerHTML = `<h2>Financial Reports - ${selectedUnit}</h2>`;
      if (dateFilter) {
        title.innerHTML += `<p>Date Range: ${new Date(dateFilter.startDate).toLocaleDateString()} - ${new Date(dateFilter.endDate).toLocaleDateString()}</p>`;
      }
      document.body.appendChild(title);
      
      const titleCanvas = await html2canvas(title, {
        scale: 2,
        logging: false,
      });
      
      // Create canvas from the table
      const canvas = await html2canvas(tableRef.current, {
        scale: 2,
        logging: false,
      });
      
      document.body.removeChild(title);
      
      // Initialize PDF
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
      });
      
      // Add title to PDF
      const titleImgData = titleCanvas.toDataURL('image/png');
      pdf.addImage(titleImgData, 'PNG', 10, 10, 280, (titleCanvas.height * 280) / titleCanvas.width);
      
      // Add table to PDF
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add new page if needed
      pdf.addImage(imgData, 'PNG', 10, 30, imgWidth, imgHeight);
      
      // Save the PDF
      pdf.save(`financial_reports_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsPrinting(false);
    }
  };

  if (!user) {
    return <div className="p-4">Please log in to view reports.</div>;
  }

  return (
    <div className="flex flex-col space-y-4 mt-2">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div>
            <p className="text-amber-600 font-semibold">Hi, {user.surname} {user.firstname}</p>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Choose Unit
            </label>
            <select
              value={selectedUnit}
              onChange={(e) => handleUnitChange(e.target.value)}
              className="w-64 p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
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
        
        <button
          onClick={handlePrint}
          disabled={isPrinting || filteredReports.length === 0}
          className="flex items-center px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isPrinting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Reports
            </>
          )}
        </button>
      </div>

      <h1 className="text-2xl text-left font-bold">Financial Reports</h1>

      <div className="overflow-x-auto">
        <table ref={tableRef} className="min-w-full bg-white border border-gray-200 shadow-md">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-4 py-2 text-left border-b">Report ID</th>
              <th className="px-4 py-2 text-left border-b">Unit</th>
              <th className="px-4 py-2 text-left border-b">Type</th>
              <th className="px-4 py-2 text-left border-b">Beneficiary</th>
              <th className="px-4 py-2 text-left border-b">Amount</th>
              <th className="px-4 py-2 text-left border-b">Date</th>
              <th className="px-4 py-2 text-left border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((report) => {
                const { date } = formatDateTime(report.datePrepared);
                return (
                  <tr
                    key={report.id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleRowClick(report)}
                  >
                    <td className="px-4 py-2 border-b font-medium">{report.id}</td>
                    <td className="px-4 py-2 border-b">{report.unit}</td>
                    <td className="px-4 py-2 border-b">{report.reportType}</td>
                    <td className="px-4 py-2 border-b">{report.beneficiary}</td>
                    <td className="px-4 py-2 border-b">₦{report.amount.toLocaleString()}</td>
                    <td className="px-4 py-2 border-b">{date}</td>
                    <td className="px-4 py-2 border-b">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-2 text-center border-b">
                  No reports found for the selected criteria
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

      {selectedReport && (
        <ReportModal 
          report={selectedReport} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default Reports;