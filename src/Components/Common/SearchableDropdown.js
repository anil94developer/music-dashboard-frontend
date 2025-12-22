import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const SearchableDropdown = ({
  options = [],
  onChange,
  placeholder = "Search...",
  valueKey = "_id",
  labelKey = "name",
  extraParams = {},
  className = "",
  title = "Select Options",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter(
    (option) =>
      option[labelKey]?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedOptions.some((item) => item[valueKey] === option[valueKey])
  );

  // Close modal when clicking outside and lock body scroll
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && 
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
      // Lock body scroll
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        // Restore body scroll
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.width = '';
        document.body.style.height = '';
      };
    }
  }, [showModal]);

  const handleOptionClick = (selectedOption) => {
    const updatedOptions = [...selectedOptions, selectedOption];
    setSelectedOptions(updatedOptions);
    onChange(updatedOptions, extraParams);
    setSearchTerm("");
  };

  const handleRemoveOption = (removedOption) => {
    const updatedOptions = selectedOptions.filter(
      (item) => item[valueKey] !== removedOption[valueKey]
    );
    setSelectedOptions(updatedOptions);
    onChange(updatedOptions, extraParams);
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setSearchTerm("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSearchTerm("");
  };

  const handleClearAll = () => {
    setSelectedOptions([]);
    onChange([], extraParams);
  };

  return (
   <>
      <div className="searchable-dropdown-wrapper">
      {/* Input and Selected Items */}
        <div 
          className={`searchable-dropdown-input ${className}`} 
          ref={dropdownRef}
          onClick={handleOpenModal}
        >
          <div className="selected-items-container">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
          <span
            key={option[valueKey]}
                  className="selected-item-badge"
                  onClick={(e) => e.stopPropagation()}
          >
                  <span className="badge-text">{option[labelKey]}</span>
            <button
              type="button"
                    className="badge-close-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveOption(option);
                    }}
                    aria-label="Remove"
                  >
                    <i className="fa fa-times"></i>
                  </button>
          </span>
              ))
            ) : (
              <span className="placeholder-text">{placeholder}</span>
            )}
          </div>
          <div className="dropdown-arrow">
            <i className="fa fa-chevron-down"></i>
          </div>
        </div>
      </div>

      {/* Modal Dialog - Using Portal for proper full page display */}
      {showModal && createPortal(
        <div className="searchable-dropdown-modal-overlay" onClick={handleCloseModal}>
          <div className="searchable-dropdown-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <i className="fa fa-list"></i> {title}
              </h3>
              <button 
                className="modal-close-btn"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              {/* Search Input */}
              <div className="modal-search-container">
        <input
          type="text"
                  className="modal-search-input"
                  placeholder={`Search ${placeholder.toLowerCase()}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                {selectedOptions.length > 0 && (
                  <button 
                    className="btn-clear-all"
                    onClick={handleClearAll}
                    title="Clear all selections"
                  >
                    <i className="fa fa-trash"></i> Clear All
                  </button>
                )}
      </div>

              {/* Selected Items Section */}
              {selectedOptions.length > 0 && (
                <div className="selected-items-section">
                  <div className="selected-items-header">
                    <h4>
                      <i className="fa fa-check-circle"></i> Selected Items ({selectedOptions.length})
                    </h4>
                  </div>
                  <div className="selected-items-list">
                    {selectedOptions.map((option) => (
                      <div key={option[valueKey]} className="selected-item-in-modal">
                        <span className="selected-item-name">{option[labelKey]}</span>
                        <button
                          type="button"
                          className="remove-selected-item-btn"
                          onClick={() => handleRemoveOption(option)}
                          title="Remove"
                        >
                          <i className="fa fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="modal-options-container">
                {filteredOptions.length > 0 ? (
                  <ul className="modal-options-list">
                    {filteredOptions.map((option) => {
                      const isSelected = selectedOptions.some(
                        (item) => item[valueKey] === option[valueKey]
                      );
                      return (
                        <li key={option[valueKey]}>
              <button
                type="button"
                            className={`modal-option-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              if (isSelected) {
                                handleRemoveOption(option);
                              } else {
                                handleOptionClick(option);
                              }
                            }}
                          >
                            <div className="option-checkbox">
                              {isSelected && <i className="fa fa-check"></i>}
                            </div>
                            <span className="option-text">{option[labelKey]}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="no-options-found-modal">
                    <i className="fa fa-search"></i>
                    <p>No options found</p>
                    <span>Try a different search term</span>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-modal-cancel"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button 
                className="btn-modal-done"
                onClick={handleCloseModal}
              >
                <i className="fa fa-check"></i> Done
            </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default SearchableDropdown;
