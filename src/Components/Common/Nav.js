import React, { useState, useEffect } from "react";
import { images } from "../../assets/images";
import { useUserProfile } from "../../Context/UserProfileContext";
import AuthController from "../../Controllers/Auth-controller/AuthController";
import { SideBar } from "./SideBar";
import "./RoleSpecificStyles.css";

export const Nav = (props) => {
  const { handleLogout } = AuthController()
  const { userPermission, userProfile } = useUserProfile()
  const [financialMenu, setFinancialMenu] = useState(false)
  const [subMenu, setSubMenu] = useState("")
  const [profileMenu, setProfileMenu] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  const renderIcon = (name) => {
    return name == "Dashboard" ? "fa fa-dashboard"
      : name == "One Release" ? "fa fa-caret-square-o-left"
        : name == "Catalog" ? "fa  fa-bullseye"
          : name == "Daily Trends" ? "fa fa-clock-o"
            : name == "Financial" ? "fa  fa-money"
              : name == "User Mangement" ? "fa fa-users"
                : name == "User Mangement" ? "fa fa-retweet"
                  : name == "Withdraw Request" ? "fa fa-sort-amount-asc"
                    : name == "All Transcations" ? "fa fa-random"
                      : "fa fa-sort-amount-asc"
  }

  const getNavbarClass = () => {
    if (userProfile?.role === "Admin") return "navbar admin-navbar";
    if (userProfile?.role === "company") return "navbar company-navbar";
    if (userProfile?.role === "employee") return "navbar employee-navbar";
    return "navbar";
  };

  return (
    <nav className={getNavbarClass()}>
      <div className="container-fluid">
        <div className="row align-items-center w-100">
          <div className="col-sm-6 col-6">
            <div className="topbar-left d-flex align-items-center">
              {userProfile?.logo && (
                <a className="navbar-brand" href="#" style={{ marginRight: '15px' }}>
                  <img 
                    className="img-fluid" 
                    src={userProfile.logo} 
                    alt="Logo" 
                    style={{ maxHeight: '40px', width: 'auto' }}
                    onError={(e) => {
                      e.target.src = require('../../assets/images/logo.png');
                    }}
                  />
                </a>
              )}
              <button className="d-block navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>
          </div>
          <div className="col-sm-6 col-6">
            <div className="topbar-left">
              <div className="navbar-collapse position-relative">
                <ul className="navbar-nav text-end">
                  <li className="nav-item dropdown">
                    <a 
                      className="nav-link dropdown-toggle" 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setDropdownVisible(!dropdownVisible);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <img src={images?.user} className="img-fluid" alt="User Image" />
                      <span className="user-name hidden-xs">{userProfile?.name}</span>
                    </a>
 
                    {userProfile?.role != "Admin" && <p>Client Number:- {userProfile.clientNumber}</p>}
                    
                    {dropdownVisible && (
                      <ul className="dropdown-menu position-absolute show" style={{ display: 'block', right: 0, left: 'auto' }}>
                        <li>
                          <a href="profile" className="dropdown-item">
                            <i className="fa fa-user"></i> Profile
                          </a>
                        </li>
                        {
                          userProfile?.role == "employee" &&
                          <li>
                            <a href="/bank information" className="dropdown-item">
                              <i className="fa fa-bank"></i> Bank Information
                            </a>
                          </li>
                        }
                        {userProfile.role === "company" && (
                          <>
                            <li>
                              <a href="/User Access" className="dropdown-item">
                                <i className="fa fa-sitemap"></i> User Access
                              </a>
                            </li>
                            <li>
                              <a href="/bank information" className="dropdown-item">
                                <i className="fa fa-bank"></i> Bank Information
                              </a>
                            </li>
                            <li>
                              <a href="password change" className="dropdown-item">
                                <i className="fa fa-lock"></i> Change Password
                              </a>
                            </li>
                            <li>
                              <a href="/Support" className="dropdown-item">
                                <i className="fa fa-support"></i> Support
                              </a>
                            </li>
                            <li>
                              <a href="/Report" className="dropdown-item">
                                <i className="fa fa-money"></i>Financial Report
                              </a>
                            </li>
                          </>
                        )} 
                        <li>
                          <a href="#" className="dropdown-item" onClick={handleLogout}>
                            <i className="fa fa-sign-out"></i> Logout
                          </a>
                        </li>
                      </ul>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    // <nav>
    //   <div>
    //     <header className="main-header">
    //       <a className="logo">
    //         <b>Music Dashboard</b>
    //       </a>
    //       <nav className="navbar navbar-static-top" role="navigation">
    //         <div className="navbar-custom-menu">
    //           <ul className="nav navbar-nav">
    //             <li className="dropdown user user-menu">
    //               <a href="#" className="dropdown-toggle" onClick={toggleDropdown}>
    //                 <img
    //                   src={images?.user}
    //                   className="user-image"
    //                   alt="User Image"
    //                 />
    //                 <span className="hidden-xs">{userProfile?.name}</span>
    //               </a>

    //               {dropdownVisible &&
    //                 <div className="modal" style={{ display: 'block', marginTop: -50, }} onClick={toggleDropdown}>
    //                   <div style={{
    //                     position: 'absolute',
    //                     right: 0,
    //                   }}>
    //                     <div className="modal-content">
    //                       <div style={{}}>
    //                         <ul className="sidebar-menu">
    //                           <li className="treeview">
    //                             <a href="password change">
    //                               <i className="fa fa-lock"></i> <span>Change Password</span>
    //                             </a>
    //                           </li>
    //                         </ul>
    //                         <ul className="sidebar-menu">
    //                           <li className="treeview">
    //                             <a href="profile">
    //                               <i className="fa fa-user"></i> <span>Profile</span>
    //                             </a>
    //                           </li>
    //                         </ul>
    //                         {userProfile?.role == "company" &&
    //                           <>
    //                             <ul className="sidebar-menu">
    //                               <li className="treeview">
    //                                 <a href='User Access'>
    //                                   <i className="fa fa-sitemap"></i> <span>User Access</span>
    //                                 </a>
    //                               </li>
    //                             </ul>
    //                             <ul className="sidebar-menu">
    //                               <li className="treeview">
    //                                 <a href="bank information">
    //                                   <i className="fa fa-bank"></i> <span>Bank Information</span>
    //                                 </a>
    //                               </li>
    //                             </ul>
    //                             <ul className="sidebar-menu">
    //                               <li className="treeview">
    //                                 <a href="Support">
    //                                   <i className="fa fa-support"></i> <span>Support</span>
    //                                 </a>
    //                               </li>
    //                             </ul>

    //                           </>
    //                         }
    //                         <ul className="sidebar-menu">
    //                           <li className="treeview">
    //                             <a href="" onClick={() => handleLogout()}>
    //                               <i className="fa fa-sign-out"></i> <span>Logout</span>
    //                             </a>
    //                           </li>
    //                         </ul>
    //                       </div>
    //                     </div>
    //                   </div>
    //                 </div>
    //               }
    //             </li>
    //           </ul>
    //         </div>
    //       </nav>
    //     </header>
    //     <aside className="main-sidebar" style={{ backgroundColor: '#000', height: 'auto' }}>
    //       <section className="sidebar" style={{ backgroundColor: '#000' }}>
    //         <div className="user-panel" style={{ backgroundColor: '#000' }}>
    //           <div className=" image form-row" style={{ borderBottomStyle: 'solid', borderBottomWidth: 0, borderBottomColor: '#fff', marginTop: 10, padding: 5 }}>
    //             <img
    //               src={images.user}
    //               className="img-circle"
    //               alt="User Image"
    //             />
    //             <div>
    //               <span>{userProfile?.name}</span> <br></br>
    //               <span>{userProfile?.email}</span>
    //             </div>
    //           </div>
    //           <p >{userProfile?._id}</p>
    //         </div>

    //         {userProfile.role == "Admin"
    //           && <>
    //             <ul className="sidebar-menu">
    //               <li className="treeview">
    //                 <a href="/Dashboard" >
    //                   <i className="fa fa-dashboard"></i> <span>Dashboard</span>
    //                 </a>
    //               </li>
    //             </ul>
    //             <ul className="sidebar-menu">
    //               <li className="treeview">
    //                 <a href="/CompanyManagement" >
    //                   <i className="fa fa-clock-o"></i> <span>Master Account</span>
    //                 </a>
    //               </li>
    //             </ul>
    //             <ul className="sidebar-menu">
    //               <li className="treeview">
    //                 <a href="/All releases" >
    //                   <i className="fa  fa-bullseye"></i> <span>All Release</span>
    //                 </a>
    //               </li>
    //             </ul>
    //             <ul className="sidebar-menu">
    //               <li className="treeview">
    //                 <a href="/All Tracks" >
    //                   <i className="fa fa-clock-o"></i> <span>All Tracks</span>
    //                 </a>
    //               </li>
    //             </ul>
    //             <ul className="sidebar-menu">
    //               <li className="treeview">
    //                 <a href="/Withdraw Request" >
    //                   <i className="fa fa-money"></i> <span>Withdraw Request</span>
    //                 </a>
    //               </li>
    //             </ul>
    //           </>
    //         }
    //         {userProfile.role == "company"
    //           && <>
    //             <ul className="sidebar-menu">
    //               <li className="treeview">
    //                 <a href="/Dashboard" >
    //                   <i className="fa fa-dashboard"></i> <span>Dashboard</span>
    //                 </a>
    //               </li>
    //             </ul>
    //             <ul className="sidebar-menu">
    //               <li className="treeview">
    //                 <a href="/One Release" >
    //                   <i className="fa fa-caret-square-o-left"></i> <span>One Release</span>
    //                 </a>
    //               </li>
    //             </ul>
    //             <ul className="sidebar-menu">
    //               <li className="treeview">
    //                 <a href="/All releases" >
    //                   <i className="fa  fa-bullseye"></i> <span>All Release</span>
    //                 </a>
    //               </li>
    //             </ul>
    //             <ul className="sidebar-menu">
    //               <li className="treeview">
    //                 <a href="/All drafts" >
    //                   <i className="fa fa-clock-o"></i> <span>All Draft</span>
    //                 </a>
    //               </li>
    //             </ul>
    //             <ul className="sidebar-menu">
    //               <li className="treeview">
    //                 <a href="/Daily Trends" >
    //                   <i className="fa fa-retweet"></i> <span>Analytics</span>
    //                 </a>
    //               </li>
    //             </ul>

    //             <ul className="sidebar-menu">
    //               <li className="treeview">
    //                 <a href="/Payment Operations" >
    //                   <i className="fa  fa-money"></i> <span>Payment Operations</span>
    //                 </a>
    //               </li>
    //             </ul>
    //             <ul className="sidebar-menu">
    //               <li className="treeview">
    //                 <a href="/Financial Report" >
    //                   <i className="fa fa-tree"></i> <span>Financial Report</span>
    //                 </a>
    //               </li>
    //             </ul>
    //           </>
    //         }

    //         {userProfile.role == "employee" && userPermission && userPermission?.menuPermission?.map((item, index) => {
    //           let link = `/${item.mainMenuName}`;
    //           return item.status &&
    //             item.mainMenuName != 'User Access' &&
    //             item.mainMenuName != 'Support' &&
    //             item.mainMenuName != 'Multiple Release' &&
    //             <ul className="sidebar-menu">
    //               <li className="treeview">
    //                 {item.submenu.length > 0 ?
    //                   <a onClick={() => { subMenu == index ? setSubMenu(-1) : setSubMenu(index) }}>
    //                     <i className={renderIcon(item.mainMenuName)}></i> <span>{item.mainMenuName}</span>
    //                   </a>
    //                   :
    //                   <a href={link}>
    //                     <i className={renderIcon(item.mainMenuName)}></i> <span>{item.mainMenuName}</span>
    //                   </a>
    //                 } </li>
    //               {index == subMenu ?
    //                 item.submenu.map((item, index) => {
    //                   let subMenuLink = `/${item.subMenuName}`;
    //                   return item.status && <li><a href={subMenuLink}><i className="fa fa-circle-o"></i>{item.subMenuName}</a></li>

    //                 })
    //                 :
    //                 <></>

    //               }

    //             </ul>
    //         })
    //         }

    //       </section>

    //     </aside>
    //   </div>
    // </nav>
  );
};