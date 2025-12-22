import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { base } from "../../Constants/Data.constant";
import { useUserProfile } from "../../Context/UserProfileContext";
import { getData, postData } from "../../Services/Ops";
import { Nav } from "../Common/Nav";
import { SideBar } from '../Common/SideBar'
import "./UserAccessForm.css";
import "../Common/RoleSpecificStyles.css";
import SearchableDropdown from "../Common/SearchableDropdown";
function UserAccessForm(props) {
  const navigate = useNavigate()
  const { userProfile } = useUserProfile()
  const [labelNameList, setLabelNameList] = useState([])
  const [airtestNameList, setaAirtestNameList] = useState([])
  const [menuPermission, setMenuPermission] = useState([]);
  const [otherPermission, setOtherPermission] = useState([
    { sectionName: "artist", status: true, list: [] },
    { sectionName: "label", status: true, list: [] },
    // { sectionName: "Channel", status: true, list: [] },
  ]);
  const [userPermission, setUserPermission] = useState({
    email: "",
    password: "",
    name: "",
    noOfLabel: "",
    role: userProfile.type == "Admin" ? "company" : "employee",
    pricePercentage: 0
  });
  const handleCheckboxChange = (e, category, index, subIndex = null) => {
    const { checked } = e.target;
    if (category == "menuPermission") {
      setMenuPermission((prev) => {
        const updated = [...prev];
        if (subIndex !== null) {
          updated[index].submenu[subIndex].status = checked;
        } else {
          updated[index].status = checked;
        }
        return updated;
      });
    } else if (category === "otherPermission") {
      setOtherPermission((prev) => {
        const updated = [...prev];
        updated[index].status = checked;
        return updated;
      });
    }
  };
  useEffect(() => {
    fetchLabel()
    fetchAirtest()
    getPermmissoin()
  }, [props, userProfile])
  const fetchLabel = async () => {
    let result = await getData(base.labelList);
    console.log(result)
    setLabelNameList(result.data)
  }
  const fetchAirtest = async () => {
    let result = await getData(base.fetchArtistList);
    console.log(result)
    setaAirtestNameList(result.data)
  }
  const getPermmissoin = () => {
    setMenuPermission(
      userProfile.role == "Admin" ?
        [
          {
            "mainMenuName": "Dashboard",
            "status": false,
            "submenu": []
          },
          {
            "mainMenuName": "One Release",
            "status": false,
            "submenu": []
          },
          {
            "mainMenuName": "Multiple Release",
            "status": false,
            "submenu": []
          },
          {


            "mainMenuName": "All releases",
            "status": false,
            "submenu": []
          },
          {
            "mainMenuName": "All drafts",
            "status": false,
            "submenu": []
          },
          {
            "mainMenuName": "Daily Trends",
            "status": false,
            "submenu": []
          },
          {
            "mainMenuName": "Financial",
            "status": false,
            "submenu": [
              {
                "subMenuName": "Payment Operations",
                "status": false,
                "submenu": []
              },
              {
                "subMenuName": "Financial Report",
                "status": false,
                "submenu": []
              }
            ]
          },
          {
            "mainMenuName": "User Access",
            "status": false,
            "submenu": []
          },
        ]
        :
        userProfile.role == "company" ?
          [
            {
              "mainMenuName": "Dashboard",
              "status": false,
              "submenu": []
            },
            {
              "mainMenuName": "One Release",
              "status": false,
              "submenu": []
            },
            // {
            //   "mainMenuName": "Multiple Release",
            //   "status": false,
            //   "submenu": []
            // },
            {


              "mainMenuName": "All releases",
              "status": false,
              "submenu": []
            },
            {
              "mainMenuName": "All drafts",
              "status": false,
              "submenu": []
            },
            {
              "mainMenuName": "Daily Trends",
              "status": false,
              "submenu": []
            },
            {
              "mainMenuName": "Financial",
              "status": false,
              "submenu": [
                {
                  "subMenuName": "Payment Operations",
                  "status": false,
                  "submenu": []
                },
                {
                  "subMenuName": "Financial Report",
                  "status": false,
                  "submenu": []
                }
              ]
            },
            {
              "mainMenuName": "Support",
              "status": false,
              "submenu": []
            }
          ]
          : userProfile.role == "employee" &&
          []
    )
  }
  const handleSubmit = async () => {
    const payload = {
      ...userPermission,
      menuPermission,
      artist : otherPermission?.[0].list,
      label : otherPermission?.[1].list,
    };
    if (userPermission.email == "" || userPermission.name == "") {
      Swal.fire("Error", "Please fill email , password and name", "error");
      return 0;
    }
    console.log("payload=======", payload)
    try {
      const result = await postData(base.addPermission, payload);
      console.log(result.data)
      if (result?.data?.status === true) {
        Swal.fire("Success", result.data.message, "success");
        navigate("/user access")
      } else {
        Swal.fire("Error", result.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred during submission", "error");
      console.error("Submission error:", error);
    }
  };
  const selectHandleChange = (selectedItems, index) => {
    setOtherPermission((prev) => {
      const updatedPermissions = [...prev];
      updatedPermissions[index] = {
        ...updatedPermissions[index],
        list: selectedItems.map((item) => item._id), // Extract the value key (e.g., _id) for the list
      };
      return updatedPermissions;
    });
  };



  const getMainContentClass = () => {
    if (userProfile?.role === "Admin") return "main-cotent admin-main-content";
    if (userProfile?.role === "company") return "main-cotent company-main-content";
    if (userProfile?.role === "employee") return "main-cotent employee-main-content";
    return "main-cotent";
  };

  return (
    <div>
      <SideBar />
      <div className={getMainContentClass()}>
        <Nav />
        <div className="content-main">
          <div className="user-access-form-page">
            {/* Page Header */}
            <div className="page-header-section">
              <div className="header-content">
                <div>
                  <h1>
                    <i className="fa fa-user-plus"></i> Add New User
                  </h1>
                  <p className="page-subtitle">Create a new user account and configure their access permissions</p>
                </div>
                <button
                  className="btn-back"
                  onClick={() => navigate("/user access")}
                >
                  <i className="fa fa-arrow-left"></i> Back to Users
                </button>
              </div>
            </div>

            {/* User Information Card */}
            <div className="form-card">
              <div className="card-header-section">
                <h3>
                  <i className="fa fa-info-circle"></i> User Information
                </h3>
              </div>
              <div className="card-body-form">
                <div className="form-row">
                  <div className="form-group-modern">
                    <label className="form-label-modern">
                      <i className="fa fa-user"></i> Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control-modern"
                      placeholder="Enter user name"
                      value={userPermission.name}
                      onChange={(e) => setUserPermission((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="form-group-modern">
                    <label className="form-label-modern">
                      <i className="fa fa-envelope"></i> Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control-modern"
                      placeholder="Enter email address"
                      value={userPermission.email}
                      onChange={(e) => setUserPermission((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group-modern">
                    <label className="form-label-modern">
                      <i className="fa fa-percent"></i> Percent Value
                    </label>
                    <input
                      type="number"
                      min={1} 
                      max={100}
                      className="form-control-modern"
                      placeholder="Enter percentage (1-100)"
                      value={userPermission.pricePercentage}
                      onChange={(e) => setUserPermission((prev) => ({ ...prev, pricePercentage: e.target.value }))}
                    />
                  </div>
                  {userProfile.role == "Admin" && (
                    <div className="form-group-modern">
                      <label className="form-label-modern">
                        <i className="fa fa-tags"></i> Number of Labels
                      </label>
                      <input
                        type="number"
                        className="form-control-modern"
                        placeholder="Enter number of labels"
                        value={userPermission.noOfLabel}
                        onChange={(e) => setUserPermission((prev) => ({ ...prev, noOfLabel: e.target.value }))}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Permissions Card */}
            <div className="form-card">
              <div className="card-header-section">
                <h3>
                  <i className="fa fa-list"></i> Menu Permissions
                </h3>
              </div>
              <div className="card-body-form">
                <p className="card-subtitle">Select which menu sections the user can access</p>
                <div className="permission-grid">
                  {menuPermission && menuPermission?.map((menu, index) => (
                    <div className="permission-item" key={menu.mainMenuName}>
                      <div className="permission-main">
                        <label className="permission-checkbox">
                          <input 
                            type="checkbox" 
                            checked={menu.status} 
                            onChange={(e) => handleCheckboxChange(e, "menuPermission", index)} 
                          />
                          <span className="checkmark"></span>
                          <span className="permission-label">
                            <i className="fa fa-folder"></i> {menu?.mainMenuName}
                          </span>
                        </label>
                      </div>
                      {menu?.submenu && menu.submenu.length > 0 && (
                        <div className="permission-submenu">
                          {menu.submenu.map((submenu, subIndex) => (
                            <label className="permission-checkbox submenu-item" key={submenu.subMenuName}>
                              <input
                                type="checkbox"
                                checked={submenu.status}
                                onChange={(e) => handleCheckboxChange(e, "menuPermission", index, subIndex)}
                              />
                              <span className="checkmark"></span>
                              <span className="permission-label">
                                <i className="fa fa-file"></i> {submenu?.subMenuName}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Catalog Scope Card */}
            {userProfile?.role == "company" && (
              <div className="form-card">
                <div className="card-header-section">
                  <h3>
                    <i className="fa fa-database"></i> Catalog Scope
                  </h3>
                </div>
                <div className="card-body-form">
                  <p className="card-subtitle">Define the catalog access for this user</p>
                  <div className="catalog-scope-grid">
                    {otherPermission?.map((item, index) => (
                      <div className="catalog-scope-item" key={item.sectionName}>
                        <div className="catalog-scope-header">
                          <label className="catalog-label-modern">
                            <i className={`fa ${item.sectionName === "label" ? "fa-tag" : "fa-music"}`}></i> 
                            {item.sectionName.charAt(0).toUpperCase() + item.sectionName.slice(1)}
                          </label>
                        </div>
                        <div className="catalog-scope-input-wrapper">
                          {item.sectionName == "label" && (
                            <SearchableDropdown 
                              className="catalog-dropdown"
                              placeholder={`Search ${item.sectionName}...`}
                              title={`Select ${item.sectionName.charAt(0).toUpperCase() + item.sectionName.slice(1)}`}
                              options={labelNameList}
                              labelKey="title"
                              onChange={(selectedItems) => selectHandleChange(selectedItems, index)}
                            />
                          )}
                          {item.sectionName == "artist" && (
                            <SearchableDropdown 
                              className="catalog-dropdown"
                              placeholder={`Search ${item.sectionName}...`}
                              title={`Select ${item.sectionName.charAt(0).toUpperCase() + item.sectionName.slice(1)}`}
                              options={airtestNameList}
                              labelKey="name"
                              onChange={(selectedItems) => selectHandleChange(selectedItems, index)}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="form-actions">
              <button
                onClick={() => handleSubmit()}
                className="btn-submit-form"
                type="submit"
              >
                <i className="fa fa-check"></i> Create User
              </button>
              <button
                onClick={() => navigate("/user access")}
                className="btn-cancel-form"
                type="button"
              >
                <i className="fa fa-times"></i> Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UserAccessForm;