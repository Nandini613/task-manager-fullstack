import { useState, useEffect } from 'react';
import api from '../api';
import './MasterBoard.css';

const COLUMNS = ['Todo', 'In Progress', 'Review', 'Done'];

const MasterBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [filterPriority, setFilterPriority] = useState('All');

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks/all');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = async (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;
    
    // Optimistic update
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status } : t));

    try {
      await api.put(`/tasks/${taskId}`, { status });
    } catch (err) {
      console.error(err);
      fetchTasks(); // Revert on error
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const filteredTasks = tasks.filter(t => filterPriority === 'All' || t.priority === filterPriority);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Master Taskboard</h1>
          <p className="subtitle">Organization-wide workflow</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select 
            className="priority-select" 
            value={filterPriority} 
            onChange={e => setFilterPriority(e.target.value)}
            style={{ width: '180px' }}
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      <div className="kanban-board">
        {COLUMNS.map(col => (
          <div 
            key={col} 
            className="kanban-column glass-panel"
            onDrop={(e) => handleDrop(e, col)}
            onDragOver={handleDragOver}
          >
            <h3 className="kanban-col-header">
              {col} <span className="task-count">{filteredTasks.filter(t => t.status === col).length}</span>
            </h3>
            <div className="kanban-cards">
              {filteredTasks.filter(t => t.status === col).map(task => (
                <div 
                  key={task._id} 
                  className="kanban-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task._id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100px' }}>{task.projectId?.name}</span>
                  </div>
                  <h4>{task.title}</h4>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <div className="avatar-group">
                      {task.assignees?.map(u => (
                        <div key={u._id} className="avatar" title={u.name}>{u.name.charAt(0)}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasterBoard;
