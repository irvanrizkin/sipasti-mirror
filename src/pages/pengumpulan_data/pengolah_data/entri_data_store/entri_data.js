import { create } from "zustand";
import axios from "axios";

const entri_datastore = create((set) => ({
  selectedValue: 0,
  userOptions: [],
  pengawasUserOptions: [],
  initialValues: {
    user_id_petugas_lapangan: "",
    user_id_pengawas: "",
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
        `https://api-ecatalogue-staging.online/api/pengumpulan-data/get-entri-data/${id}`
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
  fetchUserOptions: async () => {
    try {
      const response = await axios.get(
        "http://api-ecatalogue-staging.online/api/pengumpulan-data/list-user?role=Pengawas"
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
  fetchPengawasUserOptions: async () => {
    try {
      const response = await axios.get(
        "http://api-ecatalogue-staging.online/api/pengumpulan-data/list-user?role=Pengawas"
      );
      const options =
        response.data?.data.map((user) => ({
          value: user.pengawas_id,
          label: user.nama_lengkap,
          nrp: user.nrp,
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

export default entri_datastore;
