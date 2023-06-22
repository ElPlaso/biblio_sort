import React, { useState, useRef, useEffect } from "react";
import { MdMoreVert } from "react-icons/md";

interface MoreButtonDropdownProps {
  children?: React.ReactNode;
  hideDropdown?: boolean;
  setHideDropdown?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MoreButtonDropdown({
  children,
  hideDropdown,
  setHideDropdown,
}: MoreButtonDropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    if (hideDropdown && dropdownOpen) {
      setDropdownOpen(false);
    }
  }, [hideDropdown]);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className={dropdownOpen ? "hidden" : ""}
          ref={buttonRef}
          onClick={() => {
            if (buttonRef.current) {
              const rect = buttonRef.current.getBoundingClientRect();
              setDropdownStyle({
                position: "fixed",
                top: rect.bottom,
                left: rect.left,
              });
              setDropdownOpen(true);
              setHideDropdown && setHideDropdown(false);
            }
          }}
          id="menu-button"
          aria-haspopup="true"
        >
          <MdMoreVert size={20} />
        </button>

        {/* Display a different button when dropdown is open */}
        {dropdownOpen && (
          <button
            type="button"
            onClick={() => setDropdownOpen(false)}
            id="menu-close-button"
            aria-haspopup="true"
          >
            <MdMoreVert size={20} />
          </button>
        )}
      </div>
      {dropdownOpen && (
        <div
          ref={dropdownRef}
          style={dropdownStyle}
          className="z-10 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-darkColor"
          role="menu"
          aria-orientation="horizontal"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          {children}
        </div>
      )}
    </div>
  );
}
