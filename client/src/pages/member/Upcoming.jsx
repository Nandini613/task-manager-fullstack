import { useState, useEffect } from 'react';
import api from '../../api';

const Upcoming = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks/member/my-tasks');
        
        // Filter for upcoming (tomorrow onwards)
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        const upcomingTasks = res.data.filter(t => t.dueDate && new Date(t.dueDate) > today);
        
        setTasks(upcomingTasks);
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
        <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Upcoming</h1>
        <p className="subtitle">Look ahead at what's on the horizon</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {tasks.length > 0 ? tasks.map(task => (
          <div key={task._id} className="task-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{task.title}</h3>
            <div style={{ marginTop: 'auto', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>{task.projectId?.name}</span>
              <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
        )) : (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>No upcoming tasks scheduled.</div>
        )}
      </div>
    </div>
  );
};

export default Upcoming;
