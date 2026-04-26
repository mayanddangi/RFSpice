export function applyCoupler(inTonesByPort, params) {
  const inTones = inTonesByPort['RFin'] || Object.values(inTonesByPort)[0] || [];
  const coupling = params.coupling_db || 20;
  const il = params.IL_db || 0.2;
  
  const throughTones = inTones.map(t => ({ f_hz: t.f_hz, p_dbm: t.p_dbm - il, origin: t.origin }));
  const coupledTones = inTones.map(t => ({ f_hz: t.f_hz, p_dbm: t.p_dbm - coupling, origin: t.origin }));
  
  return {
    RFout: throughTones,
    CPLout: coupledTones
  };
}
