import { create } from "zustand";
import axios from "axios";

export const useTest3Store = create((set) => ({
  pemeriksaanData: [],
  fetchPemeriksaanData: async () => {
    try {
      const response = await axios.get(
        "https://api-ecatalogue-staging.online/api/pemeriksaan-rekonsiliasi/get-data-pemeriksaan-rekonsiliasi/150"
      ); // Pastikan URL sudah benar
      const pemeriksaanData = response.data?.data?.pemeriksaan_data || [];

      // Update status_pemeriksaan berdasarkan data dari API
      const updatedData = pemeriksaanData.map((item) => ({
        ...item,
        status_pemeriksaan: item.status_pemeriksaan || "Memenuhi", // Contoh perubahan
      }));

      // Kalau hanya ada satu data, hanya tampilkan satu baris
      set({
        pemeriksaanData:
          updatedData.length === 1 ? [updatedData[0]] : updatedData,
      });
    } catch (error) {
      console.error("Failed to fetch pemeriksaan_data:", error);
    }
  },
}));
