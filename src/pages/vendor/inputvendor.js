import React, { useState, useEffect } from "react";
import Navbar from "../../components/navigationbar";
import TextInput from "../../components/input";
import FileInput from "../../components/FileInput";
import Checkbox from "../../components/checkbox";
import Button from "../../components/button";
import Dropdown from "../../components/dropdown";
import axios from "axios";
import CustomAlert from "../../components/alert";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
// import { Console } from "console";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "16px",
  overflow: "hidden",
};

const center = {
  lat: -6.236307766247564,
  lng: 106.80058533427567,
};
const InputVendor = ({ onNext, onBack, onClose }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB8rzsPylVTp7WFWmXxXvWOpVCIhVdySCo",
    libraries: ["places"],
  });
  const [map, setMap] = React.useState(null);
  const [markerPosition, setMarkerPosition] = useState(center);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [nama_vendor, setnama_vendor] = useState("");
  const [jenis_vendor_id, setjenis_vendor_id] = useState("");
  const [kategori_vendor_id, setkategori_vendor_id] = useState("");
  const [alamat, setalamat] = useState("");
  const [no_telepon, setno_telepon] = useState("");
  const [no_hp, setno_hp] = useState("");
  const [sumber_daya, setsumber_daya] = useState("");
  const [nama_pic, setnama_pic] = useState("");
  const [provinsi_id, setprovinsi_id] = useState("");
  const [kota_id, setkota_id] = useState("");
  const [provinsiOptions, setProvinsiOptions] = useState([]);
  const [kotaOptions, setKotaOptions] = useState([]);
  const [koordinat, setkoordinat] = useState("");
  const [logoUploadState, setlogoUploadState] = useState("default");
  const [dok_pendukung_url, setDokPendukungUrl] = useState(null);
  const [logoUploadProgress, setLogoUploadProgress] = useState(0);
  const [logo_url, setLogoUrl] = useState(null);
  const [inputValues, setInputValues] = useState([]);
  const [uploadState, setUploadState] = useState("default");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [dokPendukungUploadState, setDokPendukungUploadState] =
    useState("default");
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [alertOpen, setAlertOpen] = useState(false);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleSearchChange = (e) => {
    const input = e.target.value;
    setSearchValue(input);

    if (input && input.trim() !== "") {
      const service = new window.google.maps.places.AutocompleteService();

      service.getPlacePredictions(
        { input, types: ["geocode"] },
        (predictions, status) => {
          if (status === "OK" && predictions) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
          }
        }
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (placeId) => {
    const service = new window.google.maps.places.PlacesService(map);

    service.getDetails({ placeId }, (place, status) => {
      if (status === "OK" && place.geometry) {
        const location = place.geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        setMarkerPosition({ lat, lng });
        map.panTo(location);
        map.setZoom(14); // Zoom ke lokasi hasil pencarian
        setSearchValue(place.formatted_address); // Update input dengan alamat yang dipilih
        setSuggestions([]);
      }
    });
  };

  const handleInputChange = (newValues) => {
    setInputValues(newValues);
  };

  const handleLogoFileSelect = (files) => {
    if (files.length === 0) {
      setError("File wajib dipilih.");
      return;
    }

    const file = files[0];
    setLogoUrl(file);
    setlogoUploadState("processing");
    setError("");
    try {
      setLogoUrl(file);
      setlogoUploadState("done");
    } catch (error) {
      console.error("Error processing logo file:", error);
      setlogoUploadState("default");
    }
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setlogoUploadState("done");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const onMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
  };

  const handleDokPendukungFileSelect = (files) => {
    if (files.length === 0) {
      setError("File wajib dipilih.");
      return;
    }

    const file = files[0];
    setDokPendukungUrl(file);
    setDokPendukungUploadState("processing");
    setError("");

    try {
      setDokPendukungUrl(file);
      setDokPendukungUploadState("done");
    } catch (error) {
      console.error("Error processing dokumen pendukung file:", error);
      setDokPendukungUploadState("default");
    }
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDokPendukungUploadState("done");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleLogoCancel = () => {
    setlogoUploadState("default");
    setLogoUrl(null);
    setProgress(0);
  };

  const handleDokPendukungCancel = () => {
    setDokPendukungUploadState("default");
    setDokPendukungUrl(null);
    setProgress(0);
  };

  useState("default");
  const [dokPendukungUploadProgress, setDokPendukungUploadProgress] =
    useState(0);

  useEffect(() => {
    const fetchProvinsi = async () => {
      try {
        const response = await axios.get(
          "https://api-ecatalogue-staging.online/api/provinces-and-cities"
        );
        // console.log("API Response:", response.data.data);

        if (response.data.data && Array.isArray(response.data.data)) {
          const formattedProvinsi = response.data.data.map((provinsi) => ({
            value: provinsi.id_province.toString(),
            label: provinsi.province_name,
            cities: provinsi.cities,
          }));

          setProvinsiOptions(formattedProvinsi);
          console.log(provinsi_id);
        } else {
          console.error("Provinces not found in the response");
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinsi();
  }, [provinsi_id]);

  const handleProvinsiChange = (selectedOption) => {
    setprovinsi_id(selectedOption.value);

    setKotaOptions([]);
    setkota_id("");

    console.log(kotaOptions);
    console.log(kota_id);

    const selectedProvinsi = provinsiOptions.find(
      (provinsi) => provinsi.value === selectedOption.value
    );

    setKotaOptions(
      selectedProvinsi?.cities.map((city) => ({
        value: city.cities_id,
        label: city.cities_name,
      })) || []
    );

    console.log(selectedProvinsi);
  };

  const handleCheckboxChange = (type) => {
    setSelectedTypes((prev) => {
      const updatedTypes = prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type];

      setjenis_vendor_id(updatedTypes.join(","));
      console.log("Updated jenis_vendor_id:", updatedTypes.join(","));

      return updatedTypes;
    });
  };

  const saveVendorData = async () => {
    try {
      const jsonVendorTypes = selectedTypes.map((type) => parseInt(type));
      const jsonCategories = selectedTypes.map((type) => parseInt(type));

      const stringLogoUrl = Array.isArray(logo_url)
        ? logo_url.join(", ")
        : logo_url || "";
      const stringDokPendukungUrl = Array.isArray(dok_pendukung_url)
        ? dok_pendukung_url.join(", ")
        : dok_pendukung_url || "";

      const formData = new FormData();
      formData.append("nama_vendor", nama_vendor);
      formData.append(
        "jenis_vendor_id",
        jsonVendorTypes.length > 0 ? `[${jsonVendorTypes.join(",")}]` : "[]"
      );
      formData.append(
        "kategori_vendor_id",
        kategori_vendor_id ? `[${kategori_vendor_id}]` : "[]"
      );
      formData.append("alamat", alamat);
      formData.append("no_telepon", no_telepon);
      formData.append("no_hp", no_hp);
      formData.append("sumber_daya", sumber_daya);
      formData.append("nama_pic", nama_pic);
      formData.append("provinsi_id", provinsi_id);
      formData.append("kota_id", kota_id);
      formData.append("koordinat", koordinat);
      formData.append("logo_url", stringLogoUrl);
      formData.append("dok_pendukung_url", stringDokPendukungUrl);
      console.log("Payload yang dikirim:", {
        nama_vendor,
        jenis_vendor_id,
        kategori_vendor_id,
        alamat,
        no_telepon,
        no_hp,
        sumber_daya,
        nama_pic,
        provinsi_id,
        kota_id,
        koordinat,
        logo_url,
        dok_pendukung_url,
      });
      const response = await fetch(
        "https://api-ecatalogue-staging.online/api/input-vendor",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (!response.ok || result.status === "error") {
        console.error("Response error:", result);
        throw new Error(
          result.message || "Terjadi kesalahan saat input vendor."
        );
      }

      setAlertMessage(result.message || "Input vendor berhasil!");
      setAlertSeverity("success");
      setAlertOpen(true);

      window.location.reload();
      // setnama_vendor("");
      // setSelectedTypes([]);
      // setkategori_vendor_id("");
      // setalamat("");
      // setno_telepon("");
      // setno_hp("");
      // setsumber_daya("");
      // setnama_pic("");
      // setprovinsi_id("");
      // setkota_id("");
      // setkoordinat("");
      // setLogoUrl("default");
      // setDokPendukungUrl("default");
    } catch (error) {
      const errorMessage = error.message || "Data gagal disimpan.";
      console.error("Error saat menyimpan data:", errorMessage);
      setAlertMessage(errorMessage);
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  // .then((response) => {
  //   if (!response.ok) {
  //     throw new Error("Gagal menyimpan data. Silakan coba lagi.");
  //   }
  //   return response.json(); // Parsing JSON
  // })
  // .then((result) => {
  //   if (result.success) {
  //     // Jika sukses
  //     setAlertMessage(result.message || "Data berhasil disimpan.");
  //     setAlertSeverity("success");
  //     setAlertOpen(true);

  //     // Reset inputan jika berhasil
  //     setnama_vendor("");
  //     setSelectedTypes([]);
  //     setkategori_vendor_id("");
  //     setalamat("");
  //     setno_telepon("");
  //     setno_hp("");
  //     setsumber_daya("");
  //     setnama_pic("");
  //     setprovinsi_id("");
  //     setkota_id("");
  //     setkoordinat("");
  //     setLogoUrl("");
  //     setDokPendukungUrl("");
  //   } else if (result.error) {
  //     // Jika terdapat error dari API
  //     setAlertMessage(result.message || "Data gagal disimpan.");
  //     setAlertSeverity("error");
  //     setAlertOpen(true);
  //     console.error(
  //       "API error:",
  //       result.message || "Error tidak diketahui."
  //     );
  //   }
  // })
  // .catch((error) => {
  //   // Menangani error dari jaringan atau fetch
  //   setAlertMessage(error.message || "Data gagal disimpan.");
  //   setAlertSeverity("error");
  //   setAlertOpen(true);
  //   console.error("Fetch error:", error);
  // });
  // };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setkoordinat(`${lat}, ${lng}`);
    setMarkerPosition({ lat, lng });
  };

  const getOptions = () => {
    if (selectedTypes.length === 0) return [];
    const options = {
      1: [
        { value: "1", label: "Pedagang Grosir" },
        { value: "2", label: "Distributor" },
        { value: "3", label: "Produsen" },
        { value: "4", label: "Pedagang Campuran" },
      ],
      2: [
        { value: "8", label: "Produsen" },
        { value: "5", label: "Jasa Penyewaan Alat Berat" },
        { value: "6", label: "Kontraktor" },
        { value: "7", label: "Agen" },
      ],
      3: [
        { value: "9", label: "Kontraktor" },
        { value: "10", label: "Pemerintah Daerah" },
      ],
    };
    const combinedOptionsMap = new Map();

    selectedTypes
      .flatMap((type) => options[type] || [])
      .forEach((option) => {
        if (combinedOptionsMap.has(option.label)) {
          const existingOption = combinedOptionsMap.get(option.label);
          existingOption.value += `,${option.value}`;
        } else {
          combinedOptionsMap.set(option.label, { ...option });
        }
      });

    return Array.from(combinedOptionsMap.values());
  };

  const labelToCategoriesMap = {
    Produsen: ["3", "8"],
    Kontraktor: ["6", "9"],
  };
  // const handleProvinsiChange = (selectedOption) => {
  //   setprovinsi_id(selectedOption ? selectedOption.value : "");
  //   setKotaOptions([]);
  //   setkota_id("");
  // };

  const handleKotaChange = (selectedOption) => {
    setkota_id(selectedOption ? selectedOption.value : "");
  };

  const handleKoordinatChange = (e) => {
    const value = e.target.value;
    setkoordinat(value);

    // Pisah koordinat latitude dan longitude
    const [lat, lng] = value.split(",").map(Number);

    // Validasi apakah koordinat valid
    if (!isNaN(lat) && !isNaN(lng)) {
      setMarkerPosition({ lat, lng });
      map.panTo({ lat, lng });
      map.setZoom(14); // Zoom ke lokasi baru
    } else {
      console.error("Koordinat tidak valid.");
    }
  };

  return isLoaded ? (
    <>
      <div className="p-8">
        <Navbar />
        <div className="p-6">
          <h3 className="text-H3 text-emphasis-on_surface-high">
            Input Data Vendor
          </h3>

          <div className="flex flex-wrap gap-4 mt-3">
            <div className="flex-grow grid grid-cols-1 gap-4 py-8 px-6 rounded-[16px] bg-custom-neutral-100">
              <TextInput
                label="Nama Vendor/Perusahaan"
                placeholder="Masukkan nama vendor/perusahaan"
                state="border"
                isRequired={true}
                errorMessage="Vendor/Perusahaan tidak boleh kosong."
                value={nama_vendor}
                onChange={(e) => setnama_vendor(e.target.value)}
              />

              <div className="space-b-1">
                <p className="text-B2">Jenis Responden/ Vendor</p>
                <div className="flex space-x-8">
                  <Checkbox
                    label="Material"
                    checked={selectedTypes.includes("1")}
                    onChange={() => handleCheckboxChange("1")}
                  />
                  <Checkbox
                    label="Peralatan"
                    checked={selectedTypes.includes("2")}
                    onChange={() => handleCheckboxChange("2")}
                  />
                  <Checkbox
                    label="Tenaga Kerja"
                    checked={selectedTypes.includes("3")}
                    onChange={() => handleCheckboxChange("3")}
                  />
                </div>
              </div>

              <Dropdown
                options={getOptions()}
                label="Kategori Vendor/Perusahaan"
                placeholder="Pilih kategori vendor/perusahaan"
                errorMessage="Kategori tidak boleh kosong."
                value={kategori_vendor_id}
                onSelect={(selectedOption) =>
                  setkategori_vendor_id(selectedOption.value)
                }
                isRequired={true}
              />

              <TextInput
                label="Sumber daya yang dimiliki"
                placeholder="Masukkan sumber daya"
                type="text"
                state="border"
                isRequired={true}
                errorMessage="Sumber daya tidak boleh kosong."
                value={sumber_daya}
                onChange={(e) => setsumber_daya(e.target.value)}
              />

              <TextInput
                label="Alamat vendor atau perusahaan"
                placeholder="Masukkan alamat"
                type="text"
                state="border"
                isRequired={true}
                errorMessage="Alamat tidak boleh kosong."
                value={alamat}
                onChange={(e) => setalamat(e.target.value)}
              />

              <div className="flex gap-8">
                <TextInput
                  label="Nomor Telepon"
                  placeholder="Masukkan nomor telepon"
                  type="text"
                  state="border"
                  isRequired={true}
                  errorMessage="Nomor telepon tidak boleh kosong."
                  name="phone"
                  value={no_telepon}
                  onChange={(e) => setno_telepon(e.target.value)}
                  className="flex-1"
                />
                <TextInput
                  label="Nomor HP"
                  placeholder="Masukkan nomor HP"
                  type="text"
                  state="border"
                  isRequired={true}
                  errorMessage="Nomor HP tidak boleh kosong."
                  value={no_hp}
                  onChange={(e) => setno_hp(e.target.value)}
                  className="flex-1"
                />
              </div>

              <TextInput
                label="Nama PIC"
                placeholder="Masukkan nama PIC"
                type="text"
                state="border"
                isRequired={true}
                errorMessage="Nama PIC tidak boleh kosong."
                value={nama_pic}
                onChange={(e) => setnama_pic(e.target.value)}
              />

              <div className="flex gap-8">
                <Dropdown
                  options={provinsiOptions}
                  label="Pilih Provinsi"
                  placeholder="Pilih Provinsi"
                  onSelect={handleProvinsiChange}
                  value={provinsiOptions.find(
                    (option) => option.value === provinsi_id
                  )}
                  isRequired
                  errorMessage="Provinsi harus dipilih"
                />
                <Dropdown
                  options={kotaOptions}
                  label="Pilih Kota"
                  placeholder="Pilih Kota"
                  onSelect={handleKotaChange}
                  value={kotaOptions.find((option) => option.value === kota_id)}
                  isRequired
                  errorMessage="Kota harus dipilih"
                />
              </div>
            </div>

            <div className="flex-grow grid grid-cols-1 gap-4 py-8 px-6 rounded-[16px] bg-custom-neutral-100">
              <div
                style={{
                  marginBottom: "10px",
                  position: "relative",
                  borderRadius: "16px",
                }}>
                <input
                  type="text"
                  placeholder="Cari lokasi..."
                  value={searchValue}
                  onChange={handleSearchChange}
                  style={{
                    padding: "8px",
                    borderRadius: "12px",
                    border: "1px solid #ccc",
                    width: "100%",
                  }}
                />
                {/* Dropdown saran lokasi */}
                {suggestions.length > 0 && (
                  <ul
                    style={{
                      listStyle: "none",
                      margin: 0,
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      backgroundColor: "#fff",
                      position: "absolute",
                      width: "100%",
                      zIndex: 10,
                      top: "40px",
                    }}>
                    {suggestions.map((suggestion) => (
                      <li
                        key={suggestion.place_id}
                        onClick={() =>
                          handleSuggestionClick(suggestion.place_id)
                        }
                        style={{
                          padding: "8px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                        }}>
                        {suggestion.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="space-y-6">
                <GoogleMap
                  Marker
                  position={center}
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={10}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                  onClick={handleMapClick}>
                  <Marker position={markerPosition} />
                </GoogleMap>
                <TextInput
                  label="Koordinat"
                  placeholder="Masukkan Koordinat"
                  type="text"
                  value={koordinat}
                  onChange={handleKoordinatChange}
                  state="border"
                />
                <FileInput
                  onFileSelect={handleLogoFileSelect}
                  setSelectedFile={setLogoUrl}
                  buttonText="Pilih Berkas"
                  multiple={false}
                  accept=".jpg, .jpeg"
                  Label="Unggah Logo"
                  HelperText="Format .JPG, .JPEG dan maksimal 2MB"
                  state={logoUploadState}
                  onCancel={handleLogoCancel}
                  selectedFile={logo_url}
                  maxSizeMB={2}
                />
                <FileInput
                  onFileSelect={handleDokPendukungFileSelect}
                  setSelectedFile={setDokPendukungUrl}
                  buttonText="Pilih Berkas"
                  multiple={false}
                  accept=".pdf"
                  Label="Unggah Dokumen Pendukung"
                  HelperText="Format .PDF dan maksimal 2MB"
                  state={dokPendukungUploadState}
                  onCancel={handleDokPendukungCancel}
                  selectedFile={dok_pendukung_url}
                  maxSizeMB={2}
                />
              </div>

              <div className="flex flex-row justify-end items-right space-x-4 mt-3 bg-neutral-100 px-6 py-8 rounded-[16px]">
                <Button
                  label="Kembali"
                  variant="secondary"
                  size="md"
                  onClick={onBack}
                />
                <Button
                  label="Simpan & Lanjut"
                  variant="primary"
                  size="md"
                  onClick={onNext}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-end items-right space-x-4 mt-3 bg-neutral-100 px-6 py-8 rounded-[16px]">
            <Button variant="outlined_yellow" size="Medium" onClick={onBack}>
              Kembali
            </Button>
            <Button variant="solid_blue" size="Medium" onClick={saveVendorData}>
              Simpan & Lanjut
            </Button>
          </div>
        </div>

        <CustomAlert
          message={alertMessage}
          severity={alertSeverity}
          openInitially={alertOpen}
          onClose={() => setAlertOpen(false)}
        />
      </div>
    </>
  ) : null;
};

export default InputVendor;
