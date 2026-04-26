export const COMPONENT_SCHEMAS = {
  source: {
    freq_hz: { type: 'number', label: 'Frequency (Hz)', default: 100e6 },
    power_dbm: { type: 'number', label: 'Power (dBm)', default: 0 },
    phase_noise_dbchz: { type: 'number', label: 'Phase Noise (dBc/Hz)', default: -120 }
  },
  amplifier: {
    gain_db: { type: 'number', label: 'Gain (dB)', default: 15 },
    p1db_dbm: { type: 'number', label: 'P1dB (dBm)', default: 20 },
    nf_db: { type: 'number', label: 'Noise Figure (dB)', default: 3 },
    oip3_dbm: { type: 'number', label: 'OIP3 (dBm)', default: 35 },
    freq_min_hz: { type: 'number', label: 'Min Freq (Hz)', default: 10e6 },
    freq_max_hz: { type: 'number', label: 'Max Freq (Hz)', default: 6000e6 },
    v_dc: { type: 'number', label: 'Voltage (V)', default: 12 },
    i_dc_ma: { type: 'number', label: 'Current (mA)', default: 80 }
  },
  attenuator: {
    atten_db: { type: 'number', label: 'Attenuation (dB)', default: 3 },
    freq_max: { type: 'number', label: 'Max Freq (Hz)', default: 6000e6 }
  },
  filter: {
    topology: { type: 'select', label: 'Topology', options: ['LPF', 'HPF', 'BPF', 'BSF'], default: 'LPF' },
    f_cutoff_hz: { type: 'number', label: 'Cutoff Freq (Hz) [LPF/HPF]', default: 500e6 },
    f_low: { type: 'number', label: 'Low Freq (Hz) [BPF/BSF]', default: 400e6 },
    f_high: { type: 'number', label: 'High Freq (Hz) [BPF/BSF]', default: 600e6 },
    order: { type: 'number', label: 'Order', default: 3 },
    IL_db: { type: 'number', label: 'Insertion Loss (dB)', default: 1 }
  },
  mixer: {
    mode: { type: 'select', label: 'Mixer Mode', options: ['Down-converter', 'Up-converter'], default: 'Down-converter' },
    conv_loss_db: { type: 'number', label: 'Conversion Loss (dB)', default: 7 },
    lo_drive_dbm: { type: 'number', label: 'LO Drive (dBm)', default: 7 },
    ip3_dbm: { type: 'number', label: 'IIP3 (dBm)', default: 20 },
    p1db_dbm: { type: 'number', label: 'P1dB (dBm)', default: 10 },
    isolation_lo_rf: { type: 'number', label: 'LO-RF Isolation (dB)', default: 25 },
    isolation_lo_if: { type: 'number', label: 'LO-IF Isolation (dB)', default: 23 },
    freq_min_hz: { type: 'number', label: 'Min Freq (Hz)', default: 100e3 },
    freq_max_hz: { type: 'number', label: 'Max Freq (Hz)', default: 7400e6 }
  },
  multiplier: {
    N: { type: 'select', label: 'Multiplier (N)', options: [2, 3, 4], default: 2 },
    conv_loss_db: { type: 'number', label: 'Conversion Loss (dB)', default: 11 },
    harmonic_rejection_db: { type: 'number', label: 'Harmonic Rejection (dBc)', default: 18 },
    input_power_min_dbm: { type: 'number', label: 'Min Input Power (dBm)', default: 8 },
    input_power_max_dbm: { type: 'number', label: 'Max Input Power (dBm)', default: 13 },
    freq_min_hz: { type: 'number', label: 'Min Input Freq (Hz)', default: 1700e6 },
    freq_max_hz: { type: 'number', label: 'Max Input Freq (Hz)', default: 3600e6 }
  },
  vco: {
    f_min_hz: { type: 'number', label: 'Min Freq (Hz)', default: 300e6 },
    f_max_hz: { type: 'number', label: 'Max Freq (Hz)', default: 525e6 },
    vtune_v: { type: 'number', label: 'V_tune (V)', default: 12 },
    kvco_hz_per_v: { type: 'number', label: 'Kvco (Hz/V)', default: 18e6 },
    output_dbm: { type: 'number', label: 'Output Power (dBm)', default: 9 },
    harmonics_dbc: { type: 'number', label: 'Harmonics (dBc)', default: -27 },
    phase_noise_dbchz: { type: 'number', label: 'Phase Noise @100kHz (dBc/Hz)', default: -118 },
    v_dc: { type: 'number', label: 'Voltage (V)', default: 12 },
    i_dc_ma: { type: 'number', label: 'Current (mA)', default: 140 }
  },
  bias_tee: {
    freq_min: { type: 'number', label: 'Min Freq (Hz)', default: 10e6 },
    freq_max: { type: 'number', label: 'Max Freq (Hz)', default: 6000e6 },
    IL_db: { type: 'number', label: 'Insertion Loss (dB)', default: 0.5 },
    max_current_a: { type: 'number', label: 'Max Current (A)', default: 0.5 }
  },
  coupler: {
    coupling_db: { type: 'number', label: 'Coupling (dB)', default: 20 },
    IL_db: { type: 'number', label: 'Insertion Loss (dB)', default: 0.2 },
    directivity_db: { type: 'number', label: 'Directivity (dB)', default: 20 }
  },
  termination: {
    impedance_ohm: { type: 'number', label: 'Impedance (Ohm)', default: 50 }
  }
};
