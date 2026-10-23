import React, { createContext, useContext, useState } from 'react';

const CalculatorContext = createContext();

export function CalculatorProvider({ children }) {
  const [formData, setFormData] = useState({
    idade: '',
    meus_km_ano: '',
    perfil_uso: 50,
    n_parcelas: '',
    estado_civil: 'solteiro',
    entrada: '',
    tipo_veiculo: [],
    tipo_motor: [],
    motorizacao: [],
    transmissao: []
  });
  
  const [budgetRange, setBudgetRange] = useState({
    min: 50000,
    max: 350000
  });

  const [results, setResults] = useState({
    bestEconomic: null,
    bestSustainable: null,
    allFilteredCars: [],
    excludedCarIds: []
  });

  const clearForm = () => {
    setFormData({
      idade: '',
      meus_km_ano: '',
      perfil_uso: 50,
      n_parcelas: '',
      estado_civil: 'solteiro',
      entrada: '',
      tipo_veiculo: [],
      tipo_motor: [],
      motorizacao: [],
      transmissao: []
    });
    setResults({
      bestEconomic: null,
      bestSustainable: null,
      allFilteredCars: [],
      excludedCarIds: []
    });
  };

  return (
    <CalculatorContext.Provider value={{
      formData,
      setFormData,
      budgetRange,
      setBudgetRange,
      results,
      setResults,
      clearForm
    }}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}