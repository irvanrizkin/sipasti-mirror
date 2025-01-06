import React, { useState, useEffect } from "react";
import { Field, FieldArray, Form, Formik } from "formik";
import Navbar from "../../../components/navigationbar";
import Button from "../../../components/button";
import { pemeriksaan_dataStore } from "../pemeriksaan_data_final_store/pemeriksaan_data";
import { submitDataVerifikasiValidasi } from "../../../services/api";
import FileInput from "../../../components/FileInput";

import { useStore } from "zustand";
import dayjs from "dayjs";
import CustomAlert from "../../../components/alert";
import { useRouter } from "next/router";

import "dayjs/locale/id";

dayjs.locale("id");

function App() {
  const [berita_acara, setBerita_Acara] = useState(null);
  const [selectedberitaacara, setselectedBeritaAcara] = useState(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const {
    data_vendor_id,
    identifikasi_kebutuhan_id,
    data,
    updateStatus,
    fetchDataEntriData,
  } = useStore(pemeriksaan_dataStore);

  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedId = localStorage.getItem("shortlist_id");
    if (storedId) {
      fetchDataEntriData(storedId).then(() => {
        console.log("Data yang diterima: ", data); // Log data yang diterima
        setLoading(false);
      });
    }
  }, [fetchDataEntriData]);

  const [alert, setAlert] = useState({
    message: "",
    severity: "",
    open: false,
  });

  useEffect(() => {
    const storedId = localStorage.getItem("shortlist_id");
    if (storedId) {
      fetchDataEntriData(storedId).then(() => {
        console.log("Data yang diterima: ", data);
        setLoading(false);
      });
    }
  }, [fetchDataEntriData]);

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

  const isSubmitDisabled =
    Array.isArray(data) &&
    data.some((item) => item.status_pemeriksaan === null);

  const handleSubmit = async (values) => {
    console.log("localStorage sebelum submit:", { ...localStorage });

    try {
      const verifikasiValidasi = data
        .filter((item) => item.verified_by !== null)
        .map((item) => ({
          id_pemeriksaan: item.id_pemeriksaan,
          status_pemeriksaan: item.status_pemeriksaan || "memenuhi",
          verified_by: item.verified_by || "tim teknis",
        }));

      const payload = new FormData();
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
    } finally {
      localStorage.removeItem("shortlist_id");
      console.log("localStorage setelah submit:", { ...localStorage });
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
            <div className="rounded-[16px] border border-gray-200 overflow-hidden mt-4">
              <div className="overflow-x-auto">
                <table className="table-fixed w-full">
                  <thead>
                    <tr className="bg-custom-blue-100 text-left text-emphasis-on_surface-high uppercase tracking-wider">
                      <th className="px-3 py-6 text-sm text-center w-[40px]">
                        No
                      </th>
                      <th className="px-3 py-6 text-sm w-full">
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
                      <th className="px-3 py-6 text-sm text-center w-[370px]">
                        Memenuhi
                      </th>
                      <th className="px-3 py-6 text-sm text-center w-[370px]">
                        Tidak Memenuhi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          Loading data...
                        </td>
                      </tr>
                    ) : data && Array.isArray(data) && data.length > 0 ? (
                      data.map((item, index) => (
                        <tr
                          key={item.id_pemeriksaan || index}
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
                          {/* Rest of your table */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          Tidak ada data tersedia.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <h4 className="text-H4 text-emphasis-on_surface-high mt-6 mb-3 ">
              Unggah Berita Acara
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
