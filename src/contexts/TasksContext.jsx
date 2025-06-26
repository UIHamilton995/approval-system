import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async (dateFilter = null) => {
    try {
      let fromDate, toDate;
      
      if (dateFilter) {
        fromDate = new Date(dateFilter.startDate);
        toDate = new Date(dateFilter.endDate);
      } else {
        const currentDate = new Date();
        fromDate = new Date(currentDate);
        fromDate.setDate(currentDate.getDate() - 8);
        toDate = new Date(currentDate);
        toDate.setDate(currentDate.getDate() + 1);
      }

      const response = await axios.get(
        `https://prognosis-api.leadwayhealth.com/api/EnrolleeProfile/GetPaymentDetails`,
        {
          params: {
            Fromdate: fromDate.toISOString().split('T')[0],
            Todate: toDate.toISOString().split('T')[0],
            Claimstatus: 0,
            sector: 0
          }
        }
      );

      if (response.data && response.data.status === 200 && Array.isArray(response.data.result)) {
        setTasks(response.data.result);
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (err) {
      setError(err.message);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshTasks = () => {
    setLoading(true);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TasksContext.Provider value={{ tasks, loading, error, refreshTasks, fetchTasks }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);