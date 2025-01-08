import React, { useState } from "react";

const Checkbox = ({ label, checked: initialChecked = false, onChange }) => {
  const [checked, setChecked] = useState(initialChecked);

  const handleCheckboxChange = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    if (onChange) {
      onChange(newChecked);
    }
  };

  return (
    <div className="flex items-center justify-left space-x-2 h-full">
      {" "}
      <button
        onClick={handleCheckboxChange}
        type="button"
        className="flex items-center">
        <img
          src={checked ? "/images/checked.svg" : "/images/unchecked.svg"}
          alt={checked ? "Checked" : "Unchecked"}
        />
      </button>
      <span className="ml-2 text-emphasis-on_surface-medium">{label}</span>
    </div>
  );
};

export default Checkbox;
