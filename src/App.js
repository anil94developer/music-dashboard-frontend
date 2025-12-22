import { useEffect, useState, Suspense, lazy, useMemo } from 'react'
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { UserProfileProvider, useUserProfile } from "./Context/UserProfileContext";
import { ProtectedRoute } from "./Components/Common/ProtectedRoute";
import { postData } from "./Services/Ops";
import { base } from "./Constants/Data.constant";
import './Components/Common/ResponsiveStyles.css'

// Lazy load all components for better performance
const Login = lazy(() => import("./Components/Login/Login").then(module => ({ default: module.Login })));
const Dashboard = lazy(() => import("./Components/Dashboard/Dashboard").then(module => ({ default: module.Dashboard })));
const OneRelease = lazy(() => import("./Components/One-release/OneRelease").then(module => ({ default: module.OneRelease })));
const MainStep = lazy(() => import("./Components/One-release/MainStep").then(module => ({ default: module.MainStep })));
const AllRelease = lazy(() => import("./Components/AllRelease/AllRelease").then(module => ({ default: module.AllRelease })));
const AllTracks = lazy(() => import("./Components/AllTracks/AllTracks").then(module => ({ default: module.AllTracks })));
const DailyTreads = lazy(() => import("./Components/DailyTreads/DailyTreads"));
const Profile = lazy(() => import("./Components/Profile/Profile"));
const BankInformation = lazy(() => import("./Components/BankInformation/BankInformation"));
const Support = lazy(() => import("./Components/Support/Support"));
const Password = lazy(() => import("./Components/Password/Password"));
const UserMangement = lazy(() => import("./Components/UserMangement/UserMangement"));
const PaymentOperations = lazy(() => import("./Components/PaymentOperations/PaymentOperations"));
const FinancialReport = lazy(() => import("./Components/FinancialReports/FinancialReports"));
const UserAccessForm = lazy(() => import("./Components/UserAccess/UserAccessForm"));
const AllDraft = lazy(() => import("./Components/AllDraft/AllDraft").then(module => ({ default: module.AllDraft })));
const ReleaseDetails = lazy(() => import("./Components/AllRelease/ReleaseDetails").then(module => ({ default: module.ReleaseDetails })));
const FinalSubmit = lazy(() => import("./Components/One-release/FinalSubmit"));
const EditUserPermission = lazy(() => import("./Components/UserAccess/EditUserPermssion"));
const UserAccess = lazy(() => import("./Components/UserAccess/UserAccess"));
const WithdrawRequest = lazy(() => import("./Components/Withdraw Request/WithdrawRequest"));
const AllTranscations = lazy(() => import("./Components/AllTranscations/AllTranscations"));
const Upload = lazy(() => import("./Components/Upload/Upload"));
const UserDetails = lazy(() => import("./Components/UserMangement/UserDetails"));
const CompanyManagement = lazy(() => import("./Components/CompanyMangement/CompanyMangement"));
const AddCompany = lazy(() => import("./Components/CompanyMangement/AddCompany"));
const CompanyDetails = lazy(() => import("./Components/CompanyMangement/CompanyDetails"));
const ForgetPassword = lazy(() => import("./Components/Login/ForgetPassword").then(module => ({ default: module.ForgetPassword })));
const Report = lazy(() => import("./Components/Report/Report"));
const ReportUpload = lazy(() => import("./Components/CompanyMangement/ReportUpload"));
const TopStoreReport = lazy(() => import("./Components/Report/TopStore"));
const ReportMarket = lazy(() => import("./Components/Report/Market"));
const ReportTrack = lazy(() => import("./Components/Report/Track"));
const Dailytopstore = lazy(() => import("./Components/DailyTreads/TreadTopStore"));
const DailyMarket = lazy(() => import("./Components/DailyTreads/TreadMarket"));
const DailyTrack = lazy(() => import("./Components/DailyTreads/DailyTrack"));
const DailyStream = lazy(() => import("./Components/DailyTreads/DailyStream"));
const Membership = lazy(() => import("./Components/Membership/Membership"));
const UserPlan = lazy(() => import("./Components/UserPlan/UserPlan"));

// Loading component
const PageLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    flexDirection: 'column',
    gap: '20px'
  }}>
    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
      <span className="visually-hidden">Loading...</span>
    </div>
    <p style={{ color: '#667eea', fontSize: '16px', fontWeight: 500 }}>Loading page...</p>
  </div>
);

