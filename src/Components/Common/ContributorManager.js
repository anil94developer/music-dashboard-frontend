import React, { useState } from 'react';

export default function ContributorManager(props) {
  const {
    label = "Contributor",
    availableItems = [],
    selectedItems = [],
    setSelectedItems,
    setAvailableItems
  } = props;

  const [showModal, setShowModal] = useState(false);
  const [selectedInModal, setSelectedInModal] = useState([]);
  const [personNames, setPersonNames] = useState({});

  const openModal = () => {
    setShowModal(true);
    setSelectedInModal([]);
    setPersonNames({});
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInModal([]);
    setPersonNames({});
  };

  const toggleSelection = (item) => {
    if (selectedInModal.some(i => i.id === item.id)) {
      setSelectedInModal(selectedInModal.filter(i => i.id !== item.id));
      const newNames = { ...personNames };
      delete newNames[item.id];
      setPersonNames(newNames);
    } else {
      setSelectedInModal([...selectedInModal, item]);
      setPersonNames({ ...personNames, [item.id]: '' });
    }
  };

  const updatePersonName = (itemId, name) => {
    setPersonNames({ ...personNames, [itemId]: name });
  };

  const addSelectedContributors = () => {
    if (selectedInModal.length === 0) {
      return;
    }

    const newContributors = selectedInModal.map(item => ({
      ...item,
      value: personNames[item.id] || ''
    }));

    // Remove selected items from available
    const remainingAvailable = availableItems.filter(
      item => !selectedInModal.some(sel => sel.id === item.id)
    );

    // Add to selected
    const updatedSelected = [...selectedItems, ...newContributors];

    setSelectedItems(updatedSelected);
    setAvailableItems(remainingAvailable);
    closeModal();
  };

  const removeContributor = (itemId) => {
    const removed = selectedItems.find(item => item.id === itemId);
    if (removed) {
      setSelectedItems(selectedItems.filter(item => item.id !== itemId));
      setAvailableItems([...availableItems, { id: removed.id, name: removed.name }]);
    }
  };

  const updateContributorName = (itemId, name) => {
    setSelectedItems(selectedItems.map(item =>
      item.id === itemId ? { ...item, value: name } : item
    ));
  };

  return (
    <div className="contributor-manager-container">
      {/* Input Field */}
      <div className="contributor-input-wrapper">
        <input
          type="text"
          className="form-control contributor-input"
          placeholder={`Select ${label.toLowerCase()}...`}
          value={selectedItems.length > 0 ? `${selectedItems.length} ${label}(s) selected` : `Select ${label.toLowerCase()}...`}
          onClick={openModal}
          readOnly
        />
        <button 
          className="btn-contributor-open" 
          type="button" 
          onClick={openModal}
          title="Select contributors"
        >
          <i className="fa fa-search"></i>
        </button>
        <button 
          className="btn-contributor-add" 
          type="button" 
          onClick={openModal}
          title="Add contributors"
        >
          <i className="fa fa-plus"></i>
        </button>
      </div>

      {/* Selected Contributors Display */}
      {selectedItems && selectedItems.length > 0 && (
        <div className="selected-contributors-container">
          {selectedItems.map((item) => (
            <div key={item.id} className="contributor-chip-manager">
              <div className="contributor-info">
                <span className="contributor-name">{item.name}</span>
              </div>
              <input
                type="text"
                className="form-control contributor-name-input"
                placeholder="Enter Person Name"
                value={item.value || ''}
                onChange={(e) => updateContributorName(item.id, e.target.value)}
              />
              <button
                className="btn-remove-contributor"
                onClick={() => removeContributor(item.id)}
                title="Remove"
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-dialog-custom contributor-manager-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content-custom">
              <div className="modal-header-custom">
                <div className="modal-header-left">
                  <h5>Select {label}</h5>
                  {selectedInModal.length > 0 && (
                    <span className="selected-count-badge">{selectedInModal.length} selected</span>
                  )}
                </div>
                <button 
                  type="button" 
                  className="close-button" 
                  onClick={closeModal}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body-custom">
                {/* Available Items List */}
                {availableItems.length > 0 ? (
                  <div className="contributor-items-list">
                    <ul>
                      {availableItems.map((item) => {
                        const isSelected = selectedInModal.some(i => i.id === item.id);
                        return (
                          <li
                            key={item.id}
                            onClick={() => toggleSelection(item)}
                            className={isSelected ? 'selected' : ''}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelection(item)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span>{item.name}</span>
                            {isSelected && (
                              <div className="person-name-input-wrapper">
                                <input
                                  type="text"
                                  className="form-control person-name-input"
                                  placeholder="Enter Person Name"
                                  value={personNames[item.id] || ''}
                                  onChange={(e) => updatePersonName(item.id, e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            )}
                            {isSelected && (
                              <i className="fa fa-check-circle check-icon"></i>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <div className="no-items-message">
                    <i className="fa fa-info-circle"></i>
                    <p>All {label.toLowerCase()}s have been added</p>
                  </div>
                )}
              </div>
              <div className="modal-footer-custom contributor-modal-footer">
                <button
                  className="btn-cancel-contributor"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="btn-add-selected"
                  onClick={addSelectedContributors}
                  disabled={selectedInModal.length === 0}
                >
                  <i className="fa fa-check"></i> Add Selected ({selectedInModal.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

