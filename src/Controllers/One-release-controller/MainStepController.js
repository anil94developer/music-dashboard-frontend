import React, { useContext, useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import { base } from '../../Constants/Data.constant';
import { getData, postData } from '../../Services/Ops';
const MainStepController = (props) => { 
  const navigate = useNavigate();
  const [step, setStep] = useState("step1"); 
  const [isLoading, setIsLoading] = useState(false);


  const [myRelease, setMyRelease] = useState({});

  
    const fetchReleaseDetails = async (releaseId) => { 
      setIsLoading(true)
      //alert(releaseId)
      let body={
        releaseId:releaseId
      }
      let result = await postData(base.releaseDetails,body);
     
      if (result.data.status === true) { 
        // alert(true)
      setIsLoading(false) 
          setMyRelease(result.data.data)
      } else {
      setIsLoading(false)

        // Swal.fire("Error", result.message, result.message);
      }
    }

  return {
    setStep,
    step,
    myRelease,
    setMyRelease,
    fetchReleaseDetails,
    isLoading,
  }

}
export default MainStepController;