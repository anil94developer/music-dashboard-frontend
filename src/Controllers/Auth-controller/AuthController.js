import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getData, postData } from "../../Services/Ops";
import { base } from "../../Constants/Data.constant";
import useLocalStorage from "use-local-storage";


const AuthController = (props) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState("");
    


    const handleLogout = () => { 
        // Swal.fire({
        //     title: "Are you sure?",
        //     text: "You will be logged out of your account!",
        //     icon: "warning",
            // showCancelButton: true,
            // confirmButtonText: "Yes, Logout",
            // cancelButtonText: "No, Stay",
            // reverseButtons: true, // Optional: swaps the position of Yes/No buttons
        // })
            // if (result.isConfirmed) { 
                localStorage.clear();
                sessionStorage.clear(); 
                navigate("/");
    
                // Show a success message
                // Swal.fire({
                //     title: "Logged out!",
                //     text: "You have been logged out successfully.",
                //     icon: "success",
                //     timer: 2000,
                //     showConfirmButton: false,
                // });
            // }
         
    };

    return { 
        handleLogout,
    };
};
export default AuthController;
