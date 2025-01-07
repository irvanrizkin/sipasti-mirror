import React, { useState, useEffect } from "react";
import { Field, FieldArray, Form, Formik } from "formik";
import Navbar from "../../../components/navigationbar";
import Button from "../../../components/button";
import { pemeriksaan_dataStore } from "../test2_store/test2";
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
  const [progress, setProgress] = useState(0);
  const {
    data_vendor_id,
    dataAPI,
    identifikasi_kebutuhan_id,
    data,
    updateStatus,
    fetchDataEntriData,
  } = useStore(pemeriksaan_dataStore);

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

  const shortlist_id =
    typeof window !== "undefined" ? localStorage.getItem("shortlist_id") : null;

  useEffect(() => {
    if (shortlist_id) {
      console.log("shortlist_id yang dikirim:", shortlist_id);
      fetchDataEntriData(shortlist_id); // Use the shortlist_id from localStorage
    }
  }, [shortlist_id]);

  useEffect(() => {
    console.log("Fetched Data from Store:", data);
  }, [data]);

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

  //   const isSubmitDisabled = data.some(
  //     (item) => item.status_pemeriksaan === null
  //   );

  const handleSubmit = async (values) => {
    try {
      const verifikasiValidasi = data
        .filter((item) => item.verified_by !== null)
        .map((item) => ({
          id_pemeriksaan: item.id_pemeriksaan,
          status_pemeriksaan: item.status_pemeriksaan || "memenuhi",
          verified_by: item.verified_by || "tim teknis",
        }));

      // Membuat objek FormData
      const payload = new FormData();
      // const formattedDate = dayjs().format("YYYY-MM-DD HH:mm:ss");
      // payload.append("date_field", formattedDate);
      payload.append("identifikasi_kebutuhan_id", identifikasi_kebutuhan_id);
      payload.append("data_vendor_id", data_vendor_id);

      if (selectedberitaacara) {
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
      <Formik initialValues={{ catatan_blok_1: "" }} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => (
          <Form>
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
                    {dataAPI.map((item, index) => (
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
