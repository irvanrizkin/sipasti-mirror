import React, { useState, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

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

const MapComponent = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB8rzsPylVTp7WFWmXxXvWOpVCIhVdySCo", // Ganti dengan API Key Anda
    libraries: ["places"], // Tambahkan library "places" untuk fitur autocomplete
  });

  const [markerPosition, setMarkerPosition] = useState(center);
  const [map, setMap] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const onMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
  };

  const onLoad = useCallback((mapInstance) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    mapInstance.fitBounds(bounds);
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
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

  return isLoaded ? (
    <div className="map-container">
      {/* Input untuk pencarian */}
      <div style={{ marginBottom: "10px", position: "relative" }}>
        <input
          type="text"
          placeholder="Cari lokasi..."
          value={searchValue}
          onChange={handleSearchChange}
          style={{
            padding: "8px",
            borderRadius: "4px",
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
                onClick={() => handleSuggestionClick(suggestion.place_id)}
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

      {/* Komponen Google Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onMapClick}>
        <Marker position={markerPosition} />
      </GoogleMap>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default MapComponent;
