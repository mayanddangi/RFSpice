import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [inspectedNodeId, setInspectedNodeId] = useState(null);
  const [isDbManagerOpen, setIsDbManagerOpen] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [noiseFloor, setNoiseFloor] = useState(-120);
  const [minFreq, setMinFreq] = useState(0);
  const [freqUnit, setFreqUnit] = useState('MHz');

  return (
    <AppContext.Provider value={{ 
      inspectedNodeId, setInspectedNodeId, 
      isDbManagerOpen, setIsDbManagerOpen, 
      simulationResult, setSimulationResult,
      noiseFloor, setNoiseFloor,
      minFreq, setMinFreq,
      freqUnit, setFreqUnit
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
