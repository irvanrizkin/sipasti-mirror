import { create } from "zustand";
import axios from "axios";
import { useEffect } from "react";

export const pemeriksaan_dataStore = create((set) => ({
  selectedValue: 0,
  userOptions: [],
  pengawasUserOptions: [],
  dataEntri: null,
  initialValues: {
    user_id_petugas_lapangan: "",
    user_id_pengawas: "",
    data_vendor_id: "", // Ensure this is part of initialValues
    identifikasi_kebutuhan_id: "", // Ensure this is part of initialValues
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

      // Log the full response data
      console.log("API Response:", response.data);

      // Safely extract the response data
      const data = response?.data?.data?.data || {};
      const datapemeriksaan = response?.data?.data || {};
      const pemeriksaanData = datapemeriksaan.pemeriksaan_data || [];

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

      // Log the extracted pemeriksaanData to verify the structure
      console.log("Pemeriksaan Data:", pemeriksaanData);

      // Check if entriesData is an array
      const entriesData = Array.isArray(response.data.data)
        ? response.data.data
        : [];

      // Log entriesData to check if it's an array
      console.log("Entries Data:", entriesData);

      // Map the `pemeriksaanData` to update the status
      const updatedData = pemeriksaanData.map((item) => {
        // Transform item_number into id_pemeriksaan
        const id_pemeriksaan = item.item_number; // Assuming item_number is the identifier

        if (
          ["A1", "A2", "A3", "A4", "A5", "B1", "B2"].includes(id_pemeriksaan)
        ) {
          const matchingEntry = entriesData.find(
            (entry) => entry.id_pemeriksaan === id_pemeriksaan
          );

          // Update the status_pemeriksaan based on matchingEntry data
          return {
            ...item,
            id_pemeriksaan: id_pemeriksaan, // Use the transformed value
            status_pemeriksaan: matchingEntry
              ? matchingEntry.status_pemeriksaan
              : item.status_pemeriksaan,
          };
        }
        return item;
      });

      // Log updated data to check the result
      console.log("Updated Data:", updatedData);

      // Set the updated data to your store
      set({ dataAPI: updatedData });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },

  userRole: "tim teknis",
  dataAPI: [
    {
      nomor: "A",
      kelengkapan_dokumen: "KRITERIA VERIFIKASI",
      id_pemeriksaan: "null1",
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
        "Khusus peralatan mencantumkan harga beli dan harga sewa.",
      id_pemeriksaan: "A5",
      status_pemeriksaan: null,
      verified_by: "pengawas",
    },
    {
      nomor: "B",
      kelengkapan_dokumen: "KRITERIA VALIDASI",
      id_pemeriksaan: "null2",
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
        "Pemeriksaan dilakukan dengan diskusi/tatap muka antara Pengawas dan Petugas Lapangan.",
      id_pemeriksaan: "B2",
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
