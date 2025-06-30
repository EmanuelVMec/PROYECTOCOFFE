import { create } from 'zustand';

export const usePredictionStore = create((set) => ({
  prediction: null,
  inputs: {},
  tipoCafe: 0, // 👉 valor inicial por defecto

  setPrediction: (prediction) => set({ prediction }),
  setInputs: (inputs) => set({ inputs }),
  setTipoCafe: (tipo) => set({ tipoCafe: tipo }), // 👉 setter para tipo de café
}));
