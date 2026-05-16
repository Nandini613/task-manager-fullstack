import { useState } from 'react';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="layout-container">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <main className="main-content">
        <div className="mobile-header">
          <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
            ☰
          </button>
          <h2>Tasking</h2>
        </div>
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
