import { useState, useEffect } from 'react';
import api from '../../api';

const MyInbox = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks/member/my-tasks');
        
        // Filter for "Inbox" items: High priority, or in Todo/Review
        const inboxTasks = res.data.filter(t => 
          t.priority === 'High' || t.status === 'Todo' || t.status === 'Review'
        );
        
        setTasks(inboxTasks);
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
        <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>My Inbox</h1>
        <p className="subtitle">High priority and actionable items awaiting your attention</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tasks.length > 0 ? tasks.map(task => (
          <div key={task._id} className="glass-panel" style={{ display: 'flex', gap: '16px', borderLeft: task.priority === 'High' ? '4px solid #ef4444' : '1px solid var(--border-glass)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                <span className={`status-badge status-${task.status.toLowerCase().replace(' ', '')}`}>{task.status}</span>
                {task.priority === 'High' && <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600 }}>🔥 HIGH PRIORITY</span>}
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{task.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Project: {task.projectId?.name}</p>
            </div>
            <div>
              <button className="add-btn" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>View Task</button>
            </div>
          </div>
        )) : (
          <div className="empty-state">Your inbox is clear! 🎉</div>
        )}
      </div>
    </div>
  );
};

export default MyInbox;
