import React, { useState, useEffect } from "react";
import Navbar from "../../../components/navigationbar";
import Pagination from "../../../components/pagination";
import useStore from "./monitoring_perencanaan_data/monitoring_perencanaan_data_store";
import { More } from "iconsax-react";
import colors from "../../../styles/colors";
import Link from "next/link";

export default function PenugasanTim() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { initialValues, fetchStatusProgres } = useStore();
  const { status_progres } = initialValues;
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    alignRight: false,
  });

  // const openModal = (id_paket) => {
  //   console.log("Membuka modal untuk ID Paket:", id_paket);
  //   fetchVendor(id_paket);
  //   setIsModalOpen(true);
  // };

  const handleToggleDropdown = (rowId, event) => {
    if (activeDropdown === rowId) {
      setActiveDropdown(null);
    } else {
      const rect = event.target.getBoundingClientRect();
      const screenWidth = window.innerWidth;
      const dropdownWidth = 200;

      let positionLeft = rect.left + window.scrollX;
      let alignRight = false;

      if (positionLeft + dropdownWidth > screenWidth) {
        positionLeft = screenWidth - dropdownWidth - 10;
        alignRight = true;
      }

      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: positionLeft,
        alignRight: alignRight,
      });
      setActiveDropdown(rowId);
    }
  };

  useEffect(() => {
    fetchStatusProgres();
  }, [fetchStatusProgres]);

  const paginatedData = status_progres.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-8">
      <Navbar />
      <div className="space-y-3 pt-8">
        <h3 className="text-H3 text-emphasis-on_surface-high">
          Status Progres Perencanaan Data
        </h3>
        <div className="rounded-[16px] border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-auto w-full min-w-max">
              <thead>
                <tr className="bg-custom-blue-100 text-left text-emphasis-on_surface-high uppercase tracking-wider">
                  <th className="px-3 py-6 text-sm font-semibold text-center w-[52px]">
                    No
                  </th>
                  <th className="px-3 py-6 text-sm font-semibold w-[280px]">
                    Nama Paket
                  </th>
                  <th className="px-3 py-6 text-sm font-semibold w-[280px]">
                    Nama Balai
                  </th>
                  <th className="px-3 py-6 text-sm font-semibold w-[200px]">
                    Nama PPK
                  </th>
                  <th className="px-3 py-6 text-sm font-semibold w-[200px]">
                    Jabatan PPK
                  </th>
                  <th className="px-3 py-6 text-sm font-semibold w-[140px]">
                    Kode Rup
                  </th>
                  <th className="px-3 py-6 text-sm font-semibold w-[280px]">
                    Status
                  </th>
                  {/* <th className="px-3 py-6 text-sm font-semibold w-[52px] text-center relative">
                    Aksi
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={` ${
                      index % 2 === 0
                        ? "bg-custom-neutral-0"
                        : "bg-custom-neutral-100"
                    }`}
                  >
                    <td className="px-3 py-6 text-sm text-center">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-3 py-6 text-sm">{item.nama_paket}</td>
                    <td className="px-3 py-6 text-sm">{item.nama_balai}</td>
                    <td className="px-3 py-6 text-sm">{item.nama_ppk}</td>
                    <td className="px-3 py-6 text-sm">{item.jabatan_ppk}</td>
                    <td className="px-3 py-6 text-sm">{item.kode_rup}</td>
                    <td className="px-3 py-6 text-sm">{item.status}</td>
                    {/* <td className="px-3 py-6 text-sm relative">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          className={`w-[52px] h-[52px] rounded-full flex items-center justify-center transition-colors 
                          hover:bg-custom-blue-50 cursor-pointer`}
                          onClick={(e) => handleToggleDropdown(item.id, e)}
                        >
                          <More
                            size="24"
                            color={colors.Emphasis.Light.On_Surface.High}
                          />
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalData={status_progres.length}
        onPageChange={setCurrentPage}
      />
      {/* Dropdown di luar tabel */}
      {activeDropdown && (
        <div
          className="absolute bg-white rounded-[12px] shadow-lg p-2 w-56"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.alignRight
              ? undefined
              : dropdownPosition.left,
            right: dropdownPosition.alignRight ? 0 : undefined,
            zIndex: 10000,
            boxShadow: "0px 4px 16px 0px rgba(165, 163, 174, 0.45)",
          }}
        >
          {/* <Link
            href="/pj_balai/monitoring/monitoring_perencanaan_data"
            className="block px-4 py-2 text-sm text-emphasis-on_surface-high hover:bg-custom-blue-50 rounded-[12px] transition-all duration-200">
            Lihat PDF Kuesioner
          </Link> */}
          {/* <Link
            href="/pj_balai/penugasan_tim/penugasan_tim"
            className="block px-4 py-2 text-sm text-emphasis-on_surface-high hover:bg-custom-blue-50 rounded-[12px] transition-all duration-200"
            onClick={() => openModal(activeMenu)}
          >
            Lihat Detail Kuesioner
          </Link> */}
          <div className="relative">
            <button
              className="block w-full px-4 py-2 text-sm text-emphasis-on_surface-high hover:bg-custom-blue-50 rounded-[12px] transition-all duration-200 text-left"
              onMouseEnter={() => setActiveSubMenu(true)}
              onMouseLeave={() => setActiveSubMenu(false)}
            >
              Penugasan Tim
              {activeSubMenu && (
                <div
                  className="absolute right-full top-0 bg-white rounded-[12px] shadow-lg p-2 w-56 ml-1 text-left"
                  style={{
                    boxShadow: "0px 4px 16px 0px rgba(165, 163, 174, 0.45)",
                  }}
                >
                  <Link
                    href={`/pj_balai/penugasan_tim/pengawas`}
                    key="submenu_pengawas"
                    className="block w-full px-4 py-2 text-sm text-emphasis-on_surface-high hover:bg-custom-blue-50 rounded-[12px] transition-all duration-200 text-left"
                  >
                    Pengawas
                  </Link>
                  <Link
                    href={`/pj_balai/penugasan_tim/petugas_lapangan`}
                    key="submenu_pengawas"
                    className="block w-full px-4 py-2 text-sm text-emphasis-on_surface-high hover:bg-custom-blue-50 rounded-[12px] transition-all duration-200 text-left"
                  >
                    Petugas Lapangan
                  </Link>
                  <Link
                    href={`/pj_balai/penugasan_tim/pengolah_data`}
                    key="submenu_pengawas"
                    className="block w-full px-4 py-2 text-sm text-emphasis-on_surface-high hover:bg-custom-blue-50 rounded-[12px] transition-all duration-200 text-left"
                  >
                    Pengolah Data
                  </Link>
                </div>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
