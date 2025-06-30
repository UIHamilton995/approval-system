import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Departments from "./routes/Departments";
import LoginForm from "./components/LoginForm";
import { UserProvider } from "./contexts/UserContext";
import { TasksProvider } from "./contexts/TasksContext";
import { SearchProvider } from "./contexts/SearchContext";

function App() {
  return (
    <SearchProvider>
      <UserProvider>
        <TasksProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LoginForm />} />
              <Route path="/roleDashboard/*" element={<Departments />} />
            </Routes>
          </Router>
        </TasksProvider>
      </UserProvider> 
    </SearchProvider> 
  );
}

export default App;