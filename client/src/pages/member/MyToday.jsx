import { useState, useEffect } from 'react';
import api from '../../api';

const MyToday = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks/member/my-tasks');
        
        // Filter for today
        const todayStr = new Date().toDateString();
        const todayTasks = res.data.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === todayStr);
        
        setTasks(todayTasks);
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
        <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>My Today</h1>
        <p className="subtitle">Tasks demanding your attention today</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tasks.length > 0 ? tasks.map(task => (
          <div key={task._id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                <span className={`status-badge status-${task.status.toLowerCase().replace(' ', '')}`}>{task.status}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: '600' }}>{task.projectId?.name}</span>
              </div>
              <h3 style={{ fontSize: '1.2rem' }}>{task.title}</h3>
            </div>
            <div>
               <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>{task.priority} Priority</span>
            </div>
          </div>
        )) : (
          <div className="empty-state">You're all caught up for today! 🎉</div>
        )}
      </div>
    </div>
  );
};

export default MyToday;
