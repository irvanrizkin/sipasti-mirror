import { Field, FieldArray, Form, Formik } from "formik";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../../components/navigationbar";
import Tabs from "../../../components/Tabs";
import Dropdown from "../../../components/dropdown";
import TextInput from "../../../components/input";
import Button from "../../../components/button";
import FileInput from "../../../components/FileInput";
import { Trash, Add } from "iconsax-react";
import colors from "../../../styles/colors";
import usePenugasanTimStore from "./penugasan_tim/penugasan_tim";
import CustomAlert from "../../../components/alert";

export default function PenugasanTim() {
  const { userOptions, fetchUserOptions } = usePenugasanTimStore();
  const { UserTimTeknisOptions, fetchUserTimTeknisOptions } =
    usePenugasanTimStore();
  const { UserPengawasOptions, fetchUserPengawasOptions } =
    usePenugasanTimStore();
  const { UserPetugasLapangan, fetchUserPetugasLapangan } =
    usePenugasanTimStore();
  const { UserPengolahData, fetchUserPengolahData } = usePenugasanTimStore();
  const [skPenugasantimTeknisBalai, setSkPenugasantimTeknisBalai] =
    useState(null);
  const [skPenugasanPengawas, setSkPenugasanPengawas] = useState(null);
  const [skPenugasanPetugasLapangan, setSkPenugasanPetugasLapangan] =
    useState(null);
  const [skPenugasanPengolahData, setSkPenugasanPengolahData] = useState(null);
  const [suratPenugasanTimTeknisBalai, setSuratPenugasanTimTeknisBalai] =
    useState(null);
  const [suratPenugasanPengawas, setSuratPenugasanPengawas] = useState(null);
  const [suratPenugasanPetugasLapangan, setSuratPenugasanPetugasLapangan] =
    useState(null);
  const [suratPenugasanPengolahData, setSuratPenugasanPengolahData] =
    useState(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const [
    suratPenugasanTimTeknisBalaiState,
    setSuratPenugasanTimTeknisBalaiState,
  ] = useState("default");

  const [suratPenugasanPengawasState, setSuratPenugasanPengawasState] =
    useState("default");

  const [
    suratPenugasanPetugasLapanganState,
    setsuratPenugasanPetugasLapanganState,
  ] = useState("default");

  const [
    suratPenugasanPengolahDataState,
    setsuratPenugasanPetugasPengolahDataState,
  ] = useState("default");

  const { alert, setAlert } = usePenugasanTimStore();

  const handleCancelSuratPenugasanTimTeknisBalai = () => {
    console.log("Cancelling file upload...");

    setSuratPenugasanTimTeknisBalai(null);
    setSkPenugasantimTeknisBalai(null);

    setProgress(0);
    setSuratPenugasanTimTeknisBalaiState("default");

    setError("");
  };

  const handleCancelSuratPenugasanPengawas = () => {
    console.log("Cancelling file upload...");

    setSuratPenugasanPengawas(null);
    setSkPenugasanPengawas(null);

    setProgress(0);
    setSuratPenugasanPengawasState("default");

    setError("");
  };

  const handleCancelSuratPenugasanPetugasLapangan = () => {
    console.log("Cancelling file upload...");

    setSuratPenugasanPetugasLapangan(null);
    setSkPenugasanPetugasLapangan(null);

    setProgress(0);
    setsuratPenugasanPetugasLapanganState("default");

    setError("");
  };

  const handleCancelSuratPenugasanPengolahData = () => {
    console.log("Cancelling file upload...");

    setsuratPenugasanPetugasPengolahDataState(null);
    setSkPenugasanPengolahData(null);

    setProgress(0);
    setsuratPenugasanPetugasPengolahDataState("default");

    setError("");
  };

  const handleSuratPenugasanTimTeknisBalai = (files) => {
    if (files.length === 0) {
      setError("File wajib dipilih.");
      return;
    }

    const file = files[0];
    setSkPenugasantimTeknisBalai(file);
    setSuratPenugasanTimTeknisBalaiState("processing");
    setError("");
    try {
      setSkPenugasantimTeknisBalai(file);
      setSuratPenugasanTimTeknisBalaiState("done");
    } catch (error) {
      console.error("Error processing logo file:", error);
      setSuratPenugasanTimTeknisBalaiState("default");
    }
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setSuratPenugasanTimTeknisBalaiState("done");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSuratPenugasanPengawas = (files) => {
    if (files.length === 0) {
      setError("File wajib dipilih.");
      return;
    }

    const file = files[0];
    setSkPenugasanPengawas(file);
    setSuratPenugasanPengawasState("processing");
    setError("");
    try {
      setSkPenugasanPengawas(file);
      setSuratPenugasanPengawasState("done");
    } catch (error) {
      console.error("Error processing logo file:", error);
      setSuratPenugasanPengawasState("default");
    }
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setSuratPenugasanPengawasState("done");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSuratPenugasanPetugasLapangan = (files) => {
    if (files.length === 0) {
      setError("File wajib dipilih.");
      return;
    }

    const file = files[0];
    setSkPenugasanPetugasLapangan(file);
    setsuratPenugasanPetugasLapanganState("processing");
    setError("");
    try {
      setSkPenugasanPetugasLapangan(file);
      setsuratPenugasanPetugasLapanganState("done");
    } catch (error) {
      console.error("Error processing logo file:", error);
      setSkPenugasanPetugasLapangan("default");
    }
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setsuratPenugasanPetugasLapanganState("done");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSuratPenugasanPengolahData = (files) => {
    if (files.length === 0) {
      setError("File wajib dipilih.");
      return;
    }

    const file = files[0];
    setSkPenugasanPengolahData(file);
    setsuratPenugasanPetugasPengolahDataState("processing");
    setError("");
    try {
      setSkPenugasanPengolahData(file);
      setsuratPenugasanPetugasPengolahDataState("done");
    } catch (error) {
      console.error("Error processing logo file:", error);
      setSkPenugasanPengolahData("default");
    }
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setsuratPenugasanPetugasPengolahDataState("done");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  useEffect(() => {
    fetchUserOptions();
  }, [fetchUserOptions]);

  useEffect(() => {
    fetchUserTimTeknisOptions();
  }, [fetchUserTimTeknisOptions]);

  useEffect(() => {
    fetchUserPengawasOptions();
  }, [fetchUserPengawasOptions]);

  useEffect(() => {
    fetchUserPetugasLapangan();
  }, [fetchUserPetugasLapangan]);

  useEffect(() => {
    fetchUserPengolahData();
  }, [fetchUserPengolahData]);

  console.log("sknya", skPenugasanPengawas);
  const tabs = [
    {
      label: "Tim Teknis Balai",
      index: 0,
      content: (
        <Formik
          initialValues={{
            nama_tim: "",
            ketua: "",
            sekretaris: "",
            anggota: [""],
            skPenugasanTimTeknisBalai: null,
          }}
          onSubmit={(values) => {
            console.log(JSON.stringify(values, null, 2));
            usePenugasanTimStore
              .getState()
              .saveTimTeknisBalaiData(
                values.nama_tim,
                values.ketua,
                values.sekretaris,
                values.anggota,
                values.skPenugasanTimTeknisBalai
              );
          }}
        >
          {({ values, submitForm, setFieldValue }) => {
            console.log("checkedvalue", values);
            return (
              <Form>
                <div className="">
                  <div className="mt-3 bg-neutral-100 px-6 py-8 rounded-[16px] space-y-8">
                    <TextInput
                      label="Nama Tim"
                      labelPosition="left"
                      placeholder="Masukkan Nama Tim"
                      isRequired={true}
                      size="Medium"
                      labelWidth="100px"
                      errorMessage="Nama tim tidak boleh kosong"
                      value={values.nama_tim}
                      onChange={(e) =>
                        setFieldValue("nama_tim", e.target.value)
                      }
                    />
                    <div className="px-[456px]">
                      <Button
                        variant="disabled"
                        size="Medium"
                        // onClick={handleCariData}
                      >
                        Cari Data di SIPASTI
                      </Button>
                    </div>
                    <Dropdown
                      label="Ketua"
                      labelPosition="left"
                      placeholder="Pilih Ketua"
                      size="Medium"
                      isRequired={true}
                      options={UserTimTeknisOptions}
                      value={values.ketua}
                      onSelect={(selectedOption) =>
                        setFieldValue("ketua", selectedOption.value)
                      }
                      errorMessage="Ketua tidak boleh kosong"
                    />
                    <Dropdown
                      label="Sekretaris"
                      labelPosition="left"
                      placeholder="Pilih Sekretaris"
                      size="Medium"
                      isRequired={true}
                      options={UserTimTeknisOptions}
                      value={values.sekretaris}
                      onSelect={(selectedOption) =>
                        setFieldValue("sekretaris", selectedOption.value)
                      }
                      errorMessage="Sekretaris tidak boleh kosong"
                    />
                    <FieldArray
                      name="anggota"
                      render={(arrayHelpers) => (
                        <div className="space-y-4">
                          {values.anggota.map((_, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-4"
                            >
                              <Field
                                as={Dropdown}
                                name={`anggota.${index}`}
                                label={`Nama Anggota ${index + 1}`}
                                labelPosition="left"
                                placeholder="Pilih nama anggota"
                                isRequired={true}
                                options={UserTimTeknisOptions}
                                value={values.anggota[index]}
                                onSelect={(selectedOption) =>
                                  setFieldValue(
                                    `anggota.${index}`,
                                    selectedOption.value
                                  )
                                }
                                size="Medium"
                                errorMessage="Nama anggota tidak boleh kosong"
                              />
                              <div className="flex space-x-2 items-center">
                                <div
                                  className={`w-12 h-12 flex items-center justify-center rounded-full ${
                                    values.anggota.length > 1
                                      ? "bg-custom-red-100 hover:bg-custom-red-200 cursor-pointer"
                                      : "bg-custom-gray-200 cursor-not-allowed"
                                  }`}
                                  onClick={() => {
                                    if (values.anggota.length > 1) {
                                      arrayHelpers.remove(index);
                                      if (values.anggota.length > 1) {
                                        arrayHelpers.remove(index);
                                      }
                                    }
                                  }}
                                >
                                  <Trash
                                    size="24"
                                    color={
                                      values.anggota.length > 1
                                        ? colors.Solid.Basic.Red[500]
                                        : colors.Emphasis.Light.On_Surface.Small
                                    }
                                  />
                                </div>
                                <div
                                  className="w-12 h-12 flex items-center justify-center rounded-full bg-custom-blue-100 hover:bg-custom-blue-200 cursor-pointer"
                                  onClick={() => {
                                    arrayHelpers.push("");
                                    arrayHelpers.push("");
                                  }}
                                >
                                  <Add
                                    size="24"
                                    color={colors.Solid.Basic.Blue[500]}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                    <FileInput
                      onFileSelect={(files) => {
                        handleSuratPenugasanTimTeknisBalai(files);
                        setFieldValue("skPenugasanTimTeknisBalai", files[0]);
                      }}
                      setSelectedFile={setSuratPenugasanTimTeknisBalai}
                      buttonText="Pilih Berkas"
                      multiple={false}
                      accept=".pdf"
                      Label="Unggah SK/Surat Penugasan"
                      HelperText="Format .PDF dan maksimal 2MB"
                      state={suratPenugasanTimTeknisBalaiState}
                      onCancel={() => {
                        handleCancelSuratPenugasanTimTeknisBalai();
                        setFieldValue("skPenugasanTimTeknisBalai", null);
                      }}
                      selectedFile={skPenugasantimTeknisBalai}
                      maxSizeMB={2}
                    />
                  </div>
                  <div className="flex flex-row justify-end items-right space-x-4 mt-3 bg-neutral-100 px-6 py-8 rounded-[16px]">
                    <Button
                      variant="solid_blue"
                      size="Medium"
                      onClick={submitForm}
                    >
                      Simpan
                    </Button>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      ),
    },
    {
      label: "Pengawas",
      index: 1,
      content: (
        <Formik
          initialValues={{
            pengawas: [""],
            skPenugasanPengawas: null,
          }}
          onSubmit={(values) => {
            console.log("Data pengawas:", values.pengawas);
            console.log(
              "Data skPenugasanPengawas:",
              values.skPenugasanPengawas
            );
            usePenugasanTimStore
              .getState()
              .savePengawasData(values.pengawas, values.skPenugasanPengawas);
          }}
        >
          {({ values, submitForm, setFieldValue }) => (
            <Form className="h-full flex flex-col">
              <div className="mt-3 bg-neutral-100 px-6 py-8 min-h-[596px] rounded-[16px] space-y-8">
                <FieldArray
                  name="pengawas"
                  render={(arrayHelpers) => (
                    <div className="space-y-4">
                      {values.pengawas.map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4"
                        >
                          <Field
                            as={Dropdown}
                            name={`pengawas.${index}`}
                            label={`Nama Pengawas ${index + 1}`}
                            labelPosition="left"
                            placeholder="Masukkan Pengawas"
                            isRequired={true}
                            options={UserPengawasOptions}
                            onSelect={(selectedOption) =>
                              setFieldValue(
                                `pengawas.${index}`,
                                selectedOption.value
                              )
                            }
                            size="Medium"
                            errorMessage="Nama Pengawas tidak boleh kosong"
                          />
                          <div className="flex space-x-2 items-center">
                            <div
                              className={`w-12 h-12 flex items-center justify-center rounded-full ${
                                values.pengawas.length > 1
                                  ? "bg-custom-red-100 hover:bg-custom-red-200 cursor-pointer"
                                  : "bg-custom-gray-200 cursor-not-allowed"
                              }`}
                              onClick={() => {
                                if (values.pengawas.length > 1) {
                                  arrayHelpers.remove(index);
                                }
                              }}
                            >
                              <Trash
                                size="24"
                                color={
                                  values.pengawas.length > 1
                                    ? colors.Solid.Basic.Red[500]
                                    : colors.Emphasis.Light.On_Surface.Small
                                }
                              />
                            </div>
                            <div
                              className="w-12 h-12 flex items-center justify-center rounded-full bg-custom-blue-100 hover:bg-custom-blue-200 cursor-pointer"
                              onClick={() => arrayHelpers.push("")}
                            >
                              <Add
                                size="24"
                                color={colors.Solid.Basic.Blue[500]}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                />
                <FileInput
                  onFileSelect={(files) => {
                    handleSuratPenugasanPengawas(files);
                    setFieldValue("skPenugasanPengawas", files[0]);
                  }}
                  setSelectedFile={setSuratPenugasanPengawas}
                  buttonText="Pilih Berkas"
                  multiple={false}
                  accept=".pdf"
                  Label="Unggah SK/Surat Penugasan"
                  HelperText="Format .PDF dan maksimal 2MB"
                  state={suratPenugasanPengawasState}
                  onCancel={() => {
                    handleCancelSuratPenugasanPengawas();
                    setFieldValue("skPenugasanPengawas", null);
                  }}
                  selectedFile={skPenugasanPengawas}
                  maxSizeMB={2}
                />
              </div>
              <div className="flex flex-row justify-end items-right space-x-4 mt-3 bg-neutral-100 px-6 py-8 rounded-[16px]">
                <Button variant="solid_blue" size="Medium" onClick={submitForm}>
                  Simpan
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      ),
    },
    {
      label: "Petugas Lapangan",
      index: 2,
      content: (
        <Formik
          initialValues={{
            petugasLapangan: [""],
            skPenugasanPetugasLapangan: null,
          }}
          onSubmit={(values) => {
            console.log("Data petugas lapangan:", values.petugasLapangan);
            console.log(
              "Data skPenugasanPetugasLapangan:",
              values.skPenugasanPetugasLapangan
            );
            usePenugasanTimStore
              .getState()
              .savePetugasLapanganData(
                values.petugasLapangan,
                values.skPenugasanPetugasLapangan
              );
          }}
        >
          {({ values, submitForm, setFieldValue }) => (
            <Form className="h-full flex flex-col">
              <div className="mt-3 bg-neutral-100 px-6 py-8 min-h-[596px] rounded-[16px] space-y-8">
                <FieldArray
                  name="petugasLapangan"
                  render={(arrayHelpers) => (
                    <div className="space-y-4">
                      {values.petugasLapangan.map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4"
                        >
                          <Field
                            as={Dropdown}
                            name={`petugasLapangan.${index}`}
                            label={`Nama Petugas Lapangan ${index + 1}`}
                            labelPosition="left"
                            placeholder="Masukkan Petugas Lapangan"
                            isRequired={true}
                            options={UserPetugasLapangan}
                            onSelect={(selectedOption) =>
                              setFieldValue(
                                `petugasLapangan.${index}`,
                                selectedOption.value
                              )
                            }
                            size="Medium"
                            errorMessage="Nama Petugas Lapangan tidak boleh kosong"
                          />
                          <div className="flex space-x-2 items-center">
                            <div
                              className={`w-12 h-12 flex items-center justify-center rounded-full ${
                                values.petugasLapangan.length > 1
                                  ? "bg-custom-red-100 hover:bg-custom-red-200 cursor-pointer"
                                  : "bg-custom-gray-200 cursor-not-allowed"
                              }`}
                              onClick={() => {
                                if (values.petugasLapangan.length > 1) {
                                  arrayHelpers.remove(index);
                                }
                              }}
                            >
                              <Trash
                                size="24"
                                color={
                                  values.petugasLapangan.length > 1
                                    ? colors.Solid.Basic.Red[500]
                                    : colors.Emphasis.Light.On_Surface.Small
                                }
                              />
                            </div>
                            <div
                              className="w-12 h-12 flex items-center justify-center rounded-full bg-custom-blue-100 hover:bg-custom-blue-200 cursor-pointer"
                              onClick={() => arrayHelpers.push("")}
                            >
                              <Add
                                size="24"
                                color={colors.Solid.Basic.Blue[500]}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                />
                <FileInput
                  onFileSelect={(files) => {
                    handleSuratPenugasanPetugasLapangan(files);
                    setFieldValue("skPenugasanPetugasLapangan", files[0]);
                  }}
                  setSelectedFile={setSuratPenugasanPetugasLapangan}
                  buttonText="Pilih Berkas"
                  multiple={false}
                  accept=".pdf"
                  Label="Unggah SK/Surat Penugasan"
                  HelperText="Format .PDF dan maksimal 2MB"
                  state={suratPenugasanPetugasLapanganState}
                  onCancel={() => {
                    handleCancelSuratPenugasanPetugasLapangan();
                    setFieldValue("skPenugasanPetugasLapangan", null);
                  }}
                  selectedFile={values.skPenugasanPetugasLapangan}
                  maxSizeMB={2}
                />
              </div>
              <div className="flex flex-row justify-end items-right space-x-4 mt-3 bg-neutral-100 px-6 py-8 rounded-[16px]">
                <Button variant="solid_blue" size="Medium" onClick={submitForm}>
                  Simpan
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      ),
    },
    {
      label: "Pengolah Data",
      index: 3,
      content: (
        <Formik
          initialValues={{
            pengolahData: [""],
            skPenugasanPengolahData: null,
          }}
          onSubmit={(values) => {
            console.log("Data pengolah data:", values.pengolahData);
            console.log(
              "Data skPenugasanPengolahData:",
              values.skPenugasanPengolahData
            );
            usePenugasanTimStore
              .getState()
              .savePengolahData(
                values.pengolahData,
                values.skPenugasanPengolahData
              );
          }}
        >
          {({ values, submitForm, setFieldValue }) => (
            <Form className="h-full flex flex-col">
              <div className="mt-3 bg-neutral-100 px-6 py-8 min-h-[596px] rounded-[16px] space-y-8">
                <FieldArray
                  name="pengolahData"
                  render={(arrayHelpers) => (
                    <div className="space-y-4">
                      {values.pengolahData.map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4"
                        >
                          <Field
                            as={Dropdown}
                            name={`pengolahData.${index}`}
                            label={`Nama Pengolah Data ${index + 1}`}
                            labelPosition="left"
                            placeholder="Masukkan nama pengolah data"
                            isRequired={true}
                            options={UserPengolahData}
                            onSelect={(selectedOption) =>
                              setFieldValue(
                                `pengolahData.${index}`,
                                selectedOption.value
                              )
                            }
                            size="Medium"
                            errorMessage="Nama Pengolah Data tidak boleh kosong"
                          />
                          <div className="flex space-x-2 items-center">
                            <div
                              className={`w-12 h-12 flex items-center justify-center rounded-full ${
                                values.pengolahData.length > 1
                                  ? "bg-custom-red-100 hover:bg-custom-red-200 cursor-pointer"
                                  : "bg-custom-gray-200 cursor-not-allowed"
                              }`}
                              onClick={() => {
                                if (values.pengolahData.length > 1) {
                                  arrayHelpers.remove(index);
                                }
                              }}
                            >
                              <Trash
                                size="24"
                                color={
                                  values.pengolahData.length > 1
                                    ? colors.Solid.Basic.Red[500]
                                    : colors.Emphasis.Light.On_Surface.Small
                                }
                              />
                            </div>
                            <div
                              className="w-12 h-12 flex items-center justify-center rounded-full bg-custom-blue-100 hover:bg-custom-blue-200 cursor-pointer"
                              onClick={() => arrayHelpers.push("")}
                            >
                              <Add
                                size="24"
                                color={colors.Solid.Basic.Blue[500]}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                />
                <FileInput
                  onFileSelect={(files) => {
                    handleSuratPenugasanPengolahData(files);
                    setFieldValue("skPenugasanPengolahData", files[0]);
                  }}
                  setSelectedFile={setSuratPenugasanPengolahData}
                  buttonText="Pilih Berkas"
                  multiple={false}
                  accept=".pdf"
                  Label="Unggah SK/Surat Penugasan"
                  HelperText="Format .PDF dan maksimal 2MB"
                  state={suratPenugasanPengolahDataState}
                  onCancel={() => {
                    handleCancelSuratPenugasanPengolahData();
                    setFieldValue("skPenugasanPengolahData", null);
                  }}
                  selectedFile={skPenugasanPengolahData}
                  maxSizeMB={2}
                />
              </div>
              <div className="flex flex-row justify-end items-right space-x-4 mt-3 bg-neutral-100 px-6 py-8 rounded-[16px]">
                <Button variant="solid_blue" size="Medium" onClick={submitForm}>
                  Simpan
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      ),
    },
  ];
  return (
    <div className="p-8">
      <Navbar />
      <div className="space-y-3 pt-8">
        <h3 className="text-H3 text-emphasis-on_surface-high">
          Penugasan Tim Pelaksana
        </h3>
        <Tabs tabs={tabs} />
        <CustomAlert
          message={alert.message}
          severity={alert.severity}
          openInitially={alert.open}
          onClose={() =>
            setAlert({ open: false, severity: "info", message: "" })
          }
        />
      </div>
    </div>
  );
}
