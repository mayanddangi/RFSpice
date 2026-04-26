export function applySource(params) {
  const f_hz = params.freq_hz || 100e6;
  const p_dbm = params.power_dbm || 0;
  return [{ f_hz, p_dbm, origin: 'source' }];
}
