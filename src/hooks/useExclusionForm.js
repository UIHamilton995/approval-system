import { useState, useEffect, useRef } from "react";
import { fetchAllProviders, fetchClientCompanies, fetchEnrolleesByGroupId } from "../utils/exclusionApi";

const useExclusionForm = (addTask) => {
  const departments = [
    "Select Unit",
    "MANCO",
    "FSI/Telco",
    "UP-Country", 
    "Commercial",
    "Distribution",
    "Retail/SME",
    "Energy",
    "Case Management",
    "Contact Centre",
    "Client Services"
  ];

  const [formData, setFormData] = useState({
    department: "Select Unit",
    hospitalName: "",
    providerBankName: "",
    providerAccountNumber: "",
    approvalRequestAmount: "",
    invoiceFile: null,
    companyName: "",
    enrolleeName: "",
    reasonForExclusion: "",
    mainApprover: "",
    additionalApprovers: [],
    providerCode: "",
    providerEmail: "",
    bankName: "",
    groupId: "" // Added groupId for company selection
  });

  const [allProviders, setAllProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [showProviderSuggestions, setShowProviderSuggestions] = useState(false);

  const [clientCompanies, setClientCompanies] = useState([]);
  const [filteredClientCompanies, setFilteredClientCompanies] = useState([]);
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);

  const [enrollees, setEnrollees] = useState([]);
  const [filteredEnrollees, setFilteredEnrollees] = useState([]);
  const [showEnrolleeSuggestions, setShowEnrolleeSuggestions] = useState(false);

  const [isLoading, setIsLoading] = useState({
    providers: true,
    companies: true,
    enrollees: false
  });

  const [searchTerm, setSearchTerm] = useState({
    provider: "",
    company: "",
    enrollee: ""
  });

  const dropdownRef = useRef(null);

  const approvers = [
    "Dr. Tokunbo Alli",
    "Dr. Temitope Falaiye",
    "Favour Komoni",
    "Oluwatoyin Ogunmoyele",
    "Temilade Daniel-Owo"
  ];

  // Fetch providers and client companies on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [providers, companies] = await Promise.all([
          fetchAllProviders(),
          fetchClientCompanies()
        ]);
        setAllProviders(providers);
        setFilteredProviders(providers);
        setClientCompanies(companies);
        setFilteredClientCompanies(companies);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, providers: false, companies: false }));
      }
    };

    fetchData();
  }, []);

  // Fetch enrollees when a company is selected
  useEffect(() => {
    if (formData.groupId) {
      const fetchEnrollees = async () => {
        setIsLoading(prev => ({ ...prev, enrollees: true }));
        try {
          const enrollees = await fetchEnrolleesByGroupId(formData.groupId);
          setEnrollees(enrollees);
          setFilteredEnrollees(enrollees);
        } catch (error) {
          console.error("Error fetching enrollees:", error);
        } finally {
          setIsLoading(prev => ({ ...prev, enrollees: false }));
        }
      };

      fetchEnrollees();
    }
  }, [formData.groupId]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProviderSuggestions(false);
        setShowCompanySuggestions(false);
        setShowEnrolleeSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Event Handlers
  const handleHospitalSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(prev => ({ ...prev, provider: value }));
    
    const filtered = allProviders.filter(provider => 
      provider.FullName.toLowerCase().includes(value.toLowerCase()) ||
      provider.ProviderCode.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 10);
    
    setFilteredProviders(filtered);
    setShowProviderSuggestions(true);
  };

  const handleHospitalSelect = (provider) => {
    setFormData(prev => ({
      ...prev,
      hospitalName: provider.FullName.trim(),
      providerCode: provider.ProviderCode,
      providerEmail: provider.Email,
      providerBankName: provider.BankName,
      providerAccountNumber: provider.bankaccount,
      bankName: provider.bankaccountName
    }));
    setSearchTerm(prev => ({ ...prev, provider: provider.FullName.trim() }));
    setShowProviderSuggestions(false);
  };

  const handleCompanySearch = (e) => {
    const value = e.target.value;
    setSearchTerm(prev => ({ ...prev, company: value }));
    
    const filtered = clientCompanies.filter(company => 
      company.GroupName.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 10);
    
    setFilteredClientCompanies(filtered);
    setShowCompanySuggestions(true);
  };

  const handleCompanySelect = (company) => {
    setFormData(prev => ({
      ...prev,
      companyName: company.GroupName,
      groupId: company.GroupId
    }));
    setSearchTerm(prev => ({ ...prev, company: company.GroupName }));
    setShowCompanySuggestions(false);
  };

  const handleEnrolleeSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(prev => ({ ...prev, enrollee: value }));
    
    const filtered = enrollees.filter(enrollee => 
      `${enrollee.FirstName} ${enrollee.Surname}`.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 10);
    
    setFilteredEnrollees(filtered);
    setShowEnrolleeSuggestions(true);
  };

  const handleEnrolleeSelect = (enrollee) => {
    setFormData(prev => ({
      ...prev,
      enrolleeName: `${enrollee.FirstName} ${enrollee.Surname}`
    }));
    setSearchTerm(prev => ({ ...prev, enrollee: `${enrollee.FirstName} ${enrollee.Surname}` }));
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
      }
    } else {
      setFormData(prev => ({
        ...prev,
        approvalRequestAmount: '',
        mainApprover: ''
      }));
    }
  };

  const handleAdditionalApprovers = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    const filteredOptions = selectedOptions.filter(
      approver => approver !== formData.mainApprover
    );
    const limitedOptions = filteredOptions.slice(0, 2);

    setFormData(prev => ({
      ...prev,
      additionalApprovers: limitedOptions
    }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'approvalRequestAmount') return;
    
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const amountWithoutCommas = formData.approvalRequestAmount.replace(/,/g, '');
    
    const newTask = {
      Department: formData.department,
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
      bankName: formData.bankName
    };

    addTask(newTask);

    // Reset form
    setFormData({
      department: "Select Unit",
      hospitalName: "",
      providerBankName: "",
      providerAccountNumber: "",
      approvalRequestAmount: "",
      invoiceFile: null,
      companyName: "",
      enrolleeName: "",
      reasonForExclusion: "",
      mainApprover: "",
      additionalApprovers: [],
      providerCode: "",
      providerEmail: "",
      bankName: "",
      groupId: ""
    });
    setSearchTerm({
      provider: "",
      company: "",
      enrollee: ""
    });
  };

  const determineMainApprover = (amount) => {
    const numericAmount = parseInt(amount.replace(/,/g, ''), 10);
    
    if (numericAmount <= 500000) {
      return "Favour Komoni";
    } else if (numericAmount <= 5000000) {
      return "Dr. Temitope Falaiye";
    } else {
      return "Dr. Tokunbo Alli";
    }
  };

  return {
    formData,
    departments,
    filteredProviders,
    showProviderSuggestions,
    filteredClientCompanies,
    showCompanySuggestions,
    filteredEnrollees,
    showEnrolleeSuggestions,
    isLoading,
    searchTerm,
    dropdownRef,
    approvers,
    handleHospitalSearch,
    handleHospitalSelect,
    handleCompanySearch,
    handleCompanySelect,
    handleEnrolleeSearch,
    handleEnrolleeSelect,
    handleAmountChange,
    handleAdditionalApprovers,
    handleChange,
    handleSubmit
  };
};

export default useExclusionForm;