import { create } from "zustand";
import axios from "axios";

const informasi_tahap_pengumpulanStore = create((set) => ({
  initialValues: {
    status_progres: [],
    vendor: [],
  },
  urlKuisionerResult: "",
  fetchStatusProgres: async () => {
    try {
      const response = await axios.get(
        "http://api-ecatalogue-staging.online/api/pengumpulan-data/table-list-pengumpulan"
      );
      const { data } = response;
      if (data.status === "success") {
        set({
          initialValues: {
            status_progres: data.data,
          },
        });
      } else {
        console.error("Gagal mendapatkan data:", data.message);
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data:", error.message);
    }
  },

  fetchVendor: async (id_paket) => {
    try {
      const response = await axios.get(
        `http://api-ecatalogue-staging.online/api/pengumpulan-data/list-vendor-by-paket/${id_paket}`
      );
      const { data } = response;
      if (data.status === "success" && Array.isArray(data.data)) {
        set((state) => ({
          initialValues: {
            ...state.initialValues,
            vendor: data.data,
          },
        }));
      } else {
        console.error("Gagal mendapatkan data:", data.message);
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data:", error.message);
    }
  },

  fetchPDF: async (shortlist_id) => {
    try {
      const response = await axios.get(
        `https://api-ecatalogue-staging.online/api/pengumpulan-data/view-pdf-kuisioner/${shortlist_id}`
      );

      const { data } = response;
      if (data.status === "success" && data.data?.url_kuisioner) {
        return data.data.url_kuisioner;
      } else {
        console.error("Gagal mendapatkan data:", data.message);
        return null;
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data:", error.message);
      return null;
    }
  },

  fetchGenerateLink: async (shortlist_id) => {
    try {
      const response = await axios.get(
        `https://api-ecatalogue-staging.online/api/pengumpulan-data/generate-link/${shortlist_id}`
      );

      const responseData = response.data;
      if (responseData.status === "success" && responseData.data?.token) {
        const dateExpired = responseData.data.date_expired; // Ambil date expired
        console.log("Date Expired:", dateExpired); // Debugging kalau perlu
        return responseData.data.token;
      } else {
        console.error(
          "Gagal mendapatkan data:",
          responseData.message || "Data tidak valid"
        );
        return null;
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data:", error.message);
      return null;
    }
  },

  setUrlKuisionerResult: (url) => set({ urlKuisionerResult: url }),
  resetUrlKuisionerResult: () => set({ urlKuisionerResult: "" }),
}));

export default informasi_tahap_pengumpulanStore;
