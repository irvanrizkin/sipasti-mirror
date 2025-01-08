import React, { useState, useEffect } from "react";
import { Field, FieldArray, Form, Formik } from "formik";
import Navbar from "../../../../components/navigationbar";
import Button from "../../../../components/button";
import Dropdown from "../../../../components/dropdown";
import { testStore } from "../pemeriksaan_data_store/pemeriksaan_data";
import { submitData } from "../../../../services/api";
import FileInput from "../../../../components/FileInput";
import TextInput from "../../../../components/input";
import SearchBox from "../../../../components/searchbox";
import { useStore } from "zustand";
import dayjs from "dayjs";
import CustomAlert from "../../../../components/alert";
import { useRouter } from "next/router";

import "dayjs/locale/id";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";

dayjs.locale("id");

function App() {
  const [berita_acara, setBerita_Acara] = useState(null);
  const [selectedberitaacara, setselectedBeritaAcara] = useState(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const {
    selectedValue,
    setSelectedValue,
    data_vendor_id,
    identifikasi_kebutuhan_id,
    data,
    userOptions,
    pengawasUserOptions,
    setData,
    material,
    peralatan,
    tenaga_kerja,
    updateStatus,
    dataEntri,
    fetchDataEntriData,
  } = useStore(testStore);

  const router = useRouter();
  const { id } = router.query;

  const [alert, setAlert] = useState({
    message: "",
    severity: "",
    open: false,
  });

  // useEffect(() => {
  //   fetchDataEntriData(136);
  // }, [fetchDataEntriData]);

  useEffect(() => {
    if (id) {
      console.log("shortlist_id yang dikirim:", id);
      fetchDataEntriData(id);
    }
  }, [id, fetchDataEntriData]);

  //   fetchData();
  // }, [setData]);

  const handleCancelBeritaAcara = () => {
    console.log("Cancelling file upload...");

    setBerita_Acara(null);
    setselectedBeritaAcara(null);

    setProgress(0);
    setBeritaAcaraState("default");

    setError("");
  };

  const [beritaacarastate, setBeritaAcaraState] = useState("default");

  const handleChange = (id_pemeriksaan, status) => {
    updateStatus(id_pemeriksaan, status);
  };

  const isSubmitDisabled = data.some(
    (item) => item.status_pemeriksaan === null
  );

  const handleSubmit = async (values) => {
    console.log("Nilai catatan_blok_1:", values.catatan_blok_1);
    try {
      const verifikasiValidasi = data
        .filter((item) => item.verified_by !== null)
        .map((item) => ({
          id_pemeriksaan: item.id_pemeriksaan,
          status_pemeriksaan: item.status_pemeriksaan || "Belum Dipilih",
          verified_by: item.verified_by,
        }));

      const payload = new FormData();
      payload.append("identifikasi_kebutuhan_id", identifikasi_kebutuhan_id);
      payload.append("data_vendor_id", data_vendor_id);
      payload.append("catatan_blok_1", values.catatan_blok_1 || "");
      payload.append("catatan_blok_2", values.catatan_blok_2 || "");
      payload.append("catatan_blok_3", values.catatan_blok_3 || "");
      payload.append("catatan_blok_4", values.catatan_blok_4 || "");
      payload.append("berita_acara", selectedberitaacara);
      payload.append("verifikasi_validasi", JSON.stringify(verifikasiValidasi));

      console.log("Payload yang dikirim:");
      payload.forEach((value, key) => {
        console.log(key, value);
      });

      // Sending data to the API
      const response = await submitData(payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Response from API:", response);

      // Check the response status and set the alert accordingly
      if (response.status === "success") {
        setAlert({
          message: "Data berhasil dikirim!",
          severity: "success",
          open: true,
        });
      } else if (response.status === "error") {
        // If response.message is an array, show the first item
        const errorMessage = Array.isArray(response.message)
          ? response.message[0]
          : response.message || "Something went wrong";

        setAlert({
          message: `Error: ${errorMessage}`,
          severity: "error",
          open: true,
        });
      } else {
        // If the response status is unknown or not "error" or "success"
        setAlert({
          message: "Terjadi kesalahan yang tidak terduga.",
          severity: "error",
          open: true,
        });
      }
    } catch (error) {
      console.error("Gagal mengirim data:", error);
      setAlert({
        message: "Gagal mengirim data, coba lagi.",
        severity: "error",
        open: true,
      });
    }
  };

  const handleBeritaAcara = (files) => {
    if (files.length === 0) {
      setError("File wajib dipilih.");
      return;
    }

    const file = files[0];
    setselectedBeritaAcara(file);
    setBeritaAcaraState("processing");
    setError("");
    try {
      setselectedBeritaAcara(file);
      setBeritaAcaraState("done");
    } catch (error) {
      console.error("Error processing logo file:", error);
      setBeritaAcaraState("default");
    }
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setBeritaAcaraState("done");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const KeteranganTempatForm = ({ values, setFieldValue }) => {
    return (
      <div>
        <div className="mt-3 bg-neutral-100 px-6 py-8 rounded-[16px] space-y-8">
          <TextInput
            label="Provinsi"
            labelPosition="left"
            placeholder="Masukkan Provinsi"
            size="Medium"
            labelWidth="100px"
            disabledActive={true}
            value={dataEntri?.provinsi || ""}
          />
          <TextInput
            label="Kabupaten/Kota"
            labelPosition="left"
            placeholder="Masukkan Kabupaten/Kota"
            size="Medium"
            labelWidth="100px"
            disabledActive={true}
            value={dataEntri?.kota || ""}
          />
          <TextInput
            label="Nama Responden/Vendor"
            labelPosition="left"
            placeholder="Masukkan Nama Responden/Vendor"
            size="Medium"
            labelWidth="100px"
            disabledActive={true}
            value={dataEntri?.nama_responden || ""}
          />
          <TextInput
            label="Alamat Responden/Geo-tagging"
            labelPosition="left"
            placeholder="Masukkan Alamat"
            size="Medium"
            labelWidth="100px"
            disabledActive={true}
            value={dataEntri?.alamat || ""}
            // labelMargin="150px"
          />
          <TextInput
            label="Nomor Telepon/HP /E-mail"
            labelPosition="left"
            placeholder="Masukkan Nomor Kontak"
            size="Medium"
            labelWidth="100px"
            disabledActive={true}
            value={dataEntri?.no_telepon || ""}
          />
          <TextInput
            label="Kategori Responden /Vendor"
            labelPosition="left"
            placeholder="Masukkan Kategori"
            size="Medium"
            labelWidth="100px"
            disabledActive={true}
            value={dataEntri?.kategori_responden || ""}
          />
        </div>
        <TextInput
          className="my-3"
          label="Catatan Blok I"
          placeholder="Masukkan Catatan Blok I"
          size="Medium"
          errorMessage="Catatan Blok I tidak boleh kosong"
          // value={values.catatan_blok_1 || ""}
          onChange={(e) => {
            setFieldValue("catatan_blok_1", e.target.value);
          }}
        />
      </div>
    );
  };

  const KeteranganPetugasLapanganForm = ({ values, setFieldValue }) => {
    return (
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs} locale="id">
          <div className="mt-3 bg-neutral-100 px-6 py-8 rounded-[16px]">
            <div className=" space-y-8">
              <TextInput
                label="Nama Petugas Lapangan"
                labelPosition="left"
                placeholder="Nama Petugas Lapangan kosong"
                size="Medium"
                errorMessage="Nama Petugas Lapangan kosong"
                value={
                  dataEntri?.keterangan_petugas_lapangan
                    ?.nama_petugas_lapangan || ""
                }
                disabledActive={true}
              />
              <TextInput
                label="NIP"
                labelPosition="left"
                placeholder="NIP kosong"
                size="Medium"
                errorMessage="NIP kosong"
                value={
                  dataEntri?.keterangan_petugas_lapangan
                    ?.nip_petugas_lapangan || ""
                }
                disabledActive={true}
              />
              <div
                style={{ display: "flex", alignItems: "center", gap: "256px" }}>
                <div className="text-B2" style={{ minWidth: "200px" }}>
                  Tanggal Survei
                </div>
                <DatePicker
                  label="Tanggal Survei"
                  value={
                    dataEntri?.keterangan_petugas_lapangan?.tanggal_survei
                      ? dayjs(
                          dataEntri.keterangan_petugas_lapangan.tanggal_survei,
                          "DD-MM-YYYY"
                        )
                      : null
                  }
                  disabled={true}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                  localeText={{
                    cancelButtonLabel: "Batal",
                    okButtonLabel: "Pilih",
                  }}
                />
              </div>
              <TextInput
                label="Nama Pengawas"
                labelPosition="left"
                placeholder="Nama Pengawas kosong"
                size="Medium"
                errorMessage="Nama Pengawas kosong"
                value={
                  dataEntri?.keterangan_petugas_lapangan?.nama_pengawas || ""
                }
                disabledActive={true}
              />
              <TextInput
                label=" Pengawas"
                labelPosition="left"
                placeholder=" Pengawas kosong"
                size="Medium"
                errorMessage=" Pengawas kosong"
                value={
                  dataEntri?.keterangan_petugas_lapangan?.nip_pengawas || ""
                }
                disabledActive={true}
              />
              <div
                style={{ display: "flex", alignItems: "center", gap: "256px" }}>
                <div className="text-B2" style={{ minWidth: "200px" }}>
                  Tanggal Pengawasan
                </div>
                <DatePicker
                  label="Tanggal Pengawasan"
                  value={
                    dataEntri?.keterangan_petugas_lapangan?.tanggal_pengawasan
                      ? dayjs(
                          dataEntri.keterangan_petugas_lapangan
                            .tanggal_pengawasan,
                          "DD-MM-YYYY"
                        )
                      : null
                  }
                  disabled={true}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                  localeText={{
                    cancelButtonLabel: "Batal",
                    okButtonLabel: "Pilih",
                  }}
                />
              </div>
            </div>
          </div>
        </LocalizationProvider>
        <TextInput
          className="my-3"
          label="Catatan Blok II"
          placeholder="Masukkan Catatan Blok II"
          size="Medium"
          errorMessage="Catatan Blok II tidak boleh kosong"
          onChange={(e) => {
            setFieldValue("catatan_blok_2", e.target.value);
          }}
        />
      </div>
    );
  };

  const KeteranganPemberiInformasiForm = ({ values, setFieldValue }) => {
    return (
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs} locale="id">
          <div className="mt-3 bg-neutral-100 px-6 py-8 rounded-[16px]">
            <div className=" space-y-8">
              <TextInput
                label="Nama Pemberi Informasi/Jabatan"
                labelPosition="left"
                placeholder="Nama Pemberi Informasi/Jabatan kosong"
                size="Medium"
                errorMessage="Nama Pemberi Informasi/Jabatan kosong"
                value={
                  dataEntri?.keterangan_pemberi_informasi
                    ?.nama_pemberi_informasi || ""
                }
                disabledActive={true}
              />
              <TextInput
                label="Tanda Tangan Responden"
                labelPosition="left"
                placeholder="Tanda Tangan Responden kosong"
                size="Medium"
                errorMessage="Tanda Tangan Responden kosong"
                value={
                  dataEntri?.keterangan_pemberi_informasi
                    ?.tanda_tangan_responden || ""
                }
                disabledActive={true}
              />
            </div>
          </div>
        </LocalizationProvider>
        <TextInput
          className="my-3"
          label="Catatan Blok III"
          placeholder="Masukkan Catatan Blok III"
          size="Medium"
          errorMessage="Catatan Blok III tidak boleh kosong"
          // value={values.catatan_blok_3 || ""}
          onChange={(e) => {
            setFieldValue("catatan_blok_3", e.target.value);
          }}
        />
      </div>
    );
  };

  const KeteranganMaterialPeralatanTenagaKerjaForm = ({
    values,
    setFieldValue,
  }) => {
    return (
      <div>
        <TextInput
          className="my-3"
          label="Catatan Blok IV"
          placeholder="Masukkan Catatan Blok IV"
          size="Medium"
          errorMessage="Catatan Blok IV tidak boleh kosong"
          // value={values.catatan_blok_4 || ""}
          onChange={(e) => {
            setFieldValue("catatan_blok_4", e.target.value);
          }}
        />
      </div>
    );
  };

  const MaterialForm = ({ hide }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const paginatedMaterial =
      material?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ) || [];

    return (
      <div className={`${hide ? "hidden" : ""}`}>
        <FieldArray name="material">
          {({ push, remove }) => (
            <div className="mt-6">
              <div className="flex flex-row justify-between items-center">
                <div className="">
                  <Tabs
                    items={["Material", "Peralatan", "Tenaga Kerja"]}
                    onChange={(index) => setSelectedValue(index)}
                    selectedValue={0}
                  />
                </div>
                <SearchBox
                  placeholder="Cari Material..."
                  onSearch={() => {}}
                  withFilter={true}
                />
              </div>
              <div className="rounded-[16px] border border-gray-200 overflow-hidden mt-4">
                <div className="overflow-x-auto">
                  <table className="table-auto w-full min-w-max">
                    <thead>
                      <tr className="bg-custom-blue-100 text-left text-emphasis-on_surface-high uppercase tracking-wider">
                        <th className="px-3 py-6 text-sm text-center w-[52px]">
                          No
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Nama Material
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">Satuan</th>
                        <th className="px-3 py-6 text-sm w-[200px]">
                          Spesifikasi
                        </th>
                        <th className="px-3 py-6 text-sm w-[200px]">Ukuran</th>
                        <th className="px-3 py-6 text-sm w-[140px]">
                          Kodefikasi
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Kelompok Material
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Jumlah Kebutuhan
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">Merk</th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Provinsi
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">Kota</th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Satuan Setempat
                          <span className="text-custom-red-500">*</span>
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Satuan Setempat Panjang
                          <span className="text-custom-red-500">*</span>
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Satuan Setempat Lebar
                          <span className="text-custom-red-500">*</span>
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Satuan Setempat Tinggi
                          <span className="text-custom-red-500">*</span>
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Konversi Satuan Setempat ke Satuan Standar
                          <span className="text-custom-red-500">*</span>
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Harga per satuan Setempat (Rp)
                          <span className="text-custom-red-500">*</span>
                        </th>

                        <th className="px-3 py-6 text-sm w-[280px]">
                          Harga Konversi Satuan Setempat ke Satuan Standar (Rp)
                          <span className="text-custom-red-500">*</span>
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Harga Khusus (Rp)
                          <span className="text-custom-red-500">*</span>
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Keterangan
                          <span className="text-custom-red-500">*</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedMaterial.length > 0 ? (
                        paginatedMaterial.map((item, index) => (
                          <tr
                            key={item.id}
                            className={`${
                              index % 2 === 0
                                ? "bg-custom-neutral-0"
                                : "bg-custom-neutral-100"
                            }`}>
                            <td className="px-3 py-6 text-sm text-center">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td className="px-3 py-6 text-sm">
                              {item.nama_material}
                            </td>
                            <td className="px-3 py-6 text-sm">{item.satuan}</td>
                            <td className="px-3 py-6 text-sm">
                              {item.spesifikasi}
                            </td>
                            <td className="px-3 py-6 text-sm">{item.ukuran}</td>
                            <td className="px-3 py-6 text-sm">
                              {item.kodefikasi}
                            </td>
                            <td className="px-3 py-6 text-sm">
                              {item.kelompok_material}
                            </td>
                            <td className="px-3 py-6 text-sm">
                              {item.jumlah_kebutuhan}
                            </td>
                            <td className="px-3 py-6 text-sm">{item.merk}</td>
                            <td className="px-3 py-6 text-sm">
                              {item.provincies_id}
                            </td>
                            <td className="px-3 py-6 text-sm">
                              {item.cities_id}
                            </td>
                            <td className="px-3 py-6">
                              {item.satuan_setempat}
                            </td>
                            <td className="px-3 py-6">
                              {item.satuan_setempat_panjang}
                            </td>
                            <td className="px-3 py-6">
                              {item.satuan_setempat_lebar}
                            </td>
                            <td className="px-3 py-6">
                              {item.satuan_setempat_tinggi}
                            </td>
                            <td className="px-3 py-6">
                              {item.konversi_satuan_setempat}
                            </td>
                            <td className="px-3 py-6">
                              {item.harga_satuan_setempat}
                            </td>
                            <td className="px-3 py-6">
                              {item.harga_konversi_satuan_setempat}
                            </td>
                            <td className="px-3 py-6">{item.harga_khusus}</td>
                            <td className="px-3 py-6">{item.keterangan}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            className="px-3 py-6 text-B1 text-center text-emphasis-on_surface-medium"
                            colSpan="20">
                            Tidak ada data tersedia
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </FieldArray>
      </div>
    );
  };

  const PeralatanForm = ({ hide }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const paginatedPeralatan =
      peralatan?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ) || [];

    return (
      <div className={`${hide ? "hidden" : ""}`}>
        <FieldArray name="peralatan">
          {({ push, remove }) => (
            <div className="mt-6">
              <div className="flex flex-row justify-between items-center">
                <div className="">
                  <Tabs
                    items={["Material", "Peralatan", "Tenaga Kerja"]}
                    onChange={(index) => setSelectedValue(index)}
                    selectedValue={1}
                  />
                </div>
                <SearchBox
                  placeholder="Cari Peralatan..."
                  onSearch={() => {}}
                  withFilter={true}
                />
              </div>
              <div className="rounded-[16px] border border-gray-200 overflow-hidden mt-4">
                <div className="overflow-x-auto">
                  <table className="table-auto w-full min-w-max">
                    <thead>
                      <tr className="bg-custom-blue-100 text-left text-emphasis-on_surface-high uppercase tracking-wider">
                        <th className="px-3 py-6 text-sm text-center w-[52px]">
                          No
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Nama Peralatan
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">Satuan</th>
                        <th className="px-3 py-6 text-sm w-[200px]">
                          Spesifikasi
                        </th>
                        <th className="px-3 py-6 text-sm w-[200px]">
                          Kapasitas
                        </th>
                        <th className="px-3 py-6 text-sm w-[140px]">
                          Kodefikasi
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Kelompok Peralatan
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Jumlah Kebutuhan
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">Merk</th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Provinsi
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Kabupaten/Kota
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Satuan Setempat
                          <span className="text-custom-red-500">*</span>
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Harga Sewa Satuan Setempat
                          <span className="text-custom-red-500">*</span>
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Harga Sewa Konversi
                          <span className="text-custom-red-500">*</span>
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Harga Pokok
                          <span className="text-custom-red-500">*</span>
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Keterangan
                          <span className="text-custom-red-500">*</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedPeralatan.length > 0 ? (
                        paginatedPeralatan.map((item, index) => (
                          <tr
                            key={item.id}
                            className={`${
                              index % 2 === 0
                                ? "bg-custom-neutral-0"
                                : "bg-custom-neutral-100"
                            }`}>
                            <td className="px-3 py-6 text-sm text-center">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td className="px-3 py-6 text-sm">
                              {item.nama_peralatan}
                            </td>
                            <td className="px-3 py-6 text-sm">{item.satuan}</td>
                            <td className="px-3 py-6 text-sm">
                              {item.spesifikasi}
                            </td>
                            <td className="px-3 py-6 text-sm">
                              {item.kapasitas}
                            </td>
                            <td className="px-3 py-6 text-sm">
                              {item.kodefikasi}
                            </td>
                            <td className="px-3 py-6 text-sm">
                              {item.kelompok_peralatan}
                            </td>
                            <td className="px-3 py-6 text-sm">
                              {item.jumlah_kebutuhan}
                            </td>
                            <td className="px-3 py-6 text-sm">{item.merk}</td>
                            <td className="px-3 py-6 text-sm">
                              {item.provincies_id}
                            </td>
                            <td className="px-3 py-6 text-sm">
                              {item.cities_id}
                            </td>
                            <td className="px-3 py-6">
                              {item.satuan_setempat}
                            </td>
                            <td className="px-3 py-6">
                              {item.harga_satuan_setempat}
                            </td>
                            <td className="px-3 py-6">
                              {item.harga_sewa_konversi}
                            </td>
                            <td className="px-3 py-6">{item.harga_pokok}</td>
                            <td className="px-3 py-6">{item.keterangan}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            className="px-3 py-6 text-B1 text-center text-emphasis-on_surface-medium"
                            colSpan="16">
                            Tidak ada data tersedia
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </FieldArray>
      </div>
    );
  };

  const TenagaKerjaForm = ({ hide }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const paginatedTenaga_kerja =
      tenaga_kerja?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ) || [];

    return (
      <div className={`${hide ? "hidden" : ""}`}>
        <FieldArray name="tenagakerja">
          {({ push, remove }) => (
            <div className="mt-6">
              <div className="flex flex-row justify-between items-center">
                <div className="">
                  <Tabs
                    items={["Material", "Peralatan", "Tenaga Kerja"]}
                    onChange={(index) => setSelectedValue(index)}
                    selectedValue={2}
                  />
                </div>
                <SearchBox
                  placeholder="Cari Tenaga Kerja..."
                  onSearch={() => {}}
                  withFilter={true}
                />
              </div>
              <div className="rounded-[16px] border border-gray-200 overflow-hidden mt-4">
                <div className="overflow-x-auto">
                  <table className="table-auto w-full min-w-max">
                    <thead>
                      <tr className="bg-custom-blue-100 text-left text-emphasis-on_surface-high uppercase tracking-wider">
                        <th className="px-3 py-6 text-sm text-center w-[52px]">
                          No
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Jenis Tenaga Kerja
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">Satuan</th>
                        <th className="px-3 py-6 text-sm w-[200px]">
                          Jumlah Kebutuhan
                        </th>
                        <th className="px-3 py-6 text-sm w-[200px]">
                          Kodefikasi
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Provinsi
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Kabupaten/Kota
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Harga per Satuan Setempat
                          <span className="text-custom-red-500">*</span>
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Harga Konversi per Jam
                          <span className="text-custom-red-500">*</span>
                        </th>
                        <th className="px-3 py-6 text-sm w-[280px]">
                          Keterangan
                          <span className="text-custom-red-500">*</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTenaga_kerja.length > 0 ? (
                        paginatedTenaga_kerja.map((item, index) => (
                          <tr
                            key={item.id}
                            className={`${
                              index % 2 === 0
                                ? "bg-custom-neutral-0"
                                : "bg-custom-neutral-100"
                            }`}>
                            <td className="px-3 py-6 text-sm text-center">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td className="px-3 py-6 text-sm">
                              {item.jenis_tenaga_kerja}
                            </td>
                            <td className="px-3 py-6 text-sm">{item.satuan}</td>
                            <td className="px-3 py-6 text-sm">
                              {item.jumlah_kebutuhan}
                            </td>
                            <td className="px-3 py-6 text-sm">
                              {item.kodefikasi}
                            </td>
                            <td className="px-3 py-6 text-sm">
                              {item.provincies_id}
                            </td>
                            <td className="px-3 py-6 text-sm">
                              {item.cities_id}
                            </td>
                            <td className="px-3 py-6">
                              {item.harga_per_satuan_setempat}
                            </td>
                            <td className="px-3 py-6">
                              {item.harga_konversi_perjam}
                            </td>
                            <td className="px-3 py-6">{item.keterangan}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            className="px-3 py-6 text-B1 text-center text-emphasis-on_surface-medium"
                            colSpan="10">
                            Tidak ada data tersedia
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </FieldArray>
      </div>
    );
  };

  return (
    <div className="p-8">
      <Navbar />
      <h3 className="text-H3 text-emphasis-on_surface-high">Pengawasan</h3>
      <Formik initialValues={{ catatan_blok_1: "" }} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => (
          <Form>
            <h4 className="text-H4 text-emphasis-on_surface-high">
              Blok I: Keterangan Tempat
            </h4>
            <KeteranganTempatForm
              values={values}
              setFieldValue={setFieldValue}
            />
            <h4 className="text-H4 text-emphasis-on_surface-high">
              Blok II: Keterangan Petugas Lapangan
            </h4>
            <KeteranganPetugasLapanganForm
              values={values}
              setFieldValue={setFieldValue}
            />
            <h4 className="text-H4 text-emphasis-on_surface-high">
              Blok III: Keterangan Pemberi Informasi
            </h4>
            <KeteranganPemberiInformasiForm
              values={values}
              setFieldValue={setFieldValue}
            />
            <h4 className="text-H4 text-emphasis-on_surface-high">
              Blok IV: Keterangan Material, Peralatan, Tenaga Kerja
            </h4>
            <MaterialForm
              values={values}
              setFieldValue={setFieldValue}
              hide={selectedValue !== 0}
              provincesOptions={[]}
              kelompokMaterialOptions={[]}
            />
            <PeralatanForm
              values={values}
              setFieldValue={setFieldValue}
              hide={selectedValue !== 1}
            />
            <TenagaKerjaForm
              values={values}
              setFieldValue={setFieldValue}
              hide={selectedValue !== 2}
            />
            <KeteranganMaterialPeralatanTenagaKerjaForm
              values={values}
              setFieldValue={setFieldValue}
            />
            <h4 className="text-H4 text-emphasis-on_surface-high">
              Blok V: Verifikasi Dokumen
            </h4>
            <div className="rounded-[16px] border border-gray-200 overflow-hidden mt-4">
              <div className="overflow-x-auto">
                <table className="table-fixed w-full">
                  <thead>
                    <tr className="bg-custom-blue-100 text-left text-emphasis-on_surface-high uppercase tracking-wider">
                      <th className="px-3 py-6 text-sm text-center w-[40px]">
                        No
                      </th>
                      <th className="px-3 py-6 text-sm w-[180px]">
                        Kelengkapan Dokumen
                      </th>
                      <th className="px-3 py-6 text-sm text-center w-[150px] hidden">
                        ID Pemeriksaan
                      </th>
                      <th className="px-3 py-6 text-sm text-center w-[200px] hidden">
                        Status Pemeriksaan
                      </th>
                      <th className="px-3 py-6 text-sm text-center w-[200px] hidden">
                        Verified By
                      </th>
                      <th className="px-3 py-6 text-sm text-center w-[140px]">
                        Memenuhi
                      </th>
                      <th className="px-3 py-6 text-sm text-center w-[140px]">
                        Tidak Memenuhi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr
                        key={item.id_pemeriksaan}
                        className={`${
                          index % 2 === 0
                            ? "bg-custom-neutral-0"
                            : "bg-custom-neutral-100"
                        }`}>
                        <td className="px-3 py-4 text-sm text-center">
                          {item.nomor}
                        </td>
                        <td className="px-3 py-4 text-sm">
                          {item.kelengkapan_dokumen}
                        </td>
                        <td className="px-3 py-4 text-sm text-center hidden">
                          {item.id_pemeriksaan}
                        </td>
                        <td className="px-3 py-4 text-sm hidden">
                          {item.status_pemeriksaan || "Belum Dipilih"}
                        </td>
                        <td className="px-3 py-4 text-sm hidden">
                          {item.verified_by}
                        </td>

                        {/* Tombol radio hanya muncul jika item.verified_by tidak null */}
                        {item.id_pemeriksaan && item.verified_by !== null && (
                          <>
                            <td className="px-3 py-4 text-sm text-center">
                              <input
                                type="radio"
                                id={`status-${item.id_pemeriksaan}-memenuhi`}
                                name={`status-${item.id_pemeriksaan}`}
                                value="memenuhi"
                                checked={item.status_pemeriksaan === "memenuhi"}
                                onChange={() =>
                                  handleChange(item.id_pemeriksaan, "memenuhi")
                                }
                                className="mr-2"
                              />
                            </td>
                            <td className="px-3 py-4 text-sm text-center">
                              <input
                                type="radio"
                                id={`status-${item.id_pemeriksaan}-tidak_memenuhi`}
                                name={`status-${item.id_pemeriksaan}`}
                                value="tidak_memenuhi"
                                checked={
                                  item.status_pemeriksaan === "tidak_memenuhi"
                                }
                                onChange={() =>
                                  handleChange(
                                    item.id_pemeriksaan,
                                    "tidak_memenuhi"
                                  )
                                }
                                className="mr-2"
                              />
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <h4 className="text-H4 text-emphasis-on_surface-high mt-6 mb-3 ">
              Blok VI: Unggah Berita Acara
            </h4>
            <FileInput
              onFileSelect={(files) => {
                handleBeritaAcara(files);
                setFieldValue("beritaAcara", files[0]);
              }}
              setSelectedFile={setBerita_Acara}
              buttonText="Pilih Berkas"
              multiple={false}
              accept=".pdf"
              // Label="Unggah Berita Acara"
              HelxperText="Format .PDF dan maksimal 2MB"
              state={beritaacarastate}
              onCancel={() => {
                handleCancelBeritaAcara();
                setFieldValue("beritaAcara", null);
              }}
              selectedFile={selectedberitaacara}
              maxSizeMB={2}
            />
            <div className="flex flex-row justify-end items-right space-x-4 mt-3 bg-neutral-100 px-6 py-8 rounded-[16px]">
              <Button
                variant="solid_blue"
                size="Medium"
                type="submit"
                disabled={isSubmitDisabled}>
                Simpan
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      {alert.open && (
        <CustomAlert
          message={alert.message}
          severity={alert.severity}
          openInitially={alert.open}
          onClose={() => setAlert({ ...alert, open: false })}
        />
      )}
    </div>
  );
}

export default App;

const Tabs = ({ index, items, onChange, selectedValue, button }) => {
  const handleClick = (tabIndex) => {
    onChange(tabIndex);
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="inline-flex space-x-2 bg-custom-neutral-100 rounded-[16px] p-2 h-[60px]">
          {items.map((item, tabIndex) => (
            <button
              type="button"
              key={tabIndex}
              onClick={() => handleClick(tabIndex)}
              className={`px-4 py-3 text-Small rounded-[12px] transition-all duration-300 cursor-pointer whitespace-nowrap ${
                selectedValue === tabIndex
                  ? "bg-custom-blue-500 text-emphasis-on_color-high"
                  : "text-emphasis-on_surface-medium hover:bg-surface-light-overlay"
              }`}>
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          {button && (
            <button
              type="button"
              className={`${
                button.variant === "solid_blue"
                  ? "bg-custom-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } px-4 py-2 rounded-lg`}
              onClick={
                button.onClick || (() => console.log("Button clicked!"))
              }>
              {button.label || "Button"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
