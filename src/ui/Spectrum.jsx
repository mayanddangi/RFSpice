import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useAppContext } from '../AppContext';
import { useEdges } from 'reactflow';

Chart.register(...registerables);

export default function Spectrum() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { simulationResult, freqUnit, noiseFloor } = useAppContext();
  const edges = useEdges();

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    
    chartInstance.current = new Chart(ctx, {
      type: 'scatter',
      data: { datasets: [] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: { display: true, text: `Frequency (MHz)`, color: '#c5c6c7' },
            ticks: { color: '#c5c6c7' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          },
          y: {
            title: { display: true, text: 'Power (dBm)', color: '#c5c6c7' },
            min: -130,
            max: 30,
            ticks: { color: '#c5c6c7' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          }
        },
        plugins: {
          legend: { labels: { color: '#c5c6c7' } },
          tooltip: {
            callbacks: {
              label: (ctx) => `Freq: ${ctx.parsed.x.toFixed(2)} MHz, Power: ${ctx.parsed.y.toFixed(1)} dBm`
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current) return;
    
    chartInstance.current.options.scales.x.title.text = `Frequency (${freqUnit})`;
    chartInstance.current.options.scales.y.min = noiseFloor - 10;
    chartInstance.current.options.plugins.tooltip.callbacks.label = (ctx) => `Freq: ${ctx.parsed.x.toFixed(2)} ${freqUnit}, Power: ${ctx.parsed.y.toFixed(1)} dBm`;

    const probedEdges = edges.filter(e => e.data?.isProbed);
    
    let factor = 1;
    if (freqUnit === 'MHz') factor = 1e-6;
    if (freqUnit === 'GHz') factor = 1e-9;
    
    const datasets = probedEdges.map((edge, i) => {
      const tones = simulationResult?.edgeTones?.get(edge.id) || [];
      const data = tones.map(t => ({ x: t.f_hz * factor, y: t.p_dbm }));
      
      const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];
      const color = colors[i % colors.length];
      
      const stickData = [];
      for (const pt of data) {
        stickData.push({ x: pt.x, y: noiseFloor - 10 });
        stickData.push({ x: pt.x, y: pt.y });
        stickData.push({ x: pt.x, y: null }); // breaks the line
      }
      
      return {
        label: `Probe: Edge ${edge.id}`,
        data: stickData,
        backgroundColor: color,
        borderColor: color,
        showLine: true,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        spanGaps: false
      };
    });

    chartInstance.current.data.datasets = datasets;
    chartInstance.current.update();
    
  }, [simulationResult, edges, freqUnit, noiseFloor]);

  return (
    <>
      <div className="pane-header">Spectrum Plot</div>
      <div className="pane-content" style={{ flex: 1, padding: '10px' }}>
        <canvas ref={chartRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </>
  );
}
