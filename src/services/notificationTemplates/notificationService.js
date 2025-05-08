import { sendEmail, getApproverEmail } from '../emailService';
import { 
  generateApprovalEmail, 
  // generateSubmissionEmail
} from './approvalRequest';

/**
 * Service for handling all notification logic
 */
export const NotificationService = {
  /**
   * Send approval request notifications
   */
  sendApprovalNotifications: async (formData, user) => {
    const notifications = [];
    
    try {
      // Send to main approver
      if (formData.mainApprover) {
        const email = getApproverEmail(formData.mainApprover);
        if (email) {
          const notification = await sendEmail({
            recipient: email,
            subject: `Approval Request: Operational Expense (₦${formData.amount})`,
            message: generateApprovalEmail(formData, user, "main"),
            category: "Approval Request"
          });
          notifications.push({
            type: "main",
            approver: formData.mainApprover,
            success: true,
            data: notification
          });
        }
      }

      // Send to additional approvers
      for (const approver of formData.additionalApprovers) {
        const email = getApproverEmail(approver);
        if (email) {
          const notification = await sendEmail({
            recipient: email,
            subject: `Additional Approval Request: Operational Expense (₦${formData.amount})`,
            message: generateApprovalEmail(formData, user, "additional"),
            category: "Approval Request"
          });
          notifications.push({
            type: "additional",
            approver: approver,
            success: true,
            data: notification
          });
        }
      }

      // // Send confirmation to requester
      // if (user?.email) {
      //   await sendEmail({
      //     recipient: user.email,
      //     subject: `Your Operational Expense Request Submitted (₦${formData.amount})`,
      //     message: generateSubmissionEmail(formData, user),
      //     category: "Request Confirmation"
      //   });
      // }

      return notifications;
    } catch (error) {
      console.error("Notification error:", error);
      throw error;
    }
  },

  /**
   * Send notification when request is approved/rejected
   */
  sendStatusNotification: async (requestData, user, status) => {
    // Implementation for status change notifications
    // Can be similarly structured
  }
};