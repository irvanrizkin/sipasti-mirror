import React, { useCallback, useEffect, useState } from "react";
import TextInput from "../../components/input";
import Table from "../../components/table";
import Pagination from "../../components/pagination";
import Tabs from "../../components/Tabs";
import SearchBox from "../../components/searchbox";
import Button from "../../components/button";
import axios from "axios";
import Modal from "../../components/modal";
import { CloseCircle } from "iconsax-react";
import tahap4Store from "./tahap4/tahap4store";

const Tahap4 = ({ onNext, onBack, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isConfirmModalFinalOpen, setIsConfirmModalFinalOpen] = useState(false);
  const [selectedVendorFinal, setSelectedVendorFinal] = useState(null);
  const [allDataVendor, setAllDataVendor] = useState([]);
  const [searchVendorQuery, setSearchVendorQuery] = useState("");

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

  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [vendorDetail, setVendorDetail] = useState([]);
  const [dataVendor, setDataVendor] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletedDataMaterial, setDeletedDataMaterial] = useState([]);
  const [deletedDataPeralatan, setDeletedDataPeralatan] = useState([]);
  const [deletedDataTenagaKerja, setDeletedDataTenagaKerja] = useState([]);
  const itemsPerPage = 10;

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVendorId(null);
    setSelectedVendors([]);
    setDeletedDataMaterial([]);
    setDeletedDataPeralatan([]);
    setDeletedDataTenagaKerja([]);
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

  const { vendorFilters, setVendorFilters } = tahap4Store();

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
      <div className="space-y-8">
        <div className="space-y-3 pt-8">
          <div className="space-y-3">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tahap4;
