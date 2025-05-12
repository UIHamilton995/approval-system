import { useState, useEffect, useRef, useContext, useCallback } from "react";
import SuccessToast from "../components/SuccessToast";
import { UserContext } from "../contexts/userContexts";
import { NotificationService } from "../services/notificationTemplates/notificationService";

const ExclusionForm = ({ addTask = () => {} }) => {
  // Context and state
  const { user, loading } = useContext(UserContext);
  const [formData, setFormData] = useState({
    department: "",
    hospitalName: "",
    providerBankName: "",
    providerAccountNumber: "",
    approvalRequestAmount: "",
    invoiceFile: null,
    companyName: "",
    groupId: "",
    enrolleeName: "",
    enrolleeId: "",
    reasonForExclusion: "",
    mainApprover: "",
    additionalApprovers: [],
    providerCode: "",
    providerEmail: "",
    bankName: "",
    providerAccountName: ""
  });

  // API data state
  const [allProviders, setAllProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [allEnrollees, setAllEnrollees] = useState([]);
  const [filteredEnrollees, setFilteredEnrollees] = useState([]);

  // UI state
  const [showProviderSuggestions, setShowProviderSuggestions] = useState(false);
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const [showEnrolleeSuggestions, setShowEnrolleeSuggestions] = useState(false);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [providerSearchTerm, setProviderSearchTerm] = useState("");
  const [companySearchTerm, setCompanySearchTerm] = useState("");
  const [enrolleeSearchTerm, setEnrolleeSearchTerm] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  // Refs
  const dropdownRef = useRef(null);
  const companyDropdownRef = useRef(null);
  const enrolleeDropdownRef = useRef(null);

  const approvers = [
    "Dr. Tokunbo Alli",
    "Dr. Temitope Falaiye",
    "Dr. Gideon Anumba",
    "Mr. Adebayo",
    "Favour Komoni",
    "Oluwatoyin Ogunmoyele",
    "Temilade Daniel-Owo"
  ];

  // Effects
  useEffect(() => {
    if (!loading) {
      if (user?.group_name) {
        setFormData(prev => ({
          ...prev,
          department: user.group_name
        }));
        setHasPermission(true);
      } else {
        setHasPermission(false);
        setToastMessage("Permission Denied: Your account is not assigned to a required unit/group.");
        setShowSuccessToast(true);
        setFormData(prev => ({ ...prev, department: "" }));
      }
    }
  }, [user, loading]);

  const determineMainApprover = useCallback((amount) => {
    if (!amount) return "";
    const numericAmount = parseInt(amount.toString().replace(/,/g, ''), 10);
    if (isNaN(numericAmount)) return "";
    
    if (numericAmount > 500000) {
      // Auto-select Dr. Tokunbo Alli for amounts > 500k
      return "Dr. Tokunbo Alli";
    } else {
      // Show dropdown for manual selection for amounts <= 500k
      return "";
    }
  }, []);

  // Optimized provider fetching with debounce
  const fetchAllProviders = useCallback(async () => {
    setIsLoadingProviders(true);
    try {
      const response = await fetch("https://prognosis-api.leadwayhealth.com/api/ListValues/GetProviders");
      if (!response.ok) throw new Error('Network response was not ok for providers');
      const data = await response.json();
      setAllProviders(data.result || []);
      setFilteredProviders(data.result || []);
    } catch (error) {
      console.error("Error fetching providers:", error);
      setToastMessage("Error fetching provider list. Please try again.");
      setShowSuccessToast(true);
    } finally {
      setIsLoadingProviders(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (providerSearchTerm) {
        const filtered = allProviders.filter(provider =>
          provider.FullName?.toLowerCase().includes(providerSearchTerm.toLowerCase()) ||
          provider.ProviderCode?.toLowerCase().includes(providerSearchTerm.toLowerCase())
        ).slice(0, 10);
        setFilteredProviders(filtered);
      } else {
        setFilteredProviders(allProviders.slice(0, 10));
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [providerSearchTerm, allProviders]);

  useEffect(() => {
    fetchAllProviders();
  }, [fetchAllProviders]);

  // Companies fetching
  useEffect(() => {
    const fetchAllCompanies = async () => {
      try {
        const response = await fetch("https://prognosis-api.leadwayhealth.com/API/listvalues/getgroups");
        if (!response.ok) throw new Error('Network response was not ok for companies');
        const data = await response.json();
        setAllCompanies(data.result || []);
        setFilteredCompanies(data.result || []);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setToastMessage("Error fetching company list. Please try again.");
        setShowSuccessToast(true);
      }
    };
    fetchAllCompanies();
  }, []);

  // Enrollees fetching with error handling
  const fetchEnrollees = useCallback(async (groupId) => {
    if (!groupId) {
      setAllEnrollees([]);
      setFilteredEnrollees([]);
      return;
    }
    
    try {
      const response = await fetch(
        `https://prognosis-api.leadwayhealth.com/API/corporateprofile/get_employeedetails?group_id=${groupId}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response was not JSON");
      }
      
      const data = await response.json();
      
      if (!data || !data.result_overview) {
        throw new Error("Invalid data structure from API");
      }
      
      setAllEnrollees(data.result_overview || []);
      setFilteredEnrollees(data.result_overview || []);
    } catch (error) {
      console.error("Error fetching enrollees:", error);
      setToastMessage("Error fetching enrollee list. Please ensure the company is valid and try again.");
      setShowSuccessToast(true);
      setAllEnrollees([]);
      setFilteredEnrollees([]);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (companySearchTerm) {
        const filtered = allCompanies.filter(company =>
          company.GROUP_NAME?.toLowerCase().includes(companySearchTerm.toLowerCase())
        ).slice(0, 10);
        setFilteredCompanies(filtered);
      } else {
        setFilteredCompanies(allCompanies.slice(0, 10));
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [companySearchTerm, allCompanies]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (enrolleeSearchTerm) {
        const filtered = allEnrollees.filter(enrollee =>
          enrollee.FullName?.toLowerCase().includes(enrolleeSearchTerm.toLowerCase()) ||
          enrollee.EnrolleeID?.toLowerCase().includes(enrolleeSearchTerm.toLowerCase())
        ).slice(0, 10);
        setFilteredEnrollees(filtered);
      } else {
        setFilteredEnrollees(allEnrollees.slice(0, 10));
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [enrolleeSearchTerm, allEnrollees]);

  useEffect(() => {
    fetchEnrollees(formData.groupId);
  }, [formData.groupId, fetchEnrollees]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProviderSuggestions(false);
      }
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target)) {
        setShowCompanySuggestions(false);
      }
      if (enrolleeDropdownRef.current && !enrolleeDropdownRef.current.contains(event.target)) {
        setShowEnrolleeSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers
  const handleHospitalSearch = (e) => {
    const value = e.target.value;
    setProviderSearchTerm(value);
    setShowProviderSuggestions(true);
  };

  const handleHospitalSelect = (provider) => {
    setFormData(prev => ({
      ...prev,
      hospitalName: provider.FullName?.trim() || "",
      providerCode: provider.ProviderCode || "",
      providerEmail: provider.Email || "",
      providerBankName: provider.BankName || "",
      providerAccountNumber: provider.bankaccount || "",
      providerAccountName: provider.bankaccountName || "",
      bankName: provider.BankName || ""
    }));
    setProviderSearchTerm(provider.FullName?.trim() || "");
    setShowProviderSuggestions(false);
  };

  const handleCompanySearch = (e) => {
    const value = e.target.value;
    setCompanySearchTerm(value);
    setShowCompanySuggestions(true);
  };

  const handleCompanySelect = (company) => {
    setFormData(prev => ({
      ...prev,
      companyName: company.GROUP_NAME || "",
      groupId: company.GROUP_ID || ""
    }));
    setCompanySearchTerm(company.GROUP_NAME || "");
    setShowCompanySuggestions(false);
    setEnrolleeSearchTerm("");
    setFormData(prev => ({ ...prev, enrolleeName: "", enrolleeId: "" }));
  };

  const handleEnrolleeSearch = (e) => {
    const value = e.target.value;
    setEnrolleeSearchTerm(value);
    setShowEnrolleeSuggestions(true);
  };

  const handleEnrolleeSelect = (enrollee) => {
    setFormData(prev => ({
      ...prev,
      enrolleeName: enrollee.FullName || "",
      enrolleeId: enrollee.EnrolleeID || ""
    }));
    setEnrolleeSearchTerm(`${enrollee.FullName || 'Unknown'} (${enrollee.EnrolleeID || 'No ID'})`);
    setShowEnrolleeSuggestions(false);
  };

  const handleAmountChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^\d]/g, '');
    if (value) {
      const numberValue = parseInt(value, 10);
      if (!isNaN(numberValue)) {
        value = numberValue.toLocaleString('en-NG');
        const mainApprover = determineMainApprover(value);
        setFormData(prev => ({
          ...prev,
          approvalRequestAmount: value,
          mainApprover
        }));
        return;
      }
    }
    setFormData(prev => ({
      ...prev,
      approvalRequestAmount: '',
      mainApprover: ''
    }));
  };

  const handleAdditionalApprovers = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    const filteredOptions = selectedOptions.filter(
      approver => approver !== formData.mainApprover
    ).slice(0, 2);
    setFormData(prev => ({
      ...prev,
      additionalApprovers: filteredOptions
    }));
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.files ? e.target.files[0] : null,
      }));
    } else if (name !== 'approvalRequestAmount') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.group_name) {
      setToastMessage("Submission Failed: You do not have permission or are not logged in correctly.");
      setShowSuccessToast(true);
      return;
    }

    // Validate required fields
    if (!formData.hospitalName || !formData.companyName || !formData.enrolleeName || 
        !formData.approvalRequestAmount || !formData.reasonForExclusion || !formData.invoiceFile) {
      setToastMessage("Please fill all required fields");
      setShowSuccessToast(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const amountWithoutCommas = formData.approvalRequestAmount.replace(/,/g, '');
      
      const requestBody = {
        Provider: formData.hospitalName,
        RequestType: "Provider-Client",
        ProviderCode: formData.providerCode,
        ProviderBank: formData.providerBankName,
        ProviderAccountNumber: formData.providerAccountNumber,
        ProviderAccountName: formData.providerAccountName,
        ProviderContact1: "",
        ProviderEmail: formData.providerEmail,
        ClientName: formData.companyName,
        EnrolleeID: formData.enrolleeId,
        Unit: user.group_name,
        GroupName: formData.companyName,
        ApprovalAmount: parseFloat(amountWithoutCommas) || 0,
        MainApprover: formData.mainApprover,
        AlternativeApprover: formData.additionalApprovers.join(", "),
        BankName: formData.providerBankName,
        BankAccount: formData.providerAccountNumber,
        Reason: formData.reasonForExclusion,
        Status: "Pending",
        CreatedBy: user?.email || user?.username || "user",
        vat: "",
        wht: "",
        InvoiceFile: formData.invoiceFile ? formData.invoiceFile.name : "",
        FileType: formData.invoiceFile ? formData.invoiceFile.name.split('.').pop().toUpperCase() : ""
      };

      const apiEndpoint = "https://prognosis-api.leadwayhealth.com/api/HealthApproval/InsertHealthApprovalPayment";

      const apiResponse = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit request");
      }

      // Send notifications to approvers
      try {
        await NotificationService.sendApprovalNotifications({
          hospitalName: formData.hospitalName,
          companyName: formData.companyName,
          enrolleeName: formData.enrolleeName,
          amount: formData.approvalRequestAmount,
          reason: formData.reasonForExclusion,
          mainApprover: formData.mainApprover,
          additionalApprovers: formData.additionalApprovers,
          requester: user?.username || user?.email || "Unknown"
        });
      } catch (emailError) {
        console.error("Error sending notifications:", emailError);
        // Don't fail the submission if emails fail
      }

      setToastMessage("Payment request submitted successfully!");
      setShowSuccessToast(true);

      const newTask = {
        Department: user.group_name,
        Title: formData.hospitalName,
        Description: formData.reasonForExclusion,
        startDate: new Date().toISOString().split("T")[0],
        approvalAmount: amountWithoutCommas,
        status: "Pending",
        mainApprover: formData.mainApprover,
        additionalApprovers: formData.additionalApprovers,
        providerCode: formData.providerCode,
        providerEmail: formData.providerEmail,
        providerBankName: formData.providerBankName,
        providerAccountNumber: formData.providerAccountNumber,
        companyName: formData.companyName,
        enrolleeName: formData.enrolleeName,
        enrolleeId: formData.enrolleeId,
        bankName: formData.bankName,
        invoiceFileName: formData.invoiceFile ? formData.invoiceFile.name : ""
      };

      addTask(newTask);

      // Reset form
      setFormData({
        department: user.group_name || "",
        hospitalName: "",
        providerBankName: "",
        providerAccountNumber: "",
        approvalRequestAmount: "",
        invoiceFile: null,
        companyName: "",
        groupId: "",
        enrolleeName: "",
        enrolleeId: "",
        reasonForExclusion: "",
        mainApprover: "",
        additionalApprovers: [],
        providerCode: "",
        providerEmail: "",
        bankName: "",
        providerAccountName: ""
      });
      setProviderSearchTerm("");
      setCompanySearchTerm("");
      setEnrolleeSearchTerm("");
      const fileInput = document.querySelector('input[name="invoiceFile"]');
      if (fileInput) fileInput.value = "";

    } catch (error) {
      console.error("Error submitting form:", error);
      setToastMessage(`Submission Failed: ${error.message}`);
      setShowSuccessToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto text-center">
        <div className="flex justify-center items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce"></div>
          <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <p className="mt-4 text-gray-600">Loading user data...</p>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-2">
          Payment Request Approval
        </h2>
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Permission Denied: Your account is not assigned to a required unit/group.
                Please contact your administrator.
              </p>
            </div>
          </div>
        </div>
        <SuccessToast
          message={toastMessage}
          show={showSuccessToast}
          onClose={() => setShowSuccessToast(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-2">
        Provider-Client Payment Request
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-md font-medium text-gray-700 mb-1">
            Unit / Department
          </label>
          <input
            type="text"
            name="department"
            value={formData.department}
            className="w-full p-3 border rounded-md shadow-sm bg-gray-100 text-gray-600 cursor-not-allowed"
            readOnly
            aria-readonly="true"
          />
        </div>

        <div className="relative" ref={dropdownRef}>
          <label htmlFor="hospitalName" className="block text-md font-medium text-gray-700 mb-1">
            Hospital/Provider Name <span className="text-red-500">*</span>
          </label>
          <input
            id="hospitalName"
            type="text"
            value={providerSearchTerm}
            onChange={handleHospitalSearch}
            onFocus={() => setShowProviderSuggestions(true)}
            className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by name or provider code..."
            required
            autoComplete="off"
          />
          {showProviderSuggestions && (
            <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {isLoadingProviders ? (
                <div className="p-3 text-gray-500 flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading providers...
                </div>
              ) : filteredProviders.length > 0 ? (
                filteredProviders.map((provider) => (
                  <div
                    key={provider.ProviderCode || provider.FullName}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleHospitalSelect(provider)}
                  >
                    <div className="font-medium">{provider.FullName?.trim() || "Unknown Provider"}</div>
                    <div className="text-sm text-gray-600 flex justify-between flex-wrap">
                      <span>Code: {provider.ProviderCode || "N/A"}</span>
                      {provider.BankName && <span>Bank: {provider.BankName}</span>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-500">No matching providers found</div>
              )}
            </div>
          )}
        </div>

        {formData.providerCode && (
          <div className="bg-blue-50 p-4 rounded-md space-y-2 border border-blue-200">
            <h4 className="text-md font-semibold text-gray-700 mb-2">Provider Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="text-gray-600">Code:</span>
                <span className="ml-2 font-medium text-gray-800">{formData.providerCode || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">Account #:</span>
                <span className="ml-2 font-medium text-gray-800">{formData.providerAccountNumber || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">Bank:</span>
                <span className="ml-2 font-medium text-gray-800">{formData.providerBankName || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">Account Name:</span>
                <span className="ml-2 font-medium text-gray-800">{formData.providerAccountName || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 font-medium text-gray-800">{formData.providerEmail || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}

        <div className="relative" ref={companyDropdownRef}>
          <label htmlFor="companyName" className="block text-md font-medium text-gray-700 mb-1">
            Client / Company Name <span className="text-red-500">*</span>
          </label>
          <input
            id="companyName"
            type="text"
            value={companySearchTerm}
            onChange={handleCompanySearch}
            onFocus={() => setShowCompanySuggestions(true)}
            className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by company name..."
            required
            autoComplete="off"
          />
          {showCompanySuggestions && (
            <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <div
                    key={company.GROUP_ID}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleCompanySelect(company)}
                  >
                    <div className="font-medium">{company.GROUP_NAME || "Unknown Company"}</div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-500">No matching companies found</div>
              )}
            </div>
          )}
        </div>

        {formData.groupId && (
          <div className="relative" ref={enrolleeDropdownRef}>
            <label htmlFor="enrolleeName" className="block text-md font-medium text-gray-700 mb-1">
              Enrollee Name
            </label>
            <input
              id="enrolleeName"
              type="text"
              value={enrolleeSearchTerm}
              onChange={handleEnrolleeSearch}
              onFocus={() => setShowEnrolleeSuggestions(true)}
              className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={allEnrollees.length ? "Search by enrollee name or ID..." : "Loading enrollees..."}
              disabled={!allEnrollees.length}
              autoComplete="off"
            />
            {showEnrolleeSuggestions && (
              <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredEnrollees.length > 0 ? (
                  filteredEnrollees.map((enrollee) => (
                    <div
                      key={enrollee.EnrolleeID || enrollee.FullName}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                      onClick={() => handleEnrolleeSelect(enrollee)}
                    >
                      <div className="font-medium">{enrollee.FullName || "Unknown Enrollee"}</div>
                      {enrollee.EnrolleeID && (
                        <div className="text-sm text-gray-600">
                          ID: {enrollee.EnrolleeID}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-500">
                    {allEnrollees.length === 0 ? 
                      (formData.groupId ? 'No enrollees found for this company' : 'Select a company first') : 
                      'No matching enrollees found'}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {formData.enrolleeId && (
          <div className="bg-green-50 p-4 rounded-md space-y-2 border border-green-200">
            <h4 className="text-md font-semibold text-gray-700 mb-2">Enrollee Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium text-gray-800">{formData.enrolleeName}</span>
              </div>
              <div>
                <span className="text-gray-600">ID:</span>
                <span className="ml-2 font-medium text-gray-800">{formData.enrolleeId || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="approvalRequestAmount" className="block text-md font-medium text-gray-700 mb-1">
            Approval Request Amount (₦) <span className="text-red-500">*</span>
          </label>
          <input
            id="approvalRequestAmount"
            type="text"
            name="approvalRequestAmount"
            value={formData.approvalRequestAmount}
            onChange={handleAmountChange}
            className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter amount in Naira"
            required
            inputMode="numeric"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="mainApprover" className="block text-md font-medium text-gray-700 mb-1">
              Main Approver <span className="text-red-500">*</span>
            </label>
            {formData.approvalRequestAmount && determineMainApprover(formData.approvalRequestAmount) ? (
              <input
                type="text"
                value={formData.mainApprover}
                className="w-full p-3 border rounded-md shadow-sm bg-gray-50"
                disabled
              />
            ) : (
              <select
                id="mainApprover"
                name="mainApprover"
                value={formData.mainApprover}
                onChange={(e) => setFormData(prev => ({ ...prev, mainApprover: e.target.value }))}
                className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Main Approver</option>
                {approvers.map((approver) => (
                  <option key={approver} value={approver}>
                    {approver}
                  </option>
                ))}
              </select>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.approvalRequestAmount && determineMainApprover(formData.approvalRequestAmount) ? 
                "Main approver automatically selected based on amount" : 
                "Please select a main approver for amounts ≤ ₦500,000"}
            </p>
          </div>

          <div>
            <label htmlFor="additionalApprovers" className="block text-md font-medium text-gray-700 mb-1">
              Additional Approvers (Max 2)
            </label>
            <select
              id="additionalApprovers"
              name="additionalApprovers"
              multiple
              size={3}
              onChange={handleAdditionalApprovers}
              value={formData.additionalApprovers}
              className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {approvers
                .filter(approver => approver !== formData.mainApprover)
                .map((approver) => (
                  <option key={approver} value={approver}>
                    {approver}
                  </option>
                ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Hold Ctrl/Cmd to select multiple. Main approver is excluded from this list.
            </p>
            {formData.additionalApprovers.length > 0 && (
              <div className="mt-2 text-sm text-gray-700">
                Selected: {formData.additionalApprovers.join(", ")}
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="reasonForExclusion" className="block text-md font-medium text-gray-700 mb-1">
            Reason for Exclusion <span className="text-red-500">*</span>
          </label>
          <textarea
            id="reasonForExclusion"
            name="reasonForExclusion"
            value={formData.reasonForExclusion}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Provide detailed reason for this exclusion request..."
            required
          />
        </div>

        <div>
          <label htmlFor="invoiceFile" className="block text-md font-medium text-gray-700 mb-1">
            Invoice File (PDF, JPG, PNG) <span className="text-red-500">*</span>
          </label>
          <input
            id="invoiceFile"
            type="file"
            name="invoiceFile"
            onChange={handleChange}
            className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            accept=".pdf,.jpg,.jpeg,.png"
            required
          />
          {formData.invoiceFile && (
            <p className="mt-2 text-sm text-gray-600">
              Selected file: {formData.invoiceFile.name}
            </p>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white ${isSubmitting ? 'bg-blue-700' : 'bg-blue-950 hover:bg-red-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : 'Submit Request'}
          </button>
        </div>
      </form>

      <SuccessToast
        message={toastMessage}
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
    </div>
  );
};

export default ExclusionForm;