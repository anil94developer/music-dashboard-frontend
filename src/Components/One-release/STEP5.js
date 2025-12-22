import React, { useEffect } from 'react';
import Step5Controller from '../../Controllers/One-release-controller/Step5Controller';
export default function STEP5(props) {
  const { releaseData, fetchReleaseDetails , setErrors} = props
  const { handleSubmit,
    removeExclusiveDate,
    removePreOrder,
    exclusiveOrderSelect,
    preOrderSelect,
    handlePreOrderDateChange,
    handleExclusiveDateChange,
    preOrderDate, setPreOrderDate,
    selectPreOrderDate, setSelectPreOrderDate,
    exclusiveDates, setExclusiveDates,
    selectexclusiveDate, setSelectexclusiveDate, allowPreview, setAllowPreview,
    setReleaseData, mainReleaseDate, setMainReleaseDate
  } = Step5Controller();
  useEffect(() => {
    const getData = async () => {
      setReleaseData(releaseData)
      setMainReleaseDate(releaseData?.step5?.MainReleaseDate)
      setAllowPreview(releaseData?.step5?.Preview?.Allow90Sec)
      setSelectPreOrderDate(releaseData?.step5?.PreOrder)
      setSelectexclusiveDate(releaseData?.step5?.ExclusiveReleaseDates)
    }
    getData()
  }, [releaseData])
  return (
    <div className="step5-container">
      {/* Header Section */}
      <div className="step5-header">
        <h2>Release Date</h2>
        <p className="step5-subtitle">Set your release dates and pre-order options</p>
      </div>

      <div className="row">
        {/* Main Release Date Card */}
        <div className="col-lg-6 col-12">
          <div className="release-date-card">
            <div className="card-header-section">
              <i className="fa fa-calendar-alt"></i>
              <h3>Main Release Date</h3>
            </div>
            <div className="card-content-section">
              <div className="form-group">
                <label>Choose a main release date <span className="required-star">*</span></label>
                <div className="date-input-wrapper">
                  <input
                    className="form-control date-input"
                    type="date"
                    value={mainReleaseDate || ''}
                    onChange={(e) => setMainReleaseDate(e.target.value)}
                  />
                  <i className="fa fa-calendar date-icon"></i>
                </div>
                {props.errors?.['step5.MainReleaseDate'] && (
                  <span className="text-danger">{props.errors['step5.MainReleaseDate']}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pre-Order Section Card */}
        <div className="col-lg-6 col-12">
          <div className="release-date-card">
            <div className="card-header-section">
              <i className="fa fa-shopping-cart"></i>
              <h3>Pre-Order Dates</h3>
            </div>
            <div className="card-content-section">
              <div className="form-group">
                <label>Add a pre-order date</label>
                <div className="select-wrapper">
                  <select 
                    className="form-select form-control" 
                    onChange={(e) => preOrderSelect(e.target.value)}
                  >
                    <option value="">Select Music Store</option>
                    {preOrderDate.map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                  <i className="fa fa-chevron-down select-icon"></i>
                </div>
                {props.errors?.['step5.PreOrder'] && (
                  <span className="text-danger">{props.errors['step5.PreOrder']}</span>
                )}
              </div>

              {/* Selected Pre-Order Dates */}
              {selectPreOrderDate && selectPreOrderDate.length > 0 && (
                <div className="selected-dates-container">
                  <h5 className="selected-dates-title">
                    <i className="fa fa-list"></i> Selected Pre-Order Dates
                  </h5>
                  {selectPreOrderDate.map((item) => (
                    <div key={item.id} className="date-item-card">
                      <div className="date-item-content">
                        <div className="date-item-name">
                          <i className="fa fa-store"></i>
                          <span>{item.name}</span>
                        </div>
                        <div className="date-input-wrapper">
                          <input
                            className="form-control date-input"
                            type="date"
                            value={item.date || ''}
                            onChange={(e) => handlePreOrderDateChange(item.id, e.target.value)}
                          />
                          <i className="fa fa-calendar date-icon"></i>
                        </div>
                        <button 
                          type="button" 
                          className="btn-remove-date"
                          onClick={() => removePreOrder(item.id)}
                          title="Remove"
                        >
                          <i className="fa fa-times"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Exclusive Release Dates Card */}
        <div className="col-lg-6 col-12">
          <div className="release-date-card">
            <div className="card-header-section">
              <i className="fa fa-star"></i>
              <h3>Exclusive Release Dates</h3>
            </div>
            <div className="card-content-section">
              <div className="form-group">
                <label>Add an exclusive release date</label>
                <div className="select-wrapper">
                  <select 
                    className="form-select form-control" 
                    onChange={(e) => exclusiveOrderSelect(e.target.value)}
                  >
                    <option value="">Select Store</option>
                    {exclusiveDates?.map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                  <i className="fa fa-chevron-down select-icon"></i>
                </div>
                {props.errors?.['step5.ExclusiveReleaseDates'] && (
                  <span className="text-danger">{props.errors['step5.ExclusiveReleaseDates']}</span>
                )}
              </div>

              {/* Selected Exclusive Dates */}
              {selectexclusiveDate && selectexclusiveDate.length > 0 && (
                <div className="selected-dates-container">
                  <h5 className="selected-dates-title">
                    <i className="fa fa-list"></i> Selected Exclusive Dates
                  </h5>
                  {selectexclusiveDate.map((item) => (
                    <div key={item.id} className="date-item-card">
                      <div className="date-item-content">
                        <div className="date-item-name">
                          <i className="fa fa-star"></i>
                          <span>{item.name}</span>
                        </div>
                        <div className="date-input-wrapper">
                          <input
                            className="form-control date-input"
                            type="date"
                            value={item.date || ''}
                            onChange={(e) => handleExclusiveDateChange(item.id, e.target.value)}
                          />
                          <i className="fa fa-calendar date-icon"></i>
                        </div>
                        <button 
                          type="button" 
                          className="btn-remove-date"
                          onClick={() => removeExclusiveDate(item.id)}
                          title="Remove"
                        >
                          <i className="fa fa-times"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="step5-submit-container">
        <button 
          type="submit" 
          className="btn-save-step5"
          onClick={() => {
            setErrors?.([]);
            handleSubmit();
          }}
        >
          <i className="fa fa-save"></i> Save Release Dates
        </button>
      </div>
    </div>
  );
}