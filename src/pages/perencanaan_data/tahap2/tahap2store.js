import { create } from "zustand";

const useStore = create((set) => ({
  selectedValue: 0,
  provincesOptions: [],
  initialValues: {
    materials: [],
    peralatans: [],
    tenagaKerjas: [],
  },
  dataMaterial: [],
  filteredDataMaterial: [],
  rowsToAdd: 0,
  isModalOpen: false,
  alertMessage: "",
  alertSeverity: "info",
  isAlertOpen: false,
  materialFilters: [],
  peralatanFilters: [],
  tenagaKerjaFilters: [],
  setMaterialFilters: (filters) => set({ materialFilters: filters }),
  setPeralatanFilters: (filters) => set({ peralatanFilters: filters }),
  setTenagaKerjaFilters: (filters) => set({ tenagaKerjaFilters: filters }),
  setAlertSeverity: (severity) => set({ alertSeverity: severity }),
  setAlertMessage: (message) => set({ alertMessage: message }),
  setIsAlertOpen: (value) => set({ isAlertOpen: value }),
  setSelectedValue: (value) => set({ selectedValue: value }),
  setProvincesOptions: (options) => set({ provincesOptions: options }),
  setInitialValues: (values) =>
    set((state) => ({
      initialValues: {
        ...state.initialValues,
        ...values,
      },
    })),
  setDataMaterial: (data) => set({ dataMaterial: data }),
  setFilteredDataMaterial: (data) => set({ filteredDataMaterial: data }),
  setRowsToAdd: (rows) => set({ rowsToAdd: rows }),
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),

  // Optimized push functions
  pushMaterial: (newMaterial) =>
    set((state) => ({
      initialValues: {
        ...state.initialValues,
        materials: [...state.initialValues.materials, newMaterial],
      },
    })),

  pushPeralatan: (newPeralatan) =>
    set((state) => ({
      initialValues: {
        ...state.initialValues,
        peralatans: [...state.initialValues.peralatans, newPeralatan],
      },
    })),

  pushTenagaKerja: (newTenagaKerja) =>
    set((state) => ({
      initialValues: {
        ...state.initialValues,
        tenagaKerjas: [...state.initialValues.tenagaKerjas, newTenagaKerja],
      },
    })),
}));

export default useStore;