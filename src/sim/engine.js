import { applySource } from './rules/source';
import { applyAmplifier } from './rules/amplifier';
import { applyAttenuator } from './rules/attenuator';
import { applyFilter } from './rules/filter';
import { applyMixer } from './rules/mixer';
import { applyMultiplier } from './rules/multiplier';
import { applyVCO } from './rules/vco';
import { applyBiasTee } from './rules/bias_tee';
import { applyCoupler } from './rules/coupler';
import { cleanTones } from './tones';

const rules = {
  source: applySource,
  amplifier: applyAmplifier,
  attenuator: applyAttenuator,
  filter: applyFilter,
  mixer: applyMixer,
  multiplier: applyMultiplier,
  vco: applyVCO,
  bias_tee: applyBiasTee,
  coupler: applyCoupler,
  termination: () => []
};

export function simulateNetwork(nodes, edges, noiseFloor = -120, minFreq = 0) {
  const nodeMap = new Map();
  nodes.forEach(n => nodeMap.set(n.id, n));
  
  const adj = new Map();
  const inDegree = new Map();
  
  nodes.forEach(n => {
    adj.set(n.id, []);
    inDegree.set(n.id, 0);
  });
  
  edges.forEach(e => {
    adj.get(e.source).push({ target: e.target, edgeId: e.id, sourceHandle: e.sourceHandle, targetHandle: e.targetHandle });
    inDegree.set(e.target, inDegree.get(e.target) + 1);
  });
  
  const queue = [];
  nodes.forEach(n => {
    if (inDegree.get(n.id) === 0) {
      queue.push(n.id);
    }
  });
  
  const sorted = [];
  while (queue.length > 0) {
    const u = queue.shift();
    sorted.push(u);
    adj.get(u).forEach(v => {
      inDegree.set(v.target, inDegree.get(v.target) - 1);
      if (inDegree.get(v.target) === 0) {
        queue.push(v.target);
      }
    });
  }
  
  if (sorted.length !== nodes.length) {
    console.warn("Cycle detected in graph! Simulation may be incomplete.");
  }
  
  const edgeTones = new Map();
  const nodeInTones = new Map(); // nodeId -> { handleId: [] }
  const nodeValidation = new Map(); // nodeId -> string[]
  
  nodes.forEach(n => nodeInTones.set(n.id, {}));
  
  for (const nodeId of sorted) {
    const node = nodeMap.get(nodeId);
    const type = node.data.componentType;
    const params = node.data.params || {};
    const inTonesByPort = nodeInTones.get(nodeId);
    
    const rule = rules[type];
    let outTones = [];
    if (rule) {
      if (type === 'source' || type === 'vco') {
        outTones = rule(params);
      } else {
        outTones = rule(inTonesByPort, params, { noiseFloor });
      }
    } else {
      outTones = Object.values(inTonesByPort)[0] || [];
    }
    
    // Validation
    const warnings = [];
    const outTonesFlat = Array.isArray(outTones) ? outTones : Object.values(outTones).flat();
    const inTonesFlat = Object.values(inTonesByPort).flat();
    
    if (type === 'amplifier' && params.p1db_dbm !== undefined) {
      if (outTonesFlat.some(t => t.p_dbm > params.p1db_dbm - 1)) {
        warnings.push("P1dB Compression/Saturation");
      }
    }
    
    if (params.freq_max_hz || params.freq_min_hz) {
      const maxF = params.freq_max_hz || Infinity;
      const minF = params.freq_min_hz || 0;
      
      // For sources/VCOs, validate the output. For everything else, validate the input frequency range.
      const tonesToCheck = (type === 'source' || type === 'vco') ? outTonesFlat : inTonesFlat;
      
      if (tonesToCheck.some(t => t.f_hz < minF || t.f_hz > maxF)) {
        warnings.push("Out of Band Tones");
      }
    }
    
    if (warnings.length > 0) {
      nodeValidation.set(nodeId, warnings);
    }
    
    const outEdges = adj.get(nodeId);
    for (const edgeInfo of outEdges) {
      const eId = edgeInfo.edgeId;
      const targetId = edgeInfo.target;
      const tHandle = edgeInfo.targetHandle || 'RFin';
      const sHandle = edgeInfo.sourceHandle;
      
      let propagatedTones = [];
      if (Array.isArray(outTones)) {
        propagatedTones = cleanTones(outTones, noiseFloor, minFreq);
      } else if (outTones && outTones[sHandle]) {
        propagatedTones = cleanTones(outTones[sHandle], noiseFloor, minFreq);
      } else if (outTones && outTones['RFout']) {
        propagatedTones = cleanTones(outTones['RFout'], noiseFloor, minFreq); // fallback
      }
      
      edgeTones.set(eId, propagatedTones);
      
      const currentTargetTones = nodeInTones.get(targetId);
      if (!currentTargetTones[tHandle]) {
        currentTargetTones[tHandle] = [];
      }
      currentTargetTones[tHandle] = cleanTones(currentTargetTones[tHandle].concat(propagatedTones), noiseFloor, minFreq);
    }
  }
  
  return { edgeTones, nodeInTones, nodeValidation };
}
