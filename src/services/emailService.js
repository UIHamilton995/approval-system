/**
 * Service for sending emails through API
 */
export const sendEmail = async (emailData) => {
    try {
      const emailPayload = {
        EmailAddress: emailData.recipient,
        Subject: emailData.subject,
        MessageBody: emailData.message,
        Category: emailData.category || "System Notification",
        UserId: emailData.userId || 1,
        ProviderId: emailData.providerId || 1,
        ServiceId: emailData.serviceId || 1
      };
  
      const response = await fetch("https://prognosis-api.leadwayhealth.com/api/EnrolleeProfile/SendEmailAlert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      });
  
      if (!response.ok) {
        throw new Error("Failed to send email");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Email sending error:", error);
      throw error;
    }
  };
  
  /**
   * Approver email mapping (can be moved to config if needed)
   */
  export const APPROVER_EMAILS = {
    "Dr. Tokunbo Alli": "t-alli@leadway.com",
    "Dr. Gideon Anumba": "g-anumba@leadway.com",
    "Mr. Adebayo": "e-adebayo@leadway.com",
    "Dr. Temitope Falaiye": "t-falaiye@leadway.com",
    "Favour Komoni": "f-komoni-mbaekwe@leadway.com",
    "Oluwatoyin Ogunmoyele": "o-ogunmoyole@leadway.com",
    "Temilade Daniel-Owo": "t-adewoye-daniel-owo@leadway.com"
  };
  
  /**
   * Helper to get approver email
   */
  export const getApproverEmail = (approverName) => {
    return APPROVER_EMAILS[approverName] || null;
  };