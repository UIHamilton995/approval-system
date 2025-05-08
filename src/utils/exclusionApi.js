export const fetchAllProviders = async () => {
  try {
    const response = await fetch("https://prognosis-api.leadwayhealth.com/api/ListValues/GetProviders");
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error("Error fetching providers:", error);
    return [];
  }
};

export const fetchClientCompanies = async () => {
  try {
    const response = await fetch("https://prognosis-api.leadwayhealth.com/API/listvalues/getgroups");
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error("Error fetching client companies:", error);
    return [];
  }
};

export const fetchEnrolleesByGroupId = async (groupId) => {
  try {
    const response = await fetch(`https://prognosis-api.leadwayhealth.com/API/corporateprofile/get_employeedetails?group_id=${groupId}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error("Error fetching enrollees:", error);
    return [];
  }
};