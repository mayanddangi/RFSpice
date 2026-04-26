import React from 'react';
import { ReactFlowProvider, useReactFlow } from 'reactflow';
import { toPng } from 'html-to-image';
import Split from 'react-split';
import Palette from './ui/Palette';
import Inspector from './ui/Inspector';
import Spectrum from './ui/Spectrum';
import GraphCanvas from './graph/GraphCanvas';
import DbManager from './ui/DbManager';
import { AppProvider, useAppContext } from './AppContext';
import { simulateNetwork } from './sim/engine';

function AppContent() {
  const { setIsDbManagerOpen, setSimulationResult, simulationResult, noiseFloor, setNoiseFloor, minFreq, setMinFreq, freqUnit, setFreqUnit } = useAppContext();
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();

  const handleNew = () => {
    if (window.confirm("Are you sure you want to clear the canvas?")) {
      setNodes([]);
      setEdges([]);
      setSimulationResult(null);
    }
  };

  const handleSaveJSON = () => {
    const data = {
      nodes: getNodes(),
      edges: getEdges()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rfspice_schematic.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            setNodes(data.nodes || []);
            setEdges(data.edges || []);
          } catch (err) {
            alert('Invalid JSON file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleRun = () => {
    const nodes = getNodes();
    const edges = getEdges();
    const result = simulateNetwork(nodes, edges, noiseFloor, minFreq);
    setSimulationResult(result);
  };

  const handleClearProbes = () => {
    setEdges(eds => eds.map(e => ({
      ...e,
      data: { ...e.data, isProbed: false },
      style: { ...e.style, stroke: 'var(--accent)', strokeWidth: 2 }
    })));
  };

  const handleExportPNG = () => {
    const el = document.querySelector('.react-flow');
    if (el) {
      toPng(el).then((dataUrl) => {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'rfspice_canvas.png';
        a.click();
      });
    }
  };

  const handleExportCSV = () => {
    if (!simulationResult || !simulationResult.edgeTones) {
      alert('Please run a simulation first.');
      return;
    }
    
    let csv = "EdgeID,Frequency (Hz),Power (dBm),Origin\n";
    for (const [edgeId, tones] of simulationResult.edgeTones.entries()) {
      for (const t of tones) {
        csv += `${edgeId},${t.f_hz},${t.p_dbm},${t.origin || ''}\n`;
      }
    }
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rfspice_spectrum.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="app-container">
        <div className="top-bar">
          <h1 style={{ margin: '0 10px 0 0' }}>RFSpice</h1>
          <button className="toolbar-btn" onClick={handleNew}>New</button>
          <button className="toolbar-btn" onClick={handleOpenJSON}>Open</button>
          <button className="toolbar-btn" onClick={handleSaveJSON}>Save</button>
          
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '6px', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>Floor (dBm):</label>
            <input 
              type="number" 
              value={noiseFloor} 
              onChange={e => setNoiseFloor(parseFloat(e.target.value) || -120)} 
              style={{ width: '55px', padding: '4px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '4px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '6px', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>Min (Hz):</label>
            <input 
              type="number" 
              value={minFreq} 
              onChange={e => setMinFreq(parseFloat(e.target.value) || 0)} 
              style={{ width: '70px', padding: '4px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '4px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '6px', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>Unit:</label>
            <select 
              value={freqUnit} 
              onChange={e => setFreqUnit(e.target.value)}
              style={{ padding: '4px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer' }}
            >
              <option value="Hz">Hz</option>
              <option value="MHz">MHz</option>
              <option value="GHz">GHz</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '10px' }}></div>

          <button className="toolbar-btn" onClick={handleRun} style={{ background: 'var(--accent)', color: '#fff' }}>Run</button>
          <button className="toolbar-btn" onClick={handleClearProbes}>Clear</button>
          <button className="toolbar-btn" onClick={handleExportPNG}>PNG</button>
          <button className="toolbar-btn" onClick={handleExportCSV}>CSV</button>
          <button className="toolbar-btn" onClick={() => setIsDbManagerOpen(true)}>Parts DB</button>
        </div>
        
        <Split 
          sizes={[70, 30]} 
          direction="vertical" 
          style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}
          gutterSize={8}
          minSize={100}
        >
          <Split 
            sizes={[20, 60, 20]} 
            direction="horizontal" 
            style={{ display: 'flex', flex: 1, overflow: 'hidden' }}
            gutterSize={8}
            minSize={[150, 300, 150]}
          >
            <div className="pane pane-left">
              <Palette />
            </div>
            <div className="pane-center">
              <GraphCanvas />
            </div>
            <div className="pane pane-right">
              <Inspector />
            </div>
          </Split>
          
          <div className="pane-bottom pane">
            <Spectrum />
          </div>
        </Split>
      </div>
      <DbManager />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ReactFlowProvider>
        <AppContent />
      </ReactFlowProvider>
    </AppProvider>
  );
}
