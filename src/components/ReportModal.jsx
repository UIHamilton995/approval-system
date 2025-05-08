import { formatDateTime } from "../utils/tasksHelper";
import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ReportModal = ({ report, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState("");
  const contentRef = useRef(null);
  
  if (!report) return null;

  const { date, time } = formatDateTime(report.datePrepared);

  const getStatusStyle = (status) => {
    const base = "px-4 py-3 rounded-md text-center font-bold text-sm uppercase tracking-wide ";
    const statusStyles = {
      Processing: "bg-amber-100 text-amber-800 border border-amber-200",
      Paid: "bg-green-100 text-green-800 border border-green-200",
    };
    return base + (statusStyles[status] || statusStyles.Default);
  };

  // Function to download as image
  const downloadAsImage = async () => {
    try {
      setDownloading(true);
      setDownloadType("image");
      
      const element = contentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      const imageData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imageData;
      link.download = `Report_${report.id}_${date.replace(/\//g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setDownloading(false);
      setDownloadType("");
    }
  };

  // Function to generate PDF from current view
  const generatePDF = async () => {
    try {
      setDownloading(true);
      setDownloadType("pdf");
      
      const element = contentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Report_${report.id}_${date.replace(/\//g, '-')}.pdf`);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
      setDownloadType("");
    }
  };

  // Attempt direct file download as fallback
  const tryDirectDownload = () => {
    try {
      setDownloading(true);
      setDownloadType("direct");
      
      // Try to force download by creating a temporary form and submitting it
      const form = document.createElement("form");
      form.method = "GET";
      form.action = report.fileUrl;
      form.target = "_blank";
      
      const downloadInput = document.createElement("input");
      downloadInput.type = "hidden";
      downloadInput.name = "download";
      downloadInput.value = "1";
      form.appendChild(downloadInput);
      
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
      
      setTimeout(() => {
        setDownloading(false);
        setDownloadType("");
      }, 2000);
      
    } catch (error) {
      console.error("Direct download failed:", error);
      setDownloading(false);
      setDownloadType("");
      alert("Download failed. Please try another option.");
    }
  };

  const getButtonLabel = () => {
    if (!downloading) return "Download Options";
    
    switch (downloadType) {
      case "image": return "Creating Image...";
      case "pdf": return "Generating PDF...";
      case "direct": return "Downloading...";
      default: return "Processing...";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6" ref={contentRef}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Report Details: {report.id}
              </h2>
              <p className="text-gray-600 mt-1">
                {report.unit} • {report.reportType}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-lg mb-3 text-blue-700 border-b pb-2">
                  Transaction Information
                </h3>
                <DetailRow label="Report Type" value={report.reportType} />
                <DetailRow label="Unit" value={report.unit} />
                <DetailRow label="Narration" value={report.narration} />
                <DetailRow label="Date Prepared" value={`${date} at ${time}`} />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-lg mb-3 text-blue-700 border-b pb-2">
                  Financial Details
                </h3>
                <DetailRow label="Amount" value={`₦${report.amount.toLocaleString()}`} />
                <DetailRow label="VAT (7.5%)" value={`₦${report.valueAddedTax.toLocaleString()}`} />
                <DetailRow label="WHT (5%)" value={`₦${report.witHoldingTax.toLocaleString()}`} />
                <DetailRow 
                  label="Net Amount" 
                  value={`₦${report.netAmount.toLocaleString()}`} 
                  highlight={true}
                />
                
                {/* Status Display */}
                <div className="mt-4">
                  <div className={getStatusStyle(report.status)}>
                    Status: {report.status}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-lg mb-3 text-blue-700 border-b pb-2">
                  Benefactor Details
                </h3>
                <DetailRow label="Organization" value={report.benefactor} />
                <DetailRow label="Bank" value={report.benefactorBank} />
                <DetailRow label="Account Number" value={report.benefactorAccountNumber} />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-lg mb-3 text-blue-700 border-b pb-2">
                  Beneficiary Details
                </h3>
                <DetailRow label="Organization" value={report.beneficiary} />
                <DetailRow label="Bank" value={report.beneficiaryBank} />
                <DetailRow label="Account Number" value={report.beneficiaryAccountNumber} />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-lg mb-3 text-blue-700 border-b pb-2">
                  Approval Information
                </h3>
                <DetailRow label="Requester" value={report.requester} />
                <DetailRow 
                  label="Approver" 
                  value={report.approver || "Pending Approval"} 
                  highlight={!report.approver}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0">
            {downloading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{getButtonLabel()}</span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={generatePDF}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Save as PDF
                </button>
                
                <button
                  onClick={downloadAsImage}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Save as Image
                </button>
                
                <button
                  onClick={tryDirectDownload}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Original File
                </button>
              </div>
            )}
            
            <button
              onClick={onClose}
              className="px-4 py-2 ml-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, highlight = false }) => (
  <div className="grid grid-cols-3 gap-4 mb-3">
    <span className="text-gray-600 font-medium">{label}</span>
    <span className={`col-span-2 ${highlight ? 'font-bold text-blue-700' : 'font-semibold'}`}>
      {value}
    </span>
  </div>
);

export default ReportModal;