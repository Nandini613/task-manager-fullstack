import { useState, useEffect } from 'react';
import api from '../../api';

const AssignedToMe = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks/member/my-tasks');
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <div style={{ padding: '24px' }}>Loading...</div>;

  return (
    <div style={{ paddingBottom: '24px' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Assigned to Me</h1>
        <p className="subtitle">All tasks currently assigned to you across all projects</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {tasks.length > 0 ? tasks.map(task => (
          <div key={task._id} className="task-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '12px' }}>
              <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
              <span className={`status-badge status-${task.status.toLowerCase().replace(' ', '')}`}>{task.status}</span>
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{task.title}</h3>
            {task.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{task.description}</p>}
            
            <div style={{ marginTop: 'auto', width: '100%', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>{task.projectId?.name}</span>
              {task.dueDate && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
            </div>
          </div>
        )) : (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>No tasks assigned to you.</div>
        )}
      </div>
    </div>
  );
};

export default AssignedToMe;
