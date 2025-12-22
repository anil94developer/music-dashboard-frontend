import React, { useState, useEffect } from 'react';
import { base } from '../../Constants/Data.constant';
import { getData, postData } from '../../Services/Ops';
import { showSuccess, showError } from '../../Utils/Notification';

export default function LabelSelector(props) {
  const { selectedLabel = '', setSelectedLabel } = props;
  const [query, setQuery] = useState("");
  const [labelList, setLabelList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");

  // Fetch label list once on component mount
  useEffect(() => {
    fetchLabelList();
  }, []);

  const fetchLabelList = async () => {
    try {
      let result = await getData(base.labelList);
      if (result.status === true || result.data) {
        setLabelList(Array.isArray(result.data) ? result.data : []);
      }
    } catch (error) {
      console.error("Error fetching label list:", error);
    }
  };

  const filteredLabels = labelList.filter(label =>
    label.title?.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectLabel = (label) => {
    setSelectedLabel(label.title);
    setQuery("");
    setShowModal(false);
  };

  const addNewLabel = async () => {
    if (!newLabelName.trim()) {
      showError("Please enter label name", "Validation Error");
      return;
    }

    let body = { title: newLabelName };
    let result = await postData(base.addLabel, body);

    if (result.data?.status === true) {
      showSuccess(result.message || "Label added successfully", "Success");
      await fetchLabelList();
      setNewLabelName("");
      setShowAddForm(false);
      if (result.data.data) {
        handleSelectLabel(result.data.data);
      }
    } else {
      showError(result.message || "Failed to add label", "Error");
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setQuery("");
    setShowAddForm(false);
    setNewLabelName("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setQuery("");
    setNewLabelName("");
    setShowAddForm(false);
  };

  return (
    <div className="label-selector-container">
      {/* Selected Label Display */}
      <div className="selected-label-display">
        {selectedLabel ? (
          <div className="selected-label-chip">
            <span className="label-chip-name">{selectedLabel}</span>
            <button 
              className="label-chip-remove" 
              onClick={() => setSelectedLabel("")}
              title="Remove label"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="no-label-selected">No label selected</div>
        )}
      </div>

      {/* Open Modal Button */}
      <button 
        type="button" 
        className="btn btn-primary open-label-modal-btn" 
        onClick={handleOpenModal}
      >
        <i className="fa fa-plus"></i> {selectedLabel ? 'Change Label' : 'Select Label'}
      </button>

      {/* Modal Dialog */}
      {showModal && (
        <>
          <div 
            className="modal-backdrop" 
            onClick={handleCloseModal}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1040,
            }}
          ></div>
          <div 
            className="modal fade show" 
            style={{ display: 'block', zIndex: 1050 }}
            role="dialog"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content label-modal-content">
                <div className="modal-header label-modal-header">
                  <h4 className="modal-title">Select Label Name</h4>
                  <button 
                    type="button" 
                    className="btn-close-modal" 
                    onClick={handleCloseModal}
                    aria-label="Close"
                  >
                    <span>×</span>
                  </button>
                </div>
                <div className="modal-body label-modal-body">
                  {/* Search Section */}
                  <div className="label-search-section">
                    <div className="form-group">
                      <label>Search Label</label>
                      <div className="search-input-wrapper">
                        <input 
                          className="form-control label-search-input" 
                          type="text" 
                          value={query} 
                          onChange={(e) => {
                            setQuery(e.target.value);
                            setShowAddForm(false);
                          }} 
                          placeholder="Type to search for a label..." 
                          autoFocus
                        />
                        <i className="fa fa-search search-icon"></i>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-outline-primary add-new-label-btn"
                      onClick={() => {
                        setShowAddForm(true);
                        setQuery("");
                      }}
                    >
                      <i className="fa fa-plus"></i> Add New Label
                    </button>
                  </div>

                  {/* Search Results or Add Form */}
                  {query && !showAddForm && (
                    <div className="label-results-section">
                      {filteredLabels.length > 0 ? (
                        <div className="label-results-list">
                          <h5 className="results-title">Search Results</h5>
                          {filteredLabels.map((label, index) => (
                            <div 
                              key={label._id || index} 
                              className="label-result-item"
                              onClick={() => handleSelectLabel(label)}
                            >
                              <div className="label-result-info">
                                <i className="fa fa-tag label-result-icon"></i>
                                <span className="label-result-name">{label.title}</span>
                              </div>
                              <i className="fa fa-check-circle add-icon"></i>
                            </div>
                          ))}
                        </div>
                      ) : query.length > 0 && (
                        <div className="no-results-message">
                          <p>No label found. Click "Add New Label" to create one.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Show All Labels when no search */}
                  {!query && !showAddForm && labelList.length > 0 && (
                    <div className="label-results-section">
                      <div className="label-results-list">
                        <h5 className="results-title">All Labels ({labelList.length})</h5>
                        {labelList.map((label, index) => (
                          <div 
                            key={label._id || index} 
                            className="label-result-item"
                            onClick={() => handleSelectLabel(label)}
                          >
                            <div className="label-result-info">
                              <i className="fa fa-tag label-result-icon"></i>
                              <span className="label-result-name">{label.title}</span>
                            </div>
                            {selectedLabel === label.title && (
                              <i className="fa fa-check-circle selected-icon"></i>
                            )}
                            {selectedLabel !== label.title && (
                              <i className="fa fa-plus add-icon"></i>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add New Label Form */}
                  {showAddForm && (
                    <div className="add-label-form-section">
                      <h5 className="form-section-title">Add New Label</h5>
                      <div className="form-group">
                        <label>Label Name <span className="required-star">*</span></label>
                        <input
                          className="form-control"
                          type="text"
                          value={newLabelName}
                          onChange={(e) => setNewLabelName(e.target.value)}
                          placeholder="Enter label name..."
                          autoFocus
                        />
                      </div>
                      <div className="form-actions">
                        <button
                          className="btn btn-secondary"
                          type="button"
                          onClick={() => {
                            setShowAddForm(false);
                            setNewLabelName("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={addNewLabel}
                        >
                          <i className="fa fa-check"></i> Add Label
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer label-modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handleCloseModal}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

