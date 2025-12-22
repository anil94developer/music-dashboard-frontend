import { ListItem } from "@mui/material";
import React, { useState, useEffect } from "react";
import { base } from "../../Constants/Data.constant";
import { getData } from "../../Services/Ops";
import StreamGraph from "../Common/Chart/StreamGraph";
// import "./styles.css";
import * as XLSX from 'xlsx';

const AutomaticReports = (props) => {
  const { report } = props
  const [streamData, setStreamData] = useState([]) 
  useEffect(() => {
    getGraphReport()
  }, [])
  const getGraphReport = async () => {
    let result = await getData(base.getStream);
    console.log("====================>", result.data)
    if (result?.data?.status) {
      setStreamData(result.data)
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
 
  return (
    <div className="reports-container">
      <div className="box-header">
        <h3 className="box-title">Automatic Report</h3>
        <button
          onClick={() => exportTableToExcel('example2', 'AutomaticReport.xlsx')}
          className="btn btn-success"
          style={{ float: 'right' }}
        >
          Download as Excel
        </button>
      </div>
      <div className="reports-table">
        <div className="box-body table-responsive">
          <table id="example2" className="table table-bordered table-striped">
            <thead>
              <tr>
                {/* Static Table Headers */}
                <th>Sale Start Date</th>
                <th>Sale End Date</th>
                <th>DSP</th>
                <th>Sale Store Name</th>
                <th>Sale Type</th>
                <th>Sale User Type</th>
                <th>Territory</th>
                <th>Product Artist</th>
                <th>Product Title</th>
                <th>Asset Artist</th>
                <th>Asset Title</th>
                <th>Original Gross Income</th>
                <th>Converted Gross Income</th>
                <th>Currency</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {report.map((report, index) => (
                <tr key={index}>
                  {/* Static Table Data based on predefined keys */}
                  <td>{report.SaleStartdate}</td>
                  <td>{report.SaleEnddate}</td>
                  <td>{report.DSP}</td>
                  <td>{report.SaleStoreName}</td>
                  <td>{report.SaleType}</td>
                  <td>{report.SaleUserType}</td>
                  <td>{report.Territory}</td>
                  <td>{report.ProductArtist}</td>
                  <td>{report.ProductTitle}</td>
                  <td>{report.AssetArtist}</td>
                  <td>{report.AssetTitle}</td>
                  <td>{report.OriginalGrossIncome.$numberDecimal}</td>
                  <td>{report.ConvertedGrossIncome.$numberDecimal}</td>
                  <td>{report.Currency}</td>
                  {/* <td>
                    <div className="action-buttons">
                        <button title="Download" className="action-button">
                        <i className="fa fa-download"></i>
                      </button>  
                       <button title="Delete" className="action-button delete">
                        <i className="fa fa-trash"></i>
                      </button>  
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
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