// Prefetch routes based on user role for instant loading
const prefetchRoutes = (role) => {
  if (role === "Admin") {
    // Prefetch admin routes
    import("./Components/Dashboard/Dashboard");
    import("./Components/CompanyMangement/CompanyMangement");
    import("./Components/AllRelease/AllRelease");
  } else if (role === "company") {
    // Prefetch company routes
    import("./Components/Dashboard/Dashboard");
    import("./Components/One-release/OneRelease");
    import("./Components/AllRelease/AllRelease");
    import("./Components/DailyTreads/DailyTreads");
  } else if (role === "employee") {
    // Prefetch employee routes
    import("./Components/Dashboard/Dashboard");
    import("./Components/One-release/OneRelease");
  }
};

// Public Route Component (for login, forget password)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("userData");
  
  // If user is already logged in, redirect to dashboard
  if (token && userData) {
    try {
      const parsedUser = typeof userData === 'string' ? JSON.parse(userData) : userData;
      if (parsedUser && parsedUser.role) {
        return <Navigate to="/Dashboard" replace />;
      }
    } catch (e) {
      // If parsing fails, allow access to public route
    }
  }
  
  return children;
};

function App() {
  const { userProfile, getPermissoin, getProfile, setUserProfile } = useUserProfile()
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  // Handle auto-login from new window - MUST run first before other initialization
  useEffect(() => {
    const handleAutoLogin = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const autoLoginKey = urlParams.get('autoLogin');
      
      if (autoLoginKey) {
        try {
          const autoLoginData = localStorage.getItem(autoLoginKey);
          if (autoLoginData) {
            const loginInfo = JSON.parse(autoLoginData);
            
            // Check if data is not too old (10 minutes for incognito windows)
            if (Date.now() - loginInfo.timestamp < 10 * 60 * 1000) {
              if (loginInfo.token && loginInfo.userData) {
                // Set user profile and token immediately
                const userData = loginInfo.userData;
                
                // Store in localStorage (ensure it's stringified)
                localStorage.setItem("token", loginInfo.token);
                localStorage.setItem("userData", typeof userData === 'string' ? userData : JSON.stringify(userData));
                
                // Set user profile in context
                if (setUserProfile) {
                  setUserProfile(typeof userData === 'string' ? JSON.parse(userData) : userData);
                }
                
                // Clean up the auto-login key
                localStorage.removeItem(autoLoginKey);
                
                // Remove autoLogin from URL immediately
                window.history.replaceState({}, document.title, window.location.pathname);
                
                // Force immediate redirect to dashboard
                setTimeout(() => {
                  window.location.replace("/Dashboard");
                }, 100);
                return;
              } else if (loginInfo.needsLogin && loginInfo.email) {
                // If login is needed, try company default password first, then other defaults
                const companyDefaultPassword = 'company123';
                const defaultPasswords = [companyDefaultPassword, '123456', 'password', 'Password@123', 'admin123'];
                
                for (const password of defaultPasswords) {
                  try {
                    const loginBody = { email: loginInfo.email, password };
                    const loginResponse = await postData(base.login, loginBody);
                    
                    if (loginResponse?.data?.status === true && loginResponse?.data?.data) {
                      const loginData = loginResponse.data.data;
                      
                      // Store properly
                      localStorage.setItem("token", loginData.token);
                      localStorage.setItem("userData", typeof loginData === 'string' ? loginData : JSON.stringify(loginData));
                      
                      if (setUserProfile) {
                        setUserProfile(typeof loginData === 'string' ? JSON.parse(loginData) : loginData);
                      }
                      
                      localStorage.removeItem(autoLoginKey);
                      window.history.replaceState({}, document.title, window.location.pathname);
                      
                      setTimeout(() => {
                        window.location.replace("/Dashboard");
                      }, 100);
                      return;
                    }
                  } catch (err) {
                    continue;
                  }
                }
              }
            } else {
              // Data expired
              localStorage.removeItem(autoLoginKey);
            }
          } else {
            // Key not found - might be in different window context (incognito)
            // Extract userId from the key and try to login
            const keyParts = autoLoginKey.split('_');
            if (keyParts.length >= 4) {
              const userId = keyParts.slice(3).join('_'); // Get userId from key
              
              // Try to fetch user data and login
              try {
                const { postData } = await import('./Services/Ops');
                const { base } = await import('./Constants/Data.constant');
                
                // Fetch user details
                const userResult = await postData(base.getUser, { userId });
                
                if (userResult?.data?.status === true && userResult?.data?.data) {
                  const userData = userResult.data.data;
                  const email = userData.email;
                  
                  // Try company default password first, then other defaults
                  const companyDefaultPassword = 'company123';
                  const defaultPasswords = [companyDefaultPassword, '123456', 'password', 'Password@123', 'admin123'];
                  let loginSuccess = false;
                  
                  for (const password of defaultPasswords) {
                    try {
                      const loginBody = { email, password };
                      const loginResponse = await postData(base.login, loginBody);
                      
                      if (loginResponse?.data?.status === true && loginResponse?.data?.data) {
                        const loginData = loginResponse.data.data;
                        
                        // Store in localStorage
                        localStorage.setItem("token", loginData.token);
                        localStorage.setItem("userData", typeof loginData === 'string' ? loginData : JSON.stringify(loginData));
                        
                        if (setUserProfile) {
                          setUserProfile(typeof loginData === 'string' ? JSON.parse(loginData) : loginData);
                        }
                        
                        // Remove autoLogin from URL
                        window.history.replaceState({}, document.title, window.location.pathname);
                        
                        // Redirect to dashboard
                        setTimeout(() => {
                          window.location.replace("/Dashboard");
                        }, 100);
                        loginSuccess = true;
                        return;
                      }
                    } catch (err) {
                      continue;
                    }
                  }
                  
                  if (!loginSuccess) {
                    // If login fails, redirect to login page with message
                    window.history.replaceState({}, document.title, window.location.pathname);
                    window.location.href = "/?error=autoLoginFailed";
                  }
                } else {
                  window.history.replaceState({}, document.title, window.location.pathname);
                  window.location.href = "/?error=userNotFound";
                }
              } catch (error) {
                console.error("Auto-login error (incognito):", error);
                window.history.replaceState({}, document.title, window.location.pathname);
                window.location.href = "/?error=autoLoginError";
              }
            } else {
              // Invalid key format
              window.history.replaceState({}, document.title, window.location.pathname);
              window.location.href = "/?error=invalidKey";
            }
          }
        } catch (error) {
          console.error("Auto-login error:", error);
          // On error, redirect to login page
          window.location.href = "/";
        }
      }
    };
    
    // Run immediately, don't wait for other effects
    handleAutoLogin();
  }, [setUserProfile]);

  // Initialize from localStorage first for instant loading
  // This should run AFTER auto-login check
  useEffect(() => {
    // Skip initialization if auto-login is in progress
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('autoLogin')) {
      return; // Let auto-login handler do its work first
    }
    
    const initializeApp = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("userData");
      
      // If we have stored data, set it immediately for instant route loading
      if (token && userData) {
        try {
          const parsedUser = typeof userData === 'string' ? JSON.parse(userData) : userData;
          if (parsedUser && parsedUser.role) {
            // Prefetch routes for instant loading
            prefetchRoutes(parsedUser.role);
            setIsInitialized(true);
          } else if (userProfile?.role) {
            prefetchRoutes(userProfile.role);
            setIsInitialized(true);
          }
        } catch (e) {
          setIsInitialized(true);
        }
      } else {
        setIsInitialized(true);
      }
      
      // Fetch fresh data in background
      if (!userProfile || !userProfile.role) {
        if (getProfile) {
          try {
            await getProfile();
          } catch (error) {
            // Silently handle profile fetch errors
          }
        }
        // Silently fetch permissions without blocking or showing errors
        if (getPermissoin) {
          try {
            await getPermissoin();
          } catch (error) {
            // Silently handle permission fetch failures - no logging or errors
            // This is expected for Admin and some company users
          }
        }
      } else {
        // Prefetch routes when profile is loaded
        prefetchRoutes(userProfile.role);
      }
    };
    
    initializeApp();
  }, [userProfile?.role]);

  // Get user role from localStorage or context for instant route determination
  const getUserRole = () => {
    if (userProfile?.role) return userProfile.role;
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsed = typeof userData === 'string' ? JSON.parse(userData) : userData;
        return parsed?.role;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const userRole = getUserRole();

  // Memoize routes to prevent recreation on every render
  const adminRoute = useMemo(() => (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>}></Route>
        <Route path="/forgetpassword" element={<PublicRoute><ForgetPassword /></PublicRoute>}></Route>
        <Route path="/Dashboard" element={<ProtectedRoute allowedRoles={["Admin"]}><Dashboard /></ProtectedRoute>}></Route>
        <Route path="/CompanyManagement" element={<ProtectedRoute allowedRoles={["Admin"]}><CompanyManagement /></ProtectedRoute>}></Route>
        <Route path="/CompanyDetails" element={<ProtectedRoute allowedRoles={["Admin"]}><CompanyDetails /></ProtectedRoute>}></Route>
        <Route path="All releases" element={<ProtectedRoute allowedRoles={["Admin"]}><AllRelease /></ProtectedRoute>}></Route>
        <Route path="/all tracks" element={<ProtectedRoute allowedRoles={["Admin"]}><AllTracks /></ProtectedRoute>}></Route>
        <Route path="/main-step" element={<ProtectedRoute allowedRoles={["Admin"]}><MainStep /></ProtectedRoute>}></Route>
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}></Route>
        <Route path="/AddCompany" element={<ProtectedRoute allowedRoles={["Admin"]}><AddCompany /></ProtectedRoute>}></Route>
        <Route path="/release-details" element={<ProtectedRoute><ReleaseDetails /></ProtectedRoute>}></Route>
        <Route path="/Withdraw Request" element={<ProtectedRoute allowedRoles={["Admin"]}><WithdrawRequest /></ProtectedRoute>}></Route>
        <Route path="/All Transcations" element={<ProtectedRoute allowedRoles={["Admin"]}><AllTranscations /></ProtectedRoute>}></Route>
        <Route path="/ReportUpload" element={<ProtectedRoute allowedRoles={["Admin"]}><ReportUpload /></ProtectedRoute>}></Route>
        <Route path="/Membership" element={<ProtectedRoute allowedRoles={["Admin"]}><Membership /></ProtectedRoute>}></Route>
        <Route path="/UserPlan" element={<ProtectedRoute allowedRoles={["Admin"]}><UserPlan /></ProtectedRoute>}></Route>
        <Route path="*" element={<Navigate to="/Dashboard" replace />}></Route>
    </Routes>
    </Suspense>
  ), []);

  const companyRoute = useMemo(() => (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>}></Route>
        <Route path="/forgetpassword" element={<PublicRoute><ForgetPassword /></PublicRoute>}></Route>
        <Route path="/Dashboard" element={<ProtectedRoute allowedRoles={["company"]}><Dashboard /></ProtectedRoute>}></Route>
        <Route path="/One Release" element={<ProtectedRoute allowedRoles={["company"]}><OneRelease /></ProtectedRoute>}></Route>
        <Route path="/main-step" element={<ProtectedRoute allowedRoles={["company"]}><MainStep /></ProtectedRoute>}></Route>
        <Route path="All releases" element={<ProtectedRoute allowedRoles={["company"]}><AllRelease /></ProtectedRoute>}></Route>
        <Route path="/final-submit" element={<ProtectedRoute allowedRoles={["company"]}><FinalSubmit /></ProtectedRoute>}></Route>
        <Route path="/All drafts" element={<ProtectedRoute allowedRoles={["company"]}><AllDraft /></ProtectedRoute>}></Route>
        <Route path="/all tracks" element={<ProtectedRoute allowedRoles={["company"]}><AllTracks /></ProtectedRoute>}></Route>
        <Route path="/Daily Trends" element={<ProtectedRoute allowedRoles={["company"]}><DailyTreads /></ProtectedRoute>}></Route>
        <Route path="/Dailytopstore" element={<ProtectedRoute allowedRoles={["company"]}><Dailytopstore /></ProtectedRoute>}></Route>
        <Route path="/DailyMarket" element={<ProtectedRoute allowedRoles={["company"]}><DailyMarket /></ProtectedRoute>}></Route>
        <Route path="/DailyTrack" element={<ProtectedRoute allowedRoles={["company"]}><DailyTrack /></ProtectedRoute>}></Route>
        <Route path="/DailyStream" element={<ProtectedRoute allowedRoles={["company"]}><DailyStream /></ProtectedRoute>}></Route>
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}></Route>
        <Route path="/bank information" element={<ProtectedRoute allowedRoles={["company"]}><BankInformation /></ProtectedRoute>}></Route>
        <Route path="/support" element={<ProtectedRoute allowedRoles={["company"]}><Support /></ProtectedRoute>}></Route>
        <Route path="/password change" element={<ProtectedRoute><Password /></ProtectedRoute>}></Route>
        <Route path="/user access" element={<ProtectedRoute allowedRoles={["company"]}><UserAccess /></ProtectedRoute>}></Route>
        <Route path="/Withdraw Request" element={<ProtectedRoute allowedRoles={["company"]}><WithdrawRequest /></ProtectedRoute>}></Route>
        <Route path="/add-user" element={<ProtectedRoute allowedRoles={["company"]}><UserAccessForm /></ProtectedRoute>}></Route>
        <Route path="/release-details" element={<ProtectedRoute><ReleaseDetails /></ProtectedRoute>}></Route>
        <Route path="/edit-permission" element={<ProtectedRoute allowedRoles={["company"]}><EditUserPermission /></ProtectedRoute>}></Route>
        <Route path="/Payment Operations" element={<ProtectedRoute allowedRoles={["company"]}><PaymentOperations /></ProtectedRoute>}></Route>
        <Route path="/Financial Report" element={<ProtectedRoute allowedRoles={["company"]}><FinancialReport /></ProtectedRoute>}></Route>
        <Route path="/multiple-release" element={<ProtectedRoute allowedRoles={["company"]}><Dashboard /></ProtectedRoute>}></Route>
        <Route path="/Report" element={<ProtectedRoute allowedRoles={["company"]}><Report /></ProtectedRoute>}></Route>
        <Route path="/ReportTopStore" element={<ProtectedRoute allowedRoles={["company"]}><TopStoreReport /></ProtectedRoute>}></Route>
        <Route path="/ReportMarket" element={<ProtectedRoute allowedRoles={["company"]}><ReportMarket /></ProtectedRoute>}></Route>
        <Route path="/ReportTrack" element={<ProtectedRoute allowedRoles={["company"]}><ReportTrack /></ProtectedRoute>}></Route>
        <Route path="*" element={<Navigate to="/Dashboard" replace />}></Route>
    </Routes>
    </Suspense>
  ), []);

  const employeeRoute = useMemo(() => (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>}></Route>
        <Route path="/forgetpassword" element={<PublicRoute><ForgetPassword /></PublicRoute>}></Route>
        <Route path="/Dashboard" element={<ProtectedRoute allowedRoles={["employee"]}><Dashboard /></ProtectedRoute>}></Route>
        <Route path="/One Release" element={<ProtectedRoute allowedRoles={["employee"]}><OneRelease /></ProtectedRoute>}></Route>
        <Route path="/main-step" element={<ProtectedRoute allowedRoles={["employee"]}><MainStep /></ProtectedRoute>}></Route>
        <Route path="All releases" element={<ProtectedRoute allowedRoles={["employee"]}><AllRelease /></ProtectedRoute>}></Route>
        <Route path="/final-submit" element={<ProtectedRoute allowedRoles={["employee"]}><FinalSubmit /></ProtectedRoute>}></Route>
        <Route path="/All drafts" element={<ProtectedRoute allowedRoles={["employee"]}><AllDraft /></ProtectedRoute>}></Route>
        <Route path="/Daily Trends" element={<ProtectedRoute allowedRoles={["employee"]}><DailyTreads /></ProtectedRoute>}></Route>
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}></Route>
        <Route path="/password change" element={<ProtectedRoute><Password /></ProtectedRoute>}></Route>
        <Route path="/release-details" element={<ProtectedRoute><ReleaseDetails /></ProtectedRoute>}></Route>
        <Route path="/multiple-release" element={<ProtectedRoute allowedRoles={["employee"]}><Dashboard /></ProtectedRoute>}></Route>
        <Route path="*" element={<Navigate to="/Dashboard" replace />}></Route>
    </Routes>
    </Suspense>
  ), []);

  // Determine which route to render based on user role (instant from localStorage)
  const currentRoute = useMemo(() => {
    if (!isInitialized) {
      return <PageLoader />;
    }
    
    if (userRole === "employee") return employeeRoute;
    if (userRole === "company") return companyRoute;
    if (userRole === "Admin") return adminRoute;
    
    // Default to admin route if no role (will show login)
    return adminRoute;
  }, [userRole, isInitialized, adminRoute, companyRoute, employeeRoute]);

  return <div className='h-100'>
    {currentRoute}
  </div>

}

export default App;
