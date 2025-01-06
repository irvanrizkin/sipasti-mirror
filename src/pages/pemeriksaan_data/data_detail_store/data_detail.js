// store/index.js
import { create } from "zustand";
import axios from "axios";
// import { fetchDataEntriData } from "../../../../services/api";

export const datadetail_store = create((set) => ({
  selectedValue: 0,
  userOptions: [],
  pengawasUserOptions: [],
  dataEntri: null,
  initialValues: {
    user_id_petugas_lapangan: "",
    user_id_pengawas: "",
  },
  material: null,
  peralatan: null,
  tenaga_kerja: null,
  setSelectedValue: (value) => set({ selectedValue: value }),
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

  fetchDataEntriData: async (id) => {
    try {
      const response = await axios.get(
        `https://api-ecatalogue-staging.online/api/pemeriksaan-rekonsiliasi/get-data-pemeriksaan-rekonsiliasi/${id}`
      );
      const data = response.data.data;

      set((state) => ({
        dataEntri: data.data,
        material: data.data.material || [],
        peralatan: data.data.peralatan || [],
        tenaga_kerja: data.data.tenaga_kerja || [],
        initialValues: {
          ...state.initialValues,
          data_vendor_id: data.data.data_vendor_id || "",
          identifikasi_kebutuhan_id: data.data.identifikasi_kebutuhan_id || "",
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

  userRole: "pengawas",
  data: [
    {
      nomor: "A",
      kelengkapan_dokumen: "KRITERIA VERIFIKASI",
      id_pemeriksaan: "null",
      // status_pemeriksaan: null,
      verified_by: null,
    },
    {
      nomor: "1",
      kelengkapan_dokumen:
        "Memeriksa kelengkapan data dan ada tidaknya bukti dukung",
      id_pemeriksaan: "A1",
      status_pemeriksaan: null,
      verified_by: "pengawas",
    },
    {
      nomor: "2",
      kelengkapan_dokumen:
        "Jenis material, peralatan, tenaga kerja yang dilakukan pengumpulan data berdasarkan identifikasi kebutuhan.",
      id_pemeriksaan: "A2",
      status_pemeriksaan: null,
      verified_by: "pengawas",
    },
    {
      nomor: "3",
      kelengkapan_dokumen: "Sumber harga pasar.",
      id_pemeriksaan: "A3",
      status_pemeriksaan: null,
      verified_by: "pengawas",
    },
    {
      nomor: "4",
      kelengkapan_dokumen:
        "Harga survei didapat minimal 3 vendor untuk setiap jenis material peralatan atau sesuai dengan kondisi di lapangan.",
      id_pemeriksaan: "A4",
      status_pemeriksaan: null,
      verified_by: "pengawas",
    },
    {
      nomor: "5",
      kelengkapan_dokumen:
        "Khusus peralatan mencantumkan harga beli dan harga sewa.",
      id_pemeriksaan: "A5",
      status_pemeriksaan: null,
      verified_by: "pengawas",
    },
    {
      nomor: "B",
      kelengkapan_dokumen: "KRITERIA VALIDASI",
      id_pemeriksaan: "null2",
      // status_pemeriksaan: null,
      verified_by: null,
    },
    {
      nomor: "1",
      kelengkapan_dokumen:
        "Kuesioner terisi lengkap dan sesuai dengan petunjuk cara pengisian kuesioner (lampiran iv) dan sudah ditandatangani Responden, Petugas Lapangan, dan Pengawas.",
      id_pemeriksaan: "B1",
      status_pemeriksaan: null,
      verified_by: "pengawas",
    },
    {
      nomor: "2",
      kelengkapan_dokumen:
        "Pemeriksaan dilakukan dengan diskusi/tatap muka antara Pengawas dan Petugas Lapangan.",
      id_pemeriksaan: "B2",
      status_pemeriksaan: null,
      verified_by: "pengawas",
    },
  ],
  setUserRole: (role) => set(() => ({ userRole: role })),
  updateStatus: (id_pemeriksaan, status) =>
    set((state) => ({
      data: state.data.map((item) =>
        item.id_pemeriksaan === id_pemeriksaan
          ? { ...item, status_pemeriksaan: status }
          : item
      ),
    })),
  setData: (newData) => set({ data: newData }),
}));
