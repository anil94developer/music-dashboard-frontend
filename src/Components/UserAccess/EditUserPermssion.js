import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { base } from "../../Constants/Data.constant";
import { getData, postData, putData } from "../../Services/Ops";
import { Nav } from "../Common/Nav";
import { SideBar } from '../Common/SideBar'
import SearchInput from "../Common/SearchBox";
import "./UserAccessForm.css";
import SearchableDropdown from "../Common/SearchableDropdown";
function EditUserPermission() {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.userData;
  const [labelNameList, setLabelNameList] = useState([])
  const [airtestNameList, setaAirtestNameList] = useState([])
  const [menuPermission, setMenuPermission] = useState([]);
  const [otherPermission, setOtherPermission] = useState([]);
  const [newLabelName, setNewLabelName] = useState("");
  const [showLabelInput, setShowLabelInput] = useState(false);
  const [userPermission, setUserPermission] = useState({
    email: userData.userDetails?.email,
    pricePercentage: userData.userDetails?.pricePercentage,
    name: userData.userDetails?.name,
  });

  useEffect(() => {
      fetchLabel()
      fetchAirtest()
    }, [])
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
  const [selectedItems, setSelectedItems] = useState(otherPermission.map(() => []));
  useEffect(() => {
    setMenuPermission(userData.menuPermission)
    setOtherPermission([
      {
        sectionName: "label",
        list: userData.userDetails?.label || []
      },
      {
        sectionName: "artist",
        list: userData.userDetails?.artist || []
      }
    ]);
  }, [])
  const handleCheckboxChange = (e, category, index, subIndex = null) => {
    const { checked } = e.target;
    if (category === "menuPermission") {
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

  const addNewLabel = async () => {
    if (newLabelName.trim() === "") return;
    let payload = { title: newLabelName };
    let result = await postData(base.addLabel, payload);
    if (result.status === true) {
      setLabelNameList([...labelNameList, { _id: result.data._id, title: newLabelName }]);
      setNewLabelName("");
      fetchLabel();
      setShowLabelInput(false);
      Swal.fire("Success", "New label added successfully", "success");
    } else {
      setShowLabelInput(false);
      setNewLabelName("");
      Swal.fire("Error", result.message, "error");
    }
  };

  const handleSubmit = async () => {
    const payload = {
      name: userPermission.name,
      noOfLabel: userPermission.noOfLabel,
      "registeredUserId": userData.userDetails?._id,
      menuPermission: menuPermission,
      otherPermission: otherPermission,
    };
    try {
      const result = await putData(base.updatePermission, payload);
      if (result?.status === true) {
        Swal.fire("Success", result.data.message, "success");
        navigate("/User Access")
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
  return (
    <div>
      <SideBar />
      <div className="main-cotent">
        <Nav />
        <div className="content-main">
          <div className="page-heading">
            <h2>User Access Management</h2>
          </div>
          <section className="content">
            <div className="user-edit-form">
              <div className="row">
                <div className="col-md-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Name:</label>
                    <input type="text" value={userPermission.name} onChange={(e) => setUserPermission((prev) => ({ ...prev, name: e.target.value }))} />
                  </div>
                </div>
                <div className="col-md-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Email:</label>
                    <input type="email" value={userPermission.email} onChange={(e) => setUserPermission((prev) => ({ ...prev, email: e.target.value }))} />
                  </div>
                </div>
                <div className="col-md-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Percent Value: </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      className="form-control"
                      value={userPermission.pricePercentage}
                      onChange={(e) => setUserPermission((prev) => ({ ...prev, pricePercentage: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <div className="menu-permission">
                <h2>Menu Permissions</h2>
                <div className="permission-form form-section d-flex flex-wrap">
                  {menuPermission.map((menu, index) => (
                    <div className="form-inner d-flex align-items-center" key={menu.mainMenuName}>
                      <input type="checkbox" checked={menu.status} onChange={(e) => handleCheckboxChange(e, "menuPermission", index)} />
                      <label>{menu.mainMenuName}</label>
                      {menu.submenu.map((submenu, subIndex) => (
                        <label key={submenu.subMenuName} style={{ marginLeft: "20px" }}>
                          <input type="checkbox" checked={submenu.status} onChange={(e) => handleCheckboxChange(e, "menuPermission", index, subIndex)}
                          />
                          {submenu.subMenuName}
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              {/* Catalog Scope */}
              <div className="catalog-form">
                <h3 className="title">Catalog Scope</h3>
                {otherPermission?.map((item, index) => (
                  <div class="form-group">
                    <label for="genre">{item.sectionName}</label>
                    {item.sectionName === "label" && (
                      <>
                        
                        <SearchableDropdown
                          className="form-control"
                          options={labelNameList}
                          labelKey="title"
                          onChange={(selectedItems) => selectHandleChange(selectedItems, index)}
                        />

<button className="btn btn-success" onClick={() => setShowLabelInput(true)} style={{ marginLeft: "10px" }}>
                          Add New Label
                        </button>
                        {showLabelInput && (
                          <div className="mt-2">
                            <input
                              className="form-control"
                              type="text"
                              value={newLabelName}
                              onChange={(e) => setNewLabelName(e.target.value)}
                              placeholder="Enter New Label"
                            />
                            <button className="btn btn-primary mt-1" onClick={addNewLabel}>Submit Label</button>
                          </div>
                        )}
                      </>
                    )}
                    {item.sectionName == "artist" &&
                      <SearchableDropdown className="form-control"
                        options={airtestNameList}
                        labelKey="name"
                        onChange={(selectedItems) => selectHandleChange(selectedItems, index)}
                      />
                    }

                  </div>
                ))}
              </div>
              <button
                onClick={() => [handleSubmit()]}
                className="btn btn-primary"
                type="Submit"
              >
                Submit
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
export default EditUserPermission;