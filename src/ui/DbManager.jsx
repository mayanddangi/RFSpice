import React, { useEffect, useState } from 'react';
import { useAppContext } from '../AppContext';
import seedData from '../data/components.json';

export default function DbManager() {
  const { isDbManagerOpen, setIsDbManagerOpen } = useAppContext();
  const [db, setDb] = useState([]);

  useEffect(() => {
    const savedDbStr = localStorage.getItem('rfspice_db');
    let currentDb = seedData;
    if (savedDbStr) {
      try {
        const savedDb = JSON.parse(savedDbStr);
        // Merge: Add any seed items that are not in savedDb by ID
        const savedIds = new Set(savedDb.map(item => item.id));
        const newItems = seedData.filter(item => !savedIds.has(item.id));
        currentDb = [...savedDb, ...newItems];
      } catch (e) {
        currentDb = seedData;
      }
    }
    setDb(currentDb);
    localStorage.setItem('rfspice_db', JSON.stringify(currentDb));
  }, [isDbManagerOpen]);

  const handleReset = () => {
    if (window.confirm("This will reset the database to factory defaults. All custom parts will be lost. Continue?")) {
      setDb(seedData);
      localStorage.setItem('rfspice_db', JSON.stringify(seedData));
    }
  };

  if (!isDbManagerOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        width: '80%', height: '80%', background: 'var(--panel-bg)',
        border: '1px solid var(--accent)', borderRadius: '8px',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        <div className="pane-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Component Database Manager</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleReset} style={{ background: 'rgba(255,165,0,0.2)', border: '1px solid orange', color: 'orange', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Reset to Factory</button>
            <button onClick={() => setIsDbManagerOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
          </div>
        </div>
        <div className="pane-content" style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--accent)' }}>
                <th style={{ padding: '8px 4px' }}>ID</th>
                <th>Type</th>
                <th>Vendor</th>
                <th>Part</th>
                <th>Ports</th>
              </tr>
            </thead>
            <tbody>
              {db.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <td style={{ padding: '8px 4px' }}>{item.id}</td>
                  <td>{item.type}</td>
                  <td>{item.vendor}</td>
                  <td>{item.part}</td>
                  <td>{item.ports.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ opacity: 0.5, marginTop: '20px' }}>Adding/editing features can be implemented here.</p>
        </div>
      </div>
    </div>
  );
}
