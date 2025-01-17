import React from "react";
import Button from "../components/button";

const AccessDenied = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div className="flex flex-col items-center space-y-4 text-center">
        <h1 className="text-H1 text-custom-Error-400">Akses Ditolak</h1>
        <h5 className="text-H5 text-emphasis-on_surface-high">
          Anda tidak punya akses untuk melihat halaman ini.
        </h5>
        <Button
          variant="solid_blue"
          size="Medium"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Kembali ke Homepage
        </Button>
      </div>
    </div>
  );
};

export default AccessDenied;
