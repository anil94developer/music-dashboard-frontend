import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base } from '../../Constants/Data.constant';
import { getData, postData, postDataContent } from '../../Services/Ops';
import { showSuccess, showError } from '../../Utils/Notification';
const useBankInformationController = (props) => {
  const [bankDetails, setBankDetails] = useState({
    panNumber:"",
    accountHolder: "",
    bankName: "",
    ifscCode: "",
    accountNumber: "",
    accountType: "Savings", // Default to 'Savings'
  });

  useEffect(()=>{
    handleFetch()
  },[])
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await postData(base.addBank, bankDetails);
      console.log("Server Response:", result);

      if (result.data.status === true) {
        showSuccess(result.data.message, "Success");
      } else {
        showError(result.data.message, "Error");
      }
    } catch (error) {
      console.error("Error Submitting form:", error);
      showError("Something went wrong. Please try again later.", "Error");
    }
  };

  const handleFetch = async () => { 

    try {
      const result = await getData(base.bankDetails); 
      if (result.status == true) {
        // Swal.fire("Success", result.data.message, "success");
        setBankDetails({
          panNumber:result.data.panNumber,
          accountHolder: result.data.accountHolder,
          bankName: result.data.bankName,
          ifscCode: result.data.ifscCode,
          accountNumber: result.data.accountNumber,
          accountType: result.data.accountType, // Default to 'Savings'

        })
      } else {
        showError(result.data.message, "Error");
      }
      
      console.log(result)
    } catch (error) {
      console.error("Error Submitting form:", error);
      showError("Something went wrong. Please try again later.", "Error");
    }
  };
  return {
    bankDetails,
    handleChange,
    handleSubmit,
  };
};

export default useBankInformationController;