import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { Nav } from '../Common/Nav'
import Papa from 'papaparse'
import { getData, postData } from '../../Services/Ops';
import { base } from '../../Constants/Data.constant';
import Swal from 'sweetalert2';
export default function UserDetails() {

  const location = useLocation();
  const userId = location.state?.userId;

  const [jsonData, setJsonData] = useState(null); // State to store parsed JSON data
  const [error, setError] = useState(''); // State for error messages
  const [trackList, setTrackList] = useState([])

  useEffect(() => {
    getTrack()
  }, [])
  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'text/csv') {
        setError(''); // Reset error if file is valid
        parseCSV(file); // Call function to parse CSV
      } else {
        setError('Please upload a valid CSV file.');
      }
    }
  };

  // Parse the CSV file and convert it to JSON
  const parseCSV = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        console.log('CSV Parsed:', result);
        const json = result.data; // Convert parsed CSV to JSON
        setJsonData(json); // Store JSON data in state
      },
      header: true, // Treat first row as header (optional)
      skipEmptyLines: true, // Skip empty lines in CSV (optional)
    });
  };


  const uploadExcel = async () => {
    let body = {
      userId: userId,
      data: jsonData
    }
    let result = await postData(base.uploadTracks, body)
    console.log(result)
    if (result.data.status === true) {
      Swal.fire("Success", result.message, result.message);
    } else {
      Swal.fire("Error", result.message, result.message);
    }
  }

  const uploadStoreExcel = async () => {
    let body = {
      userId: userId,
      data: jsonData
    }
    let result = await postData(base.uploadStore, body)
    console.log(result)
    if (result.data.status === true) {
      Swal.fire("Success", result.message, result.message);
    } else {
      Swal.fire("Error", result.message, result.message);
    }
  }


  const uploadMarketExcel = async () => {
    let body = {
      userId: userId,
      data: jsonData
    }
    let result = await postData(base.uploadMarket, body)
    console.log(result)
    if (result.data.status === true) {
      Swal.fire("Success", result.message, result.message);
    } else {
      Swal.fire("Error", result.message, result.message);
    }
  }

  const getTrack = async () => {
    let result = await getData(base.getTracks)
    console.log(result)
    setTrackList(result.data) 
  }


  const uploadMarketStream = async () => {
    let body = {
      userId: userId,
      data: jsonData
    }
    let result = await postData(base.sendStream, body)
    console.log(result)
    if (result.data.status === true) {
      Swal.fire("Success", result.message, result.message);
    } else {
      Swal.fire("Error", result.message, result.message);
    }
  }


  return (
    <div>
      <Nav />
      <div className="content-wrapper">

        <div className="col-md-12">
          <div className="">
            <h3 className="mb-4">Store Upload Excel</h3>
            <section className="content-header">

              {/* Upload Input */}
              <div className="row">
                {/* Left Column */}
                <div className="col-md-6">
                  <div className="form-group">
                    {/* <label className="form-label">Select Media Files:</label> */}
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <button
                      onClick={() => uploadStoreExcel()}
                      type="Submit"
                      className="btn btn-primary"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>


        <div className="col-md-12">
          <div className="">
            <h3 className="mb-4">Market Upload Excel</h3>
            <section className="content-header">

              {/* Upload Input */}
              <div className="row">
                {/* Left Column */}
                <div className="col-md-6">
                  <div className="form-group">
                    {/* <label className="form-label">Select Media Files:</label> */}
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <button
                      onClick={() => uploadMarketExcel()}
                      type="Submit"
                      className="btn btn-primary"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>



            </section>
          </div>
        </div>



        <div className="col-md-12">
          <div className="">
            <h3 className="mb-4">Tracks Upload Excel</h3>
            <section className="content-header">

              {/* Upload Input */}
              <div className="row">
                {/* Left Column */}
                <div className="col-md-6">
                  <div className="form-group">
                    {/* <label className="form-label">Select Media Files:</label> */}
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="form-control"
                    // onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <button
                      onClick={() => uploadExcel()}
                      type="Submit"
                      className="btn btn-primary"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>



            </section>
          </div>
        </div>

        <div className="col-md-12">
          <div className="">
            <h3 className="mb-4">Stream Upload Excel</h3>
            <section className="content-header">

              {/* Upload Input */}
              <div className="row">
                {/* Left Column */}
                <div className="col-md-6">
                  <div className="form-group">
                    {/* <label className="form-label">Select Media Files:</label> */}
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="form-control"
                    // onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <button
                      onClick={() => uploadMarketStream()}
                      type="Submit"
                      className="btn btn-primary"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>



            </section>
          </div>
        </div>


        <section className="content">
          <br></br>
          <table id="example2" className="table table-bordered table-hover dataTable" aria-describedby="example2_info">
            <thead>
              <tr>
                <th>#</th>
                <th>Track</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {trackList && trackList?.map((item, index) => { 
                return (
                  <tr style={{}} key={item._id}>
                    <td>{index + 1}</td> 
                    <td>{item.Track}</td>
                    <td>{item.Quantity}</td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
      </div>

    </div>
  )
}
