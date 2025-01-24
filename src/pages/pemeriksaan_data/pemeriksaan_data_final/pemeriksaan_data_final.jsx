import React, { useState, useEffect } from "react";
import { Field, FieldArray, Form, Formik } from "formik";
import Navbar from "../../../components/navigationbar";
import Button from "../../../components/button";
import { pemeriksaan_dataStore } from "../pemeriksaan_data_final_store/pemeriksaan_data.js";
import { submitDataVerifikasiValidasi } from "../../../services/api";
import FileInput from "../../../components/FileInput";

import { useStore } from "zustand";
import dayjs from "dayjs";
import CustomAlert from "../../../components/alert";
import { useRouter } from "next/router";

import "dayjs/locale/id";

dayjs.locale("id");

function App() {
  const formattedDate = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const [berita_acara, setBerita_Acara] = useState(null);
  const [selectedberitaacara, setselectedBeritaAcara] = useState(null);
  const [error, setError] = useState("");
  const { pemeriksaanData } = useStore(pemeriksaan_dataStore);
  const [progress, setProgress] = useState(0);
  const {
    fetchPemeriksaanData,
    data_vendor_id,
    dataStatic,
    dataAPI,
    identifikasi_kebutuhan_id,
    data,
    updateStatus,
  } = useStore(pemeriksaan_dataStore);

  useEffect(() => {
    fetchPemeriksaanData();
  }, [fetchPemeriksaanData]);

  const router = useRouter();
  const { id } = router.query;

  const [alert, setAlert] = useState({
    message: "",
    severity: "",
    open: false,
  });

  useEffect(() => {
    const id = localStorage.getItem("shortlist_id");

    console.log("ID yang digunakan:", id);

    if (id) {
      console.log("Fetching data with ID:", id);
      fetchPemeriksaanData(id);
    } else {
      console.warn("shortlist_id not found in localStorage.");
    }
  }, [fetchPemeriksaanData]);

  useEffect(() => {
    console.log("Fetched Data from Store:", data);
  }, [data]);

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

  const isSubmitDisabled = ["C1", "C2", "C3", "C4"].some((id) => {
    const item = data.find((d) => d.id_pemeriksaan === id);
    return !item || item.status_pemeriksaan === null;
  });

  const isD1D2Disabled = !["C1", "C2", "C3", "C4"].every((id) => {
    const item = data.find((d) => d.id_pemeriksaan === id);
    return item && item.status_pemeriksaan === "memenuhi";
  });

  const filteredData = pemeriksaanData.filter((item) =>
    ["A1", "A2", "A3", "A4", "A5", "B1", "B2"].includes(item.item_number)
  );

  const isD1D2Complete = ["D1", "D2"].every((id) => {
    const item = data.find((d) => d.id_pemeriksaan === id);
    return item && item.status_pemeriksaan !== null;
  });

  const hasNotMeetingCItem = data.some(
    (c) =>
      c.id_pemeriksaan.startsWith("C") &&
      c.status_pemeriksaan === "tidak memenuhi"
  );

  const combinedData = dataStatic.map((item) => {
    const apiData =
      filteredData.find(
        (filteredItem) => filteredItem.item_number === item.item_number
      ) || {};

    return {
      nomor: item.nomor,
      kelengkapan_dokumen: item.kelengkapan_dokumen,
      status_pemeriksaan: apiData.status_pemeriksaan || null,
      verified_by: apiData.verified_by || null,
      showRadio: ["A1", "A2", "A3", "A4", "A5", "B1", "B2"].includes(
        item.item_number
      ),
    };
  });

  const handleSubmit = async (values) => {
    try {
      const verifikasiValidasi = data
        .filter((item) => item.verified_by !== null)
        .filter((item) => {
          // Check if any "C" item is "tidak memenuhi"
          const hasNotMeetingCItem = data.some(
            (c) =>
              c.id_pemeriksaan.startsWith("C") &&
              c.status_pemeriksaan === "tidak memenuhi"
          );
          if (hasNotMeetingCItem) {
            // If any "C" item is "tidak memenuhi", remove items starting with "D"
            return !item.id_pemeriksaan.startsWith("D");
          }
          return true;
        })
        .map((item) => {
          return {
            id_pemeriksaan: item.id_pemeriksaan,
            status_pemeriksaan: item.status_pemeriksaan || "memenuhi",
            verified_by: item.verified_by || "tim teknis",
          };
        });

      const payload = new FormData();
      payload.append("identifikasi_kebutuhan_id", identifikasi_kebutuhan_id);
      payload.append("data_vendor_id", data_vendor_id);

      const hasNotMeetingCItem = data.some(
        (c) =>
          c.id_pemeriksaan.startsWith("C") &&
          c.status_pemeriksaan === "tidak memenuhi"
      );
      if (hasNotMeetingCItem) {
        setselectedBeritaAcara(null);
        setBeritaAcaraState("default");
      }

      if (!hasNotMeetingCItem && selectedberitaacara) {
        payload.append("berita_acara_validasi", selectedberitaacara);
      }

      payload.append("verifikasi_validasi", JSON.stringify(verifikasiValidasi));

      console.log("Payload yang dikirim:");
      payload.forEach((value, key) => {
        console.log(key, value);
      });

      const response = await submitDataVerifikasiValidasi(payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Response from API:", response);

      if (response.status === "success") {
        setAlert({
          message: "Data berhasil dikirim!",
          severity: "success",
          open: true,
        });
      } else if (response.status === "error") {
        const errorMessage = Array.isArray(response.message)
          ? response.message[0]
          : response.message || "Something went wrong";

        setAlert({
          message: `Error: ${errorMessage}`,
          severity: "error",
          open: true,
        });
      } else {
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

  return (
    <div className="p-8">
      <Navbar />
      <h3 className="text-H3 text-emphasis-on_surface-high">
        Pemeriksaan Data
      </h3>
      <Formik initialValues={{ catatan_blok_1: "" }} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => (
          <Form>
            {/* Tabel Data API (Static) */}
            <div className="rounded-[16px] border border-gray-200 overflow-hidden mt-4">
              <div className="overflow-x-auto">
                <table className="table-fixed w-full">
                  <thead>
                    <tr className="bg-custom-blue-100 text-left text-emphasis-on_surface-high uppercase tracking-wider">
                      <th className="px-3 py-6 text-sm text-center w-[40px]">
                        No
                      </th>
                      <th className="px-3 py-6 text-sm text-left w-[180px]">
                        Daftar SIMAK
                      </th>
                      <th className="px-3 py-6 text-sm text-center w-[200px] hidden">
                        Status Pemeriksaan
                      </th>
                      <th className="px-3 py-6 text-sm text-center w-[140px]">
                        Memenuhi
                      </th>
                      <th className="px-3 py-6 text-sm text-center w-[140px]">
                        Tidak Memenuhi
                      </th>
                      <th className="px-3 py-6 text-sm text-center w-[140px] hidden">
                        Verified By
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {combinedData.length > 0 ? (
                      combinedData.map((item, index) => (
                        <tr
                          key={index}
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
                            {item.status_pemeriksaan}
                          </td>
                          <td className="px-3 py-4 text-sm hidden">
                            {item.verified_by}
                          </td>
                          <td className="px-3 py-4 text-sm text-center">
                            {item.showRadio ? (
                              <input
                                type="radio"
                                name={`radio-${index}`}
                                checked={item.status_pemeriksaan === "memenuhi"}
                                disabled={!item.showRadio}
                              />
                            ) : null}
                          </td>
                          <td className="px-3 py-4 text-sm text-center">
                            {item.showRadio ? (
                              <input
                                type="radio"
                                name={`radio-${index}`}
                                checked={item.status_pemeriksaan !== "memenuhi"}
                                disabled={!item.showRadio}
                              />
                            ) : null}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          style={{ textAlign: "center", padding: "10px" }}>
                          Tidak ada data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-[16px] border border-gray-200 overflow-hidden mt-4">
              <div className="overflow-x-auto">
                <table className="table-fixed w-full">
                  <thead>
                    <tr className="bg-custom-blue-100 text-left text-emphasis-on_surface-high uppercase tracking-wider">
                      <th className="px-3 py-6 text-sm text-center w-[40px]">
                        No
                      </th>
                      <th className="px-3 py-6 text-sm w-[180px]">
                        Daftar Simak
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
                                disabled={
                                  (item.id_pemeriksaan === "D1" ||
                                    item.id_pemeriksaan === "D2") &&
                                  isD1D2Disabled
                                } // D1 & D2 disabled kalau C1-C4 belum lengkap atau ada "tidak memenuhi"
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
                                disabled={
                                  (item.id_pemeriksaan === "D1" ||
                                    item.id_pemeriksaan === "D2") &&
                                  isD1D2Disabled
                                } // Sama logic kayak di atas
                                id={`status-${item.id_pemeriksaan}-tidak memenuhi`}
                                name={`status-${item.id_pemeriksaan}`}
                                value="tidak memenuhi"
                                checked={
                                  item.status_pemeriksaan === "tidak memenuhi"
                                }
                                onChange={() =>
                                  handleChange(
                                    item.id_pemeriksaan,
                                    "tidak memenuhi"
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
            {!hasNotMeetingCItem && isD1D2Complete && (
              <>
                <h4 className="text-H4 text-emphasis-on_surface-high mt-6 mb-3 ">
                  Unggah Berita Acara Penetapan Harga / Berita Acara Penetapan
                  Harga Hasil Rekonsiliasi
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
                  HelxperText="Format .PDF dan maksimal 2MB"
                  state={beritaacarastate}
                  onCancel={() => {
                    handleCancelBeritaAcara();
                    setFieldValue("beritaAcara", null);
                  }}
                  selectedFile={selectedberitaacara}
                  maxSizeMB={2}
                />
              </>
            )}

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
