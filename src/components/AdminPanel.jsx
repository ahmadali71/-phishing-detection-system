import React, { useState } from 'react';
import {
  Upload,
  Cpu,
  FileText,
  Activity,
  Users,
  Trash2,
  Check
} from 'lucide-react';

export default function AdminPanel({
  models,
  onAddModel,
  onToggleModelStatus,
  onDeleteModel,
  logs,
  onAddLog,
  stats,
  usersList,
  onUpdateUserRole,
  t
}) {
  const [activeAdminTab, setActiveAdminTab] = useState('models');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newModelName, setNewModelName] = useState('');
  const [newModelFramework, setNewModelFramework] = useState('Scikit-Learn');
  const [newModelType, setNewModelType] = useState('Supervised Classifier');
  const [newModelAccuracy, setNewModelAccuracy] = useState('96.8%');

  const [logFilter, setLogFilter] = useState('ALL');
  const [newLogMsg, setNewLogMsg] = useState('');

  const filteredLogs = logs.filter(l => logFilter === 'ALL' || l.level === logFilter);

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newModelName) return;

    if (onAddModel) {
      onAddModel({
        id: `M-0${models.length + 1}`,
        name: newModelName,
        type: newModelType,
        accuracy: newModelAccuracy,
        status: 'Active',
        framework: newModelFramework,
        date: new Date().toISOString().split('T')[0]
      });
    }

    if (onAddLog) {
      onAddLog('INFO', 'Admin Panel', `Deployed new machine learning model: ${newModelName}`);
    }

    setNewModelName('');
    setShowUploadModal(false);
  };

  const handleManualLogSubmit = (e) => {
    e.preventDefault();
    if (!newLogMsg || !onAddLog) return;
    onAddLog('INFO', 'Admin Note', newLogMsg);
    setNewLogMsg('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-warning">System Administrator</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Real-Time Orchestration</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.8rem)', fontWeight: '800' }}>Admin Management Suite</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Manage active ML models, inspect live system event logs, monitor compute performance, and manage access.
          </p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="btn-primary">
          <Upload size={16} /> Deploy New Model
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="admin-tabs" style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', overflowX: 'auto', flexShrink: 0 }}>
        <button
          onClick={() => setActiveAdminTab('models')}
          className="btn-secondary"
          style={{
            background: activeAdminTab === 'models' ? '#2563eb' : 'var(--bg-input)',
            color: activeAdminTab === 'models' ? 'white' : 'var(--text-secondary)',
            fontWeight: '700'
          }}
        >
          <Cpu size={16} /> ML Models ({models.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('logs')}
          className="btn-secondary"
          style={{
            background: activeAdminTab === 'logs' ? '#2563eb' : 'var(--bg-input)',
            color: activeAdminTab === 'logs' ? 'white' : 'var(--text-secondary)',
            fontWeight: '700'
          }}
        >
          <FileText size={16} /> Live Logs ({logs.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('performance')}
          className="btn-secondary"
          style={{
            background: activeAdminTab === 'performance' ? '#2563eb' : 'var(--bg-input)',
            color: activeAdminTab === 'performance' ? 'white' : 'var(--text-secondary)',
            fontWeight: '700'
          }}
        >
          <Activity size={16} /> Performance
        </button>

        <button
          onClick={() => setActiveAdminTab('users')}
          className="btn-secondary"
          style={{
            background: activeAdminTab === 'users' ? '#2563eb' : 'var(--bg-input)',
            color: activeAdminTab === 'users' ? 'white' : 'var(--text-secondary)',
            fontWeight: '700'
          }}
        >
          <Users size={16} /> Users
        </button>
      </div>

      {/* Models Tab */}
      {activeAdminTab === 'models' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Trained ML Models</h3>
            <span className="badge badge-emerald">Ensemble Active</span>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Model ID</th>
                  <th>Model Name</th>
                  <th>Framework</th>
                  <th>Accuracy</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {models.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>{m.id}</td>
                    <td style={{ fontWeight: '700' }}>
                      {m.name}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '400' }}>{m.type}</div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{m.framework}</td>
                    <td style={{ fontWeight: '800', color: '#10b981' }}>{m.accuracy}</td>
                    <td>
                      <span className={`badge badge-${m.status === 'Active' ? 'emerald' : 'warning'}`}>
                        {m.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => onToggleModelStatus(m.id)}
                          className="btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                        >
                          {m.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => onDeleteModel(m.id)}
                          className="btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '4px 8px', color: '#f87171' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeAdminTab === 'logs' && (
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Real-Time System Log Stream</h3>

            <div style={{ display: 'flex', gap: '6px' }}>
              {['ALL', 'INFO', 'WARN', 'THREAT'].map((level) => (
                <button
                  key={level}
                  onClick={() => setLogFilter(level)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    border: 'none',
                    background: logFilter === level ? '#2563eb' : 'var(--bg-input)',
                    color: logFilter === level ? 'white' : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: '#090d16', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', height: '320px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredLogs.map((log) => (
              <div key={log.id} style={{ display: 'flex', gap: '12px', borderBottom: '1px dotted rgba(255,255,255,0.08)', paddingBottom: '4px', flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--text-muted)' }}>[{log.timestamp}]</span>
                <span style={{ color: log.level === 'THREAT' ? '#ef4444' : (log.level === 'WARN' ? '#f59e0b' : '#60a5fa'), fontWeight: '700' }}>
                  {log.level}
                </span>
                <span style={{ color: '#a855f7' }}>[{log.module}]</span>
                <span style={{ color: 'var(--text-primary)' }}>{log.message}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleManualLogSubmit} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Add admin log note..."
              value={newLogMsg}
              onChange={(e) => setNewLogMsg(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn-secondary">
              Add Log
            </button>
          </form>
        </div>
      )}

      {/* Performance Tab */}
      {activeAdminTab === 'performance' && (
        <div className="grid-3">
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>Average Inference Latency</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', margin: '6px 0', color: '#60a5fa' }}>42.5 ms</div>
            <div style={{ fontSize: '0.75rem', color: '#10b981' }}>⚡ Real-time prediction target met</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>Scan Throughput Capacity</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', margin: '6px 0', color: '#a855f7' }}>{stats.totalScans + 1200} req/sec</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Scalable worker threads</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>Memory & CPU Load</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', margin: '6px 0', color: '#10b981' }}>28% CPU</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>1.2 GB / 8.0 GB RAM</div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeAdminTab === 'users' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px' }}>Registered User Accounts</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '700' }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className="badge badge-blue">{u.role}</span></td>
                    <td><span className="badge badge-emerald">Active</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => onUpdateUserRole(u.email, u.role === 'Admin' ? 'User' : 'Admin')}
                        className="btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                      >
                        Toggle Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '460px', padding: '24px', background: 'var(--bg-secondary)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px' }}>Deploy Machine Learning Model</h3>
            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Model Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. XGBoost Phishing Engine v3.0"
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  style={{ width: '100%', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Framework</label>
                  <select
                    value={newModelFramework}
                    onChange={(e) => setNewModelFramework(e.target.value)}
                    style={{ width: '100%', marginTop: '4px' }}
                  >
                    <option value="Scikit-Learn">Scikit-Learn</option>
                    <option value="PyTorch">PyTorch</option>
                    <option value="TensorFlow">TensorFlow</option>
                    <option value="XGBoost">XGBoost</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Accuracy</label>
                  <input
                    type="text"
                    value={newModelAccuracy}
                    onChange={(e) => setNewModelAccuracy(e.target.value)}
                    style={{ width: '100%', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Deploy Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
