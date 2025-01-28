import { create } from "zustand";

export const filterDataDetailStore = create((set) => ({
	materialFilters: [],
	setMaterialFilters: (filters) => set({ materialFilters: filters }),
	peralatanFilters: [],
	setPeralatanFilters: (filters) => set({ peralatanFilters: filters }),
	tenagaKerjaFilters: [],
	setTenagaKerjaFilters: (filters) => set({ tenagaKerjaFilters: filters }),
}));