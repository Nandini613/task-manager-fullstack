import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../AuthContext";

const ProjectView = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  
  const [availableMembers, setAvailableMembers] = useState([]);
  const [selectedMemberEmail, setSelectedMemberEmail] = useState("");

  const fetchProjectData = async () => {
    try {
      const res = await api.get('/projects');
      const currProject = res.data.find(p => p._id === id);
      setProject(currProject);
      
      const tasksRes = await api.get(`/tasks/${id}`);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error(err);
    }
  };
  
  const fetchTasksOnly = async () => {
      const tasksRes = await api.get(`/tasks/${id}`);
      setTasks(tasksRes.data);
  }

  const fetchMembers = async () => {
    if (user.role === 'admin') {
      try {
        const res = await api.get('/auth/members');
        setAvailableMembers(res.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchProjectData();
    fetchMembers();
  }, [id]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      await api.post(`/tasks/${id}`, { title, description, priority, dueDate });
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDueDate("");
      fetchTasksOnly();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleComplete = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, { completed: !task.completed });
      fetchTasksOnly();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasksOnly();
    } catch (error) {
      console.error(error);
    }
  };

  const addMember = async (e) => {
    e.preventDefault();
    if (!selectedMemberEmail) return;
    try {
      await api.post(`/projects/${id}/members`, { email: selectedMemberEmail });
      setSelectedMemberEmail("");
      fetchProjectData(); // refresh project members
      alert("Member added successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add member");
    }
  };

  const getPriorityColor = (prio) => {
    if (prio === 'High') return 'priority-high';
    if (prio === 'Medium') return 'priority-medium';
    return 'priority-low';
  };

  if (!project) return <div className="app-wrapper"><div className="container" style={{textAlign:'center'}}>Loading...</div></div>;

  return (
    <div className="app-wrapper">
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ textAlign: 'left' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '8px', display: 'inline-block' }}>← Back to Dashboard</Link>
            <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>{project.name}</h1>
            <p className="subtitle">{project.description}</p>
          </div>
        </header>

        {user.role === 'admin' && (
          <form className="input-section" onSubmit={addMember} style={{ marginBottom: '24px', padding: '16px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Add Member to Project</h3>
            <div className="input-row">
              <select 
                className="priority-select" 
                value={selectedMemberEmail} 
                onChange={(e) => setSelectedMemberEmail(e.target.value)}
                style={{ flex: 2 }}
              >
                <option value="">Select Member...</option>
                {availableMembers.map(m => (
                  <option key={m._id} value={m.email}>{m.name} ({m.email})</option>
                ))}
              </select>
              <button type="submit" className="add-btn" style={{ flex: 1 }}>Add Member</button>
            </div>
            {project.members && project.members.length > 0 && (
               <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                 Current Members: {project.members.map(m => m.name).join(', ')}
               </div>
            )}
          </form>
        )}

        <form className="input-section" onSubmit={addTask}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Task Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="input-row">
            <input
              type="text"
              placeholder="Description (Optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="desc-input"
            />
            <input 
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="date-input"
            />
            <select 
              value={priority} 
              onChange={(e) => setPriority(e.target.value)}
              className="priority-select"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <button type="submit" className="add-btn">Add Task</button>
          </div>
        </form>

        <div className="task-list">
          {tasks.map((task) => (
            <div className={`task-card ${task.completed ? 'completed' : ''}`} key={task._id}>
              <div className="task-content" onClick={() => toggleComplete(task)}>
                <div className="checkbox-wrapper">
                  <div className={`custom-checkbox ${task.completed ? 'checked' : ''}`}>
                    {task.completed && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="task-details">
                  <span className="task-title">{task.title}</span>
                  {task.description && <span className="task-desc">{task.description}</span>}
                  {task.dueDate && (
                    <span className="task-date">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="calendar-icon">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="task-actions">
                <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                  {task.priority || "Medium"}
                </span>
                <button 
                  className="delete-btn" 
                  onClick={() => deleteTask(task._id)}
                  aria-label="Delete Task"
                  type="button"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="empty-state">
              <p>No tasks yet in this project. Add one above!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProjectView;
