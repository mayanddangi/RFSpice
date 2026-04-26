// tones.js
// Tone = { f_hz: number, p_dbm: number, origin: string }

export const NOISE_FLOOR_DBM = -120; // Pruning floor
export const FREQ_BIN_HZ = 1000;     // Merge within 1 kHz

export function dbmToWatts(dbm) {
  return Math.pow(10, (dbm - 30) / 10);
}

export function wattsToDbm(watts) {
  if (watts <= 0) return -200;
  return 10 * Math.log10(watts) + 30;
}

export function addDbm(dbm1, dbm2) {
  return wattsToDbm(dbmToWatts(dbm1) + dbmToWatts(dbm2));
}

export function cleanTones(tones, floor = NOISE_FLOOR_DBM, minFreq = 0, bin = FREQ_BIN_HZ) {
  const pruned = tones.filter(t => t.p_dbm >= floor && t.f_hz >= minFreq);
  pruned.sort((a, b) => a.f_hz - b.f_hz);
  
  const merged = [];
  for (const tone of pruned) {
    if (merged.length === 0) {
      merged.push({ ...tone });
      continue;
    }
    
    const last = merged[merged.length - 1];
    if (Math.abs(tone.f_hz - last.f_hz) <= bin) {
      last.p_dbm = addDbm(last.p_dbm, tone.p_dbm);
      if (tone.p_dbm > last.p_dbm) {
        last.origin = tone.origin;
        last.f_hz = tone.f_hz;
      }
    } else {
      merged.push({ ...tone });
    }
  }
  return merged;
}
