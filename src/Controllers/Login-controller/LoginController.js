import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData, getData } from "../../Services/Ops";
import { base } from "../../Constants/Data.constant";
import useLocalStorage from "use-local-storage";
import { useUserProfile } from "../../Context/UserProfileContext";
import { showSuccess, showError } from "../../Utils/Notification";
import Swal from "sweetalert2";


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
      const userId = loginData.userId || loginData.profile?._id || loginData._id;
      const userRole = loginData.profile?.role || loginData.role;
      
      // Check membership BEFORE completing login for company role users
      if (userRole === "company") {
        try {
          let hasActiveMembership = false;
          
          // FIRST CHECK: Check if user has membershipId in users collection (from loginData)
          const userMembershipId = loginData.profile?.membershipId || loginData.membershipId;
          console.log("=== MEMBERSHIP CHECK DEBUG ===");
          console.log("User membershipId from loginData:", userMembershipId);
          console.log("Full loginData:", loginData);
          console.log("loginData.profile:", loginData.profile);
          
          if (userMembershipId && userMembershipId.trim() !== '') {
            // User has membershipId in users collection - allow login
            console.log("✅✅✅ User has membershipId in users collection - allowing login ✅✅✅");
            hasActiveMembership = true;
          } else {
            // SECOND CHECK: Check membershipusers collection via API
            // IMPORTANT: We need to use the token from login response to check membership
            // The membership API requires authentication
            const token = loginData.token;
            
            // Temporarily store token to use getData function
            const originalToken = localStorage.getItem("token");
            localStorage.setItem("token", token);
            
            // Use getData which handles axios and response structure properly
            const membershipResult = await getData(`${base.userMemberships}?userId=${userId}`);
            
            // Restore original token (or remove if it didn't exist)
            if (originalToken !== null) {
              localStorage.setItem("token", originalToken);
            } else {
              localStorage.removeItem("token");
            }
            
            console.log("Raw membership result:", membershipResult);
            console.log("Result type:", typeof membershipResult);
            console.log("Result keys:", membershipResult ? Object.keys(membershipResult) : 'null');
            
            let activeMembership = null;
            let allMemberships = [];
          
          // Extract data based on getData response structure
          // getData typically returns: { data: { status: true, data: {...} } }
          // Or sometimes: { status: true, data: {...} }
          
          let responseData = null;
          
          // Try to get the actual data object
          if (membershipResult?.data?.status === true && membershipResult?.data?.data) {
            // Structure: { data: { status: true, data: { activeMembership: {...}, allMemberships: [...] } } }
            responseData = membershipResult.data.data;
            console.log("Using nested structure (data.data.data)");
          } else if (membershipResult?.data?.status === true) {
            // Structure: { data: { status: true, ... } }
            responseData = membershipResult.data;
            console.log("Using data structure (data.data)");
          } else if (membershipResult?.status === true && membershipResult?.data) {
            // Structure: { status: true, data: { activeMembership: {...}, allMemberships: [...] } }
            responseData = membershipResult.data;
            console.log("Using direct structure (data)");
          } else if (membershipResult?.data) {
            // Structure: { data: { activeMembership: {...}, allMemberships: [...] } }
            responseData = membershipResult.data;
            console.log("Using simple data structure");
          } else {
            responseData = membershipResult;
            console.log("Using result directly");
          }
          
          console.log("Extracted responseData:", responseData);
          console.log("ResponseData keys:", responseData ? Object.keys(responseData) : 'null');
          
          // Extract activeMembership
          if (responseData?.activeMembership) {
            activeMembership = responseData.activeMembership;
            console.log("✅ Found activeMembership:", activeMembership);
          } else {
            console.log("⚠️ activeMembership not found in responseData");
          }
          
          // Extract allMemberships
          if (responseData?.allMemberships && Array.isArray(responseData.allMemberships)) {
            allMemberships = responseData.allMemberships;
            console.log("✅ Found allMemberships array with", allMemberships.length, "items");
          } else if (Array.isArray(responseData)) {
            allMemberships = responseData;
            console.log("✅ ResponseData is array with", allMemberships.length, "items");
          } else {
            console.log("⚠️ allMemberships not found or not an array");
          }
          
          // If activeMembership is null but we have allMemberships, find active one
          if (!activeMembership && allMemberships && allMemberships.length > 0) {
            console.log("🔍 Searching for active membership in allMemberships...");
            const now = new Date();
            
            // Sort by purchaseDate descending to get most recent first
            const sortedMemberships = [...allMemberships].sort((a, b) => {
              const dateA = new Date(a.purchaseDate || a.createdAt || 0);
              const dateB = new Date(b.purchaseDate || b.createdAt || 0);
              return dateB - dateA;
            });
            
            console.log("Sorted memberships count:", sortedMemberships.length);
            
            // Find first membership that is not expired and not deleted
            for (let i = 0; i < sortedMemberships.length; i++) {
              const mem = sortedMemberships[i];
              const expiryDate = new Date(mem.expiryDate);
              const status = (mem.status || '').toLowerCase();
              const isDeleted = mem.is_deleted === 1 || mem.is_deleted === true;
              
              console.log(`Membership ${i + 1}:`, {
                _id: mem._id,
                status: mem.status,
                expiryDate: mem.expiryDate,
                expiryDateObj: expiryDate,
                currentDate: now,
                isExpired: expiryDate <= now,
                isDeleted: isDeleted,
                isValid: !isDeleted && expiryDate > now
              });
              
              if (!isDeleted && expiryDate > now) {
                // If membership is not expired and not deleted, use it (ignore status)
                activeMembership = mem;
                console.log("✅ Found active membership from allMemberships:", activeMembership);
                break;
              } else {
                console.log(`❌ Membership ${i + 1} is expired or deleted`);
              }
            }
          }
          
          // Final validation of activeMembership
          if (activeMembership) {
            const expiryDate = new Date(activeMembership.expiryDate);
            const currentDate = new Date();
            const status = (activeMembership.status || '').toLowerCase();
            const isDeleted = activeMembership.is_deleted === 1 || activeMembership.is_deleted === true;
            
            console.log("=== FINAL VALIDATION ===");
            console.log("Active Membership:", {
              _id: activeMembership._id,
              expiryDate: activeMembership.expiryDate,
              expiryDateObj: expiryDate,
              expiryDateISO: expiryDate.toISOString(),
              currentDate: currentDate,
              currentDateISO: currentDate.toISOString(),
              isExpired: expiryDate <= currentDate,
              timeDiff: expiryDate.getTime() - currentDate.getTime(),
              status: activeMembership.status,
              statusLower: status,
              isDeleted: isDeleted
            });
            
            // Check expiry with some buffer (allow if expires in future)
            const isNotExpired = expiryDate.getTime() > currentDate.getTime();
            
            if (isNotExpired && !isDeleted) {
              // If membership is not expired and not deleted, allow login regardless of status
              hasActiveMembership = true;
              console.log("✅✅✅ USER HAS ACTIVE MEMBERSHIP - ALLOWING LOGIN ✅✅✅");
              console.log("Membership details:", {
                _id: activeMembership._id,
                expiryDate: expiryDate.toISOString(),
                status: activeMembership.status,
                isNotExpired: isNotExpired,
                isNotDeleted: !isDeleted
              });
            } else {
              console.log("❌ Membership expired or deleted. Expiry:", expiryDate.toISOString(), "Current:", currentDate.toISOString(), "Deleted:", isDeleted);
            }
          } else {
            console.log("❌❌❌ NO ACTIVE MEMBERSHIP FOUND FOR USER ❌❌❌");
            
            // Last resort: If we have any memberships at all, check if any is valid
            if (allMemberships && allMemberships.length > 0) {
              console.log("🔄 Last resort: Checking all memberships for any valid one...");
              const now = new Date();
              
              for (const mem of allMemberships) {
                try {
                  const expiryDate = new Date(mem.expiryDate);
                  const isDeleted = mem.is_deleted === 1 || mem.is_deleted === true;
                  
                  if (!isDeleted && expiryDate.getTime() > now.getTime()) {
                    console.log("✅ Found valid membership in last resort check:", mem._id);
                    hasActiveMembership = true;
                    activeMembership = mem;
                    break;
                  }
                } catch (e) {
                  console.error("Error checking membership:", e);
                }
              }
            }
          }
          }
          
          if (hasActiveMembership) {
            // Company user has active membership - NOW complete login
            localStorage.setItem("token", loginData.token);
            localStorage.setItem("userData", typeof loginData === 'string' ? loginData : JSON.stringify(loginData));
            setUserProfile(loginData);
            
            // Silently fetch permissions without blocking login or showing errors
            getPermissoin().catch(() => {
              // Silently handle permission fetch failures
            });
            
            setTimeout(() => {
              window.location.href = "/Dashboard";
            }, 100);
          } else {
            // Company user has no active membership - DON'T complete login
            // Store login credentials temporarily for after payment (but don't store token/userData yet)
            localStorage.setItem("pendingLogin", JSON.stringify({
              email: email,
              password: password,
              loginData: loginData,
              userId: userId
            }));
            
            // Clear any existing login data
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            
            // Don't redirect - trigger membership popup in Login component
            // Dispatch custom event to show membership plans popup
            window.dispatchEvent(new CustomEvent('membershipRequired'));
            
            // Show info message
            Swal.fire({
              icon: 'info',
              title: 'Membership Required',
              html: `
                <p>You need an active membership to access your account.</p>
                <p>Please select a membership plan from the popup to continue.</p>
              `,
              confirmButtonText: 'OK',
              allowOutsideClick: false,
              allowEscapeKey: false
            });
          }
        } catch (error) {
          console.error("Error checking membership:", error);
          // If membership check fails for company user, don't complete login
          localStorage.setItem("pendingLogin", JSON.stringify({
            email: email,
            password: password,
            loginData: loginData,
            userId: userId
          }));
          
          // Clear any existing login data
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
          
          // Dispatch custom event to show membership plans popup
          window.dispatchEvent(new CustomEvent('membershipRequired'));
          
          Swal.fire({
            icon: 'warning',
            title: 'Membership Verification Failed',
            html: `
              <p>Unable to verify your membership status.</p>
              <p>Please select a membership plan from the popup to continue.</p>
            `,
            confirmButtonText: 'OK',
            allowOutsideClick: false,
            allowEscapeKey: false
          });
        }
        return; // Don't proceed with login completion
      }
      
      // For Admin and employee users - complete login directly (no membership check needed)
      if (userRole === "Admin" || userRole === "employee") {
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
        return;
      }
      
      // For any other role, complete login without membership check
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("userData", typeof loginData === 'string' ? loginData : JSON.stringify(loginData));
      setUserProfile(loginData);
      getPermissoin().catch(() => {});
      setTimeout(() => {
        window.location.href = "/Dashboard";
      }, 100);
      
    } else {
      showError(result.message || "Login failed", "Unauthorized");
      setIsLoading(false);
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
