import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import { getData, postData, postDataContent } from '../../Services/Ops';
import { base } from '../../Constants/Data.constant';
import { AllDraft } from '../../Components/AllDraft/AllDraft';
import { useUserProfile } from '../../Context/UserProfileContext';
import * as XLSX from 'xlsx';


const OneReleaseController = (props) => {

  const navigate = useNavigate();
  const { userProfile } = useUserProfile()
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Audio");
  const [myRelease, setMyRelease] = useState([]);
  const [myReleaseDraft, setMyReleaseDraft] = useState([]);
  const [totalPages, setTotalPages] = useState(0)
  const [myTracks, setMyTracks] = useState([]);
  const [search, setSearch] = useState("")
  const [limit, setLimit] = useState(10)
 


  useEffect(() => {
    fetchReleaseList(1, limit)
    fetchTracksList()
  }, [props, userProfile])

  useEffect(() => {
    fetchReleaseList(1, limit)
  }, [search,limit])



  const getClientNo = async (userId) => {
    try {
      const body = { userId };
      const result = await postData(base.getUser, body);
      console.log("get user", result);
      return result?.data?.data?.clientNumber || null;
    } catch (error) {
      console.error("Error fetching client number:", error);
      return null;
    }
  };


  const fetchReleaseList = async (page, limit) => {
    let arrRelease = [];
    let arrDraft = [];

    // if (userProfile?.role == "Admin") {
    //   setIsLoading(true)
    //   let result = await getData(base.allReleaseList);
    //   if (result.status === true) {
    //     if (Array.isArray(result.data)) {
    //       const arrRelease = result.data.data.filter(item =>
    //         ['Submit', 'Approve', 'Reject'].includes(item.status),

    //       );

    //       // Fetch client numbers for each release
    //       const releasesWithClientNumbers = await Promise.all(
    //         arrRelease.data.map(async (item) => {
    //           const clientNumber = await getClientNo(item.userId);

    //           return { ...item, clientNumber };
    //         })
    //       );

    //       setMyRelease(releasesWithClientNumbers);
    //     }

    //   }
    // } 
    if (userProfile?.role === "Admin") {
      setIsLoading(true);
      try {
        let result = await getData(base.adminAllReleaseList + `?page=${page}&limit=${limit}&search=${search}`);
        setTotalPages(result.data.totalPages)
        console.log("result-----", result)
        if (result.status === true) {
          // if (Array.isArray(result.data.data)) {
          //   arrRelease = result.data.data.filter(item =>
          //     ['Submit', 'Approve', 'Reject'].includes(item.status)
          //   );

            // Fetch client numbers for each release
            const releasesWithClientNumbers = await Promise.all(
              result.data.data.map(async (item) => {
                try {
                  const clientNumber = await getClientNo(item.userId);
                  return { ...item, clientNumber };
                } catch (error) {
                  console.error("Error fetching client number:", error);
                  return { ...item, clientNumber: "N/A" }; // Handle failure case
                }
              })
            );

            setMyRelease(releasesWithClientNumbers);
          // }
        }
      } catch (error) {
        console.error("Error fetching release list:", error);
      } finally {
        setIsLoading(false); // Ensure loading is stopped
      }
    }
    else if (userProfile?.role == "company" || userProfile.role == "employee") {
      setIsLoading(true);
      try {
        let result = await getData(base.allReleaseList + `?page=${page}&limit=${limit}&search=${search}`);
        setTotalPages(result.data.totalPages)
        console.log("result-----", result)
        if (result.status === true) { 
            // Fetch client numbers for each release
            const releasesWithClientNumbers = await Promise.all(
              result.data.data.map(async (item) => {
                try {
                  const clientNumber = await getClientNo(item.userId);
                  return { ...item, clientNumber };
                } catch (error) {
                  console.error("Error fetching client number:", error);
                  return { ...item, clientNumber: "N/A" }; // Handle failure case
                }
              })
            );

            setMyRelease(releasesWithClientNumbers);
          // }
        }
      } catch (error) {
        console.error("Error fetching release list:", error);
      } finally {
        setIsLoading(false); // Ensure loading is stopped
      }


      try {
        let resultDraft = await getData(base.allDraftList + `?page=${page}&limit=${limit}&search=${search}`);
        setTotalPages(resultDraft.data.totalPages)
        console.log("resultDraft-----", resultDraft)
        if (resultDraft.status === true) { 
            // Fetch client numbers for each release
            const releasesWithClientNumbers = await Promise.all(
              resultDraft.data.data.map(async (item) => {
                try {
                  const clientNumber = await getClientNo(item.userId);
                  return { ...item, clientNumber };
                } catch (error) {
                  console.error("Error fetching client number:", error);
                  return { ...item, clientNumber: "N/A" }; // Handle failure case
                }
              })
            );

            setMyReleaseDraft(releasesWithClientNumbers);
          // }
        }
      } catch (error) {
        console.error("Error fetching release list:", error);
      } finally {
        setIsLoading(false); // Ensure loading is stopped
      }


      // let resultSubmit = await getData(base.releaseList + `?status=Submit`);
      // if (resultSubmit.status == true) {
      //   arrRelease.push(resultSubmit.data)
      // }

      // let result = await getData(base.releaseList + `?status=Approve`);
      // if (result.status == true) {
      //   console.log("result--------", result)
      //   // if (result.data.length > 0) {
      //     arrRelease.push(result.data);
      //   // }
      // }

      // const releasesWithClientNumbers = await Promise.all(
      //   arrRelease.map(async (item) => {
      //     const clientNumber = await getClientNo(item.userId);
      //     return { ...item, clientNumber};
      //   })
      // );




      // console.log("releasesWithClientNumbers",releasesWithClientNumbers);



      // // setMyRelease(releasesWithClientNumbers);
      // // Fetch Submitted Releases
      // let resultSubmit = await getData(base.releaseList + `?status=Submit`);
      // // if (resultSubmit.status === true) {
      // //   arrRelease = arrRelease.push(resultSubmit.data); // Flatten the data into arrRelease
      // // }

      // // Fetch Approved Releases
      // let result = await getData(base.releaseList + `?status=Approve`);
      // // if (result.status === true) {
      // //   arrRelease = arrRelease.push(result.data); // Flatten the data into arrRelease
      // // }
      // arrRelease = [...resultSubmit.data, ...result.data];

      // // Generate Releases with Client Numbers
      // const releasesWithClientNumbers = await Promise.all(
      //   arrRelease.map(async (item) => {
      //     const clientNumber = await getClientNo(item.userId[0]);
      //     return { ...item, clientNumber }; // Add clientNumber to each release
      //   })
      // );

      // // Set the result to state
      // console.log("releasesWithClientNumbers", arrRelease);
      // setMyRelease(releasesWithClientNumbers);



      // let allDraft = await getData(base.releaseList + `?status=Pending`);

      // arrDraft = allDraft.data;

      // let allReject = await getData(base.releaseList + `?status=Reject`);

      // arrDraft = [...allReject.data, ...arrDraft];

      // // Fetch client numbers for each release

      // console.log("arrDraft----------", arrDraft)

      // setMyReleaseDraft(arrDraft)
      // // setMyRelease(arrRelease)

    }
    // setMyReleaseDraft(arrDraft)

    setIsLoading(false)

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


  const fetchTracksList = async () => {
    setIsLoading(true)
    let result = await getData(base.tracksList);
    console.log(base.tracksList + "===========>", result)
    if (result.status === true) {
      setMyTracks(result.data)
      setIsLoading(false)
    } else {
      setIsLoading(false)

      // Swal.fire("Error", result.message, result.message);
    }
  }

  const handleSubmit = async (e) => {
    let body = {
      title: title,
      type: type,
    };

    let result = await postData(base.addOneRelease, body);
    console.log(result);
    if (result.data.status === true) {
      navigate("/main-step", { state: { releaseId: result.data.data._id } });
    } else {
      Swal.fire("Error", result.message, result.message);
    }
  }

  const moreAction = (e) => {
    navigate("/main-step", { state: { releaseId: e._id } });
  }

  const deleteAction = async (e) => {
    let body = {
      id: e._id
    }
    console.log(body)
    let result = await postData(base.deleteOneRelease, body);
    if (result.data.status === true) {
      Swal.fire("Success", result.message, result.message)

      // let updateArr= myReleaseDraft.filter(item=> item._id !== e.id)
      // setMyReleaseDraft(updateArr)
      fetchReleaseList(1, limit)

    } else {
      Swal.fire("Error", result.message, result.message);
    }

  }
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = limit; // Set items per page

  // Calculate total pages
  const totalRow = Math.ceil(totalPages);

  // Get current items for the page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = myRelease.slice(startIndex, startIndex + itemsPerPage);


  const nextPage = () => {
    fetchReleaseList(currentPage, itemsPerPage)
    setCurrentPage((prev) => Math.min(prev + 1, totalRow))
  }
  const previusPage = () => {
    fetchReleaseList(currentPage, itemsPerPage)
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }
  return {
    isLoading,
    setIsLoading,
    title,
    setTitle,
    type,
    setType,
    myRelease,
    handleSubmit,
    moreAction,
    deleteAction,
    myTracks, setMyTracks, myReleaseDraft,
    exportTableToExcel,
    fetchReleaseList,
    totalPages,
    nextPage,
    startIndex,
    currentPage,
    previusPage,
    search, setSearch,
    limit, setLimit
  }

}
export default OneReleaseController;