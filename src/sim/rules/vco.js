export function applyVCO(params) {
  const f_min = params.f_min_hz || 1000e6;
  const f_max = params.f_max_hz || 2000e6;
  const vtune = params.vtune_v || 5;
  const kvco = params.kvco_hz_per_v || 100e6;
  const p_out = params.output_dbm || 5;
  const harm_dbc = params.harmonics_dbc || -20;
  
  let f = f_min + (kvco * vtune);
  if (f > f_max) f = f_max;
  if (f < f_min) f = f_min;
  
  const outTones = [];
  outTones.push({ f_hz: f, p_dbm: p_out, origin: 'vco' });
  
  outTones.push({ f_hz: f * 2, p_dbm: p_out + harm_dbc, origin: 'vco_h2' });
  outTones.push({ f_hz: f * 3, p_dbm: p_out + harm_dbc - 5, origin: 'vco_h3' });
  
  return outTones;
}
