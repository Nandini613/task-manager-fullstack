import { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name: newProjectName, description: newProjectDesc });
      setNewProjectName('');
      setNewProjectDesc('');
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-wrapper">
      <div className="container" style={{ maxWidth: '800px' }}>
        <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Dashboard</h1>
            <p className="subtitle">Welcome, {user.name} ({user.role})</p>
          </div>
          <button className="delete-btn" onClick={logout} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Logout</button>
        </header>

        {user.role === 'admin' && (
          <form className="input-section" onSubmit={handleCreateProject}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Create New Project</h2>
            <div className="input-row">
              <input
                type="text"
                placeholder="Project Name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                required
                style={{ flex: 1 }}
              />
              <input
                type="text"
                placeholder="Description"
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                className="desc-input"
              />
              <button type="submit" className="add-btn">Create</button>
            </div>
          </form>
        )}

        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Your Projects</h2>
          {projects.length === 0 ? (
            <div className="empty-state">
              <p>No projects found. {user.role === 'admin' ? 'Create one above!' : 'Ask an admin to add you to a project.'}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {projects.map(project => (
                <Link to={`/project/${project._id}`} key={project._id} style={{ textDecoration: 'none' }}>
                  <div className="task-card" style={{ flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>{project.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>{project.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.8rem', color: 'var(--accent-primary)' }}>
                      <span>{project.members?.length || 0} Members</span>
                      <span>View Project →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
