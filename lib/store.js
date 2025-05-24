import { create } from 'zustand'

const useAlertStore = create((set) => ({
  selectedAlertType: null,
  setSelectedAlertType: (type) => set({ selectedAlertType: type }),
  clearSelectedAlertType: () => set({ selectedAlertType: null })
}))

export default useAlertStore

// This store manages the selected alert type for filtering alerts in the dashboard.