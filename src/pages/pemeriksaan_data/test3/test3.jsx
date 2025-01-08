import React, { useEffect } from "react";
import { useTest3Store } from "../test3_store/test3";

const PemeriksaanTable = () => {
  const { pemeriksaanData, fetchPemeriksaanData } = useTest3Store();

  useEffect(() => {
    fetchPemeriksaanData();
  }, [fetchPemeriksaanData]);

  const dataStatic = [
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
  ];
  const filteredData = pemeriksaanData.filter((item) =>
    ["A1", "A2", "A3", "A4", "A5", "B1", "B2"].includes(item.item_number)
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Pemeriksaan Data</h1>

      {/* Tabel Pemeriksaan Data (from API) */}
      <div className="rounded-[16px] border border-gray-200 overflow mt-4">
        <h2>Pemeriksaan Data (from API)</h2>
        <div className="overflow-x-auto">
          <table className="table-fixed w-full">
            <thead>
              <tr className="bg-custom-blue-100 text-left text-emphasis-on_surface-high uppercase tracking-wider">
                <th className="px-3 py-6 text-sm text-center w-[40px]">No</th>
                <th className="px-3 py-6 text-sm text-center w-[40px]">
                  Data Vendor ID
                </th>
                <th className="px-3 py-6 text-sm w-[180px]">
                  Shortlist Vendor ID
                </th>
                <th className="px-3 py-6 text-sm text-center w-[150px]">
                  Item Number
                </th>
                <th className="px-3 py-6 text-sm text-center w-[200px]">
                  Status Pemeriksaan
                </th>
                <th className="px-3 py-6 text-sm text-center w-[200px]">
                  Verified By
                </th>
              </tr>
            </thead>
            <tbody>
              {pemeriksaanData.length > 0 ? (
                pemeriksaanData.map((item, index) => (
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
                    <td className="px-3 py-4 text-sm text-center">
                      {item.data_vendor_id}
                    </td>
                    <td className="px-3 py-4 text-sm">
                      {item.shortlist_vendor_id}
                    </td>
                    <td className="px-3 py-4 text-sm text-center">
                      {item.item_number}
                    </td>
                    <td className="px-3 py-4 text-sm">
                      {item.status_pemeriksaan}
                    </td>
                    <td className="px-3 py-4 text-sm">{item.verified_by}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: "center", padding: "10px" }}>
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabel Data API (Static) */}
      <div className="rounded-[16px] border border-gray-200 overflow mt-4">
        <div className="overflow-x-auto">
          <table className="table-fixed w-full">
            <thead>
              <tr className="bg-custom-blue-100 text-left text-emphasis-on_surface-high uppercase tracking-wider">
                <th className="px-3 py-6 text-sm text-center w-[40px]">No</th>
                <th className="px-3 py-6 text-sm text-left w-[200px]">
                  Kelengkapan Dokumen
                </th>
                <th className="px-3 py-6 text-sm text-center w-[200px] hidden">
                  Status Pemeriksaan
                </th>
                <th className="px-3 py-6 text-sm text-center w-[200px]">
                  Memenuhi
                </th>
                <th className="px-3 py-6 text-sm text-center w-[200px]">
                  Tidak Memenuhi
                </th>
                <th className="px-3 py-6 text-sm text-center w-[200px] hidden">
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
    </div>
  );
};

export default PemeriksaanTable;
