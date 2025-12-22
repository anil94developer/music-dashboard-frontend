import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { images } from '../../assets/images';
import { base } from '../../Constants/Data.constant';
import { getData, postData } from '../../Services/Ops';
import { useUserProfile } from '../../Context/UserProfileContext';
import { showSuccess, showError } from '../../Utils/Notification';

export default function SearchInput(props) {
  const { artistData = [], setSelectData } = props;
  const [query, setQuery] = useState("");
  const { userPermission, userProfile } = useUserProfile()
  const [artistList, setArtistList] = useState([]);
  const [link, setLink] = useState("");
  const [itunesLinkId, setItunesLinkId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [selectedArtists, setSelectedArtists] = useState(Array.isArray(artistData) ? artistData : []);

  // Fetch artist list once on component mount
  useEffect(() => {
    fetchArtistList();
  }, []);

  // Update selected artists when artistData prop changes
  useEffect(() => {
    if (Array.isArray(artistData)) {
      setSelectedArtists(artistData);
    }
  }, [artistData]);

  const addArtist = (artist) => {
    // Prevent duplicate artist entries
    if (!selectedArtists.some(item => item._id === artist._id)) {
      const updatedArtists = [...selectedArtists, artist];
      console.log("updatedArtists-----", updatedArtists)
      setSelectedArtists(updatedArtists);
      setSelectData(updatedArtists);  // Update parent component
    }

    setQuery("");
    setLink("");
    setItunesLinkId("")
  };

  const removeArtist = (artistId) => {
    const updatedArtists = selectedArtists.filter(artist => artist._id !== artistId);
    setSelectedArtists(updatedArtists);
    setSelectData(updatedArtists);  // Update parent component
  };

  const filteredArtists = artistList.filter(artist =>
    artist.name.toLowerCase().includes(query.toLowerCase())
  );

  const addHandleSubmit = async () => {
    if (!query.trim()) {
      showError("Please enter artist name", "Validation Error");
      return;
    }

    let body = { name: query, linkId: link, itunesLinkId: itunesLinkId };
    let result = await postData(base.addArtist, body);
    console.log("artiest result======", result)

    if (result.data.status === true) {
      showSuccess(result.message, "Success");
      fetchArtistList();
      setQuery("");
      setLink("");
      setItunesLinkId("");
      setShowAddForm(false);
      addArtist(result.data.data);
    } else {
      showError(result.message, "Error");
    }
  }

  const handleOpenModal = () => {
    setShowModal(true);
    setQuery("");
    setShowAddForm(false);
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setQuery("");
    setLink("");
    setItunesLinkId("");
    setShowAddForm(false);
  }

  const fetchArtistList = async () => {
    let result = await getData(base.fetchArtistList);
    if (result.status === true) {
      setArtistList(result.data);
    } else {
      Swal.fire("Error", "Failed to fetch artist list", "error");
    }
  }

  return (
    <div className="artist-selector-container">
      {/* Selected Artists Display */}
      <div className="selected-artists-display">
        {selectedArtists.length > 0 ? (
          selectedArtists.map((artist) => (
            <div key={artist._id} className="selected-artist-chip">
              <div className="artist-chip-content">
                <img src={images.user} className="artist-chip-img" alt={artist.name} />
                <span className="artist-chip-name">{artist.name}</span>
                {artist.linkId && (
                  <a href={artist.linkId} target="_blank" rel="noopener noreferrer" className="artist-link">
                    <img src='https://static.believedigital.com/images/logos/stores/204.svg' height="16" width="16" alt="Spotify" />
                  </a>
                )}
                {artist.itunesLinkId && (
                  <a href={artist.itunesLinkId} target="_blank" rel="noopener noreferrer" className="artist-link">
                    <img src='https://static.believedigital.com/images/logos/stores/408.svg' height="16" width="16" alt="iTunes" />
                  </a>
                )}
                <button 
                  className="artist-chip-remove" 
                  onClick={() => removeArtist(artist._id)}
                  title="Remove artist"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-artist-selected">No artist selected</div>
        )}
      </div>

      {/* Open Modal Button */}
      <button 
        type="button" 
        className="btn btn-primary open-artist-modal-btn" 
        onClick={handleOpenModal}
      >
        <i className="fa fa-plus"></i> {selectedArtists.length > 0 ? 'Add More Artists' : 'Select Artist'}
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
              <div className="modal-content artist-modal-content">
                <div className="modal-header artist-modal-header">
                  <h4 className="modal-title">Select Primary Artist</h4>
                  <button 
                    type="button" 
                    className="btn-close-modal" 
                    onClick={handleCloseModal}
                    aria-label="Close"
                  >
                    <span>×</span>
                  </button>
                </div>
                <div className="modal-body artist-modal-body">
                  {/* Search Section */}
                  <div className="artist-search-section">
                    <div className="form-group">
                      <label>Search Artist</label>
                      <div className="search-input-wrapper">
                        <input 
                          className="form-control artist-search-input" 
                          type="text" 
                          value={query} 
                          onChange={(e) => {
                            setQuery(e.target.value);
                            setShowAddForm(false);
                          }} 
                          placeholder="Type to search for an artist..." 
                          autoFocus
                        />
                        <i className="fa fa-search search-icon"></i>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-outline-primary add-new-artist-btn"
                      onClick={() => {
                        setShowAddForm(true);
                        setQuery("");
                      }}
                    >
                      <i className="fa fa-plus"></i> Add New Artist
                    </button>
                  </div>

                  {/* Search Results or Add Form */}
                  {query && !showAddForm && (
                    <div className="artist-results-section">
                      {filteredArtists.length > 0 ? (
                        <div className="artist-results-list">
                          <h5 className="results-title">Search Results</h5>
                          {filteredArtists.map((artist) => (
                            <div 
                              key={artist._id} 
                              className="artist-result-item"
                              onClick={() => {
                                addArtist(artist);
                                setQuery("");
                              }}
                            >
                              <div className="artist-result-info">
                                <img src={images.user} className="artist-result-img" alt={artist.name} />
                                <span className="artist-result-name">{artist.name}</span>
                              </div>
                              <div className="artist-result-links">
                                {artist.linkId && (
                                  <a href={artist.linkId} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                    <img src='https://static.believedigital.com/images/logos/stores/204.svg' height="20" width="20" alt="Spotify" />
                                  </a>
                                )}
                                {artist.itunesLinkId && (
                                  <a href={artist.itunesLinkId} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                    <img src='https://static.believedigital.com/images/logos/stores/408.svg' height="20" width="20" alt="iTunes" />
                                  </a>
                                )}
                                <i className="fa fa-plus add-icon"></i>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : query.length > 0 && (
                        <div className="no-results-message">
                          <p>No artist found. Click "Add New Artist" to create one.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Add New Artist Form */}
                  {showAddForm && (
                    <div className="add-artist-form-section">
                      <h5 className="form-section-title">Add New Artist</h5>
                      <div className="form-group">
                        <label>Artist Name <span className="required-star">*</span></label>
                        <input
                          className="form-control"
                          type="text"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Enter artist name..."
                          autoFocus
                        />
                      </div>
                      <div className="form-group">
                        <label>Spotify Link ID</label>
                        <input
                          className="form-control"
                          type="text"
                          value={link}
                          onChange={(e) => setLink(e.target.value)}
                          placeholder="Add Spotify Link ID (optional)..."
                        />
                      </div>
                      <div className="form-group">
                        <label>iTunes Link ID</label>
                        <input
                          className="form-control"
                          type="text"
                          value={itunesLinkId}
                          onChange={(e) => setItunesLinkId(e.target.value)}
                          placeholder="Add iTunes Link ID (optional)..."
                        />
                      </div>
                      <div className="form-actions">
                        <button
                          className="btn btn-secondary"
                          type="button"
                          onClick={() => {
                            setShowAddForm(false);
                            setQuery("");
                            setLink("");
                            setItunesLinkId("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={addHandleSubmit}
                        >
                          <i className="fa fa-check"></i> Add Artist
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Selected Artists in Modal */}
                  {selectedArtists.length > 0 && (
                    <div className="selected-artists-modal-section">
                      <h5 className="selected-title">Selected Artists ({selectedArtists.length})</h5>
                      <div className="selected-artists-list">
                        {selectedArtists.map((artist) => (
                          <div key={artist._id} className="selected-artist-modal-item">
                            <div className="selected-artist-info">
                              <img src={images.user} className="selected-artist-img" alt={artist.name} />
                              <span>{artist.name}</span>
                            </div>
                            <div className="selected-artist-actions">
                              {artist.linkId && (
                                <a href={artist.linkId} target="_blank" rel="noopener noreferrer">
                                  <img src='https://static.believedigital.com/images/logos/stores/204.svg' height="18" width="18" alt="Spotify" />
                                </a>
                              )}
                              {artist.itunesLinkId && (
                                <a href={artist.itunesLinkId} target="_blank" rel="noopener noreferrer">
                                  <img src='https://static.believedigital.com/images/logos/stores/408.svg' height="18" width="18" alt="iTunes" />
                                </a>
                              )}
                              <button 
                                className="btn-remove-artist"
                                onClick={() => removeArtist(artist._id)}
                                title="Remove"
                              >
                                <i className="fa fa-times"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer artist-modal-footer">
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
