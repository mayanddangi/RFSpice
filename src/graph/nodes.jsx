import React from 'react';
import { Handle, Position } from 'reactflow';
import { useAppContext } from '../AppContext';

export function ComponentNode({ id, data }) {
  const { simulationResult } = useAppContext();
  const warnings = simulationResult?.nodeValidation?.get(id);

  const type = data.componentType || 'unknown';
  
  let inputs = [];
  let outputs = [];

  if (type === 'source') {
    outputs = ['RFout'];
  } else if (type === 'mixer') {
    inputs = ['in1', 'in2'];
    outputs = ['out1'];
  } else if (type === 'termination') {
    inputs = ['RFin'];
  } else if (type === 'coupler') {
    inputs = ['RFin'];
    outputs = ['RFout', 'CPLout'];
  } else {
    inputs = ['RFin'];
    outputs = ['RFout'];
  }

  return (
    <div style={{
      background: 'var(--panel-bg)',
      border: warnings ? '2px solid red' : (data.selected ? '2px solid var(--accent-hover)' : '1px solid var(--accent)'),
      padding: '6px 10px',
      borderRadius: '6px',
      color: 'var(--text-main)',
      minWidth: '80px',
      textAlign: 'center',
      boxShadow: warnings ? '0 0 10px rgba(255, 0, 0, 0.6)' : (data.selected ? '0 0 10px rgba(102, 252, 241, 0.4)' : 'none'),
      backdropFilter: 'blur(5px)',
      position: 'relative'
    }}>
      {warnings && (
        <div 
          style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'red', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'help' }} 
          title={warnings.join('\n')}
        >!</div>
      )}

      {/* Inputs (Target Handles) */}
      {inputs.map((port, i) => {
        const top = `${((i + 1) * 100) / (inputs.length + 1)}%`;
        let label = port.includes('RF') ? 'RF' : port.includes('LO') ? 'LO' : port.includes('IF') ? 'IF' : 'IN';
        
        if (type === 'mixer') {
          const isUp = data.params?.mode === 'Up-converter';
          if (port === 'in1') label = isUp ? 'IF' : 'RF';
          if (port === 'in2') label = 'LO';
        }

        return (
          <React.Fragment key={port}>
            <div style={{ position: 'absolute', left: '-35px', top, transform: 'translateY(-50%)', fontSize: '0.65rem', color: 'var(--accent)', fontWeight: 'bold', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
              {label}
            </div>
            <Handle
              type="target"
              position={Position.Left}
              id={port}
              style={{ 
                top, 
                background: 'var(--accent)', 
                width: '12px', 
                height: '12px', 
                left: '-6px',
                border: '2px solid var(--panel-bg)',
                boxShadow: '0 0 5px var(--accent)'
              }}
            />
          </React.Fragment>
        );
      })}
      
      {/* Node Content */}
      <div style={{ pointerEvents: 'none' }}>
        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '2px', opacity: 0.8 }}>
          {data.label}
        </div>
        <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
          {data.id || type}
        </div>
        {warnings && (
          <div style={{ color: '#ff4444', fontSize: '0.6rem', marginTop: '4px', fontWeight: 'bold' }}>
            {warnings[0]}
          </div>
        )}
      </div>

      {/* Outputs (Source Handles) */}
      {outputs.map((port, i) => {
        const top = `${((i + 1) * 100) / (outputs.length + 1)}%`;
        let label = port.includes('IF') ? 'IF' : port.includes('RF') ? 'RF' : 'OUT';

        if (type === 'mixer') {
          const isUp = data.params?.mode === 'Up-converter';
          if (port === 'out1') label = isUp ? 'RF' : 'IF';
        }

        return (
          <React.Fragment key={port}>
            <div style={{ position: 'absolute', right: '-40px', top, transform: 'translateY(-50%)', fontSize: '0.65rem', color: 'var(--accent)', fontWeight: 'bold', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
              {label}
            </div>
            <Handle
              type="source"
              position={Position.Right}
              id={port}
              style={{ 
                top, 
                background: 'var(--accent)', 
                width: '12px', 
                height: '12px', 
                right: '-6px',
                border: '2px solid var(--panel-bg)',
                boxShadow: '0 0 5px var(--accent)'
              }}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}
