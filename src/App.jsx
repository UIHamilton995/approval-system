import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Departments from "./routes/Departments";
import LoginForm from "./components/LoginForm";
import { UserProvider } from "./contexts/userContexts";
import { TasksProvider } from "./contexts/taskContexts";

function App() {
  return (
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
  );
}

export default App;