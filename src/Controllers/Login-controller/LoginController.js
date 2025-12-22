import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../../Services/Ops";
import { base } from "../../Constants/Data.constant";
import useLocalStorage from "use-local-storage";
import { useUserProfile } from "../../Context/UserProfileContext";
import { showSuccess, showError } from "../../Utils/Notification";


const LoginController = (props) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUserProfile ,setUserPermission,getPermissoin} = useUserProfile()


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsLoading(false);
    let body = {
      email: email,
      password: password,
    };

    let result = await postData(base.login, body);
    console.log("login result==========>",result);
    if (result.data.status === true) {
      const loginData = result.data.data;
      
      // Store data properly in localStorage (must be stringified)
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("userData", typeof loginData === 'string' ? loginData : JSON.stringify(loginData));
      
      // Set user profile in context
      setUserProfile(loginData);
      
      // Silently fetch permissions without blocking login or showing errors
      getPermissoin().catch(() => {
        // Silently handle permission fetch failures (especially for Admin users)
        // No error notification or console error needed
      });
      
      // Use window.location.href for immediate redirect to ensure navigation works
      setTimeout(() => {
        window.location.href = "/Dashboard";
      }, 100);
      
    } else {
      showError(result.message || "Login failed", "Unauthorized");
    }
  };

  return {
    handleSubmit,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
  };
};
export default LoginController;
