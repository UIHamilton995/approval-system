import Sidebar from '../components/Landing/Sidebar';
import Navbar from '../components/Landing/Navbar';
import { Outlet } from 'react-router-dom';

const RoleDashboard = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-48">
        <Navbar />
        <main className="flex-grow p-4 mt-16 bg-slate-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default RoleDashboard;