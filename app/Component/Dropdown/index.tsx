import React, { useEffect, useRef, useState } from "react";
import "./Style.scss";
import downIcon from "../../assets/down.png";
import upIcon from "../../assets/up.png";

type Option = {
  name: string;
};

const options: Option[] = [
  { name: "Education" },
  { name: "Yeeeah, science!" },
  { name: "Art" },
  { name: "Sport" },
  { name: "Games" },
  { name: "Health" },
];

const Dropdown = () => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchOption, setSearchOption] = useState<string>("");
  const [listOption, setListOption] = useState<Option[]>(options);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setSearchOption(option.name);
    setIsOpen(false);
    setIsSearching(false); // Reset search state after selection
  };

  useEffect(() => {
    if (isSearching && searchOption) {
      // Filter options based on search input
      const filteredOptions = options.filter((option) =>
        option.name.toLowerCase().includes(searchOption.toLowerCase())
      );

      // Add the selected option back to the list if it's not already included
      if (
        selectedOption &&
        !filteredOptions.some((option) => option.name === selectedOption.name)
      ) {
        filteredOptions.unshift(selectedOption); // Add selected option at the top
      }

      setListOption(filteredOptions);
    } else {
      // Show all options if not searching
      setListOption(options);
    }
  }, [isSearching, searchOption, selectedOption]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsSearching(false); // Reset search state when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  console.log(listOption);

  return (
    <div className="dropdown" ref={menuRef}>
      <div
        className="select-box"
        onClick={() => {
          setIsSearching(false); // Reset search state when opening the menu
        }}
      >
        <input
          type="text"
          value={searchOption}
          placeholder="Science"
          onChange={(e) => {
            setSearchOption(e.target.value);
            setIsSearching(true); // Enable search mode when typing
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchOption.length > 0) {
              setIsOpen(!isOpen);
            }
          }}
        />
        <span>
          <img src={isOpen ? upIcon : downIcon} alt="" />
        </span>
      </div>

      {isOpen && (
        <ul>
          {listOption?.length > 0 ? (
            listOption?.map((option, index) => (
              <li
                key={index}
                className={
                  selectedOption?.name === option.name ? "selected" : ""
                }
                onClick={() => handleOptionClick(option)}
              >
                {option.name}
              </li>
            ))
          ) : (
            <li>No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
