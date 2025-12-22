import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import { base } from '../../Constants/Data.constant';
import { getData, postData, postDataContent } from '../../Services/Ops';
const useChangePasswordController = (props) => {
  // State for managing form inputs
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      oldPassword:oldPassword,
      newPassword:newPassword,
    };

    try {
      const result = await postData(base.changePassword, formData);
      console.log("Server Response:", result);

      if (result.data.status === true) {
        Swal.fire("Success", result.data.message, "success");
      } else {
        Swal.fire("Error", result.data.message, "error");
      }
    } catch (error) {
      console.error("Error Submitting form:", error);
      Swal.fire("Error", "Something went wrong. Please try again later.", "error");
    }
  };



  return {
    // States
    newPassword,
    setNewPassword,
    oldPassword, setOldPassword,
    handleSubmit,
  }

}
export default useChangePasswordController;