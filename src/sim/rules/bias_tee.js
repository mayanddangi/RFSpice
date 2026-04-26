export function applyBiasTee(inTonesByPort, params) {
  const inTones = inTonesByPort['RFin'] || Object.values(inTonesByPort)[0] || [];
  const il = params.IL_db || 0.5;
  
  return inTones.map(t => ({ f_hz: t.f_hz, p_dbm: t.p_dbm - il, origin: t.origin }));
}
