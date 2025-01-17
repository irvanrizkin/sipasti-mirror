import { create } from "zustand";
import axios from "axios";

const survei_kuesionerStore = create((set) => ({
  selectedValue: 0,
  petugasLapanganuserOptions: [],
  pengawasUserOptions: [],
  initialValues: {
    user_id_petugas_lapangan: "",
    user_id_pengawas: "",
    nip_petugas_lapangan: "",
    nip_pengawas: "",
    nama_pemberi_informasi: "",
    data_vendor_id: "",
    identifikasi_kebutuhan_id: "",
    material: [],
    peralatan: [],
    tenaga_kerja: [],
  },
  dataEntri: null,
  material: null,
  peralatan: null,
  tenaga_kerja: null,
  data_vendor_id: "",
  identifikasi_kebutuhan_id: "",
  setSelectedValue: (value) => set({ selectedValue: value }),
  fetchData: async (id) => {
    try {
      const response = await axios.get(
        `https://api-ecatalogue-staging.online/api/survey-kuisioner/get-data-survey?token=${id}`
      );
      const data = response.data.data;

      set((state) => ({
        dataEntri: data,
        material: data.material || [],
        peralatan: data.peralatan || [],
        tenaga_kerja: data.tenaga_kerja || [],
        initialValues: {
          ...state.initialValues,
          data_vendor_id: data.data_vendor_id || "",
          identifikasi_kebutuhan_id: data.identifikasi_kebutuhan_id || "",
        },
        data_vendor_id: data.data_vendor_id || "",
        identifikasi_kebutuhan_id: data.identifikasi_kebutuhan_id || "",
      }));

      console.log("identifikasi_kebutuhan_id:", data.identifikasi_kebutuhan_id);
      console.log("data_vendor_id:", data.data_vendor_id);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  fetchPetugasLapanganUserOptions: async () => {
    try {
      const response = await axios.get(
        "https://api-ecatalogue-staging.online/api/pengumpulan-data/list-user?role=Petugas%20Lapangan"
      );
      const options =
        response.data?.data.map((user) => ({
          value: user.user_id,
          label: user.nama_lengkap,
          nip: user.nip,
        })) || [];
      set({ petugasLapanganuserOptions: options });
      console.log("User options berhasil diambil:", options);
    } catch (error) {
      console.error(
        "Error fetching user options:",
        error.response?.data || error.message
      );
    }
  },
  fetchPengawasUserOptions: async () => {
    try {
      const response = await axios.get(
        "http://api-ecatalogue-staging.online/api/pengumpulan-data/list-user?role=Pengawas"
      );
      const options =
        response.data?.data.map((user) => ({
          value: user.user_id,
          label: user.nama_lengkap,
          nip: user.nip,
        })) || [];
      set({ pengawasUserOptions: options });
      console.log("User options berhasil diambil:", options);
    } catch (error) {
      console.error(
        "Error fetching user options:",
        error.response?.data || error.message
      );
    }
  },
}));

export default survei_kuesionerStore;
