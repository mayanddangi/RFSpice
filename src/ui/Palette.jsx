import React from 'react';

const componentTypes = [
  { type: 'source', label: 'RF Source' },
  { type: 'amplifier', label: 'Amplifier' },
  { type: 'attenuator', label: 'Attenuator' },
  { type: 'filter', label: 'Filter' },
  { type: 'mixer', label: 'Mixer' },
  { type: 'multiplier', label: 'Multiplier' },
  { type: 'vco', label: 'VCO' },
  { type: 'bias_tee', label: 'Bias-Tee' },
  { type: 'coupler', label: 'Coupler' },
  { type: 'termination', label: 'Termination' }
];

export default function Palette() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <>
      <div className="pane-header">Component Palette</div>
      <div className="pane-content" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {componentTypes.map((c) => (
          <div
            key={c.type}
            className="palette-item"
            onDragStart={(event) => onDragStart(event, c.type)}
            draggable
            style={{
              padding: '10px 12px',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              cursor: 'grab',
              background: 'rgba(0,0,0,0.3)',
              userSelect: 'none',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = 'var(--panel-bg)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(0,0,0,0.3)'}
          >
            {c.label}
          </div>
        ))}
      </div>
    </>
  );
}
