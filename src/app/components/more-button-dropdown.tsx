import React, { useState, useRef, useEffect } from "react";
import { MdMoreVert, MdMoreHoriz } from "react-icons/md";

type Position = "left" | "right";

type hideDropdownProp = [
  // whether to hide dropdown
  boolean,
  // for resetting hideDropdown to false
  React.Dispatch<React.SetStateAction<boolean>>
];

interface MoreButtonDropdownProps {
  // children?: React.ReactNode;
  horizontal?: boolean;
  // customise position of dropdown
  position?: Position;
  // programmatically hide dropdown for more control
  hideDropdownOption?: hideDropdownProp;
  // more control over button click
  onButtonClick?: () => void;
  disabled?: boolean;
  items?: DropdownItem[];
}

export default function MoreButtonDropdown({
  hideDropdownOption,
  horizontal,
  position,
  onButtonClick,
  disabled,
  items,
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
    if (hideDropdownOption && hideDropdownOption[0] && dropdownOpen) {
      setDropdownOpen(false);
    }
  }, [dropdownOpen, hideDropdownOption]);

  return (
    <div className="relative inline-block text-left dropdown-item">
      <div>
        <button
          type="button"
          className={dropdownOpen ? "hidden" : ""}
          ref={buttonRef}
          disabled={disabled ? disabled : false}
          onClick={() => {
            if (buttonRef.current) {
              const rect = buttonRef.current.getBoundingClientRect();
              let width = 208;

              const left = position === "left" ? rect.left - width : rect.left;
              setDropdownStyle({
                position: "fixed",
                top: rect.bottom,
                left: left,
              });
              setDropdownOpen(true);
              hideDropdownOption && hideDropdownOption[1](false);
            }
            onButtonClick && onButtonClick();
          }}
          id="menu-button"
          aria-haspopup="true"
        >
          {horizontal ? <MdMoreHoriz size={20} /> : <MdMoreVert size={20} />}
        </button>

        {/* Display a different button when dropdown is open, 
            because the on click and handle click outside trigger at same time */}
        {dropdownOpen && (
          <button
            type="button"
            onClick={() => setDropdownOpen(false)}
            id="menu-close-button"
            aria-haspopup="true"
          >
            {horizontal ? <MdMoreHoriz size={20} /> : <MdMoreVert size={20} />}
          </button>
        )}
      </div>
      {dropdownOpen && !disabled && (
        <div
          ref={dropdownRef}
          style={dropdownStyle}
          className="z-10 w-52 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-darkColor"
          role="menu"
          aria-orientation="horizontal"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          {items &&
            items.map((item, index, arr) => {
              let roundingClasses = "";
              // round children depending on position in dropdown list so all children can fit within dropdown container
              if (arr.length === 1) {
                roundingClasses = "rounded-t-md rounded-b-md";
              } else if (index === 0) {
                roundingClasses = "rounded-t-md";
              } else if (index === arr.length - 1) {
                roundingClasses = "rounded-b-md";
              }

              return (
                <a
                  key={item.id}
                  href="#"
                  onClick={item.onClick}
                  className={`flex flex-row justify-between items-center text-gray-700 dark:text-white px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-50 dark:hover:bg-opacity-10 ${roundingClasses}`}
                  role="menuitem"
                  tabIndex={-1}
                  id={`menu-item-${item.id}`}
                >
                  <span>{item.label}</span>
                  {item.icon}
                </a>
              );
            })}
        </div>
      )}
    </div>
  );
}
