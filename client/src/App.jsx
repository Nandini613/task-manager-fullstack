import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProjectView from './pages/ProjectView';
import TeamManagement from './pages/TeamManagement';
import MasterBoard from './pages/MasterBoard';
import GlobalCategories from './pages/GlobalCategories';
import AdminSettings from './pages/AdminSettings';
import AssignedToMe from './pages/member/AssignedToMe';
import MyToday from './pages/member/MyToday';
import Upcoming from './pages/member/Upcoming';
import MyInbox from './pages/member/MyInbox';
import Placeholder from './pages/Placeholder';
import Layout from './components/Layout';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  const { showWelcome } = useContext(AuthContext);

  return (
    <>
      {showWelcome && (
        <div className="welcome-overlay">
          <div className="welcome-text">welcome to tasking</div>
        </div>
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/project/:id" element={<PrivateRoute><ProjectView /></PrivateRoute>} />

        <Route path="/team" element={<PrivateRoute><TeamManagement /></PrivateRoute>} />
        <Route path="/master-board" element={<PrivateRoute><MasterBoard /></PrivateRoute>} />
        <Route path="/categories" element={<PrivateRoute><GlobalCategories /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><AdminSettings /></PrivateRoute>} />
        <Route path="/inbox" element={<PrivateRoute><MyInbox /></PrivateRoute>} />
        <Route path="/today" element={<PrivateRoute><MyToday /></PrivateRoute>} />
        <Route path="/upcoming" element={<PrivateRoute><Upcoming /></PrivateRoute>} />
        <Route path="/assigned" element={<PrivateRoute><AssignedToMe /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default App;