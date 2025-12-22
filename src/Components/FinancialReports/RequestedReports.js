import { ListItem } from "@mui/material";
import React, { useState, useEffect } from "react";
import { base } from "../../Constants/Data.constant";
import { getData, postData } from "../../Services/Ops";
import StreamGraph from "../Common/Chart/StreamGraph";
// import "./styles.css";
import * as XLSX from 'xlsx';

const AutomaticReports = (props) => {

  const [streamData, setStreamData] = useState([])
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())



  const [report, setReport] = useState([])

  useEffect(() => {
    getReoprt();
  }, [])

  const getReoprt = async () => {
    let body = {
      userId: "6378290424"
    }
    let result = await postData(base.getFincialReport, body)
    console.log("getReoprt---getFincialReport---------", result.data)
    if (result.data.data.length > 0) {
      setReport(result.data.data)
    } else {
      setReport([])
    }

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

  return (
    <div className="reports-container">
      <div className="box-header">
        {/* <h3 className="box-title">Automatic Report</h3> */}
        {/* <div className="row">
          <div className="col-md-3 col-sm-6 col-12">
            <div className="form-group">
              <label htmlFor="releaseDate">Start Date</label>
              <input
                value={startDate}
                type="date"
                className="form-control"
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3 col-sm-6 col-12">
            <div className="form-group">
              <label htmlFor="releaseDate">End Date</label>
              <input
                value={endDate}
                type="date"
                className="form-control"
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3 col-sm-6 col-12">
            <div className="form-group">
              <label htmlFor="releaseDate"> .{" "}</label>
              <input
                value={"Search"}
                type="Submit"
                className="form-control"
                onClick={() => getReoprt()}
              />

            </div>
          </div>
          <div className="col-md-3 col-sm-6 col-12">
            <div className="form-group">
              <label htmlFor="releaseDate"> .{" "}</label>
              <input
                value={"Download"}
                type="Submit"
                className="btn btn-success"
                onClick={() => exportTableToExcel('example2', 'AutomaticReport.xlsx')}
              />

            </div>
          </div>
        </div> */}

      </div>
      <div className="reports-table">
        <div className="box-body table-responsive">
          {report && report.length === 0 ? (
            <p>No data available.</p>
          ) : (
            <table id="example2" className="table table-bordered table-striped">
              <thead>
                <tr>
                  {/* Static Table Headers */}
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Excel Data</th>
                </tr>
              </thead>
              <tbody>
                {report?.map((item, index) => (
                  <tr key={index}>
                    {/* Static Table Data based on predefined keys */}
                    <td>{item.toDate}</td>
                    <td>{item.fromDate}</td>
                    <td>
                      <a onClick={() => { downloadFile(item.excelUrl) }}>
                        <i className="fa fa-download"></i> Download Excel
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* <section className="content">
        <div className="row">
          <div className="col-lg-12 col-xs-12">
            <StreamGraph list={streamData} />
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default AutomaticReports;
