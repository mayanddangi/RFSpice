import React, { useEffect, useState } from 'react';
import { useAppContext } from '../AppContext';
import { useReactFlow } from 'reactflow';
import { COMPONENT_SCHEMAS } from '../components/schemas';
import seedData from '../data/components.json';

export default function Inspector() {
  const { inspectedNodeId, setInspectedNodeId } = useAppContext();
  const { getNode, setNodes } = useReactFlow();
  const [formData, setFormData] = useState({});
  const [db, setDb] = useState([]);

  useEffect(() => {
    const savedDbStr = localStorage.getItem('rfspice_db');
    let currentDb = seedData;
    if (savedDbStr) {
      try {
        const savedDb = JSON.parse(savedDbStr);
        const savedIds = new Set(savedDb.map(item => item.id));
        const newItems = seedData.filter(item => !savedIds.has(item.id));
        currentDb = [...savedDb, ...newItems];
      } catch (e) {
        currentDb = seedData;
      }
    }
    setDb(currentDb);
  }, []);

  const node = inspectedNodeId ? getNode(inspectedNodeId) : null;

  useEffect(() => {
    if (node) {
      const type = node.data.componentType;
      const schema = COMPONENT_SCHEMAS[type] || {};
      
      const initialParams = {};
      Object.keys(schema).forEach(key => {
        initialParams[key] = node.data.params?.[key] ?? schema[key].default;
      });
      
      setFormData(initialParams);
      
      if (!node.data.params) {
        setNodes(nds => nds.map(n => n.id === node.id ? { ...n, data: { ...n.data, params: initialParams } } : n));
      }
    }
  }, [inspectedNodeId, node?.id, setNodes]);

  if (!node) {
    return (
      <>
        <div className="pane-header">Property Inspector</div>
        <div className="pane-content">
          <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>Double-click a component to inspect properties.</p>
        </div>
      </>
    );
  }

  const type = node.data.componentType;
  const schema = COMPONENT_SCHEMAS[type] || {};

  const handleChange = (key, value, valueType) => {
    const val = valueType === 'number' ? parseFloat(value) : value;
    const newFormData = { ...formData, [key]: val };
    setFormData(newFormData);
    
    setNodes(nds => nds.map(n => {
      if (n.id === node.id) {
        return { ...n, data: { ...n.data, params: newFormData } };
      }
      return n;
    }));
  };

  const handleLoadFromDb = (e) => {
    const partId = e.target.value;
    if (!partId) return;
    const partData = db.find(p => p.id === partId);
    if (partData) {
      const newFormData = { ...formData, ...partData.params };
      setFormData(newFormData);
      setNodes(nds => nds.map(n => n.id === node.id ? { ...n, data: { ...n.data, params: newFormData } } : n));
    }
  };

  const handleDeleteNode = () => {
    setNodes(nds => nds.filter(n => n.id !== node.id));
    setInspectedNodeId(null);
  };

  const matchingParts = db.filter(p => p.type === type);

  return (
    <>
      <div className="pane-header">
        Inspector: {node.data.label}
        <button onClick={() => setInspectedNodeId(null)} style={{ float: 'right', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>×</button>
      </div>
      <div className="pane-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '30px' }}>
        
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '4px' }}>Load from Component DB</label>
          <select 
            onChange={handleLoadFromDb}
            defaultValue=""
            style={{ width: '100%', padding: '6px', background: 'rgba(0,0,0,0.3)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
          >
            <option value="" disabled>-- Select Part --</option>
            {matchingParts.map(p => (
              <option key={p.id} value={p.id}>{p.vendor} {p.part}</option>
            ))}
          </select>
        </div>

        <hr style={{ borderColor: 'var(--border-color)', width: '100%', margin: '4px 0' }} />

        {Object.entries(schema).map(([key, field]) => (
          <div key={key}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '4px' }}>{field.label}</label>
            {field.type === 'select' ? (
              <select 
                value={formData[key] ?? field.default}
                onChange={(e) => handleChange(key, e.target.value, field.type)}
                style={{ width: '100%', padding: '6px', background: 'rgba(0,0,0,0.3)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
              >
                {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : (
              <input 
                type="number"
                step="any"
                value={formData[key] ?? field.default}
                onChange={(e) => handleChange(key, e.target.value, field.type)}
                style={{ width: '100%', padding: '6px', background: 'rgba(0,0,0,0.3)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            )}
          </div>
        ))}
        
        <button 
          onClick={handleDeleteNode}
          style={{ marginTop: '20px', background: 'rgba(255, 0, 0, 0.2)', color: '#ff4444', padding: '8px', border: '1px solid #ff4444', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Delete Component
        </button>
      </div>
    </>
  );
}
