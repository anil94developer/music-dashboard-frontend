import React, { useContext, useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import { base } from '../../Constants/Data.constant';
import { getData, postData, postDataContent } from '../../Services/Ops';
const useSupportController = (props) => {
  const [issueType, setIssueType] = useState("Apple motion submission");
  const [email, setEmail] = useState("");
  const [clientNumber, setClientNumber] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [motionType, setMotionType] = useState("--None--");
  const [motionLink, setMotionLink] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [supportList, setSupportList] = useState([])
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  useEffect(() => {
    getsupportList();
  }, [props])
  const handleSubmit = async (e) => {
    e.preventDefault();
    // alert(issueType)
    // const formData = new FormData();
    // formData.append("issueType", issueType);
    // formData.append("email", email);
    // formData.append("clientNumber", clientNumber);
    // formData.append("country", country);
    // formData.append("description", description);
    // formData.append("motionType", motionType);
    // formData.append("motionLink", motionLink);

    // Attach files (if any)
    // (attachments || []).forEach((file, index) => {
    //   formData.append(`attachments[${index}]`, file);
    // });
    let body = {
      "issueType": issueType,
      "email": email,
      "clientNumber": clientNumber,
      "country": country,
      "description": description,
      "motionType": motionType,
      "motionLink": "",
      "attachments": attachments
    }
    // console.log("FormData Values:");
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`);
    // }

    try {
      const result = await postDataContent(base.addSupport, body);
      console.log("Server Response:", result);

      if (result.status === true) {
        Swal.fire("Success", result.data.message, "success");
        getsupportList();
        // navigate("/support", { replace: true, state: { reload: Date.now() } });
      } else {
        Swal.fire("Error", result.data.message, "error");

      }
    } catch (error) {
      console.error("Error Submitting form:", error);
      Swal.fire("Error", "Something went wrong. Please try again later.", "error");
    }
  };

  const getsupportList = async () => {
    let result = await getData(base.supportList);
    console.log("----------",result)
    if (result.status === true) {
      setSupportList(result.data);
    } else {
      Swal.fire("Error", result.data.message, "error");
    }
  }


  return {
    // States
    issueType,
    email,
    clientNumber,
    country,
    description,
    motionType,
    motionLink,
    attachments,
    // State setters
    setIssueType,
    setEmail,
    setClientNumber,
    setCountry,
    setDescription,
    setMotionType,
    setMotionLink,
    setAttachments,
    // Handlers
    handleFileChange,
    handleSubmit,
    supportList
  }

}
export default useSupportController;