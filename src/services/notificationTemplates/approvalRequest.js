/**
 * Generates approval request email HTML
 */
export const generateApprovalEmail = (data, user, recipientType) => {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <p>Dear ${recipientType === "main" ? data.mainApprover : "Approver"},</p>
            
            <p>A new operational expense request requires your approval:</p>
            
            <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold; width: 30%; background-color: #f5f5f5;">Requestor</td>
                <td style="border: 1px solid #ddd; padding: 10px;">${user?.username || user?.email || "Unknown"}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold; background-color: #f5f5f5;">Unit</td>
                <td style="border: 1px solid #ddd; padding: 10px;">${user.group_name}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold; background-color: #f5f5f5;">Beneficiary</td>
                <td style="border: 1px solid #ddd; padding: 10px;">${data.beneficiary}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold; background-color: #f5f5f5;">Amount</td>
                <td style="border: 1px solid #ddd; padding: 10px;">₦${data.amount}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold; background-color: #f5f5f5;">Description</td>
                <td style="border: 1px solid #ddd; padding: 10px;">${data.description}</td>
              </tr>
            </table>
            
            <p style="margin-top: 20px;">
              ${recipientType === "main" 
                ? "As the <strong>main approver</strong>, your approval is required to proceed with this request." 
                : "As an <strong>additional approver</strong>, your approval is requested for this expense."}
            </p>
            
            <p>Please log in to the system to review and take action on this request.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p>Best regards,<br/><strong>Best HMO Winner</strong></p>
            </div>
          </div>
        </body>
      </html>
    `;
  };
  
  // /**
  //  * Generates submission confirmation email
  //  */
  // export const generateSubmissionEmail = (data, user) => {
  //   return `
  //     <html>
  //       <body style="font-family: Arial, sans-serif; line-height: 1.6;">
  //         <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
  //           <p>Dear ${user?.username || "User"},</p>
            
  //           <p>Your operational expense request has been successfully submitted:</p>
            
  //           <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
  //             <tr>
  //               <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold; width: 30%; background-color: #f5f5f5;">Request ID</td>
  //               <td style="border: 1px solid #ddd; padding: 10px;">OP-${Math.random().toString(36).substr(2, 9).toUpperCase()}</td>
  //             </tr>
  //             <tr>
  //               <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold; background-color: #f5f5f5;">Amount</td>
  //               <td style="border: 1px solid #ddd; padding: 10px;">₦${data.amount}</td>
  //             </tr>
  //             <tr>
  //               <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold; background-color: #f5f5f5;">Status</td>
  //               <td style="border: 1px solid #ddd; padding: 10px;">Pending Approval</td>
  //             </tr>
  //           </table>
            
  //           <p>You will be notified once your request has been processed.</p>
            
  //           <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
  //             <p>Best regards,<br/><strong>Best HMO Winner</strong></p>
  //           </div>
  //         </div>
  //       </body>
  //     </html>
  //   `;
  // };