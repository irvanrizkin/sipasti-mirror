import { create } from "zustand";

const tahap4Store = create((set) => ({
  vendorFilters: [],
  setVendorFilters: (filters) => set({ vendorFilters: filters }),
  materialFilters: [],
  setMaterialFilters: (filters) => set({ materialFilters: filters }),
  peralatanFilters: [],
  setPeralatanFilters: (filters) => set({ peralatanFilters: filters }),
  tenagaKerjaFilters: [],
  setTenagaKerjaFilters: (filters) => set({ tenagaKerjaFilters: filters }),
}));

export default tahap4Store;
