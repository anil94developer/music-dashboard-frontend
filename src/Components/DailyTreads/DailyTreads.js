import React, { useState, useEffect } from 'react'
import { stream } from 'xlsx'
import { base } from '../../Constants/Data.constant'
import { getData } from '../../Services/Ops'
import ChartZoomPan from '../Common/Chart/ChartZoomPan'
import CircleGraph from '../Common/Chart/CircleGraph'
import MarketGraph from '../Common/Chart/MarketGraph'
import CustomPieChart from '../Common/Chart/PaiChart'
import SimpleGraph from '../Common/Chart/SimpleGraph'
import SplineChart from '../Common/Chart/SplineChart'
// import DrillDown from '../Common/Chart/DrillDown'
import { Nav } from '../Common/Nav'
import { SideBar } from '../Common/SideBar'
import * as XLSX from 'xlsx';
import { useUserProfile } from '../../Context/UserProfileContext';

export default function DailyTreads() {
  const { userProfile } = useUserProfile();
  const [topStoresTab, setTopStoresTab] = useState("graph");
  const [marketListTab, setMarketListTab] = useState("graph");
  const [streamListTab, setStreamListTab] = useState("graph");
  const [trackListTab, setTrackListTab] = useState("graph");
  const [insideTab, setInsideTab] = useState("graph");


  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  const handleQuickDateSelect = (months) => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }

  const [topStores, setTopStores] = useState([])
  const [marketList, setMarketList] = useState([])
  const [streamList, setStreamList] = useState([])
  const [trackList, setTrackList] = useState([])
  const [insideList, setInsideList] = useState([])


  useEffect(() => {
    let query = ``;
    getStore(query);
    getMarket(query);
    getStream(query);
    getTracks(query)
    getInside(query)
  }, [])
  const getStore = async (query) => {
    let result = await getData(base.getStore + `?${query}`)
    console.log("getStore------------", result)
    if (result?.status) {
      let arr = []
      result?.data?.map((item, index) => {
        arr.push({ name: item.Store, y: item.Quantity ,Excel:item.Excel})
      })
      setTopStores(arr)
    } else {
      setTopStores([])
    }
  }
  const getMarket = async (query) => {
    let result = await getData(base.getMarket + `?${query}`)
    console.log(result)
    if (result?.status) {
      let arr = []
      result.data?.map((item, index) => {
        arr.push({ x: index, label: item.Market, y: item.Quantity ,Excel:item.Excel})
      })
      setMarketList(arr);
    } else {
      setMarketList([]);

    }
  }
  const getStream = async (query) => {
    let result = await getData(base.getStream + `?${query}`)
    console.log("result stream-------", result)
    if (result?.status) {
      let arr = []
      result.data?.map((item, index) => {
        arr.push({ x: index, label: item.dsp, y: item.streams, Excel:item.Excel })
      })
      setStreamList(arr);
    } else {
      setStreamList([]);

    }
  }
  const getTracks = async (query) => {
    let result = await getData(base.getTracks + `?${query}`)
    console.log("result getTracks-------", result)
    if (result?.status) {
      let arr = []
      result.data?.map((item, index) => {
        arr.push({ x: index, label: item.Track, y: item.Quantity, Excel:item.Excel  })
      })
      setTrackList(arr);
    } else {
      setTrackList([]);

    }
  }

  const getInside = async (query) => {
    let result = await getData(base.getInside + `?${query}`)
    console.log("result getTracks-------", result)
    if (result?.status) {
      setInsideList(result?.data);
    } else {
      setInsideList([]);
    }
  }


  function exportTableToExcel(tableId, fileName = 'TableData.xlsx') {
    // Get the table element by ID
    const table = document.getElementById(tableId);
    if (!table) {
      console.error(`Table with ID ${tableId} not found.`);
      return;
    }

    // Convert table to a worksheet
    const worksheet = XLSX.utils.table_to_sheet(table);

    // Create a new workbook and add the worksheet to it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Export the workbook to an Excel file
    XLSX.writeFile(workbook, fileName);
  }

  const downloadFile = (url, name) => {
    if (!url || url === "") {
      alert("No file available to download");
      return;
    }
    
    try {
      // Create a temporary anchor element
      const link = document.createElement('a');
      
      // Ensure URL uses HTTPS instead of HTTP
      if (url.startsWith('http:')) {
        url = url.replace('http:', 'https:');
      }
      
      // Check if URL is relative and convert to absolute if needed
      if (url.startsWith('/') && !url.startsWith('//')) {
        url = window.location.origin + url;
      }
      
      link.href = url;
      
      // Extract filename from URL or use a default name
      const filename = url.split('/').pop() || name + '.xlsx';
      link.download = filename;
      
      // Set additional attributes that might help in production
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Append to body, click and remove
      document.body.appendChild(link);
      link.click();
      
      // Small timeout before removing to ensure the download starts
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again.");
    }
  }

  const getMainContentClass = () => {
    if (userProfile?.role === "Admin") return "main-cotent admin-main-content";
    if (userProfile?.role === "company") return "main-cotent company-main-content";
    if (userProfile?.role === "employee") return "main-cotent employee-main-content";
    return "main-cotent";
  };

  return (
    <div>
      <SideBar />
      <div className={getMainContentClass()}>
        <Nav />
        <div className="content-main">
          <section className="daily-trends-page">
            {/* Page Header */}
            <div className="daily-trends-header">
              <h1>
                <i className="fa fa-chart-line"></i> Daily Trends
              </h1>
              <p className="daily-trends-subtitle">Analyze your daily performance metrics and insights</p>
            </div>

            {/* Date Filters Card */}
            <div className="filters-card">
              <div className="card-header-section">
                <h3>
                  <i className="fa fa-filter"></i> Date Filters
                </h3>
              </div>
              <div className="card-content-section">
                <div className="row">
                  <div className="col-lg-3 col-md-6 col-12">
                    <div className="form-group">
                      <label>
                        <i className="fa fa-calendar-alt"></i> Start Date
                      </label>
                      <div className="date-input-wrapper">
                        <input
                          value={startDate}
                          type="date"
                          className="form-control date-input"
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                        <i className="fa fa-calendar date-icon"></i>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-12">
                    <div className="form-group">
                      <label>
                        <i className="fa fa-calendar-check"></i> End Date
                      </label>
                      <div className="date-input-wrapper">
                        <input
                          value={endDate}
                          type="date"
                          className="form-control date-input"
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                        <i className="fa fa-calendar date-icon"></i>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-12">
                    <div className="form-group">
                      <label>
                        <i className="fa fa-clock"></i> Quick Select
                      </label>
                      <div className="select-wrapper">
                        <select 
                          className="form-control form-select"
                          onChange={(e) => handleQuickDateSelect(parseInt(e.target.value))}
                          defaultValue=""
                        >
                          <option value="" disabled>Select Time Period</option>
                          <option value="1">Last 1 Month</option>
                          <option value="3">Last 3 Months</option>
                          <option value="6">Last 6 Months</option>
                          <option value="12">Last 1 Year</option>
                        </select>
                        <i className="fa fa-chevron-down select-icon"></i>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-12">
                    <div className="form-group">
                      <label>&nbsp;</label>
                      <button
                        className="btn-search-trends"
                        onClick={() => {
                          let query = `startDate=${startDate}&&endDate=${endDate}`;
                          getStore(query);
                          getMarket(query);
                          getStream(query);
                          getTracks(query);
                          getInside(query)
                        }}
                      >
                        <i className="fa fa-search"></i> Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Store Card */}
            <div className="trend-card">
              <div className="card-header-section">
                <h2>
                  <i className="fa fa-store"></i> Top Store
                </h2>
                <button 
                  className="btn-download"
                  onClick={() => {
                    exportTableToExcel('topstore', 'topstore.xlsx')
                  }}
                >
                  <i className="fa fa-download"></i> Download
                </button>
              </div>
              <div className="card-content-section">
                {topStores.length > 0 ? (
                  <div className="row">
                    <div className="col-lg-6 col-12">
                      <div className="chart-container">
                        <CustomPieChart data={topStores} />
                      </div>
                    </div>
                    <div className="col-lg-6 col-12">
                      <div className="table-container">
                        <h4 className="table-title">
                          <i className="fa fa-table"></i> Store Data
                        </h4>
                        <div className="table-wrapper">
                          <table id="topstore" className="modern-table">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Excel Data</th>
                              </tr>
                            </thead>
                            <tbody>
                              {topStores.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td className="store-name-cell">{item.name}</td>
                                  <td className="quantity-cell">{item.y}</td>
                                  <td>
                                    {item.Excel && item.Excel !== "" && (
                                      <button
                                        className="btn-download-excel"
                                        onClick={() => downloadFile(item.Excel, item.name)}
                                      >
                                        <i className="fa fa-download"></i> Download
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-data-message">
                    <i className="fa fa-inbox"></i>
                    <h3>No Top Store Data</h3>
                    <p>No data available for the selected date range</p>
                  </div>
                )}
              </div>
            </div>

            {/* Market Card */}
            <div className="trend-card">
              <div className="card-header-section">
                <h2>
                  <i className="fa fa-chart-bar"></i> Market
                </h2>
                <button 
                  className="btn-download"
                  onClick={() => {
                    exportTableToExcel('market', 'marketData.xlsx')
                  }}
                >
                  <i className="fa fa-download"></i> Download
                </button>
              </div>
              <div className="card-content-section">
                {marketList.length > 0 ? (
                  <div className="row">
                    <div className="col-lg-6 col-12">
                      <div className="chart-container">
                        <MarketGraph charDdata={marketList} />
                      </div>
                    </div>
                    <div className="col-lg-6 col-12">
                      <div className="table-container">
                        <h4 className="table-title">
                          <i className="fa fa-table"></i> Market Data
                        </h4>
                        <div className="table-wrapper">
                          <table id="market" className="modern-table">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Label</th>
                                <th>Quantity</th>
                                <th>Excel Data</th>
                              </tr>
                            </thead>
                            <tbody>
                              {marketList.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td className="label-cell">{item.label}</td>
                                  <td className="quantity-cell">{item.y}</td>
                                  <td>
                                    {item.Excel && item.Excel !== "" && (
                                      <button
                                        className="btn-download-excel"
                                        onClick={() => downloadFile(item.Excel, item.name)}
                                      >
                                        <i className="fa fa-download"></i> Download
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-data-message">
                    <i className="fa fa-inbox"></i>
                    <h3>No Market Data</h3>
                    <p>No data available for the selected date range</p>
                  </div>
                )}
              </div>
            </div>

            {/* Stream Card */}
            <div className="trend-card">
              <div className="card-header-section">
                <h2>
                  <i className="fa fa-stream"></i> Stream
                </h2>
                <div className="header-actions">
                  <div className="tab-buttons">
                    <button 
                      onClick={() => { setStreamListTab("graph") }} 
                      className={`tab-btn ${streamListTab === "graph" ? "active" : ""}`}
                    >
                      <i className="fa fa-chart-line"></i> Graph
                    </button>
                    <button 
                      onClick={() => { setStreamListTab("table") }} 
                      className={`tab-btn ${streamListTab === "table" ? "active" : ""}`}
                    >
                      <i className="fa fa-table"></i> Table
                    </button>
                  </div>
                  {streamListTab === "table" && (
                    <button 
                      className="btn-download"
                      onClick={() => {
                        exportTableToExcel('stream', 'streamData.xlsx')
                      }}
                    >
                      <i className="fa fa-download"></i> Download
                    </button>
                  )}
                </div>
              </div>
              <div className="card-content-section">
                {streamList.length > 0 ? (
                  streamListTab === "graph" ? (
                    <div className="chart-container">
                      <SimpleGraph data={streamList} title={"Stream"} type={'column'} />
                    </div>
                  ) : (
                    <div className="table-container">
                      <div className="table-wrapper">
                        <table id="stream" className="modern-table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Label</th>
                              <th>Quantity</th>
                              <th>% Stream</th>
                              <th>Excel Data</th>
                            </tr>
                          </thead>
                          <tbody>
                            {streamList.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="label-cell">{item.label}</td>
                                <td className="quantity-cell">{item.y}</td>
                                <td className="percentage-cell">{(item.y * 100 / 100000).toFixed(2)}%</td>
                                <td>
                                  {item.Excel && item.Excel !== "" && (
                                    <button
                                      className="btn-download-excel"
                                      onClick={() => downloadFile(item.Excel, item.name)}
                                    >
                                      <i className="fa fa-download"></i> Download
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="no-data-message">
                    <i className="fa fa-inbox"></i>
                    <h3>No Stream Data</h3>
                    <p>No data available for the selected date range</p>
                  </div>
                )}
              </div>
            </div>
            {/* Tracks Card */}
            <div className="trend-card">
              <div className="card-header-section">
                <h2>
                  <i className="fa fa-music"></i> Tracks
                </h2>
                <div className="header-actions">
                  <div className="tab-buttons">
                    <button 
                      onClick={() => { setTrackListTab("graph") }} 
                      className={`tab-btn ${trackListTab === "graph" ? "active" : ""}`}
                    >
                      <i className="fa fa-chart-line"></i> Graph
                    </button>
                    <button 
                      onClick={() => { setTrackListTab("table") }} 
                      className={`tab-btn ${trackListTab === "table" ? "active" : ""}`}
                    >
                      <i className="fa fa-table"></i> Table
                    </button>
                  </div>
                  {trackListTab === "table" && (
                    <button 
                      className="btn-download"
                      onClick={() => {
                        exportTableToExcel('tracks', 'tracksData.xlsx')
                      }}
                    >
                      <i className="fa fa-download"></i> Download
                    </button>
                  )}
                </div>
              </div>
              <div className="card-content-section">
                {trackList.length > 0 ? (
                  trackListTab === "graph" ? (
                    <div className="chart-container">
                      <MarketGraph charDdata={trackList} />
                    </div>
                  ) : (
                    <div className="table-container">
                      <div className="table-wrapper">
                        <table id="tracks" className="modern-table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Label</th>
                              <th>Quantity</th>
                              <th>Excel Data</th>
                            </tr>
                          </thead>
                          <tbody>
                            {trackList.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="label-cell">{item.label}</td>
                                <td className="quantity-cell">{item.y}</td>
                                <td>
                                  {item.Excel && item.Excel !== "" && (
                                    <button
                                      className="btn-download-excel"
                                      onClick={() => downloadFile(item.Excel, item.name)}
                                    >
                                      <i className="fa fa-download"></i> Download
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="no-data-message">
                    <i className="fa fa-inbox"></i>
                    <h3>No Track Data</h3>
                    <p>No data available for the selected date range</p>
                  </div>
                )}
              </div>
            </div>


            {/* Inside Data Card */}
            <div className="trend-card">
              <div className="card-header-section">
                <h2>
                  <i className="fa fa-database"></i> Inside Data
                </h2>
                <button 
                  className="btn-download"
                  onClick={() => {
                    exportTableToExcel('inside', 'insideData.xlsx')
                  }}
                >
                  <i className="fa fa-download"></i> Download
                </button>
              </div>
              <div className="card-content-section">
                {insideList.length > 0 ? (
                  <div className="table-container">
                    <div className="table-wrapper">
                      <table id="inside" className="modern-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Label</th>
                            <th>Artist</th>
                            <th>ISRC</th>
                            <th>Streams</th>
                            <th>Stream %</th>
                            <th>Streams Change</th>
                            <th>Stream Change %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {insideList.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td className="title-cell">{item.Title}</td>
                              <td className="label-cell">{item.Label}</td>
                              <td className="artist-cell">{item.Artist}</td>
                              <td className="isrc-cell">{item.ISRC}</td>
                              <td className="quantity-cell">{item.Streams}</td>
                              <td className="percentage-cell">{(item.Streams * 100 / 100000).toFixed(2)}%</td>
                              <td className="change-cell">{item.Streamschange}</td>
                              <td className="percentage-cell">{(item.Streams * 100 / 100000).toFixed(2)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="no-data-message">
                    <i className="fa fa-inbox"></i>
                    <h3>No Inside Data</h3>
                    <p>No data available for the selected date range</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}