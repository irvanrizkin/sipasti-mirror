import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "../../public/images/logo.svg";
import { User, Logout } from "iconsax-react";
import colors from "../styles/colors";
import CustomAlert from "./alert";

const Navbar = () => {
  const router = useRouter();
  const [hovered, setHovered] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const [role, setRole] = useState(null);
  let hoverTimeout;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("role");
      setRole(storedRole);
    }
  }, []);

  useEffect(() => {
    console.log("User role:", role);
  }, [role]);

  const handleMouseEnter = (index) => {
    clearTimeout(hoverTimeout);
    setHovered(index);
  };

  const handleMouseLeave = () => {
    hoverTimeout = setTimeout(() => {
      setHovered(null);
    }, 300);
  };

  const handleProfileMouseEnter = () => {
    clearTimeout(hoverTimeout);
    setIsProfileHovered(true);
  };

  const handleProfileMouseLeave = () => {
    hoverTimeout = setTimeout(() => {
      setIsProfileHovered(false);
    }, 300);
  };

  const allLinks = [
    {
      href: "/dashboard",
      label: "Beranda",
      roles: [
        "superadmin",
        "Tim Teknis Balai",
        "PJ Balai",
        "Petugas Lapangan",
        "Koordinator Provinsi",
        "Pengolah Data",
        "Pengawas",
      ],
    },
    {
      href: "",
      label: "Perencanaan Data",
      activePath: "/perencanaan_data",
      roles: ["superadmin", "Tim Teknis Balai"],
    },
    {
      href: "/pengumpulan_data/pengawas/informasi_tahap_pengumpulan",
      label: "Pengumpulan Data",
      activePath: "/pengumpulan_data",
      roles: ["superadmin", "Petugas Lapangan", "Pengolah Data", "Pengawas"],
    },
    {
      href: "/pemeriksaan_data/informasi_pemeriksaan_data",
      label: "Pemeriksaan",
      activePath: "/pemeriksaan_data",
      roles: [
        "superadmin",
        "Koordinator Provinsi",
        "Tim Teknis Balai",
      ],
    },
    {
      href: "",
      label: "Responden/Vendor",
      activePath: "/vendor",
      roles: ["superadmin", "Tim Teknis Balai"],
    },
    {
      href: "",
      label: "Monitoring",
      activePath: "/pj_balai",
      roles: ["superadmin", "PJ Balai"],
    },
    {
      href: "/user_role/user_role",
      label: "Assign User",
      activePath: "/user_role",
      roles: ["superadmin"],
    },
  ];

  const links = allLinks.filter((link) => link.roles.includes(role));

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://api-ecatalogue-staging.online/api/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({}),
        }
      );

      if (response.ok) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        setAlertMessage("Keluar gagal");
        setAlertOpen(true);
      }
    } catch (error) {
      setAlertMessage("Error saat logout: " + error.message);
      setAlertOpen(true);
    }
  };

  return (
    <>
      {/* CustomAlert for logout errors */}
      <CustomAlert
        message={alertMessage}
        severity="error"
        openInitially={alertOpen}
        onClose={() => setAlertOpen(false)}
      />

      <nav
        className={`flex justify-between items-center ${
          isSticky ? "sticky" : "relative"
        }`}>
        {/* Logo Container */}
        <Link
          href="/dashboard"
          className="bg-custom-blue-500 flex items-center rounded-full py-6 px-7 transition-transform duration-300 ease-in-out hover:scale-110 active:scale-95">
          <Image
            src={logo}
            alt="SIPASTI Logo"
            className={`max-h-[54.37px] max-w-[156px] transition-transform duration-300 ease-in-out
              ${
                links.some((link) =>
                  router.pathname.startsWith(link.activePath || link.href)
                )
                  ? "scale-110"
                  : "scale-100"
              }
            `}
          />
        </Link>

        {/* Navbar Links */}
        <div className="flex items-center rounded-full bg-custom-neutral-100 mx-auto">
          <ul className="inline-flex flex-row items-center gap-x-3 px-2 h-[66px]">
            {links.map((link, index) => {
              const isActive = router.pathname.startsWith(
                link.activePath || link.href
              );
              const isHovered = hovered === index;

              return (
                <li
                  key={index}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}>
                  <Link
                    href={link.href}
                    className={`py-4 px-4
                  ${
                    isActive
                      ? "text-emphasis-on_color-high text-H6"
                      : "text-emphasis-on_surface-medium text-B1"
                  } 
                  leading-none rounded-full transition-all duration-300 ease-in-out transform 
                  ${isActive ? "bg-custom-blue-500" : ""} 
                  ${
                    isHovered
                      ? "hover:bg-surface-light-overlay active:bg-custom-neutral-300"
                      : ""
                  }
                  ${isHovered ? "scale-105" : "scale-100"}
                `}>
                    {link.label}
                  </Link>
                  {/* Perencanaan Data Menu */}
                  {link.label === "Perencanaan Data" && isHovered && (
                    <div
                      className="absolute left-0 mt-[32px] w-56 bg-white rounded-[12px] shadow-lg p-2 z-50"
                      style={{
                        boxShadow: "0px 4px 16px 0px rgba(165, 163, 174, 0.45)",
                      }}>
                      {[
                        {
                          href: "/perencanaan_data/tahap1",
                          label: "Buat Baru",
                        },
                        {
                          href: "/perencanaan_data/perencanaan_data_list",
                          label: "Informasi Perencanaan Data",
                        },
                      ].map((submenuItem, submenuIndex) => (
                        <Link
                          key={submenuIndex}
                          href={submenuItem.href}
                          className="block px-4 py-2 text-sm text-emphasis-on_surface-high hover:bg-custom-blue-50 rounded-[12px] transition-all duration-200">
                          {submenuItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                  {/* Vendor */}
                  {link.label === "Responden/Vendor" && isHovered && (
                    <div
                      className="absolute left-0 mt-[32px] w-56 bg-white rounded-[12px] shadow-lg p-2 z-50"
                      style={{
                        boxShadow: "0px 4px 16px 0px rgba(165, 163, 174, 0.45)",
                      }}>
                      {[
                        {
                          href: "/vendor/inputvendor",
                          label: "Input Data Responden/Vendor",
                        },
                        {
                          href: "/perencanaan_data/perencanaan_data_list",
                          label: "Informasi Responden/Vendor",
                        },
                      ].map((submenuItem, submenuIndex) => (
                        <Link
                          key={submenuIndex}
                          href={submenuItem.href}
                          className="block px-4 py-2 text-sm text-emphasis-on_surface-high hover:bg-custom-blue-50 rounded-[12px] transition-all duration-200">
                          {submenuItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                  {/* Vendor
                  {link.label === "Responden/Vendor" && isHovered && (
                    <div
                      className="absolute left-0 mt-[32px] w-56 bg-white rounded-[12px] shadow-lg p-2 z-50"
                      style={{
                        boxShadow: "0px 4px 16px 0px rgba(165, 163, 174, 0.45)",
                      }}>
                      {[
                        {
                          href: "/vendor/inputvendor",
                          label: "Input Data Responden/Vendor",
                        },
                        {
                          href: "/perencanaan_data/perencanaan_data_list",
                          label: "Informasi Responden/Vendor",
                        },
                      ].map((submenuItem, submenuIndex) => (
                        <Link
                          key={submenuIndex}
                          href={submenuItem.href}
                          className="block px-4 py-2 text-sm text-emphasis-on_surface-high hover:bg-custom-blue-50 rounded-[12px] transition-all duration-200">
                          {submenuItem.label}
                        </Link>
                      ))}
                    </div>
                  )} */}
                  {link.label === "Monitoring" && isHovered && (
                    <div
                      className="absolute left-0 mt-[32px] w-56 bg-white rounded-[12px] shadow-lg p-2 z-50"
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        boxShadow: "0px 4px 16px 0px rgba(165, 163, 174, 0.45)",
                      }}>
                      {[
                        {
                          href: "/pj_balai/monitoring/monitoring_perencanaan_data",
                          label: "Monitoring",
                          submenus: [
                            {
                              href: "/pj_balai/monitoring/monitoring_perencanaan_data",
                              label: "Perencanaan Data",
                            },
                            {
                              href: "/pj_balai/monitoring/monitoring_pengumpulan_data",
                              label: "Pengumpulan Data",
                            },
                            {
                              href: "/pj_balai/monitoring/monitoring_pemeriksaan_data",
                              label: "Pemeriksaan Data",
                            },
                            // {
                            //   href: "/pj_balai/monitoring/submenu2",
                            //   label: "Penyebarluasan Data",
                            // },
                          ],
                        },
                        {
                          href: "/pj_balai/penugasan_tim/penugasan_tim",
                          label: "Penugasan Tim",
                        },
                      ].map((submenuItem, submenuIndex) => (
                        <div key={submenuIndex} className="relative group">
                          <Link
                            href={submenuItem.href}
                            className="block px-4 py-2 text-sm text-emphasis-on_surface-high hover:bg-custom-blue-50 rounded-[12px] transition-all duration-200">
                            {submenuItem.label}
                          </Link>
                          {submenuItem.submenus && (
                            <div
                              className="absolute left-full top-0 mt-0 ml-[16px] w-56 bg-white rounded-[12px] shadow-lg p-2 hidden group-hover:block z-50"
                              style={{
                                boxShadow:
                                  "0px 4px 16px 0px rgba(165, 163, 174, 0.45)",
                              }}>
                              {submenuItem.submenus.map(
                                (deepSubmenu, deepIndex) => (
                                  <Link
                                    key={deepIndex}
                                    href={deepSubmenu.href}
                                    className="block px-4 py-2 text-sm text-emphasis-on_surface-high hover:bg-custom-blue-50 rounded-[12px] transition-all duration-200">
                                    {deepSubmenu.label}
                                  </Link>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Profile Container */}
        <div
          className="relative"
          onMouseEnter={handleProfileMouseEnter}
          onMouseLeave={handleProfileMouseLeave}>
          {/* Profile Button */}
          <div className="bg-custom-neutral-100 flex items-center rounded-full px-3 pe-6 h-[66px] space-x-3 cursor-pointer">
            <div className="p-2 bg-custom-neutral-0 rounded-full">
              <User
                color={colors.Emphasis.Light.On_Surface.High}
                variant="Linear"
                size={24}
              />
            </div>
            <div className="space-y-1 flex flex-col">
              <span className="text-emphasis-on_surface-high text-ExtraSmall">
                Role
              </span>
              <span className="text-emphasis-on_surface-high text-H6">
                Username
              </span>
            </div>
          </div>

          {/* Dropdown Menu */}
          {isProfileHovered && (
            <div
              className="absolute right-0 mt-[12px] w-60 bg-white rounded-[12px] p-2 transition-opacity duration-300 ease-in-out"
              style={{
                boxShadow: "0px 4px 16px 0px rgba(165, 163, 174, 0.45)",
                zIndex: 50,
              }}>
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-emphasis-on_surface-high hover:bg-custom-blue-50 rounded-[12px]">
                Pengaturan Akun
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-custom-red-500 hover:bg-custom-red-50 rounded-[12px]">
                Keluar
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
