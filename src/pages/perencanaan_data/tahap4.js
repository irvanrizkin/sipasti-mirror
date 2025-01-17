import React, { useCallback, useEffect, useState } from "react";
import TextInput from "../../components/input";
import Table from "../../components/table";
import Pagination from "../../components/pagination";
import Tabs from "../../components/Tabs";
import SearchBox from "../../components/searchbox";
import Button from "../../components/button";
import axios from "axios";
import Modal from "../../components/modal";
import Navbar from "../../components/navigationbar";
import Stepper from "../../components/stepper";
import { CloseCircle } from "iconsax-react";
import tahap4Store from "./tahap4/tahap4store";

const Tahap4 = ({ onNext, onBack, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isModalFinalOpen, setIsModalFinalOpen] = useState(false);
  const [isConfirmModalFinalOpen, setIsConfirmModalFinalOpen] = useState(false);
  const [selectedVendorFinal, setSelectedVendorFinal] = useState(null);
  const [allDataMaterial, setAllDataMaterial] = useState([]);
  const [allDataPeralatan, setAllDataPeralatan] = useState([]);
  const [allDataTenagaKerja, setAllDataTenagaKerja] = useState([]);
  const [allDataVendor, setAllDataVendor] = useState([]);
  const [searchMaterialQuery, setSearchMaterialQuery] = useState("");
  const [searchPeralatanQuery, setSearchPeralatanQuery] = useState("");
  const [searchTenagaKerjaQuery, setSearchTenagaKerjaQuery] = useState("");
  const [searchVendorQuery, setSearchVendorQuery] = useState("");
  const [currentStep, setCurrentStep] = useState(3);
  const navigateToTahap3 = () => {
    window.location.href = "/perencanaan_data/tahap3?fromTahap4=true";
  };
  const NUMBER_OF_STEPS = 4;
  const stepLabels = [
    "Informasi Umum",
    "Identifikasi Kebutuhan",
    "Penentuan Shortlist Vendor",
    "Perancangan Kuesioner",
  ];

  const [commonInformation, setCommonInformation] = useState({
    kode_rup: "",
    nama_balai: "",
    nama_paket: "",
    nama_ppk: "",
    jabatan_ppk: "",
    jenis_informasi: "",
  });
  const [selectedVendors, setSelectedVendors] = useState([]);
  const isVendorSelected = (vendorId) => {
    return selectedVendors.some(
      (selectedVendor) => selectedVendor.data_vendor_id === vendorId
    );
  };

  <Modal isOpen={isConfirmModalFinalOpen}>
    <div className="space-y-4 p-4">
      <h2 className="text-H5">Peringatan</h2>
      <p>
        Dengan menekan tombol simpan Anda tidak dapat melakukan perubahan data
        kembali.
      </p>
      <div className="flex justify-end space-x-4 mt-4">
        <Button variant="outlined_yellow" size="Medium">
          Batal
        </Button>
        <Button
          variant="solid_blue"
          size="Medium"
          onClick={() => {
            setIsConfirmModalFinalOpen(false);
            handleCloseModal();
          }}
        >
          Ya, Cetak
        </Button>
      </div>
    </div>
  </Modal>;

  const handleDeleteAndContinue = () => {
    setIsConfirmModalOpen(true); // Open the confirmation modal
  };

  const confirmDelete = () => {
    // This is where you can add logic to proceed with deletion
    setIsConfirmModalOpen(false); // Close confirmation modal
    console.log("Data deleted and proceeding to the next step.");
    onNext(); // Proceed to the next step if required
  };

  const cancelDelete = () => {
    setIsConfirmModalOpen(false); // Close confirmation modal without action
  };
  const handleCheckboxChange = (vendor, isChecked, type) => {
    console.log("Vendor ID yang dipilih:", vendor.id);
    console.log("Apakah checkboxnya dipilih?", isChecked);

    // Sub-fungsi untuk memperbarui data deleted berdasarkan tipe
    const updateDeletedData = (setDeletedData, deletedDataArray) => {
      if (isChecked) {
        setDeletedData([...deletedDataArray, vendor.id]);
      } else {
        setDeletedData(deletedDataArray.filter((id) => id !== vendor.id));
      }
    };

    // Update deleted data sesuai tipe
    if (type === "material") {
      updateDeletedData(setDeletedDataMaterial, deletedDataMaterial);
    } else if (type === "peralatan") {
      updateDeletedData(setDeletedDataPeralatan, deletedDataPeralatan);
    } else if (type === "tenaga_kerja") {
      updateDeletedData(setDeletedDataTenagaKerja, deletedDataTenagaKerja);
    }

    // Sinkronisasi selected vendors
    setSelectedVendors((prevSelectedVendors) => {
      if (isChecked) {
        return [
          ...prevSelectedVendors,
          {
            data_vendor_id: vendor.id,
            nama_vendor: vendor.nama_vendor,
            pemilik_vendor: vendor.pemilik_vendor,
            alamat: vendor.alamat,
            kontak: vendor.kontak,
          },
        ];
      } else {
        return prevSelectedVendors.filter(
          (selectedVendor) => selectedVendor.data_vendor_id !== vendor.id
        );
      }
    });
  };

  const saveDataToAPI = async (informasiUmumId) => {
    try {
      const response = await fetch(
        `https://api-ecatalogue-staging.online/api/perencanaan-data/save-perencanaan-data/${informasiUmumId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Tambahkan data jika diperlukan
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save data to the API");
      }

      const result = await response.json();
      console.log("API Response:", result);
      return result; // Mengembalikan hasil jika diperlukan
    } catch (error) {
      console.error("Error during API call:", error);
      throw error;
    }
  };

  const handleConfirmAndSave = async () => {
    const informasiUmumId = localStorage.getItem("informasi_umum_id"); // Ambil ID dari localStorage

    if (!informasiUmumId) {
      alert("ID informasi umum tidak ditemukan. Silakan coba lagi.");
      return;
    }

    try {
      // Kirim request ke API
      await saveDataToAPI(informasiUmumId);

      // Tutup modal setelah berhasil
      setIsConfirmModalFinalOpen(false);
      handleCloseModalFinal();
      window.location.href = "/perencanaan_data/perencanaan_data_list";
    } catch (error) {
      // Tangani error jika API gagal
      alert("Gagal menyimpan data. Silakan coba lagi.");
    }
  };

  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [vendorDetail, setVendorDetail] = useState([]);
  const [dataMaterial, setDataMaterial] = useState([]);
  const [dataPeralatan, setDataPeralatan] = useState([]);
  const [dataTenagaKerja, setDataTenagaKerja] = useState([]);
  const [dataVendor, setDataVendor] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletedDataMaterial, setDeletedDataMaterial] = useState([]);
  const [deletedDataPeralatan, setDeletedDataPeralatan] = useState([]);
  const [deletedDataTenagaKerja, setDeletedDataTenagaKerja] = useState([]);
  const itemsPerPage = 10;
  const filterOptionsMaterial = [
    { label: "Material", accessor: "nama_vendor", checked: false },
    { label: "Satuan", accessor: "sumber_daya", checked: false },
    { label: "Spesifikasi", accessor: "pemilik_vendor", checked: false },
    { label: "Ukuran", accessor: "alamat", checked: false },
    { label: "Kodefikasi", accessor: "kontak", checked: false },
    { label: "Kelompok Material", accessor: "kontak", checked: false },
    { label: "Jumlah Kebutuhan", accessor: "kontak", checked: false },
    { label: "Merk", accessor: "kontak", checked: false },
    { label: "Provinsi", accessor: "kontak", checked: false },
    { label: "Kabupaten/Kota", accessor: "kontak", checked: false },
  ];
  const filterOptionsPeralatan = [
    { label: "Nama Peralatan", accessor: "nama_vendor", checked: false },
    { label: "Satuan", accessor: "sumber_daya", checked: false },
    { label: "Spesifikasi", accessor: "pemilik_vendor", checked: false },
    { label: "Kapasitas", accessor: "alamat", checked: false },
    { label: "Kodefikasi", accessor: "kontak", checked: false },
    { label: "Kelompok Peralatan", accessor: "kontak", checked: false },
    { label: "Jumlah Kebutuhan", accessor: "kontak", checked: false },
    { label: "Merk", accessor: "kontak", checked: false },
    { label: "Provinsi", accessor: "kontak", checked: false },
    { label: "Kabupaten/Kota", accessor: "kontak", checked: false },
  ];
  const filterOptionsTenagaKerja = [
    { label: "Nama Pekerja", accessor: "nama_vendor", checked: false },
    { label: "Satuan", accessor: "sumber_daya", checked: false },
    { label: "Jumlah Kebutuhan", accessor: "pemilik_vendor", checked: false },
    { label: "Kodefikasi", accessor: "kontak", checked: false },
    { label: "Provinsi", accessor: "kontak", checked: false },
    { label: "Kabupaten/Kota", accessor: "kontak", checked: false },
  ];
  const filterOptionsVendor = [
    { label: "Responden/Vendor", accessor: "nama_vendor", checked: false },
    { label: "Pemilik Vendor", accessor: "pemilik_vendor", checked: false },
    { label: "Alamat", accessor: "alamat", checked: false },
    { label: "Kontak", accessor: "kontak", checked: false },
  ];
  const fetchCommonInformation = useCallback(async () => {
    const informasi_umum_id = localStorage.getItem("informasi_umum_id");

    try {
      const response = await fetch(
        `https://api-ecatalogue-staging.online/api/perencanaan-data/perencanaan-data-result?id=${informasi_umum_id}`
      );

      if (!response.ok) {
        console.error("Failed to fetch data:", response.statusText);
        return;
      }

      const data = await response.json();
      if (!data || !data.data) {
        console.warn("Data tidak ditemukan atau kosong");
        return;
      }

      setCommonInformation(data.data.informasi_umum || {});
      setDataMaterial(data.data.material || []);
      setAllDataMaterial(data.data.material || []);
      setDataPeralatan(data.data.peralatan || []);
      setAllDataPeralatan(data.data.peralatan || []);
      setDataTenagaKerja(data.data.tenaga_kerja || []);
      setAllDataTenagaKerja(data.data.tenaga_kerja || []);
      setAllDataVendor(data.data.shortlist_vendor || []);
      setDataVendor(data.data.shortlist_vendor || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchCommonInformation();
  }, [fetchCommonInformation]);

  const handleOpenModal = (id) => {
    setSelectedVendorId(id);
    setIsModalOpen(true);
  };

  const handleOpenModalFinal = () => {
    setIsConfirmModalFinalOpen(true);
  };

  const handleCloseModalFinal = () => {
    console.log("Modal closed, data saved, or other actions");
    // Tambahkan logika lain jika diperlukan
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVendorId(null);
    setSelectedVendors([]);
    setDeletedDataMaterial([]);
    setDeletedDataPeralatan([]);
    setDeletedDataTenagaKerja([]);
  };

  const handleSearchMaterial = (query) => {
    setSearchMaterialQuery(query);

    if (!query) {
      setDataMaterial(allDataMaterial);
      return;
    }

    const filteredMaterials = allDataMaterial.filter((item) => {
      if (!materialFilters.length) {
        return Object.values(item).some((val) =>
          String(val).toLowerCase().includes(query.toLowerCase())
        );
      }
      return materialFilters.some((key) => {
        return String(item[key]).toLowerCase().includes(query.toLowerCase());
      });
    });
    setDataMaterial(filteredMaterials);
  };

  // Search for Peralatan
  const handleSearchPeralatan = (query) => {
    setSearchPeralatanQuery(query);

    if (!query) {
      setEquipmentData(allDataPeralatan);
      return;
    }

    const filteredPeralatan = allDataPeralatan.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(query.toLowerCase())
      )
    );
    setEquipmentData(filteredPeralatan); // Ganti setDataPeralatan dengan setEquipmentData
  };

  // Search for Tenaga Kerja
  const handleSearchTenagaKerja = (query) => {
    setSearchTenagaKerjaQuery(query);

    if (!query) {
      setDataTenagaKerja(allDataTenagaKerja);
      return;
    }

    const filteredTenagaKerja = allDataTenagaKerja.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(query.toLowerCase())
      )
    );
    setDataTenagaKerja(filteredTenagaKerja);
  };
  const handleSearchVendor = (query) => {
    setSearchVendorQuery(query);

    if (!query) {
      setDataVendor(allDataVendor);
      return;
    }

    const filteredVendors = allDataVendor.filter((item) => {
      if (!vendorFilters.length) {
        return Object.values(item).some((val) =>
          String(val).toLowerCase().includes(query.toLowerCase())
        );
      }
      return vendorFilters.some((key) => {
        return String(item[key]).toLowerCase().includes(query.toLowerCase());
      });
    });
    setDataVendor(filteredVendors);
  };

  useEffect(() => {
    if (selectedVendorId && isModalOpen) {
      const informasi_umum_id = localStorage.getItem("informasi_umum_id");
      axios
        .get(
          `https://api-ecatalogue-staging.online/api/perencanaan-data/shortlist-detail-identifikasi?id=${selectedVendorId}&informasi_umum_id=${informasi_umum_id}`
        )
        .then((response) => {
          console.log(
            "Vendor Detail Data (JSON):",
            JSON.stringify(response.data, null, 2)
          ); // Menampilkan data dalam format JSON
          setVendorDetail(response.data.data); // Memastikan respons diatur ke vendorDetail
          setSelectedVendorFinal(response?.data?.data?.id_vendor ?? 0);
        })
        .catch((error) =>
          console.error("Failed to fetch vendor details:", error)
        );
    }
  }, [selectedVendorId, isModalOpen]);

  const {
    vendorFilters,
    materialFilters,
    setVendorFilters,
    setMaterialFilters,
  } = tahap4Store();

  const handleAdjustData = async () => {
    if (!selectedVendorId) {
      console.error("No vendor selected.");
      return;
    }

    const informasi_umum_id = localStorage.getItem("informasi_umum_id");
    console.log(
      "ispayload",
      deletedDataTenagaKerja.map((item) => ({ id: item }))
    );
    const payload = {
      id_vendor: Number(selectedVendorFinal), // Only send the selected vendor ID
      shortlist_vendor_id: informasi_umum_id
        ? parseInt(informasi_umum_id)
        : null, // Single value, check if it's available
      material: deletedDataMaterial.map((item) => ({ id: item })),
      peralatan: deletedDataPeralatan.map((item) => ({ id: item })),
      tenaga_kerja: deletedDataTenagaKerja.map((item) => ({ id: item })),
    };
    console.log("Hapus material:", deletedDataMaterial);
    console.log("Hapus Peralatan:", deletedDataPeralatan);
    console.log("Hapus material:", deletedDataTenagaKerja);
    console.log("Payload being sent:", JSON.stringify(payload));

    try {
      const response = await axios.post(
        "https://api-ecatalogue-staging.online/api/perencanaan-data/adjust-identifikasi-kebutuhan",
        payload
      );
      if (response.status === 200) {
        console.log("Data submitted successfully:", response.data);
        fetchCommonInformation();
      } else {
        console.error("Error submitting data:", response.statusText);
        fetchCommonInformation();
      }
    } catch (error) {
      console.error("An error occurred during submission:", error);
    }
  };

  return (
    <div className="p-8">
      <Navbar />
      <div className="space-y-8">
        <div className="space-y-3 pt-8">
          <h3 className="text-H3 text-emphasis-on_surface-high">
            Tahap Perencanaan Data
          </h3>
          <div className="justify-center items-center space-x-4 mt-3 bg-neutral-100 px-6 pb-8 pt-16 rounded-[16px]">
            <Stepper
              currentStep={currentStep}
              numberOfSteps={NUMBER_OF_STEPS}
              labels={stepLabels}
            />
            <br />
          </div>
          <div className="space-y-3">
            <h4 className="text-H4 text-emphasis-on_surface-high">
              Perancangan Kuesioner
            </h4>
            <div className="space-y-2">
              <h5 className="text-H5 text-emphasis-on_surface-high">
                1. Informasi Umum
              </h5>
              <div className="mt-3 bg-custom-neutral-100 px-6 py-8 rounded-[16px] space-y-8">
                <TextInput
                  label="Kode RUP"
                  labelPosition="left"
                  size="Medium"
                  value={commonInformation.kode_rup}
                  disabledActive={true}
                />
                <TextInput
                  label="Nama Balai"
                  labelPosition="left"
                  size="Medium"
                  value={commonInformation.nama_balai}
                  disabledActive={true}
                />
                <TextInput
                  label="Nama Paket"
                  labelPosition="left"
                  size="Medium"
                  value={commonInformation.nama_paket}
                  disabledActive={true}
                />
                <TextInput
                  label="Nama PPK"
                  labelPosition="left"
                  size="Medium"
                  value={commonInformation.nama_ppk}
                  disabledActive={true}
                />
                <TextInput
                  label="Jabatan PPK"
                  labelPosition="left"
                  size="Medium"
                  value={commonInformation.jabatan_ppk}
                  disabledActive={true}
                />
              </div>
            </div>
            <h5 className="text-H5 text-emphasis-on_surface-high">
              2. Identifikasi Kebutuhan
            </h5>
            <Tabs
              tabs={[
                {
                  label: "Material",
                  content: (
                    <div className="mt-3 space-y-4">
                      <SearchBox
                        placeholder="Cari Material..."
                        onSearch={handleSearchMaterial}
                        withFilter={true}
                        filterOptions={filterOptionsMaterial}
                        onFilterClick={(filters) => {
                          let materialFilters = [];
                          for (const filter of filters) {
                            if (filter.checked) {
                              materialFilters.push(filter.accessor);
                            } else {
                              materialFilters = materialFilters.filter(
                                (item) => item !== filter.accessor
                              );
                            }
                          }
                          setMaterialFilters(materialFilters);
                        }}
                      />
                      <Table
                        columns={[
                          { title: "Nama Material", accessor: "nama_material" },
                          { title: "Satuan", accessor: "satuan" },
                          { title: "Spesifikasi", accessor: "spesifikasi" },
                          { title: "Ukuran", accessor: "ukuran" },
                          { title: "Kodefikasi", accessor: "kodefikasi" },
                          {
                            title: "Kelompok Material",
                            accessor: "kelompok_material",
                          },
                          {
                            title: "Jumlah Kebutuhan",
                            accessor: "jumlah_kebutuhan",
                          },
                          { title: "Merk", accessor: "merk" },
                          // {
                          //   title: "Provinsi",
                          //   accessor: (row) =>
                          //     row.provinces?.nama_provinsi || "Data tidak ada",
                          // },
                          // { title: "Provinsi", accessor: "provinces?.nama_provinsi" },
                          { title: "Provinsi", accessor: "provinsi" },
                          { title: "Kabupaten/Kota", accessor: "kota" },
                        ]}
                        data={dataMaterial.slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        )}
                      />
                      <Pagination
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        totalData={dataMaterial.length}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  ),
                },
                {
                  label: "Peralatan",
                  content: (
                    <div className="mt-3 space-y-4">
                      <SearchBox
                        placeholder="Cari Peralatan..."
                        onSearch={handleSearchPeralatan}
                        withFilter={true}
                        filterOptions={filterOptionsPeralatan}
                        onFilterClick={(filters) => {
                          console.log("Filter option clicked:", filters); // Debug
                          handleFilterClick(filters);
                        }}
                      />
                      <Table
                        columns={[
                          {
                            title: "Nama Peralatan",
                            accessor: "nama_peralatan",
                          },
                          { title: "Satuan", accessor: "satuan" },
                          { title: "Spesifikasi", accessor: "spesifikasi" },
                          { title: "Kapasitas", accessor: "satuan" },
                          { title: "Kodefikasi", accessor: "kodefikasi" },
                          {
                            title: "Kelompok Peralatan",
                            accessor: "kelompok_peralatan",
                          },
                          {
                            title: "Jumlah Kebutuhan",
                            accessor: "jumlah_kebutuhan",
                          },
                          { title: "Merk", accessor: "merk" },
                          { title: "Provinsi", accessor: "provinsi" },
                          { title: "Kabupaten/Kota", accessor: "kota" },
                        ]}
                        data={dataPeralatan.slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        )}
                      />
                      <Pagination
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        totalData={dataPeralatan.length}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  ),
                },
                {
                  label: "Tenaga Kerja",
                  content: (
                    <div className="mt-3 space-y-4">
                      <SearchBox
                        placeholder="Cari Tenaga Kerja..."
                        onSearch={handleSearchTenagaKerja}
                        withFilter={true}
                        filterOptions={filterOptionsTenagaKerja}
                        onFilterClick={(filters) => {
                          console.log("Filter option clicked:", filters); // Debug
                          handleFilterClick(filters);
                        }}
                      />
                      <Table
                        columns={[
                          {
                            title: "Nama Pekerja",
                            accessor: "jenis_tenaga_kerja",
                          },
                          { title: "Satuan", accessor: "satuan" },
                          {
                            title: "Jumlah Kebutuhan",
                            accessor: "jumlah_kebutuhan",
                          },
                          { title: "Kodefikasi", accessor: "kodefikasi" },
                          { title: "Provinsi", accessor: "provinsi" },
                          { title: "Kabupaten/Kota", accessor: "kota" },
                        ]}
                        data={dataTenagaKerja.slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        )}
                      />
                      <Pagination
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        totalData={dataTenagaKerja.length}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  ),
                },
              ]}
            />
            <h5 className="text-H5 text-emphasis-on_surface-high">3. Vendor</h5>
            <SearchBox
              placeholder="Cari Vendor..."
              onSearch={handleSearchVendor}
              withFilter={true}
              filterOptions={filterOptionsVendor}
              onFilterClick={(filters) => {
                let vendorFilters = [];
                for (const filter of filters) {
                  if (filter.checked) {
                    vendorFilters.push(filter.accessor);
                  } else {
                    vendorFilters = vendorFilters.filter(
                      (item) => item !== filter.accessor
                    );
                  }
                }
                setVendorFilters(vendorFilters);
                // handleFilterClick(filters);
              }}
            />
            <Table
              columns={[
                {
                  title: "Responden/Vendor",
                  accessor: "nama_vendor",
                  width: "252px",
                },
                {
                  title: "Pemilik Vendor",
                  accessor: "pemilik_vendor",
                  width: "260px",
                },
                { title: "Alamat", accessor: "alamat", width: "340px" },
                { title: "Kontak", accessor: "kontak", width: "200px" },
                {
                  title: "Rancangan Kuesioner",
                  accessor: "url_kuisioner",
                  type: "changingbutton",
                  buttonLabel: (row) =>
                    row.url_kuisioner ? "Lihat PDF" : "Edit PDF",
                  alignment: "center",
                  width: "300px",
                  onClick: (row) => {
                    if (row.url_kuisioner) {
                      window.open(row.url_kuisioner, "_blank");
                    } else {
                      handleOpenModal(row.id);
                    }
                    console.log("yang dipilih", row.id);
                  },
                },
              ]}
              data={dataVendor.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )}
            />
            <Pagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalData={dataVendor?.length || 0}
              onPageChange={setCurrentPage}
            />
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-H5">Shorlist MPK yang akan disurvei</h5>
                  <button
                    className="text-emphasis-on_surface-high"
                    onClick={handleCloseModal}
                  >
                    <CloseCircle size="24" />
                  </button>
                </div>
                {console.log("Vendor Detail in Modal:", vendorDetail)}{" "}
                {/* Check vendorDetail data */}
                <Tabs
                  tabs={[
                    {
                      label: "Material",
                      content: (
                        <div className="mt-3 space-y-4">
                          <SearchBox
                            placeholder="Cari Material..."
                            onSearch={handleSearchMaterial}
                            withFilter={true}
                          />
                          <Table
                            columns={[
                              {
                                title: "",
                                accessor: "select",
                                type: "checkbox",
                                width: "48px",
                                onChange: (material) =>
                                  handleCheckboxChange(
                                    material,
                                    !isVendorSelected(material.id),
                                    "material"
                                  ),
                                isChecked: (material) =>
                                  isVendorSelected(material.id),
                              },
                              {
                                title: "Nama Material",
                                accessor: "nama_material",
                              },
                              { title: "Satuan", accessor: "satuan" },
                              {
                                title: "Spesifikasi",
                                accessor: "spesifikasi",
                              },
                              {
                                title: "Merk",
                                accessor: "merk",
                              },
                            ]}
                            data={
                              vendorDetail?.identifikasi_kebutuhan?.material ??
                              []
                            }
                            setParentState={setCommonInformation}
                          />
                          <Pagination
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalData={
                              vendorDetail?.identifikasi_kebutuhan?.material
                                ?.length || 0
                            }
                            onPageChange={setCurrentPage}
                          />
                        </div>
                      ),
                    },
                    {
                      label: "Peralatan",
                      content: (
                        <div className="mt-3 space-y-4">
                          <SearchBox
                            placeholder="Cari Peralatan..."
                            onSearch={handleSearchPeralatan}
                            withFilter={true}
                          />
                          <Table
                            columns={[
                              {
                                title: "",
                                accessor: "select",
                                type: "checkbox",
                                width: "48px",
                                onChange: (equipment) =>
                                  handleCheckboxChange(
                                    equipment,
                                    !isVendorSelected(equipment.id),
                                    "peralatan"
                                  ),
                                isChecked: (equipment) =>
                                  isVendorSelected(equipment.id),
                              },
                              {
                                title: "Nama Peralatan",
                                accessor: "nama_peralatan",
                              },
                              { title: "Satuan", accessor: "satuan" },
                              {
                                title: "Spesifikasi",
                                accessor: "spesifikasi",
                              },
                              {
                                title: "Merk",
                                accessor: "merk",
                              },
                            ]}
                            data={
                              vendorDetail?.identifikasi_kebutuhan?.peralatan
                                ? vendorDetail.identifikasi_kebutuhan.peralatan.slice(
                                    (currentPage - 1) * itemsPerPage,
                                    currentPage * itemsPerPage
                                  )
                                : []
                            }
                            setParentState={setCommonInformation}
                          />
                          <Pagination
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalData={
                              vendorDetail?.identifikasi_kebutuhan?.peralatan
                                ?.length || 0
                            }
                            onPageChange={setCurrentPage}
                          />
                        </div>
                      ),
                    },
                    {
                      label: "Tenaga Kerja",
                      content: (
                        <div className="mt-3 space-y-4">
                          <SearchBox
                            placeholder="Cari Tenaga Kerja..."
                            onSearch={handleSearchTenagaKerja}
                            withFilter={true}
                          />
                          <Table
                            columns={[
                              {
                                title: "",
                                accessor: "select",
                                type: "checkbox",
                                width: "48px",
                                onChange: (worker) =>
                                  handleCheckboxChange(
                                    worker,
                                    !isVendorSelected(worker.id),
                                    "tenaga_kerja"
                                  ),
                                isChecked: (worker) =>
                                  isVendorSelected(worker.id),
                              },
                              {
                                title: "Nama Pekerja",
                                accessor: "jenis_tenaga_kerja",
                              },
                              { title: "Satuan", accessor: "satuan" },
                            ]}
                            data={
                              vendorDetail?.identifikasi_kebutuhan?.tenaga_kerja?.slice(
                                (currentPage - 1) * itemsPerPage,
                                currentPage * itemsPerPage
                              ) || []
                            }
                            setParentState={setCommonInformation}
                          />
                          <Pagination
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalData={
                              vendorDetail?.identifikasi_kebutuhan?.tenaga_kerja
                                ?.length || 0
                            }
                            onPageChange={setCurrentPage}
                          />
                        </div>
                      ),
                    },
                  ]}
                />
                <div className="flex flex-row justify-end items-right space-x-4 mt-3 ">
                  <Button
                    variant="outlined_yellow"
                    size="Medium"
                    onClick={handleCloseModal}
                  >
                    Kembali
                  </Button>
                  <Button
                    variant="solid_blue"
                    size="Medium"
                    // onClick={async () => {
                    //   try {
                    //     onNext();
                    //   } catch (error) {
                    //     alert(error.message);
                    //   }
                    // }}
                    // onClick={handleAdjustData}
                    onClick={handleDeleteAndContinue}
                  >
                    Simpan & Lanjut
                  </Button>
                </div>
                <Modal isOpen={isConfirmModalOpen} onClose={cancelDelete}>
                  <div className="space-y-4 p-4">
                    <h2 className="text-H5">Peringatan</h2>
                    <p>
                      Dengan menekan tombol simpan Anda tidak dapat melakukan
                      perubahan data kembali.
                    </p>
                    <div className="flex justify-end space-x-4 mt-4">
                      <Button
                        variant="outlined_yellow"
                        size="Medium"
                        onClick={cancelDelete}
                      >
                        Batal
                      </Button>
                      <Button
                        variant="solid_blue"
                        size="Medium"
                        onClick={() => {
                          handleAdjustData();
                          setIsConfirmModalOpen(false);
                          handleCloseModal();
                        }}
                      >
                        Ya, Cetak
                      </Button>
                    </div>
                  </div>
                </Modal>
              </div>
            </Modal>
            <div className="flex flex-row justify-end items-right space-x-4 mt-3 bg-neutral-100 px-6 py-8 rounded-[16px]">
              <Button
                variant="outlined_yellow"
                size="Medium"
                onClick={navigateToTahap3}
              >
                Kembali
              </Button>
              <Button
                variant="solid_blue"
                size="Medium"
                onClick={handleOpenModalFinal} // Membuka modal
              >
                Simpan & Lanjut
              </Button>

              {/* Modal */}
              <Modal isOpen={isConfirmModalFinalOpen}>
                <div className="space-y-4 p-4">
                  <h2 className="text-H5">Peringatan</h2>
                  <p>Anda yakin ingin menyimpan?</p>
                  <div className="flex justify-end space-x-4 mt-4">
                    {/* Tombol Batal */}
                    <Button
                      variant="outlined_yellow"
                      size="Medium"
                      onClick={() => setIsConfirmModalFinalOpen(false)}
                    >
                      Batal
                    </Button>

                    {/* Tombol Ya, Cetak */}
                    <Button
                      variant="solid_blue"
                      size="Medium"
                      onClick={handleConfirmAndSave} // Panggil API dan tutup modal
                    >
                      Ya
                    </Button>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tahap4;
