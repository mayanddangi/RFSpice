export function applyAmplifier(inTonesByPort, params, options = {}) {
  const inTones = inTonesByPort['RFin'] || Object.values(inTonesByPort)[0] || [];
  const gain = params.gain_db || 0;
  const p1db = params.p1db_dbm || 100;
  const oip3 = params.oip3_dbm || 100;
  const floor = options.noiseFloor ?? -120;
  
  const outTones = [];
  
  for (const t of inTones) {
    let p_out = t.p_dbm + gain;
    if (p_out > p1db - 10) {
      const diff = p_out - (p1db - 10);
      p_out -= (diff * diff) / 40;
    }
    if (p_out > p1db + 3) p_out = p1db + 3;
    
    outTones.push({
      f_hz: t.f_hz,
      p_dbm: p_out,
      origin: t.origin
    });
  }
  
  for (let i=0; i<outTones.length; i++) {
    for (let j=i+1; j<outTones.length; j++) {
      const t1 = outTones[i];
      const t2 = outTones[j];
      const f1 = t1.f_hz;
      const f2 = t2.f_hz;
      const p1 = t1.p_dbm;
      const p2 = t2.p_dbm;
      
      const p_im3_low = 2*p1 + p2 - 2*oip3;
      const f_low = 2*f1 - f2;
      if (f_low > 0 && p_im3_low > floor) {
        outTones.push({ f_hz: f_low, p_dbm: p_im3_low, origin: 'imd3' });
      }
      
      const p_im3_high = 2*p2 + p1 - 2*oip3;
      const f_high = 2*f2 - f1;
      if (f_high > 0 && p_im3_high > floor) {
        outTones.push({ f_hz: f_high, p_dbm: p_im3_high, origin: 'imd3' });
      }
    }
  }
  
  return outTones;
}
