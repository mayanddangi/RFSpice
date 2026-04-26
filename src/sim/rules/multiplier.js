export function applyMultiplier(inTonesByPort, params) {
  const inTones = inTonesByPort['RFin'] || Object.values(inTonesByPort)[0] || [];
  const n = params.N || 2;
  const conv_loss = params.conv_loss_db || 10;
  const rej = params.harmonic_rejection_db || 25;
  
  const outTones = [];
  
  for (const t of inTones) {
    outTones.push({ f_hz: t.f_hz * n, p_dbm: t.p_dbm - conv_loss, origin: `mult_x${n}` });
    
    // Fundamental leakage (standard for most multipliers)
    outTones.push({ f_hz: t.f_hz, p_dbm: t.p_dbm - conv_loss - rej, origin: `mult_f1_leak` });
    
    // One extra harmonic (3rd harmonic is typical for x2 multipliers)
    if (n === 2) {
      outTones.push({ f_hz: t.f_hz * 3, p_dbm: t.p_dbm - conv_loss - (rej + 10), origin: `mult_f3_leak` });
    }
  }
  
  return outTones;
}
