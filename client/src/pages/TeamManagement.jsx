import { useState, useEffect } from 'react';
import api from '../api';

const TeamManagement = () => {
  const [users, setUsers] = useState([]);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  
  // Invite form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fetchWorkloads = async () => {
    try {
      const res = await api.get('/admin/workloads');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWorkloads();
  }, []);

  const toggleStatus = async (id) => {
    try {
      await api.put(`/admin/users/${id}/toggle-status`);
      fetchWorkloads();
    } catch (err) {
      alert(err.response?.data?.message || 'Error toggling status');
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { name, email, password });
      setIsInviteOpen(false);
      setName('');
      setEmail('');
      setPassword('');
      fetchWorkloads();
    } catch (err) {
      alert(err.response?.data?.message || 'Error inviting member');
    }
  };

  return (
    <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', minHeight: '600px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Team Management</h1>
          <p className="subtitle">Overview of member workloads and statuses</p>
        </div>
        <button className="add-btn" onClick={() => setIsInviteOpen(true)}>+ Invite Member</button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
              <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Name</th>
              <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Email</th>
              <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Workload (Active Tasks)</th>
              <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Status</th>
              <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <td style={{ padding: '16px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="avatar" style={{ margin: 0 }}>{user.name.charAt(0)}</div>
                    {user.name}
                  </div>
                </td>
                <td style={{ padding: '16px 12px', color: 'var(--text-muted)' }}>{user.email}</td>
                <td style={{ padding: '16px 12px' }}>
                  <span style={{ 
                    background: user.workload > 5 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)', 
                    color: user.workload > 5 ? '#ef4444' : '#818cf8',
                    padding: '4px 12px', borderRadius: '12px', fontWeight: 600, fontSize: '0.85rem'
                  }}>
                    {user.workload} Tasks
                  </span>
                </td>
                <td style={{ padding: '16px 12px' }}>
                  <span className={`status-badge ${user.isActive ? 'status-done' : 'status-review'}`}>
                    {user.isActive ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td style={{ padding: '16px 12px' }}>
                  <button 
                    onClick={() => toggleStatus(user._id)}
                    style={{
                      background: 'none', border: '1px solid var(--border-glass)', 
                      color: 'var(--text-primary)', padding: '6px 12px', 
                      borderRadius: '8px', cursor: 'pointer', transition: 'var(--transition)'
                    }}
                    onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseOut={e => e.target.style.background = 'none'}
                  >
                    {user.isActive ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>No members found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-out Invite Form */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: '350px', height: '100%',
        background: 'var(--glass-bg)', backdropFilter: 'blur(30px)',
        borderLeft: '1px solid var(--border-glass)', padding: '24px',
        transform: isInviteOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 10,
        boxShadow: '-10px 0 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>Invite Member</h2>
          <button onClick={() => setIsInviteOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>
        <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%' }} />
          <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%' }} />
          <input type="password" placeholder="Temporary Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%' }} />
          <button type="submit" className="add-btn" style={{ marginTop: '8px', width: '100%' }}>Send Invite</button>
        </form>
      </div>
    </div>
  );
};

export default TeamManagement;
