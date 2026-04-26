export function applyMixer(inTonesByPort, params, options = {}) {
  const isUp = params.mode === 'Up-converter';
  
  // New permanent handle logic:
  // in1: Signal (RF in Standard, IF in Up)
  // in2: LO
  // out1: Output (IF in Standard, RF in Up)
  const signalTones = inTonesByPort['in1'] || [];
  const loTones = inTonesByPort['in2'] || [];
  const floor = options.noiseFloor ?? -120;
  
  const outTones = [];
  
  for (const sig of signalTones) {
    for (const lo of loTones) {
      const p_in = sig.p_dbm; 
      const loss = params.conv_loss_db || 8.3;
      const ip3 = params.ip3_dbm || 20;
      const p_fund = p_in - loss;
      
      // P_spur(n) = P_fund - (n - 1)(IP3 - P_in)
      const calcPout = (n) => p_fund - (n - 1) * (ip3 - p_in);

      // Order n=1: Main Sidebands
      const p1 = calcPout(1);
      outTones.push({ f_hz: Math.abs(sig.f_hz + lo.f_hz), p_dbm: p1, origin: `Mixer SB n=1 (Sum)` });
      outTones.push({ f_hz: Math.abs(sig.f_hz - lo.f_hz), p_dbm: p1, origin: `Mixer SB n=1 (Diff)` });
      
      // Order n=2: 2nd Sidebands
      const p2 = calcPout(2);
      if (p2 > floor) {
        outTones.push({ f_hz: Math.abs(sig.f_hz + 2 * lo.f_hz), p_dbm: p2, origin: `Mixer SB n=2 (Sum)` });
        outTones.push({ f_hz: Math.abs(sig.f_hz - 2 * lo.f_hz), p_dbm: p2, origin: `Mixer SB n=2 (Diff)` });
      }
      
      // Order n=3: 3rd Sidebands
      const p3 = calcPout(3);
      if (p3 > floor) {
        outTones.push({ f_hz: Math.abs(sig.f_hz + 3 * lo.f_hz), p_dbm: p3, origin: `Mixer SB n=3 (Sum)` });
        outTones.push({ f_hz: Math.abs(sig.f_hz - 3 * lo.f_hz), p_dbm: p3, origin: `Mixer SB n=3 (Diff)` });
      }
    }
  }
  
  for (const lo of loTones) {
    const leakageP = lo.p_dbm - (params.isolation_lo_if || 23);
    outTones.push({ f_hz: lo.f_hz, p_dbm: leakageP, origin: 'LO Leakage' });
  }
  
  for (const sig of signalTones) {
    outTones.push({ f_hz: sig.f_hz, p_dbm: sig.p_dbm - 30, origin: 'Signal Leakage' });
  }
  
  return { out1: outTones };
}
