import React from 'react';

const AdminSettings = () => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Workspace Settings</h1>
        <p className="subtitle">Configure branding, exports, and security</p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div className="glass-panel" style={{ flex: 1, minWidth: '300px' }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--accent-primary)' }}>Workspace Branding</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label>Organization Name</label>
            <input type="text" defaultValue="Tasking HQ" />
            <label>Primary Logo</label>
            <input type="file" />
            <button className="add-btn" style={{ marginTop: '12px' }}>Save Branding</button>
          </div>
        </div>

        <div className="glass-panel" style={{ flex: 1, minWidth: '300px' }}>
          <h3 style={{ marginBottom: '16px', color: '#10b981' }}>Data Export</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Export all organization tasks, users, and projects as a CSV.</p>
          <button className="add-btn" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>Generate CSV Report</button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
