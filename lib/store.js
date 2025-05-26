import { create } from 'zustand'

const useAlertStore = create((set) => ({
  selectedAlertType: null,
  selectedDevice: null,
  selectedPeriod: null,
  setSelectedAlertType: (type) => set({ selectedAlertType: type }),
  setSelectedDevice: (device) => set({ selectedDevice: device }),
  setSelectedPeriod: (period) => set({ selectedPeriod: period }),
  clearFilters: () => set({ selectedAlertType: null, selectedDevice: null, selectedPeriod: null })
}))

export default useAlertStore