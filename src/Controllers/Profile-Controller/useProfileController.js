import React, { useState, useEffect } from "react";
import { getData, postData, postDataContent } from "../../Services/Ops"; // Adjust the path to your service
import { base } from "../../Constants/Data.constant";
import { showSuccess, showError } from "../../Utils/Notification";
import { useUserProfile } from "../../Context/UserProfileContext";

const useProfileController = () => {
  const { getProfile: refreshUserProfile } = useUserProfile();
  
  // State for managing form inputs
  const [profile, setProfile] = useState({
    companyName: "",
    clientNumber: "",
    mainEmail: "",
    royaltiesEmail: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    postalAddress: "",
    postalCode: "",
    city: "",
    country: "", // Default value
    timeZone: "",
    language: "", // Default value
    logo: "", // Logo URL
    brandName: "", // Brand Name (for Admin)
    copyright: "", // Copyright (for Admin)
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  useEffect(() => {
    getProfile();
  }, []);


  const getProfile = async () => {
    try {
      // const userId = "671e08391a2071afe4269f80";
      const result = await getData(base.userProfile); // pass as query parameter
      // console.log(result)
      if (result && result.status === true) {
        setProfile({
          companyName: result.data.companyName || "",
          clientNumber: result.data.clientNumber || "",
          mainEmail: result.data.mainEmail || "",
          royaltiesEmail: result.data.royaltiesEmail || "",
          firstName: result.data.name || "",
          lastName: result.data.lastName || "",
          phoneNumber: result.data.phoneNumber || "",
          postalAddress: result.data.postalAddress || "",
          postalCode: result.data.postalCode || "",
          city: result.data.city || "",
          country: result.data.country || "", // Default value
          timeZone: result.data.timeZone || "",
          language: result.data.language || "", // Default value
          logo: result.data.logo || "", // Logo URL
          brandName: result.data.brandName || "", // Brand Name (for Admin)
          copyright: result.data.copyright || "", // Copyright (for Admin)
        });
        // Set logo preview if logo exists (always set, even if empty, to clear previous preview)
        if (result.data.logo) {
          setLogoPreview(result.data.logo);
        } else {
          setLogoPreview(null); // Clear preview if no logo
        }
      } else {
        showError('You do not have permission to access this resource.', 'Unauthorized');
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      showError('Something went wrong. Please try again later.', 'Error');
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  // Handle logo file selection
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError('Please select an image file', 'Invalid File Type');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('File size should be less than 5MB', 'File Too Large');
        return;
      }
      setLogoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let result;
      
      // If logo file is selected, send everything as FormData
      if (logoFile) {
        const formData = new FormData();
        formData.append('logo', logoFile);
        // Append all profile fields
        Object.keys(profile).forEach(key => {
          if (key !== 'logo') {
            formData.append(key, profile[key] || '');
          }
        });
        
        result = await postDataContent(base.updateProfile, formData);
      } else {
        // No logo file, send as regular JSON
        const profileData = { ...profile };
        result = await postData(base.updateProfile, profileData);
      }
      
      console.log("Server Response:", result);

      // Handle different response structures
      // postData returns axios response object: { data: { status, message, data } }
      // postDataContent returns response.data directly: { status, message, data }
      let responseData;
      if (result?.data && typeof result.data === 'object' && 'status' in result.data) {
        // postData response structure
        responseData = result.data;
      } else {
        // postDataContent response structure (already the data)
        responseData = result;
      }

      const isSuccess = responseData?.status === true;
      const message = responseData?.message;

      if (isSuccess) {
        showSuccess(message || "Profile updated successfully", "Success");
        setLogoFile(null); // Clear logo file after successful upload
        // Refresh profile to get updated data including logo
        await getProfile();
        // Also refresh userProfile context to update logo in Nav/SideBar
        if (refreshUserProfile) {
          await refreshUserProfile();
        }
        // Refresh the page after successful update
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        showError(message || "Failed to update profile", "Error");
      }
    } catch (error) {
      console.error("Error Submitting form:", error);
      showError("Something went wrong. Please try again later.", "Error");
    }
  };

  return {
    profile,
    handleChange,
    handleSubmit,
    handleLogoChange,
    logoPreview,
    logoFile,
  };
};

export default useProfileController;
