
import React from 'react'
import { useNavigate } from 'react-router-dom';
import OneReleaseController from '../../Controllers/One-release-controller/OneReleaseController';
import { Nav } from '../Common/Nav'
import * as XLSX from 'xlsx';
import { SideBar } from '../Common/SideBar';
import { useUserProfile } from '../../Context/UserProfileContext';

export const AllTracks = () => {
  const navigate = useNavigate();
  const { userProfile } = useUserProfile();
  const { setType, setTitle, handleSubmit, myRelease, moreAction, isLoading, myTracks, setMyTracks } = OneReleaseController();

  const getMainContentClass = () => {
    if (userProfile?.role === "Admin") return "main-cotent admin-main-content";
    if (userProfile?.role === "company") return "main-cotent company-main-content";
    if (userProfile?.role === "employee") return "main-cotent employee-main-content";
    return "main-cotent";
  };

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
    <div>
      <SideBar />
      <div className={getMainContentClass()}>
        <Nav />
        <div className="content-wrapper">

          <section className="content">
            <div className="col-md-12">
              <div className="box">
                <div className="box-header">
                  <h3 className="box-title">All Tracks</h3>
                  <button
                    onClick={() => exportTableToExcel('example2', 'Releases.xlsx')}
                    className="btn btn-success"
                    style={{ float: 'right' }}
                  >
                    Download as Excel
                  </button>
                </div>

                <div className="box-body table-responsive">
                  <table id="example2" className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Content Type</th>
                        <th>Title</th>
                        <th>Catalog ID</th>
                        <th>Content Code</th>
                        <th>Language</th>
                        <th>Category</th>
                        <th>Genre</th>
                        <th>Sub Genre</th>
                        <th>Release Date</th>
                        <th>Released Country</th>
                        <th>Country Of Origin</th>
                        <th>State of Origin</th>
                        <th>Version</th>
                        <th>Vendor</th>
                        <th>Copyright P Line</th>
                        <th>Copyright C Line</th>
                        <th>Lyricist</th>
                        <th>Music Director</th>
                        <th>Singer</th>
                        <th>Actor</th>
                        <th>Actress</th>
                        <th>Banner</th>
                        <th>Producer</th>
                        <th>Director</th>
                        <th>Is Explicit</th>
                        <th>Is Compilation</th>
                        <th>Trivia</th>
                        <th>Keywords</th>
                        <th>Tags</th>
                        <th>Order</th>
                        <th>Mood</th>
                        <th>Tempo</th>
                        <th>Location/Temple</th>
                        <th>Deity/Saint</th>
                        <th>Festival/Occasion</th>
                        <th>Religion</th>
                        <th>Instrument</th>
                        <th>Romantic</th>
                        <th>Party</th>
                        <th>Item Song</th>
                        <th>UnPlugged</th>
                        <th>Bhangra</th>
                        <th>Parent Song Code</th>
                        <th>Movie Release Date</th>
                        <th>Solo-Duet-Group</th>
                        <th>Social Media Links</th>
                        <th>Relationship</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myTracks.map((item) => (
                        <tr key={item}>
                          <td>{item.ContentType}</td>
                          <td>{item.Title}</td>
                          <td>{item.PrimaryTrackType}</td>
                          <td>{item.SecondaryTrackType}</td>
                          <td>{item.LyricsLanguage}</td>
                          <td>{item.PrimaryTrackType}</td>
                          <td>{item.Genre}</td>
                          <td>{item.SubGenre}</td>
                          <td>{item.ProductionYear}</td>
                          <td>INDIA</td>
                          <td>INDIA</td>
                          <td>Punjab</td>
                          <td>Version 1</td>
                          <td>Vendor A</td>
                          <td>{item.Pline}</td>
                          <td>{item.Pline}</td>
                          <td>{item.Lyrics}</td>
                          <td>Music Director</td>
                          <td>{item.PrimaryArtist.map(artist => artist.name).join(', ')}</td>
                          <td>Actor</td>
                          <td>Actress</td>
                          <td>Banner</td>
                          <td>{item.Producer.map(artist => artist.name).join(', ')}</td>
                          <td>Director</td>
                          <td>No</td>
                          <td>No</td>
                          <td>Trivia</td>
                          <td>Keywords</td>
                          <td>Tags</td>
                          <td>Order</td>
                          <td>Mood</td>
                          <td>Tempo</td>
                          <td>Location</td>
                          <td>Deity</td>
                          <td>Festival</td>
                          <td>Religion</td>
                          <td>Instrument</td>
                          <td>No</td>
                          <td>No</td>
                          <td>No</td>
                          <td>No</td>
                          <td>No</td>
                          <td>Parent Song</td>
                          <td>{item.ProductionYear}</td>
                          <td>Solo</td>
                          <td>Links</td>
                          <td>Relationship</td>
                        </tr>

                      ))}
                      {/* More rows can be added dynamically */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>



  );
};
