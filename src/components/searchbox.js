import React, { useState } from "react";
import { Filter, SearchNormal } from "iconsax-react";
import Checkbox from "./checkbox"; // Import Checkbox component
import colors from "../styles/colors";

const SearchBox = ({
  placeholder = "Cari...",
  onSearch,
  withFilter = false,
  onFilterClick,
  filterOptions = [],
  onApplyFilters, // NEW prop
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(filterOptions);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const toggleFilterDropdown = () => {
    setIsFilterOpen((prevState) => !prevState);
  };

  const handleFilterChange = (index, newChecked) => {
    const updatedFilters = [...selectedFilters];
    updatedFilters[index].checked = newChecked;
    setSelectedFilters(updatedFilters);

    if (onFilterClick) {
      onFilterClick(updatedFilters);
    }
  };

  const applyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters(selectedFilters); // Trigger the function with selected filters
    }
    setIsFilterOpen(false); // Close the dropdown
  };

  return (
    <div className="relative flex items-center space-x-3">
      {/* Search Input */}
      <div className="relative w-[336px]">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full p-3 pl-12 text-Small bg-white border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-custom-blue-500"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <SearchNormal
            size="24"
            color={colors.Emphasis.Light.On_Surface.Medium}
          />
        </div>
      </div>

      {/* Filter Button */}
      {withFilter && (
        <div className="relative">
          <button
            onClick={toggleFilterDropdown}
            className="flex items-center justify-center gap-2 px-4 py-2 h-[46px] w-[119px] text-Medium border-2 border-gray-300 text-emphasis-on_surface-medium rounded-[16px] focus:outline-none focus:ring-2 focus:ring-custom-blue-500"
          >
            <Filter size="20" color={colors.Emphasis.Light.On_Surface.Medium} />
            <span className="text-Small font-medium">Filter</span>
          </button>

          {/* Filter Dropdown */}
          {isFilterOpen && (
            <div
              className="absolute mt-2 right-0 w-60 bg-white rounded-[12px] p-4 shadow-md z-50"
              style={{
                boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
                maxHeight: "316px",
                overflowY: "auto",
              }}
            >
              <h4 className="text-small text-emphasis-on_surface-medium mb-3">
                Pilih Filter
              </h4>
              {selectedFilters.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center mb-3 last:mb-0 p-2 rounded-[8px] hover:bg-custom-blue-100 hover:text-custom-blue-700 cursor-pointer transition-colors duration-200"
                >
                  <Checkbox
                    label={option.label}
                    checked={option.checked}
                    onChange={(newChecked) =>
                      handleFilterChange(index, newChecked)
                    }
                    className="text-sm font-medium text-gray-600"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
