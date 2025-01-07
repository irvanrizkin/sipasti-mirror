import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import PuprLogo from "../../public/images/pu-logo.svg";
import SipastiLogo from "../../public/images/sipasti-logo.svg";
import LoginImage from "../../public/images/login-asset.svg";

import CustomAlert from "../components/alert";
import Register from "./register";
import TextInput from "../components/input";
import Button from "../components/button";
import Modal from "../components/modal";
import ForgotPassword from "./forgotpassword";
import withAuth from "../middleware/withAuth";

const Login = () => {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && router.pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleLogin = async () => {
    setErrors({});
    try {
      const response = await fetch(
        "https://api-ecatalogue-staging.online/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (data.status !== "success") {
        throw new Error(data.message || "Login failed.");
      }

      // Simpan token ke localStorage
      localStorage.setItem("token", data.token);

      // Cek role pengguna
      const roleResponse = await fetch(
        "https://api-ecatalogue-staging.online/api/check-role",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const roleData = await roleResponse.json();

      // Tambahkan console.log untuk memeriksa isi roleData
      console.log("Role Data:", roleData);

      if (roleData.status !== "success") {
        throw new Error("Gagal memeriksa role pengguna.");
      }

      // Simpan role ke localStorage atau state global
      localStorage.setItem("role", roleData.data);

      // Redirect berdasarkan role
      if (roleData.data === "superadmin") {
        router.push("/dashboard");
      } else if (roleData.data === "Tim Teknis Balai") {
        router.push("/dashboard");
      } else if (roleData.data === "PJ Balai") {
        router.push("/dashboard");
      } else if (roleData.data === "Petugas Lapangan") {
        router.push("/dashboard");
      } else if (roleData.data === "Pengolah Data") {
        router.push("/dashboard");
      } else if (roleData.data === "Koordinator Provinsi") {
        router.push("/dashboard");
      } else if (roleData.data === "Pengawas") {
        router.push("/dashboard");
      } else if (roleData.data === "Direktorat") {
        router.push("/dashboard");
      } else {
        throw new Error("Role tidak dikenali.");
      }

      setAlertMessage("Login berhasil!");
      setAlertSeverity("success");
      setAlertOpen(true);
    } catch (error) {
      setAlertMessage(error.message);
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleSSOLogin = async () => {
    const token = "YOUR_SSO_TOKEN";

    try {
      const response = await fetch(
        "https://bravo.pu.go.id/backend/ssoinformation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      if (!response.ok) {
        throw new Error("Login SSO gagal");
      }

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        setAlertMessage("Login SSO berhasil!");
        setAlertSeverity("success");
        setAlertOpen(true);
        router.push("/dashboard");
      } else {
        setErrors({ username: "Login SSO gagal." });
      }
    } catch (error) {
      setErrors({ username: error.message });
    }
  };

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const openForgotPasswordModal = () => setIsForgotPasswordModalOpen(true);
  const closeForgotPasswordModal = () => setIsForgotPasswordModalOpen(false);

  return (
    <div className="relative flex justify-center items-center h-screen gap-8 mx-4 md:gap-12 lg:gap-16">
      {/* Container for the login form */}
      <div className="flex flex-col justify-between w-full max-w-[900px] h-full p-8 mx-auto">
        {/* Card Header */}
        <div className="flex justify-between">
          <Image
            src={PuprLogo}
            alt="PUPR Logo"
            className="max-h-[54.37px] max-w-[156px]"
          />
          <Image
            src={SipastiLogo}
            alt="Sipasti Logo"
            className="max-h-[54px] max-w-[201px]"
          />
        </div>

        {/* Login card with padding */}
        <div className="flex flex-col items-center justify-center flex-grow mt-[56px]">
          <div className="self-center text-center">
            <h5 className="text-H5 text-emphasis-on_surface-high">
              Selamat Datang di Katalog HSPW!
            </h5>
            <p className="text-B1 text-emphasis-on_surface-medium w-full max-w-[384px]">
              Katalog Informasi Harga Satuan Pokok Material Peralatan Tenaga
              Kerja Konstruksi per Wilayah
            </p>
          </div>

          {/* Input fields */}
          <div className="min-w-[336px] space-y-4 w-full max-w-[336px]">
            <TextInput
              label="Email"
              placeholder="Masukkan Email"
              state="border"
              value={username}
              onChange={(e) => setEmail(e.target.value)}
              isRequired={true}
              errorMessage="Email tidak boleh kosong"
            />
            {errors.username && (
              <p className="text-custom-red-500">{errors.username}</p>
            )}
            <div className="space-y-1">
              <TextInput
                label="Kata Sandi"
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                state="border"
                isRequired={true}
                errorMessage="Kata sandi tidak boleh kosong"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password}</p>
              )}
              {/* Button to open Forgot Password modal */}
              <Button
                onClick={openForgotPasswordModal}
                variant="red_text"
                size="ExtraSmall"
                className="custom-padding">
                Lupa Kata Sandi
              </Button>
            </div>

            {/* Login Button */}
            <div className="space-y-2">
              <Button
                onClick={handleLogin}
                variant="solid_blue"
                size="Medium"
                className="w-full">
                Masuk
              </Button>
              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t-2 border-emphasis-on_surface-small rounded-full"></div>
                <span className="flex-shrink mx-4 text-custom-neutral-500 text-Overline">
                  ATAU
                </span>
                <div className="flex-grow border-t-2 border-emphasis-on_surface-small rounded-full"></div>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleSSOLogin}
                variant="disabled"
                size="Medium"
                className="w-full">
                Masuk menggunakan SSO
              </Button>
              <div className="gap-x-1 flex items-center justify-center">
                <p className="text-Small text-neutral-500 text-center">
                  Belum punya akun?
                </p>
                <div className="grid justify-end">
                  <Button
                    onClick={openRegisterModal}
                    variant="blue_text"
                    size="Extra_Small">
                    Daftar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-row justify-between items-center">
          <p className="text-B2 text-neutral-500">
            2024Â© SIPASTI V.3.0 All Reserved by PUPR
          </p>
          <div className="gap-x-2 flex items-center">
            <Button onClick={handleLogin} variant="blue_text" size="B2">
              Kebijakan Privasi
            </Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="4"
              height="4"
              viewBox="0 0 4 4"
              fill="none">
              <circle cx="2" cy="2" r="2" fill="#B3B3B3" />
            </svg>
            <Button onClick={handleLogin} variant="blue_text" size="B2">
              Syarat dan Ketentuan
            </Button>
          </div>
          <CustomAlert
            message={alertMessage}
            severity={alertSeverity}
            openInitially={alertOpen}
            onClose={handleAlertClose}
          />
        </div>
      </div>

      {/* Login Image */}
      <div className="hidden md:block max-h-[960px] max-w-[688px]">
        <Image src={LoginImage} alt="Login Image" className="object-cover" />
      </div>

      {/* Register Modal */}
      <Modal isOpen={isRegisterModalOpen} onClose={closeRegisterModal}>
        <Register onClose={closeRegisterModal} />
      </Modal>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotPasswordModalOpen}
        onClose={closeForgotPasswordModal}>
        <ForgotPassword onClose={closeForgotPasswordModal} />
      </Modal>
    </div>
  );
};

export default Login;
