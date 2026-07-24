import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

import "./Select.css";

function Select({
  options = [],
  value = "",
  placeholder = "Selecione",
  onChange,
}) {
  const [open, setOpen] = useState(false);

  const ref = useRef(null);

  const selected =
    options.find(
      (item) => item.value === value
    );

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        ref.current &&
        !ref.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  function handleSelect(option) {
    onChange(option.value);
    setOpen(false);
  }

  return (
    <div
      className="select"
      ref={ref}
    >
      <button
        type="button"
        className={`select__control ${
          open ? "open" : ""
        }`}
        onClick={() =>
          setOpen(!open)
        }
      >
        <span>
          {selected
            ? selected.label
            : placeholder}
        </span>

        <FiChevronDown
          className={`select__arrow ${
            open ? "rotate" : ""
          }`}
        />
      </button>

      {open && (
        <div className="select__menu">

          {options.map((option) => (

            <div
              key={option.value}
              className={`select__option ${
                value === option.value
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleSelect(option)
              }
            >
              <span>
                {option.label}
              </span>

              {value === option.value && (
                <FiCheck />
              )}
            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default Select;