// UserProfileContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { base } from '../Constants/Data.constant';
import { getData } from '../Services/Ops';

// Create the context
const UserProfileContext = createContext();

// Create a provider component
export const UserProfileProvider =  ({ children }) => {
    // Initialize from localStorage first for instant loading
    const getInitialProfile = () => {
        const userData = localStorage.getItem("userData");
        if (userData) {
            try {
                const parsed = typeof userData === 'string' ? JSON.parse(userData) : userData;
                if (parsed && parsed.role) {
                    return parsed;
                }
            } catch (e) {
                console.error("Error parsing userData:", e);
            }
        }
        return {};
    };

    const [userProfile, setUserProfile] = useState(getInitialProfile());
    const [userPermission, setUserPermission] = useState([]);

    useEffect(() => {
        // Load both profile and permissions in parallel for faster loading
        const loadUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setUserProfile({});
                setUserPermission([]);
                return;
            }

            try {
                const [profileResult, permissionResult] = await Promise.allSettled([
                    getData(base.userProfile),
                    getData(base.myPermission)
                ]);
                
                // Handle profile result
                if (profileResult.status === 'fulfilled' && profileResult.value && profileResult.value.status === true) {
                    setUserProfile(profileResult.value.data);
                    // Update localStorage with fresh data
                    localStorage.setItem("userData", JSON.stringify(profileResult.value.data));
                } else if (profileResult.status === 'rejected') {
                    // Silently handle profile errors - only log if critical
                    // Keep existing localStorage data if available
                }
                
                // Handle permission result - completely silent, no errors or logs
                if (permissionResult.status === 'fulfilled' && permissionResult.value) {
                    if (permissionResult.value.status === true) {
                        setUserPermission(permissionResult.value.data);
                    } else {
                        // Permission fetch failed - silently set empty array
                        // No console logs, no errors, no warnings
                        setUserPermission([]);
                    }
                } else if (permissionResult.status === 'rejected') {
                    // Permission fetch error - completely silent
                    // This is normal for Admin users and some company users
                    setUserPermission([]);
                }
            } catch (error) {
                // Silently handle any errors - don't log permission-related errors
                // If API fails but we have localStorage data, keep it
                if (!userProfile || !userProfile.role) {
                    const stored = getInitialProfile();
                    if (stored && stored.role) {
                        setUserProfile(stored);
                    }
                }
            }
        };
        
        loadUserData();
    }, []);
    
    const getPermissoin = async () => {
        try {
            // Skip permission fetch for Admin users - they don't have UserPermission records
            const currentProfile = userProfile && userProfile.role ? userProfile : getInitialProfile();
            if (currentProfile && currentProfile.role === "Admin") {
                setUserPermission([]);
                return; // Don't make API call for Admin users
            }
            
            const result = await getData(base.myPermission);
            // Always set empty array if status is false or data is empty
            // This prevents any error messages from appearing
            if (result && result.status === true && result.data && Array.isArray(result.data) && result.data.length > 0) {
                setUserPermission(result.data);
            } else {
                // Silently handle permission fetch failures - set empty array
                // No console logs, no errors, no warnings - completely silent
                setUserPermission([]);
            }
        } catch (error) { 
            // Silently handle permission fetch errors without blocking or logging
            setUserPermission([]);
        }
    };

    const getProfile = async () => {
        try {
            const result = await getData(base.userProfile);
            if (result && result.status === true) {
                setUserProfile(result.data);
                // Update localStorage with fresh data
                localStorage.setItem("userData", JSON.stringify(result.data));
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };
    return (
        <UserProfileContext.Provider value={{ userProfile, userPermission, setUserProfile,getPermissoin,getProfile }}>
            {children}
        </UserProfileContext.Provider>
    );
};

// Custom hook for using UserProfileContext
export const useUserProfile = () => {
    return useContext(UserProfileContext);
};
