import { Routes, Route } from "react-router-dom";
import RoleDashboard from "../pages/RoleDashboard";
import AllTasks from "../pages/AllTasks";
import ExclusionForm from "../pages/ExclusionForm";
import PendingTasks from "../pages/PendingTasks";
import RejectedTasks from "../pages/RejectedTasks";
import ApprovedTasks from "../pages/ApprovedTasks";
import BillingRequestForm from "../pages/BillingRequestForm";
import Messages from "../pages/Messages";
import AllBills from "../pages/AllBills";
import ViewHistory from "../components/ViewHistory";
import ExpenseTypeSelection from "../pages/ExpenseTypeSelection";
import OperationalExpenseForm from "../pages/OperationalExpenseForm";
import Payroll from "../pages/Payroll";
import Reports from "../pages/Reports";

const Departments = () => {
  return (
    <Routes>
      {/* Parent route for RoleDashboard */}
      <Route path="" element={<RoleDashboard />}>
        <Route index element={<AllTasks />} /> {/* Default content */}
        <Route path="/pending" element={<PendingTasks />} />
        <Route path="/rejected" element={<RejectedTasks />} />
        <Route path="/approved" element={<ApprovedTasks />} />
        <Route path="/exclusions" element={<ExclusionForm />} />
        <Route path="/billing-request" element={<BillingRequestForm />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/all-billing-requests" element={<AllBills />} />
        <Route path="/history/:hospitalName" element={<ViewHistory />} /> 
        <Route path="/expense-type-selection" element={<ExpenseTypeSelection />} />
        <Route path="/operational-expense" element={<OperationalExpenseForm />} />
        <Route path="/finance/payroll" element={<Payroll />} />
        <Route path="/finance/reports" element={<Reports />} />
      </Route>
    </Routes>
  );
};

export default Departments;
