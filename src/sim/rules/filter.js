export function applyFilter(inTonesByPort, params) {
  const inTones = inTonesByPort['RFin'] || Object.values(inTonesByPort)[0] || [];
  const top = params.topology || 'LPF';
  const order = params.order || 3;
  const il = params.IL_db || 0;
  const fc = params.f_cutoff_hz || 1e9;
  const fl = params.f_low || 1e9;
  const fh = params.f_high || 2e9;
  
  return inTones.map(t => {
    let attenuation = il;
    const f = t.f_hz;
    
    if (top === 'LPF') {
      if (f > fc) {
        attenuation += (order * 6) * Math.log2(f / fc);
      }
    } else if (top === 'HPF') {
      if (f < fc && f > 0) {
        attenuation += (order * 6) * Math.log2(fc / f);
      }
    } else if (top === 'BPF') {
      if (f < fl && f > 0) {
        attenuation += (order * 6) * Math.log2(fl / f);
      } else if (f > fh) {
        attenuation += (order * 6) * Math.log2(f / fh);
      }
    } else if (top === 'BSF') {
      if (f > fl && f < fh) {
        attenuation += 60; 
      }
    }
    
    return {
      f_hz: f,
      p_dbm: t.p_dbm - attenuation,
      origin: t.origin
    };
  });
}
