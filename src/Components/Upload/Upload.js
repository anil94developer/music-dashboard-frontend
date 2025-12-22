// import React, { useState } from 'react';
// import Papa from 'papaparse'; // Import PapaParse library for CSV parsing
// import { base } from '../../Constants/Data.constant';
// import { postData } from '../../Services/Ops';
// import { Nav } from '../Common/Nav'

// export default function Upload() {

//   const [jsonDataTrack, setJsonDataTrack] = useState(null); // State to store parsed JSON data
//   const [error, setError] = useState(''); // State for error messages

//   // Handle file input change
//   const handleFileChangeTrack = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.type === 'text/csv') {
//         setError(''); // Reset error if file is valid 
//         Papa.parse(file, {
//           complete: (result) => {
//             console.log('CSV Parsed:', result);
//             const json = result.data; // Convert parsed CSV to JSON
//              setJsonDataTrack(json); // Store JSON data in state
//           },
//           header: true, // Treat first row as header (optional)
//           skipEmptyLines: true, // Skip empty lines in CSV (optional)
//         });
//       } else {
//         setError('Please upload a valid CSV file.');
//       }
//     }
//   };

//   const handleSubmitTrack=async()=>{ 
//     let result = await postData(base.uploadTracks,jsonDataTrack)
//     console.log(result)
//   }




//   return (
//     <div>
//       <Nav />
//       <div className="content-wrapper">
//         <h1> Uploads</h1>
//         <div >
//           <div className="col-md-12">
//             <div className="box p-4 border rounded shadow-sm">
//               <div className="box-body">
//                 <h3 className="mb-4">Upload Media Files</h3>
//                 <section className="content-header">

//                   {/* Upload Input */}
//                   <div className="row">
//                     {/* Left Column */}
//                     <div className="col-md-6">
//                       <div className="form-group">
//                         {/* <label className="form-label">Select Media Files:</label> */}
//                         <input
//                           type="file"
//                           multiple
//                           accept="csv"
//                           className="form-control"
//                           onChange={handleFileChangeTrack}
//                         />
//                       </div>
//                     </div>

//                     <div className="col-md-6">
//                       <div className="form-group">
//                         <button
//                           onClick={() => handleSubmitTrack()}
//                           type="Submit"
//                           className="btn btn-primary"
//                         >
//                           Submit
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                 </section>
//               </div>
//             </div>
//           </div>
//         </div>


//         <section className="container-fluid content">
//         </section>
//       </div>

//     </div>
//   )
// }
