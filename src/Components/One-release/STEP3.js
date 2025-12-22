import React, { useState, useEffect } from 'react'
import Step3Controller from '../../Controllers/One-release-controller/Step3Controller'
import ARTISTLIST from '../../Enums/artist.list.json';
import DynamicInputList from '../Common/DynamicInputList';
import SearchInput from '../Common/SearchBox';
import ContributorSelector from '../Common/ContributorSelector';
import ContributorManager from '../Common/ContributorManager';
import GENRES from '../../Enums/genres.json';
import language from '../../Enums/language.json'

export default function STEP3(props) {
  const { releaseData, fetchReleaseDetails, setErrors } = props
  
  // Get uploaded files from step2 - these will be the volume options
  const uploadedFiles = releaseData?.step2 || [];
  
  // Create volume options directly from uploaded files
  // Each file becomes a volume option
  const availableVolumes = uploadedFiles.map((file, index) => ({
    value: `Volume${index + 1}`,
    label: file.fileName || `File ${index + 1}`,
    fileName: file.fileName,
    fileId: file._id,
    fileType: file.fileType || 'Audio',
    fileData: file.fileData
  }));
  const {
    localErrors,
    handleDeleteFile,
    contentType,
    setContentType,
    primaryTrackType,
    setPrimaryTrackType,
    secondaryTrackType,
    setSecondaryTrackType,
    instrumental,
    setInstrumental,
    title,
    setTitle,
    versionSubtitle,
    setVersionSubtitle,
    primaryArtist,
    setPrimaryArtist,
    featuring,
    setFeaturing,
    remixer,
    setRemixer,
    author,
    setAuthor,
    composer,
    setComposer,
    arranger,
    setArranger,
    producer,
    setProducer,
    pLine,
    setPLine,
    pYear,
    setPYear,
    cLine,
    setCLine,
    cYear,
    setCYear,
    productionYear,
    setProductionYear,
    publisher,
    setPublisher,
    isrc,
    setIsrc,
    generateISRC,
    setGenerateISRC,
    genre,
    setGenre,
    subgenre,
    setSubgenre,
    secondaryGenre,
    setSecondaryGenre,
    subSecondaryGenre,
    setSubSecondaryGenre,
    price,
    setPrice,
    producerCatalogueNumber,
    setProducerCatalogueNumber,
    parentalAdvisory,
    setParentalAdvisory,
    previewStart,
    setPreviewStart,
    trackTitleLanguage,
    setTrackTitleLanguage,
    lyricsLanguage,
    setLyricsLanguage,
    lyrics,
    setLyrics,
    step3, setStep3,
    handleSubmit,
    setReleaseData,
    btnName, setBtnName, setRowId,
    rowId,
    volume, setVolume,
    selectContributory, setSelectContributory,
    otherContributory, setOtherContributory,
    mood,
    setMood,
    isModalOpen, setIsModalOpen
  } = Step3Controller()


  const initialStoreList = [
    { id: '1', name: 'Mixing Eng', value: '' },
    { id: '2', name: 'Add Engineer', value: '' },
  ];
  const initialOtherContributoryList = [
    { id: '1', name: 'Acoustic Guitar', value: '' },
    { id: '2', name: 'Keyboard', value: '' },
    { id: '3', name: 'Bass', value: '' },
    { id: '4', name: 'Drum', value: '' },
    { id: '5', name: 'Flute', value: '' },
    { id: '6', name: 'Saxophone', value: '' }
  ];


  const [contributoryName, setContributoryName] = useState(initialStoreList);

  // Handle selection of a contributor
  const contributorySelect = (id) => {
    const selectedItem = contributoryName?.find((item) => item.id === id);
    if (selectedItem && !selectContributory?.some((item) => item.id === id)) {
      setSelectContributory([...selectContributory, selectedItem]);
      setContributoryName(contributoryName?.filter((item) => item.id !== id));
    }
  };

  // Handle changes to a specific contributor's value
  const handlecontributoryChange = (id, val) => {
    setSelectContributory((prevContributors) =>
      prevContributors?.map((item) =>
        item.id === id ? { ...item, value: val } : item
      )
    );
  };

  // Remove a contributor from the selected list
  const removeContributory = (id) => {
    const removedContributor = selectContributory.find((item) => item.id === id);
    if (removedContributor) {
      setContributoryName([...contributoryName, removedContributor]);
      setSelectContributory(selectContributory.filter((item) => item.id !== id));
    }
  };



  const [othersContributoryName, setothersContributoryName] = useState(initialOtherContributoryList);

  // Handle selection of a contributor
  const otherscontributorySelect = (id) => {
    const selectedItem = othersContributoryName?.find((item) => item.id === id);
    if (selectedItem && !otherContributory?.some((item) => item.id === id)) {
      setOtherContributory([...otherContributory, selectedItem]);
      setothersContributoryName(othersContributoryName?.filter((item) => item.id !== id));
    }
  };

  // Handle changes to a specific contributor's value
  const handleOthersContributoryChange = (id, val) => {
    setOtherContributory((prevContributors) =>
      prevContributors?.map((item) =>
        item.id === id ? { ...item, value: val } : item
      )
    );
  };

  // Remove a contributor from the selected list
  const removeOthersContributory = (id) => {
    const removedContributor = otherContributory.find((item) => item.id === id);
    if (removedContributor) {
      setothersContributoryName([...othersContributoryName, removedContributor]);
      setOtherContributory(otherContributory.filter((item) => item.id !== id));
    }
  };





  // State to manage the modal visibility
  // Function to open the modal
  const openModal = () => {
    setBtnName("Add");
    setIsModalOpen(true)
    setRowId("")
    console.log("")
    setContentType("");
    setPrimaryTrackType("");
    setSecondaryTrackType("");
    setInstrumental(false);
    setTitle("");
    setVersionSubtitle("");
    setPrimaryArtist("");
    setFeaturing("");
    setRemixer([{ value: '' }]);
    setAuthor([{ value: '' }]);
    setComposer([{ value: '' }]);
    setArranger([{ value: '' }]);
    setProducer([{ value: '' }]);
    setPLine("");
    setProductionYear("");
    setPublisher([{ value: '' }]);
    setIsrc("");
    setGenerateISRC(false);
    setGenre("");
    setSubgenre("");
    setSecondaryGenre("");
    setSubSecondaryGenre("");
    setPrice("");
    setProducerCatalogueNumber("");
    setParentalAdvisory("");
    setPreviewStart("");
    setTrackTitleLanguage("");
    setLyricsLanguage("");
    setLyrics("");
    setVolume("");
    setSelectContributory([]);
    setSelectContributory([]);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };
  
  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    // Restore body scroll when modal is closed
    document.body.style.overflow = 'auto';
  };
  useEffect(() => {
    const getData = async () => {
      setStep3(releaseData.step3);
      setReleaseData(releaseData)
      // alert(releaseData.step1.format)
      if (releaseData?.step1?.format == "SINGLE") {
        setTitle(releaseData.title || "");
        setVersionSubtitle(releaseData.step1.subTitle || "");
        setContentType(releaseData.type);
        setPrimaryArtist(releaseData.step1.primaryArtist)
        setFeaturing(releaseData.step1.featuring);
      }

    }
    getData()
  }, [releaseData.step3])
  useEffect(() => {
    fetchReleaseDetails(releaseData._id)
  }, [isModalOpen])

  // Update volumes when uploaded files change
  useEffect(() => {
    // This will trigger re-render when releaseData.step2 changes
  }, [releaseData?.step2])
  // Helper function to normalize contributor data
  const normalizeContributorData = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map((item, index) => {
      if (item.value !== undefined) {
        return {
          id: item.id || index,
          name: item.value || item.name || '',
          iprs: item.iprs || ''
        };
      }
      return {
        id: item.id || index,
        name: item.name || item.value || '',
        iprs: item.iprs || ''
      };
    }).filter(c => c.name || c.id);
  };

  const editTracks = (item) => {
    console.log(item)
    setBtnName("Edit")
    setRowId(item._id)
    setIsModalOpen(true)
    console.log(item)
    setContentType(item.ContentType || "audio");
    setPrimaryTrackType(item.PrimaryTrackType || "music");
    setSecondaryTrackType(item.SecondaryTrackType || "original");
    setInstrumental(item.Instrumental || false);
    setTitle(item.Title || "");
    setVersionSubtitle(item.VersionSubtitle || "");
    setPrimaryArtist(item.PrimaryArtist || "");
    setFeaturing(item.Featuring || "");
    setRemixer(normalizeContributorData(item.Remixer || []));
    setAuthor(normalizeContributorData(item.Author || []));
    setComposer(normalizeContributorData(item.Composer || []));
    setArranger(normalizeContributorData(item.Arranger || []));
    setProducer(normalizeContributorData(item.Producer || []));
    setPLine(item.Pline || "");
    setProductionYear(item.ProductionYear || "");
    setPublisher(normalizeContributorData(item.Publisher || []));
    setIsrc(item.ISRC || "");
    setGenerateISRC(item.GenerateISRC || false);
    setGenre(item.Genre || "");
    setSubgenre(item.Subgenre || "");
    setSecondaryGenre(item.SecondaryGenre || "");
    setSubSecondaryGenre(item.SubSecondaryGenre || "");
    setPrice(item.Price || "");
    setProducerCatalogueNumber(item.ProducerCatalogueNumber || "");
    setParentalAdvisory(item.ParentalAdvisory || "");
    setPreviewStart(item.PreviewStart || "");
    setTrackTitleLanguage(item.TrackTitleLanguage || "");
    setLyricsLanguage(item.LyricsLanguage || "");
    setLyrics(item.Lyrics || "");
    setVolume(item.Volume || "");
    setSelectContributory(item.selectContributory || [])
    setOtherContributory(item.otherContributory || [])
    setMood(item?.mood)
    setCLine(item?.cLine)
    setCYear(item?.cYear)
    setPYear(item?.pYear)
  }
  const [incrementalValue, setIncrementalValue] = useState(1);


  // useEffect to set ISRC when generateISRC is true
  useEffect(() => {
    if (generateISRC) {
      setIsrc("");
    }
  }, [generateISRC]);
  const selectedGenre = GENRES.find((g) => g.name === genre);
  const subgenres = selectedGenre ? selectedGenre.subgenres : [];
  return (
    <div className="step3-container">
      {/* Header Section */}
      <div className="step3-header">
        <div className="header-content">
          <div className="header-left">
            <i className="fa fa-music"></i>
            <h2>Tracks</h2>
            {step3 && step3.length > 0 && (
              <span className="track-count-badge">{step3.length} {step3.length === 1 ? 'track' : 'tracks'}</span>
            )}
          </div>
          <button onClick={openModal} className="btn-add-track">
            <i className="fa fa-plus"></i> Add Track
          </button>
        </div>
      </div>

      {/* Tracks Table Section */}
      <div className="tracks-table-card">
        {step3 && step3.length > 0 ? (
          <div className="tracks-table-wrapper">
            <table className="tracks-table">
              <thead>
                <tr>
                  <th>Volume</th>
                  <th>Content Type</th>
                  <th>Primary Track Type</th>
                  <th>Secondary Track Type</th>
                  <th>Title</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {step3.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <span className="volume-badge">{item.Volume}</span>
                    </td>
                    <td>
                      <span className="content-type-badge">{item.ContentType}</span>
                    </td>
                    <td>
                      <span className="track-type-badge">{item.PrimaryTrackType}</span>
                    </td>
                    <td>
                      <span className="track-type-badge secondary">{item.SecondaryTrackType}</span>
                    </td>
                    <td>
                      <div className="track-title-cell">
                        <i className="fa fa-music"></i>
                        <span>{item.Title}</span>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-edit-track" 
                          onClick={() => { editTracks(item) }}
                          title="Edit track"
                        >
                          <i className="fa fa-edit"></i> Edit
                        </button>
                        <button 
                          className="btn-delete-track" 
                          onClick={() => handleDeleteFile(item._id)}
                          title="Delete track"
                        >
                          <i className="fa fa-trash"></i> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-tracks-message">
            <i className="fa fa-music"></i>
            <p>No tracks added yet</p>
            <span>Click "Add Track" to create your first track</span>
            <button onClick={openModal} className="btn-add-first-track">
              <i className="fa fa-plus"></i> Add Your First Track
            </button>
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="track-modal-overlay" onClick={closeModal}>
          <div className="track-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="track-modal-content">
              {/* Modal Header */}
              <div className="track-modal-header">
                <div className="modal-header-left">
                  <i className="fa fa-music"></i>
                  <h4 className="modal-title">{btnName === "Edit" ? "Edit Track" : "Add New Track"}</h4>
                </div>
                <button 
                  type="button" 
                  className="modal-close-btn" 
                  onClick={closeModal} 
                  aria-label="Close"
                >
                  <i className="fa fa-times"></i>
                </button>
              </div>

              {/* Modal Body */}
              <div className="track-modal-body">
                {/* Basic Information Section */}
                <div className="form-section">
                  <div className="section-header">
                    <i className="fa fa-info-circle"></i>
                    <h5>Basic Information</h5>
                  </div>
                  <div className="section-content">
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Content Type {contentType} *</label>
                        <input type="radio" value="Audio" checked={contentType == "Audio"} onChange={() => setContentType("Audio")} /> Audio
                        {/* <input type="radio" value="Video" checked={contentType == "Video"} onChange={() => setContentType("Video")} style={{ marginLeft: "10px" }} /> Video */}
                      </div>
                      {localErrors?.['contentType'] && (
                      <span className="text-danger">{localErrors['contentType']}</span>
                       )}
                    </div>
                    {/* Primary Track Type */}
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>Primary Track Type *</label>
                        <input type="radio" value="music" checked={primaryTrackType === "music"} onChange={() => setPrimaryTrackType("music")} /> Music
                      </div>
                      {localErrors?.['primaryTrackType'] && (
                      <span className="text-danger">{localErrors['primaryTrackType']}</span>
                       )}
                    </div>
                    {/* Secondary Track Type */}
                    
                    <div className="col-lg-4 col-md-6">
                      <div className="form-group">
                        <label>Secondary Track Type *</label>
                        <input type="radio" value="original" checked={secondaryTrackType === "original"} onChange={() => setSecondaryTrackType("original")} /> Original
                        <input type="radio" value="karaoke" checked={secondaryTrackType === "karaoke"} onChange={() => setSecondaryTrackType("karaoke")} style={{ marginLeft: "10px" }} /> Karaoke
                        <input type="radio" value="medley" checked={secondaryTrackType === "medley"} onChange={() => setSecondaryTrackType("medley")} style={{ marginLeft: "10px" }} /> Medley
                        <input type="radio" value="cover" checked={secondaryTrackType === "cover"} onChange={() => setSecondaryTrackType("cover")} style={{ marginLeft: "10px" }} /> Cover
                      </div>
                      {localErrors?.['secondaryTrackType'] && (
                      <span className="text-danger">{localErrors['secondaryTrackType']}</span>
                       )}
                    </div>

                    {/* Instrumental */}
                    <div className="col-lg-2 col-md-6">
                      <div className="form-group">
                        <label>Instrumental *</label>
                        <input type="radio" value={true} checked={instrumental === true} onChange={() => setInstrumental(true)} /> Yes
                        <input type="radio" value={false} checked={instrumental === false} onChange={() => setInstrumental(false)} style={{ marginLeft: "10px" }} /> No
                      </div>
                      {localErrors?.['instrumental'] && (
                      <span className="text-danger">{localErrors['instrumental']}</span>
                       )}
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>Volume *</label>
                        <div className="volume-dropdown-container">
                          <select 
                            className="form-select form-control volume-select" 
                            value={volume} 
                            onChange={(e) => setVolume(e.target.value)}
                            disabled={uploadedFiles.length === 0}
                          >
                            <option value="">
                              {uploadedFiles.length === 0 
                                ? '- No files uploaded -' 
                                : '- Select Uploaded File -'}
                            </option>
                            {availableVolumes.map((vol, index) => {
                              // Check if this volume is already used in other tracks (excluding current track being edited)
                              const isUsed = step3?.some(track => 
                                track.Volume === vol.value && track._id !== rowId
                              );
                              return (
                                <option 
                                  key={vol.fileId || index} 
                                  value={vol.value}
                                  disabled={isUsed && volume !== vol.value}
                                  title={`${vol.fileName} (${vol.fileType})`}
                                >
                                  {vol.label} {isUsed && volume !== vol.value ? ' (Used)' : ''}
                                </option>
                              );
                            })}
                          </select>
                          <i className="fa fa-chevron-down volume-dropdown-icon"></i>
                        </div>
                        {uploadedFiles.length === 0 && (
                          <small className="text-warning volume-info" style={{ display: 'block', marginTop: '5px' }}>
                            <i className="fa fa-exclamation-triangle"></i> Please upload media files in Step 2 first
                          </small>
                        )}
                        {uploadedFiles.length > 0 && (
                          <small className="text-success volume-info" style={{ display: 'block', marginTop: '5px' }}>
                            <i className="fa fa-check-circle"></i> {uploadedFiles.length} file(s) available for selection
                          </small>
                        )}
                        {localErrors?.['volume'] && (
                          <span className="text-danger">{localErrors['volume']}</span>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>Title *</label>
                        <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
                      </div>
                      {localErrors?.['title'] && (
                      <span className="text-danger">{localErrors['title']}</span>
                       )}
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>Version/Subtitle</label>
                        <input type="text" className="form-control" value={versionSubtitle} onChange={(e) => setVersionSubtitle(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>Primary Artist *</label>
                        <SearchInput artistData={primaryArtist} setSelectData={setPrimaryArtist} />
                      </div>
                      {localErrors?.['primaryArtist'] && (
                      <span className="text-danger">{localErrors['primaryArtist']}</span>
                       )}
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>Featuring</label>
                        <SearchInput artistData={featuring} setSelectData={setFeaturing} />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>Mood *</label>
                        <select className="form-select form-control" value={mood} onChange={(e) => setMood(e.target.value)}>
                          <option value="">- Select a mood -</option>
                          <option value={'Romantic'}>Romantic</option>
                          <option value={'Sad'}>Sad</option>
                          <option value={'Happy'}>Happy</option>
                          <option value={'Soulful'}>Soulful</option>
                          <option value={'Chill'}>Chill</option>
                          <option value={'Party'}>Party</option>
                          <option value={'Insirational'}>Insirational</option>


                        </select>
                      </div>
                      {localErrors?.['mood'] && (
                      <span className="text-danger">{localErrors['mood']}</span>
                       )}
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>Remixer</label>
                        <ContributorSelector 
                          contributors={remixer || []} 
                          setContributors={setRemixer} 
                          placeholder="Select or add remixer..."
                          isIPRS={false}
                          label="Remixer"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>Author *</label>
                        <ContributorSelector 
                          contributors={author || []} 
                          setContributors={setAuthor} 
                          placeholder="Select or add author..."
                          isIPRS={true}
                          label="Author"
                        />
                      </div>
                      {localErrors?.['author'] && (
                      <span className="text-danger">{localErrors['author']}</span>
                       )}
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>Composer *</label>
                        <ContributorSelector 
                          contributors={composer || []} 
                          setContributors={setComposer} 
                          placeholder="Select or add composer..."
                          isIPRS={true}
                          label="Composer"
                        />
                      </div>
                      {localErrors?.['composer'] && (
                      <span className="text-danger">{localErrors['composer']}</span>
                       )}
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>Arranger</label>
                        <ContributorSelector 
                          contributors={arranger || []} 
                          setContributors={setArranger} 
                          placeholder="Select or add arranger..."
                          isIPRS={true}
                          label="Arranger"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>Producer</label>
                        <ContributorSelector 
                          contributors={producer || []} 
                          setContributors={setProducer} 
                          placeholder="Select or add producer..."
                          isIPRS={true}
                          label="Producer"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>P Year *</label>
                        <select className="form-select form-control" value={pYear} onChange={(e) => setPYear(e.target.value)}>
                          <option value="">- Select a (P) year -</option>
                          {[...Array(100)].map((_, i) => (
                            <option key={i} value={2026 - i}>{2026 - i}</option>
                          ))}
                        </select>
                      </div>
                      {localErrors?.['pYear'] && (
                      <span className="text-danger">{localErrors['pYear']}</span>
                       )}
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>P Line *</label>
                        <input type="text" className="form-control" value={pLine} onChange={(e) => setPLine(e.target.value)} />
                      </div>
                      {localErrors?.['pLine'] && (
                      <span className="text-danger">{localErrors['pLine']}</span>
                       )}
                    </div>



                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>C Line *</label>
                        <input type="text" className="form-control" value={cLine} onChange={(e) => setCLine(e.target.value)} />
                      </div>
                      {localErrors?.['cLine'] && (
                      <span className="text-danger">{localErrors['cLine']}</span>
                       )}
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>C Year *</label>
                        <select className="form-select form-control" value={cYear} onChange={(e) => setCYear(e.target.value)}>
                          <option value="">- Select a (C) year -</option>
                          {[...Array(100)].map((_, i) => (
                            <option key={i} value={2026 - i}>{2026 - i}</option>
                          ))}
                        </select>
                      </div>
                      {localErrors?.['cYear'] && (
                      <span className="text-danger">{localErrors['cYear']}</span>
                       )}
                    </div>




                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>Production Year *</label>
                        <select className="form-select form-control" value={productionYear} onChange={(e) => setProductionYear(e.target.value)}>
                          <option value="">- Select a year -</option>
                          {[...Array(100)].map((_, i) => (
                            <option key={i} value={2026 - i}>{2026 - i}</option>
                          ))}
                        </select>
                      </div>
                      {localErrors?.['productionYear'] && (
                      <span className="text-danger">{localErrors['productionYear']}</span>
                       )}
                    </div>


                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>Publisher</label>
                        <ContributorSelector 
                          contributors={publisher || []} 
                          setContributors={setPublisher} 
                          placeholder="Select or add publisher..."
                          isIPRS={true}
                          label="Publisher"
                        />
                      </div>
                    </div>
                    {/* {!generateISRC &&
                      <div className="col-lg-3 col-md-6">
                        <div className="form-group">
                          <label>ISRC</label>
                          <input disabled={generateISRC} type="text" className="form-control" value={!generateISRC ? "" : isrc} onChange={(e) => setIsrc(e.target.value)} />
                        </div>
                      </div>
                    }
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>Generate ISRC</label>
                        <input type="radio" value={true} checked={generateISRC === true} onChange={() => setGenerateISRC(true)} /> Yes
                        <input type="radio" value={false} checked={generateISRC === false} onChange={() => setGenerateISRC(false)} style={{ marginLeft: "10px" }} /> No
                      </div>
                    </div> */}

                    {!generateISRC &&
                      <div className="col-lg-3 col-md-6">
                        <div className="form-group">
                          <label>ISRC *</label>
                          <input
                            type="text"
                            className="form-control"
                            disabled={generateISRC} // Disabled when "Auto Generate ISRC" is Yes
                            value={generateISRC ? "" : isrc} // Clear input when auto-generate is selected
                            onChange={(e) => setIsrc(e.target.value)}
                          />
                        </div>
                      </div>
                    }
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>Generate ISRC</label>
                        <input
                          type="radio"
                          value={true}
                          checked={generateISRC === true}
                          onChange={() => {
                            setGenerateISRC(true); // Enable auto-generate
                            // Clear manual input when auto-generate is selected
                          }}
                        />{" "}
                        Yes
                        <input
                          type="radio"
                          value={false}
                          checked={generateISRC === false}
                          onChange={() => {
                            setGenerateISRC(false)
                            setIsrc("");
                          }
                          } // Allow manual input
                          style={{ marginLeft: "10px" }}
                        />{" "}
                        No
                      </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label htmlFor="genre">Genre *</label>
                        <select
                          value={genre}
                          className="form-select form-control"
                          id="genre"
                          onChange={(e) => setGenre(e.target.value)}
                        >
                          <option value={genre}>{genre ? genre : 'Select a genre'}</option>
                          {GENRES.map((item) =>
                            (<option value={item.name}>{item.name}</option>)
                          )}
                        </select>
                      </div>
                      {localErrors?.['genre'] && (
                      <span className="text-danger">{localErrors['genre']}</span>
                       )}
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label htmlFor="subgenre">SubGenre * </label>
                        <input
                          value={subgenre}
                          type="text"
                          className="form-control"
                          id="subgenre"
                          placeholder="SubGenre"
                          onChange={(e) => setSubgenre(e.target.value)}
                        />
                        {/* <select
                          value={subgenre}
                          className="form-select form-control"
                          id="subgenre"
                          onChange={(e) => setSubgenre(e.target.value)}
                          disabled={!subgenres.length} // Disable if no subgenres available
                        >
                          <option value={subgenre}>{subgenre ? subgenre : 'Select a Subgenre'}</option>
                          {subgenres.map((sub) => (
                            <option key={sub.id} value={sub.name}>{sub.name}</option>
                          ))}
                        </select> */}
                      </div>
                      {localErrors?.['subgenre'] && (
                      <span className="text-danger">{localErrors['subgenre']}</span>
                       )}
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label htmlFor="genre">Secondary Genre *</label>
                        <select
                          value={secondaryGenre}
                          className="form-select form-control"
                          id="genre"
                          onChange={(e) => setSecondaryGenre(e.target.value)}
                        >
                          <option value={secondaryGenre}>{secondaryGenre ? secondaryGenre : 'Select a Secondary genre'}</option>
                          {GENRES.map((item) =>
                            (<option value={item.name}>{item.name}</option>)
                          )}
                        </select>
                      </div>
                      {localErrors?.['secondaryGenre'] && (
                      <span className="text-danger">{localErrors['secondaryGenre']}</span>
                       )}
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label htmlFor="subgenre">Secondary SubGenre * </label>
                        <input
                          value={subSecondaryGenre}
                          type="text"
                          className="form-control"
                          id="subgenre"
                          placeholder="Enter SubGenre"
                          onChange={(e) => setSubSecondaryGenre(e.target.value)}
                        />
                        {/* <select
                          value={subSecondaryGenre}
                          className="form-select form-control"
                          id="subgenre"
                          onChange={(e) => setSubSecondaryGenre(e.target.value)}
                          disabled={!subgenres.length} // Disable if no subgenres available
                        >
                          <option value={subSecondaryGenre}>{subSecondaryGenre ? subSecondaryGenre : 'Select a Secondary Subgenre'}</option>
                          {subgenres.map((sub) => (
                            <option key={sub.id} value={sub.name}>{sub.name}</option>
                          ))}
                        </select> */}
                      </div>
                      {localErrors?.['subSecondaryGenre'] && (
                      <span className="text-danger">{localErrors['subSecondaryGenre']}</span>
                       )}
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>Price *</label>
                        {/* <input type="text" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} /> */}
                        <select
                          value={price}
                          className="form-select form-control"
                          id="price"
                          onChange={(e) => setPrice(e.target.value)}
                        >
                          <option value="">Please select...</option>
                          <option selected="selected" value="Premium">Premium</option>
                          <option value="Full">Full</option>
                          <option value="Mid">Mid</option>
                          <option value="Budget">Budget</option>
                        </select>
                      </div>
                      {localErrors?.['price'] && (
                      <span className="text-danger">{localErrors['price']}</span>
                       )}
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>Parental Advisory *</label>
                        <input type="radio" value="yes" checked={parentalAdvisory === "yes"} onChange={() => setParentalAdvisory("yes")} /> Yes
                        <input type="radio" value="no" checked={parentalAdvisory === "no"} onChange={() => setParentalAdvisory("no")} style={{ marginLeft: "10px" }} /> No
                        <input type="radio" value="no" checked={parentalAdvisory === "Cleaned"} onChange={() => setParentalAdvisory("Cleaned")} style={{ marginLeft: "10px" }} /> Cleaned
                      </div>
                      {localErrors?.['parentalAdvisory'] && (
                      <span className="text-danger">{localErrors['parentalAdvisory']}</span>
                       )}
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>Preview start *</label>
                        <input type="text" className="form-control" value={previewStart} onChange={(e) => setPreviewStart(e.target.value)} />
                      </div>
                      {localErrors?.['previewStart'] && (
                      <span className="text-danger">{localErrors['previewStart']}</span>
                       )}
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>Track title language *</label>
                        <select type="text" className="form-select form-control" value={trackTitleLanguage} onChange={(e) => setTrackTitleLanguage(e.target.value)} >
                          {language.map(item => (
                            <option key={item} value={item.value}>
                              {item.label}
                            </option>
                          ))
                          }

                        </select>
                        {localErrors?.['trackTitleLanguage'] && (
                      <span className="text-danger">{localErrors['trackTitleLanguage']}</span>
                       )}
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <label>Lyrics language *</label>
                        <select type="text" className="form-select form-control" value={lyricsLanguage} onChange={(e) => setLyricsLanguage(e.target.value)} >
                          {language.map(item => (
                            <option key={item} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      {localErrors?.['lyricsLanguage'] && (
                      <span className="text-danger">{localErrors['lyricsLanguage']}</span>
                       )}
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label>Lyrics</label>
                        <textarea className="form-control" rows="4" value={lyrics} onChange={(e) => setLyrics(e.target.value)} />
                      </div>
                    </div>


                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Add contributors</label>
                        <ContributorManager
                          label="Contributor"
                          availableItems={contributoryName}
                          selectedItems={selectContributory}
                          setSelectedItems={setSelectContributory}
                          setAvailableItems={setContributoryName}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Add Others contributors</label>
                        <ContributorManager
                          label="Other Contributor"
                          availableItems={othersContributoryName}
                          selectedItems={otherContributory}
                          setSelectedItems={setOtherContributory}
                          setAvailableItems={setothersContributoryName}
                        />
                      </div>
                    </div>




                  </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="track-modal-footer">
                <button 
                  type="button" 
                  className="btn-cancel-track" 
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-save-track"
                  onClick={async () => {
                    setErrors?.([]);
                    await handleSubmit();
                  }}
                >
                  <i className="fa fa-save"></i> {btnName === "Edit" ? "Update Track" : "Save Track"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

