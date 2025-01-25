// store/index.js
import { create } from "zustand";
import axios from "axios";
// import { fetchDataEntriData } from "../../../../services/api";

export const datadetail_store = create((set) => ({
  selectedValue: 0,
  userOptions: [],
  pengawasUserOptions: [],
  pemeriksaanData: [],
  dataEntri: null,
  initialValues: {
    // user_id_petugas_lapangan: "",
    // user_id_pengawas: "",
    // data_vendor_id: "",
    // identifikasi_kebutuhan_id: "",
    nama_pemberi_informasi: "",
    // tanggal_survei: "",
  },

  material: null,
  peralatan: null,
  tenaga_kerja: null,
  setSelectedValue: (value) => set({ selectedValue: value }),
  // For Dropdown
  fetchUserOptions: async () => {
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
      set({ userOptions: options });
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
        "https://api-ecatalogue-staging.online/api/pengumpulan-data/list-user?role=Pengawas"
      );
      const options =
        response.data?.data.map((user) => ({
          value: user.user_id,
          label: user.nama_lengkap,
          nip: user.nip,
        })) || [];
      set({ pengawasUserOptions: options });
    } catch (error) {
      console.error(
        "Error fetching pengawas user options:",
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
          // data_vendor_id: data.data.data_vendor_id || "",
          // identifikasi_kebutuhan_id: data.data.identifikasi_kebutuhan_id || "",
          nama_pemberi_informasi:
            data.data.keterangan_pemberi_informasi?.nama_pemberi_informasi ||
            "",
          // tanggal_survei:
          //   data.data.keterangan_petugas_lapangan?.tanggal_survei || "",
        },
      }));

      console.log("identifikasi_kebutuhan_id:", data.identifikasi_kebutuhan_id);
      console.log("data_vendor_id:", data.data_vendor_id);
      console.log("tanggal survei oi:", data.tanggal_survei);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },

  fetchPemeriksaanData: async (id) => {
    try {
      const response = await axios.get(
        `https://api-ecatalogue-staging.online/api/pemeriksaan-rekonsiliasi/get-data-pemeriksaan-rekonsiliasi/${id}`
      );
      const mainData = response.data?.data?.data; // Akses ke data utama
      const pemeriksaanData = response.data?.data?.pemeriksaan_data || [];

      const updatedData = pemeriksaanData.map((item) => ({
        ...item,
        status_pemeriksaan: item.status_pemeriksaan || "Memenuhi",
      }));

      set({
        pemeriksaanData:
          updatedData.length === 1 ? [updatedData[0]] : updatedData,
      });

      set((state) => ({
        dataEntri: mainData,
        material: mainData.material || [],
        peralatan: mainData.peralatan || [],
        tenaga_kerja: mainData.tenaga_kerja || [],
        initialValues: {
          ...state.initialValues,
          data_vendor_id: mainData.data_vendor_id || "",
          identifikasi_kebutuhan_id: mainData.identifikasi_kebutuhan_id || "",
          nama_pemberi_informasi:
            mainData.keterangan_pemberi_informasi?.nama_pemberi_informasi || "",
          tanggal_survei:
            mainData.keterangan_petugas_lapangan?.tanggal_survei || "",
        },
        data_vendor_id: mainData.data_vendor_id || "",
        identifikasi_kebutuhan_id: mainData.identifikasi_kebutuhan_id || "",
        nama_pemberi_informasi:
          mainData.keterangan_pemberi_informasi?.nama_pemberi_informasi || "",
        tanggal_survei:
          mainData.keterangan_petugas_lapangan?.tanggal_survei || "",
      }));

      // Tambahkan log untuk memastikan data masuk
      console.log("Cek data_vendor_id:", mainData.data_vendor_id);
      console.log(
        "Cek identifikasi_kebutuhan_id:",
        mainData.identifikasi_kebutuhan_id
      );
      console.log(
        "Cek nama_pemberi_informasi:",
        mainData.keterangan_pemberi_informasi?.nama_pemberi_informasi
      );
    } catch (error) {
      console.error("Failed to fetch pemeriksaan_data:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
  },

  userRole: "tim teknis",
  dataStatic: [
    {
      nomor: "A",
      kelengkapan_dokumen: "KRITERIA VERIFIKASI",
      item_number: "null1",
      verified_by: null,
    },
    {
      nomor: "1",
      kelengkapan_dokumen:
        "Memeriksa kelengkapan data dan ada tidaknya bukti dukung",
      item_number: "A1",
      status_pemeriksaan: "Memenuhi",
      verified_by: "pengawas",
    },
    {
      nomor: "2",
      kelengkapan_dokumen:
        "Jenis material, peralatan, tenaga kerja yang dilakukan pengumpulan data berdasarkan identifikasi kebutuhan.",
      item_number: "A2",
      status_pemeriksaan: null,
      verified_by: "pengawas",
    },
    {
      nomor: "3",
      kelengkapan_dokumen: "Sumber harga pasar.",
      item_number: "A3",
      status_pemeriksaan: null,
      verified_by: "pengawas",
    },
    {
      nomor: "4",
      kelengkapan_dokumen:
        "Harga survei didapat minimal 3 vendor untuk setiap jenis material peralatan atau sesuai dengan kondisi di lapangan.",
      item_number: "A4",
      status_pemeriksaan: null,
      verified_by: "pengawas",
    },
    {
      nomor: "5",
      kelengkapan_dokumen:
        "Khusus peralatan mencantumkan harga beli dan harga sewa.",
      item_number: "A5",
      status_pemeriksaan: null,
      verified_by: "pengawas",
    },
    {
      nomor: "B",
      kelengkapan_dokumen: "KRITERIA VALIDASI",
      item_number: "null2",
      verified_by: null,
    },
    {
      nomor: "1",
      kelengkapan_dokumen:
        "Kuesioner terisi lengkap dan sesuai dengan petunjuk cara pengisian kuesioner (lampiran iv) dan sudah ditandatangani Responden, Petugas Lapangan, dan Pengawas.",
      item_number: "B1",
      status_pemeriksaan: null,
      verified_by: "pengawas",
    },
    {
      nomor: "2",
      kelengkapan_dokumen:
        "Pemeriksaan dilakukan dengan diskusi/tatap muka antara Pengawas dan Petugas Lapangan.",
      item_number: "B2",
      status_pemeriksaan: null,
      verified_by: "pengawas",
    },
  ],
  data: [
    {
      nomor: "II",
      kelengkapan_dokumen: "KRITERIA PEMERIKSAAN HASIL DATA",
      id_pemeriksaan: "null4",
      verified_by: null,
    },
    {
      nomor: "1",
      kelengkapan_dokumen: "Pemeriksaan satuan yang salah atau belum terisi.",
      id_pemeriksaan: "C1",
      status_pemeriksaan: null,
      verified_by: "tim teknis",
    },
    {
      nomor: "2",
      kelengkapan_dokumen: "Penulisan nama kabupaten/kota.",
      id_pemeriksaan: "C2",
      status_pemeriksaan: null,
      verified_by: "tim teknis",
    },
    {
      nomor: "3",
      kelengkapan_dokumen: "Nama responden/vendor yang tidak jelas.",
      id_pemeriksaan: "C3",
      status_pemeriksaan: null,
      verified_by: "tim teknis",
    },
    {
      nomor: "4",
      kelengkapan_dokumen: "Konsistensi dalam pengisian kuesioner.",
      id_pemeriksaan: "C4",
      status_pemeriksaan: null,
      verified_by: "tim teknis",
    },
    {
      nomor: "III",
      kelengkapan_dokumen: "PEMERIKSAAN ANOMALI HARGA",
      id_pemeriksaan: "null3",
      verified_by: null,
    },
    {
      nomor: "1",
      kelengkapan_dokumen: "Ketidakwajaran harga satuan pokok.",
      id_pemeriksaan: "D1",
      status_pemeriksaan: null,
      verified_by: "tim teknis",
    },
    {
      nomor: "2",
      kelengkapan_dokumen:
        "Keterbandingan antar harga satuan pokok di wilayah yang berdekatan.",
      id_pemeriksaan: "D2",
      status_pemeriksaan: null,
      verified_by: "tim teknis",
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
