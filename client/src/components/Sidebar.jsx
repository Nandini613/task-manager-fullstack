import { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import api from '../api';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);

  useEffect(() => {
    if (user?.role === 'member') {
      api.get('/projects').then(res => setProjects(res.data)).catch(console.error);
    }
  }, [user]);

  const isActive = (path) => location.pathname === path;

  const adminLinks = [
    { name: 'Overview Dashboard', path: '/' },
    { name: 'Team Management', path: '/team' },
    { name: 'Master Task Board', path: '/master-board' },
    { name: 'Global Categories', path: '/categories' },
    { name: 'Settings', path: '/settings' },
  ];

  const memberLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'My Inbox', path: '/inbox' },
    { name: 'My Today', path: '/today' },
    { name: 'Upcoming', path: '/upcoming' },
    { name: 'Assigned to Me', path: '/assigned' },
    { name: 'Settings', path: '/settings' },
  ];

  const linksToRender = user?.role === 'admin' ? adminLinks : memberLinks;

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Tasking</h2>
        </div>

        <nav className="sidebar-nav">
          {linksToRender.map(link => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`sidebar-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}

          {user?.role === 'member' && (
            <div className="sidebar-projects-section">
              <div 
                className="projects-header" 
                onClick={() => setIsProjectsOpen(!isProjectsOpen)}
              >
                <span>My Projects</span>
                <span className={`chevron ${isProjectsOpen ? 'open' : ''}`}>▼</span>
              </div>
              
              {isProjectsOpen && (
                <div className="projects-list">
                  {projects.map(p => (
                    <Link 
                      key={p._id} 
                      to={`/project/${p._id}`} 
                      className={`project-link ${isActive(`/project/${p._id}`) ? 'active' : ''}`}
                    >
                      {p.name}
                    </Link>
                  ))}
                  <button className="add-project-btn" onClick={() => alert('Add Project functionality goes here!')}>
                    + Add Project
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name.charAt(0)}</div>
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
