import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { base } from '../../Constants/Data.constant';
import { getData, postData } from '../../Services/Ops';
import { showSuccess, showError } from '../../Utils/Notification';

export default function ContributorSelector(props) {
  const { 
    contributors = [], 
    setContributors, 
    placeholder = "Select or add contributor...",
    isIPRS = false,
    label = "Contributor"
  } = props;

  // Normalize contributors format (handle both {value: ''} and {id, name, iprs} formats)
  const normalizeContributors = (contribs) => {
    if (!Array.isArray(contribs)) return [];
    return contribs.map((contrib, index) => {
      if (contrib.value !== undefined) {
        // Old format: {value: ''}
        return {
          id: contrib.id || index,
          name: contrib.value || contrib.name || '',
          iprs: contrib.iprs || ''
        };
      }
      // New format: {id, name, iprs}
      return {
        id: contrib.id || index,
        name: contrib.name || contrib.value || '',
        iprs: contrib.iprs || ''
      };
    }).filter(c => c.name || c.id); // Remove empty entries
  };

  const normalizedContributors = normalizeContributors(contributors);

  const [query, setQuery] = useState("");
  const [contributorList, setContributorList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newContributorName, setNewContributorName] = useState("");
  const [newIPRS, setNewIPRS] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editName, setEditName] = useState("");
  const [editIPRS, setEditIPRS] = useState("");
  const [selectedInModal, setSelectedInModal] = useState([]); // Temporary selection in modal
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchContributorList();
  }, []);

  const fetchContributorList = async () => {
    try {
      let result = await getData(base.artistList);
      if (result.status === true) {
        setContributorList(result.data);
      }
    } catch (error) {
      console.error("Error fetching contributor list:", error);
    }
  };

  const filteredContributors = contributorList.filter(contributor =>
    contributor.name.toLowerCase().includes(query.toLowerCase())
  );

  // Toggle selection in modal
  const toggleSelection = (contributor) => {
    const contributorId = contributor._id || contributor.id;
    if (selectedInModal.some(c => (c._id || c.id) === contributorId)) {
      // Deselect
      setSelectedInModal(selectedInModal.filter(c => (c._id || c.id) !== contributorId));
    } else {
      // Select
      setSelectedInModal([...selectedInModal, contributor]);
    }
  };

  // Check if contributor is selected in modal
  const isSelectedInModal = (contributor) => {
    const contributorId = contributor._id || contributor.id;
    return selectedInModal.some(c => (c._id || c.id) === contributorId);
  };

  // Add all selected contributors from modal
  const addSelectedContributors = () => {
    if (selectedInModal.length === 0) {
      showError("Please select at least one contributor", "No Selection");
      return;
    }

    const newContributors = selectedInModal.map(contributor => ({
      id: contributor._id || contributor.id || Date.now(),
      name: contributor.name,
      iprs: isIPRS ? "" : undefined
    }));

    // Filter out duplicates
    const existingIds = normalizedContributors.map(c => c.id);
    const uniqueNewContributors = newContributors.filter(c => !existingIds.includes(c.id));

    if (uniqueNewContributors.length > 0) {
      const updatedContributors = [...normalizedContributors, ...uniqueNewContributors];
      setContributors(updatedContributors);
      setSelectedInModal([]);
      setQuery("");
      setShowModal(false);
      showSuccess(`${uniqueNewContributors.length} contributor(s) added successfully`, "Success");
    } else {
      showError("All selected contributors are already added", "Duplicate");
    }
  };

  // Reset modal state when opening
  const openModal = () => {
    setShowModal(true);
    setSelectedInModal([]);
    setQuery("");
    setShowAddForm(false);
  };

  const removeContributor = (index) => {
    const updatedContributors = normalizedContributors.filter((_, i) => i !== index);
    setContributors(updatedContributors);
  };

  const addNewContributor = async () => {
    if (!newContributorName.trim()) {
      showError("Contributor name cannot be empty", "Error");
      return;
    }

    try {
      const body = {
        name: newContributorName,
        linkId: "",
        itunesLinkId: ""
      };
      
      const result = await postData(base.addArtist, body);
      if (result.data.status === true) {
        showSuccess("Contributor added successfully", "Success");
        fetchContributorList();
        
        const newContributor = {
          id: result.data.data._id,
          name: newContributorName,
          iprs: isIPRS ? newIPRS : undefined
        };
        
        // Add to selected in modal so user can add it with others
        setSelectedInModal([...selectedInModal, {
          _id: result.data.data._id,
          name: newContributorName
        }]);
        
        setNewContributorName("");
        setNewIPRS("");
        setQuery("");
        setShowAddForm(false);
      } else {
        showError(result.message || "Failed to add contributor", "Error");
      }
    } catch (error) {
      console.error("Error adding contributor:", error);
      showError("Failed to add contributor", "Error");
    }
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditName(normalizedContributors[index].name || "");
    setEditIPRS(normalizedContributors[index].iprs || "");
  };

  const saveEdit = (index) => {
    const updatedContributors = [...normalizedContributors];
    updatedContributors[index].name = editName;
    if (isIPRS) {
      updatedContributors[index].iprs = editIPRS;
    }
    setContributors(updatedContributors);
    setEditingIndex(null);
    setEditName("");
    setEditIPRS("");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditName("");
    setEditIPRS("");
  };

  const updateIPRS = (index, value) => {
    const updatedContributors = [...normalizedContributors];
    updatedContributors[index].iprs = value;
    setContributors(updatedContributors);
  };

  return (
    <div className="contributor-selector-container">
      {/* Input Field */}
      <div className="contributor-input-wrapper">
        <input
          type="text"
          className="form-control contributor-input"
          placeholder={placeholder}
          value={normalizedContributors.length > 0 ? `${normalizedContributors.length} ${label}(s) selected` : placeholder}
          onChange={(e) => setQuery(e.target.value)}
          onClick={openModal}
          readOnly
        />
        <button 
          className="btn-contributor-open" 
          type="button" 
          onClick={openModal}
          title="Search and select"
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
      {normalizedContributors && normalizedContributors.length > 0 && (
        <div className="selected-contributors-container">
          {normalizedContributors.map((contributor, index) => (
            <div key={index} className="contributor-chip">
              {editingIndex === index ? (
                <div className="contributor-edit-form">
                  <input
                    type="text"
                    className="form-control contributor-edit-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Name"
                  />
                  {isIPRS && (
                    <input
                      type="text"
                      className="form-control contributor-edit-input"
                      value={editIPRS}
                      onChange={(e) => setEditIPRS(e.target.value)}
                      placeholder="IPRS NO"
                    />
                  )}
                  <button
                    className="btn-save-edit"
                    onClick={() => saveEdit(index)}
                    title="Save"
                  >
                    <i className="fa fa-check"></i>
                  </button>
                  <button
                    className="btn-cancel-edit"
                    onClick={cancelEdit}
                    title="Cancel"
                  >
                    <i className="fa fa-times"></i>
                  </button>
                </div>
              ) : (
                <>
                  <div className="contributor-info">
                    <span className="contributor-name">{contributor.name || contributor.value || 'Unnamed'}</span>
                    {isIPRS && contributor.iprs && (
                      <span className="contributor-iprs">IPRS: {contributor.iprs}</span>
                    )}
                  </div>
                  <div className="contributor-actions">
                    <button
                      className="btn-edit-contributor"
                      onClick={() => startEdit(index)}
                      title="Edit"
                    >
                      <i className="fa fa-edit"></i>
                    </button>
                    <button
                      className="btn-remove-contributor"
                      onClick={() => removeContributor(index)}
                      title="Remove"
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-dialog-custom contributor-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content-custom">
              <div className="modal-header-custom">
                <div className="modal-header-left">
                  <h5>Select or Add {label}</h5>
                  {selectedInModal.length > 0 && (
                    <span className="selected-count-badge">{selectedInModal.length} selected</span>
                  )}
                </div>
                <button 
                  type="button" 
                  className="close-button" 
                  onClick={() => setShowModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body-custom">
                {/* Tabs */}
                <div className="contributor-modal-tabs">
                  <button
                    className={`tab-button ${!showAddForm ? 'active' : ''}`}
                    onClick={() => setShowAddForm(false)}
                  >
                    <i className="fa fa-search"></i> Search
                  </button>
                  <button
                    className={`tab-button ${showAddForm ? 'active' : ''}`}
                    onClick={() => setShowAddForm(true)}
                  >
                    <i className="fa fa-plus"></i> Add New
                  </button>
                </div>

                {!showAddForm ? (
                  <>
                    {/* Search Input */}
                    <div className="search-input-wrapper">
                      <input
                        className="form-control"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={`Search for ${label.toLowerCase()}...`}
                        autoFocus
                      />
                      <i className="fa fa-search search-icon"></i>
                    </div>

                    {/* Search Results */}
                    {query ? (
                      <div className="search-results-dropdown contributor-results">
                        {filteredContributors.length > 0 ? (
                          <ul>
                            {filteredContributors.map((contributor) => {
                              const isAlreadyAdded = normalizedContributors.some(c => c.id === contributor._id);
                              const isSelected = isSelectedInModal(contributor);
                              return (
                                <li
                                  key={contributor._id}
                                  onClick={() => !isAlreadyAdded && toggleSelection(contributor)}
                                  className={`${isSelected ? 'selected' : ''} ${isAlreadyAdded ? 'already-added' : ''}`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => !isAlreadyAdded && toggleSelection(contributor)}
                                    disabled={isAlreadyAdded}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <span>{contributor.name}</span>
                                  {isAlreadyAdded && (
                                    <span className="already-added-badge">Already Added</span>
                                  )}
                                  {isSelected && !isAlreadyAdded && (
                                    <i className="fa fa-check-circle check-icon"></i>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <div className="no-results">
                            <i className="fa fa-search"></i>
                            <p>No results found</p>
                            <button
                              className="btn-switch-to-add"
                              onClick={() => setShowAddForm(true)}
                            >
                              Add New {label}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="contributor-instructions">
                        <i className="fa fa-info-circle"></i>
                        <p>Type to search for existing {label.toLowerCase()}s</p>
                        <p className="instruction-hint">Select multiple items, then click "Add Selected"</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="add-contributor-form">
                    <h4>Add New {label}</h4>
                    <div className="form-input">
                      <label>{label} Name *</label>
                      <input
                        className="form-control"
                        type="text"
                        value={newContributorName}
                        onChange={(e) => setNewContributorName(e.target.value)}
                        placeholder={`Enter ${label.toLowerCase()} name...`}
                        autoFocus
                      />
                    </div>
                    {isIPRS && (
                      <div className="form-input">
                        <label>IPRS NO</label>
                        <input
                          className="form-control"
                          type="text"
                          value={newIPRS}
                          onChange={(e) => setNewIPRS(e.target.value)}
                          placeholder="Enter IPRS number (optional)..."
                        />
                      </div>
                    )}
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={addNewContributor}
                    >
                      <i className="fa fa-plus"></i> Add {label}
                    </button>
                    <p className="add-form-hint">After adding, it will be selected. Click "Add Selected" to add all.</p>
                  </div>
                )}
              </div>
              <div className="modal-footer-custom contributor-modal-footer">
                <button
                  className="btn-cancel-contributor"
                  onClick={() => setShowModal(false)}
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

