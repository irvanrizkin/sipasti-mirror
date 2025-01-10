import { create } from "zustand";
import axios from "axios";

const usePenugasanTimStore = create((set) => ({
  userOptions: [],
  UserTimTeknisOptions: [],
  UserPengawasOptions: [],
  UserPetugasLapangan: [],
  UserPengolahData: [],
  suratPenugasanPengawas: null,
  skPenugasanPengawas: null,
  suratPenugasanPetugasLapangan: null,
  skPenugasanPetugasLapangan: null,
  suratPenugasanPengolahData: null,
  skPenugasanPengolahData: null,

  alert: { open: false, severity: "info", message: "" },

  setSuratPenugasanPengawas: (file) => set({ suratPenugasanPengawas: file }),
  setSkPenugasanPengawas: (file) => set({ skPenugasanPengawas: file }),
  setSuratPenugasanPetugasLapangan: (file) =>
    set({ suratPenugasanPetugasLapangan: file }),
  setSkPenugasanPetugasLapangan: (file) =>
    set({ skPenugasanPetugasLapangan: file }),
  setSuratPenugasanPengolahData: (file) =>
    set({ suratPenugasanPengolahData: file }),
  setSkPenugasanPengolahData: (file) => set({ skPenugasanPengolahData: file }),

  setAlert: (alert) => set({ alert }),

  fetchUserOptions: async () => {
    try {
      const response = await axios.get(
        "http://api-ecatalogue-staging.online/api/pengumpulan-data/list-user"
      );
      const options =
        response.data?.data.map((user) => ({
          value: user.user_id,
          label: user.nama_lengkap,
        })) || [];
      set({ userOptions: options });
      console.log("User options berhasil diambil:", options);
    } catch (error) {
      console.error(
        "Error fetching user options:",
        error.response?.data || error.message
      );
    }
  },
  fetchUserTimTeknisOptions: async () => {
    try {
      const response = await axios.get(
        "https://api-ecatalogue-staging.online/api/pengumpulan-data/list-user?role=Tim%20Teknis%20Balai"
      );
      const options =
        response.data?.data.map((user) => ({
          value: user.user_id,
          label: user.nama_lengkap,
        })) || [];
      set({ UserTimTeknisOptions: options });
      console.log("User options berhasil diambil:", options);
    } catch (error) {
      console.error(
        "Error fetching user options:",
        error.response?.data || error.message
      );
    }
  },
  fetchUserPengawasOptions: async () => {
    try {
      const response = await axios.get(
        "https://api-ecatalogue-staging.online/api/pengumpulan-data/list-user?role=Pengawas"
      );
      const options =
        response.data?.data.map((user) => ({
          value: user.user_id,
          label: user.nama_lengkap,
        })) || [];
      set({ UserPengawasOptions: options });
      console.log("User options berhasil diambil:", options);
    } catch (error) {
      console.error(
        "Error fetching user options:",
        error.response?.data || error.message
      );
    }
  },

  fetchUserPetugasLapangan: async () => {
    try {
      const response = await axios.get(
        "https://api-ecatalogue-staging.online/api/pengumpulan-data/list-user?role=Petugas%20Lapangan"
      );
      const options =
        response.data?.data.map((user) => ({
          value: user.user_id,
          label: user.nama_lengkap,
        })) || [];
      set({ UserPetugasLapangan: options });
      console.log("User options berhasil diambil:", options);
    } catch (error) {
      console.error(
        "Error fetching user options:",
        error.response?.data || error.message
      );
    }
  },

  fetchUserPengolahData: async () => {
    try {
      const response = await axios.get(
        "https://api-ecatalogue-staging.online/api/pengumpulan-data/list-user?role=Pengolah%20Data"
      );
      const options =
        response.data?.data.map((user) => ({
          value: user.user_id,
          label: user.nama_lengkap,
        })) || [];
      set({ UserPengolahData: options });
      console.log("User options berhasil diambil:", options);
    } catch (error) {
      console.error(
        "Error fetching user options:",
        error.response?.data || error.message
      );
    }
  },
  
  saveTimTeknisBalaiData: async (
    nama_tim,
    ketua,
    sekretaris,
    anggota,
    skPenugasanTimTeknisBalai
  ) => {
    const formData = new FormData();
    formData.append("nama_team", nama_tim);
    formData.append("ketua_team", ketua);
    formData.append("sekretaris_team", sekretaris);
    formData.append("anggota", anggota.join(","));
    formData.append("sk_penugasan", skPenugasanTimTeknisBalai);

    try {
      const response = await axios.post(
        "http://api-ecatalogue-staging.online/api/pengumpulan-data/store-team-teknis",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const status = response.data?.status || "success";
      const message = response.data?.message || "Data berhasil disimpan.";

      set({
        alert: {
          open: true,
          severity: status === "success" ? "success" : "error",
          message,
        },
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal menyimpan data pengawas.";
      console.error(
        "Gagal menyimpan data pengawas:",
        error.response?.data || error.message
      );

      set({
        alert: {
          open: true,
          severity: "error",
          message: errorMessage,
        },
      });
    }
  },
  savePengawasData: async (pengawas, skPenugasanPengawas) => {
    const formData = new FormData();
    formData.append("user_id", pengawas);
    formData.append("sk_penugasan", skPenugasanPengawas);

    try {
      const response = await axios.post(
        "http://api-ecatalogue-staging.online/api/pengumpulan-data/store-pengawas",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const status = response.data?.status || "success";
      const message = response.data?.message || "Data berhasil disimpan.";

      set({
        alert: {
          open: true,
          severity: status === "success" ? "success" : "error",
          message,
        },
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal menyimpan data pengawas.";
      console.error(
        "Gagal menyimpan data pengawas:",
        error.response?.data || error.message
      );

      set({
        alert: {
          open: true,
          severity: "error",
          message: errorMessage,
        },
      });
    }
  },
  savePetugasLapanganData: async (
    petugasLapangan,
    skPenugasanPetugasLapangan
  ) => {
    const formData = new FormData();
    formData.append("user_id", petugasLapangan);
    formData.append("sk_penugasan", skPenugasanPetugasLapangan);

    try {
      const response = await axios.post(
        "http://api-ecatalogue-staging.online/api/pengumpulan-data/store-petugas-lapangan",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const status = response.data?.status || "success";
      const message = response.data?.message || "Data berhasil disimpan.";

      set({
        alert: {
          open: true,
          severity: status === "success" ? "success" : "error",
          message,
        },
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal menyimpan data pengawas.";
      console.error(
        "Gagal menyimpan data pengawas:",
        error.response?.data || error.message
      );

      set({
        alert: {
          open: true,
          severity: "error",
          message: errorMessage,
        },
      });
    }
  },
  savePengolahData: async (pengolahData, skPenugasanPengolahData) => {
    const formData = new FormData();
    formData.append("user_id", pengolahData);
    formData.append("sk_penugasan", skPenugasanPengolahData);

    try {
      const response = await axios.post(
        "http://api-ecatalogue-staging.online/api/pengumpulan-data/store-pengolah-data",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const status = response.data?.status || "success";
      const message = response.data?.message || "Data berhasil disimpan.";

      set({
        alert: {
          open: true,
          severity: status === "success" ? "success" : "error",
          message,
        },
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal menyimpan data pengawas.";
      console.error(
        "Gagal menyimpan data pengawas:",
        error.response?.data || error.message
      );

      set({
        alert: {
          open: true,
          severity: "error",
          message: errorMessage,
        },
      });
    }
  },
}));

export default usePenugasanTimStore;
