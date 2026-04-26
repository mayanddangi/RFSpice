export function applyAttenuator(inTonesByPort, params) {
  const inTones = inTonesByPort['RFin'] || Object.values(inTonesByPort)[0] || [];
  const atten = params.atten_db || 0;
  return inTones.map(t => ({
    f_hz: t.f_hz,
    p_dbm: t.p_dbm - atten,
    origin: t.origin
  }));
}
