import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { base } from "../../Constants/Data.constant";
import { useUserProfile } from "../../Context/UserProfileContext";
import { getData, postData } from "../../Services/Ops";
import { Nav } from "../Common/Nav";
import { SideBar } from "../Common/SideBar";
// import "./UserAccessForm.css";
import language from '../../Enums/language.json'
import country from '../../Enums/country.list.json'


function AddCompany(props) {
    const navigate = useNavigate()
    const { userProfile } = useUserProfile()

    const [form, setForm] = useState({
        role: "company",
        panNo: "",
        aadharNo: "",
        companyName: "",
        email: "",
        royaltiesEmail: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        postalAddress: "",
        postalCode: "",
        city: "",
        country: "",
        language: "",
        membershipId: "", // Membership selection
        noOfLabel: "", // Will be auto-filled from membership
    });
    
    const [memberships, setMemberships] = useState([]);
    const [loadingMemberships, setLoadingMemberships] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    
    // Fetch active memberships on component mount
    useEffect(() => {
        const fetchMemberships = async () => {
            setLoadingMemberships(true);
            try {
                const result = await getData(base.activeMemberships);
                if (result.data?.status === true && Array.isArray(result.data.data)) {
                    setMemberships(result.data.data);
                }
            } catch (error) {
                console.error("Error fetching memberships:", error);
            } finally {
                setLoadingMemberships(false);
            }
        };
        fetchMemberships();
    }, []);
    
    // Handle membership selection - auto-fill noOfLabel
    const handleMembershipChange = (e) => {
        const selectedMembershipId = e.target.value;
        const selectedMembership = memberships.find(m => m._id === selectedMembershipId);
        
        setForm((prev) => ({
            ...prev,
            membershipId: selectedMembershipId,
            noOfLabel: selectedMembership ? (selectedMembership.noOfLabels || "") : ""
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Payload:", form); // Debugging the payload
        try {
            const result = await postData(base.addCompany, form);
            if (result.data?.status === true) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: result.message,
                });
                navigate("/CompanyManagement");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: result.message || "An error occurred.",
                });
            }
        } catch (error) {
            console.error("Error sending data:", error);
            Swal.fire("Error", "An unexpected error occurred. Please try again.", "error");
        }
    };

    return (
        <div>
            <SideBar />
            <div className="main-cotent">
                <Nav />
                <div className="content-main">
                    <section className="page-heading">
                        <h1>Add Company</h1>
                    </section>
                    <section className="content">
                        <form className="profile-form" onSubmit={handleSubmit}>
                            <div className="dash-detail dash-detail-two">
                                <div className="row">
                                    {/* Company Name */}
                                    <div className="col-lg-3 col-md-4 col-12">
                                        <div className="form-group">
                                            <label for="exampleInputEmail1"> Company Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter company name"
                                                name="companyName"
                                                value={form.companyName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {/* Main Email */}
                                    <div className="col-lg-3 col-md-4 col-12">
                                        <div className="form-group">
                                            <label >Main Email Address</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Enter main email address"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {/* Royalties Email */}
                                    <div className="col-lg-3 col-md-4 col-12">
                                        <div className="form-group">
                                            <label >Royalties Email Address</label>
                                            <input
                                                type="royaltiesEmail"
                                                className="form-control"
                                                placeholder="Enter royalties email address"
                                                name="royaltiesEmail"
                                                value={form.royaltiesEmail}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* First Name */}
                                    <div className="col-lg-3 col-md-4 col-12">
                                        <div className="form-group">
                                            <label >First Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter first name"
                                                name="firstName"
                                                value={form.firstName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {/* Last Name */}
                                    <div className="col-lg-3 col-md-4 col-12">
                                        <div className="form-group">
                                            <label >Last Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter last name"
                                                name="lastName"
                                                value={form.lastName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {/* Phone Number */}
                                    <div className="col-lg-3 col-md-4 col-12">
                                        <div className="form-group">
                                            <label >Phone Number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter phone number"
                                                name="phoneNumber"
                                                value={form.phoneNumber}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {/* Membership Selection */}
                                    <div className="col-lg-3 col-md-4 col-12">
                                        <div className="form-group">
                                            <label>Select Membership <span style={{color: 'red'}}>*</span></label>
                                            <select
                                                className="form-select form-control"
                                                name="membershipId"
                                                value={form.membershipId}
                                                onChange={handleMembershipChange}
                                                required
                                            >
                                                <option value="">Select Membership</option>
                                                {memberships.map((membership) => (
                                                    <option key={membership._id} value={membership._id}>
                                                        {membership.name} - ${membership.price}/{membership.durationType}
                                                        {membership.noOfLabels > 0 && ` (${membership.noOfLabels} Labels)`}
                                                    </option>
                                                ))}
                                            </select>
                                            {loadingMemberships && <small>Loading memberships...</small>}
                                        </div>
                                    </div>
                                    {/* No Of Labels - Auto-filled from membership */}
                                    <div className="col-lg-3 col-md-4 col-12">
                                        <div className="form-group">
                                            <label>No Of Labels</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Auto-filled from membership"
                                                name="noOfLabel"
                                                value={form.noOfLabel}
                                                onChange={handleChange}
                                                readOnly={!!form.membershipId}
                                                required
                                            />
                                            {form.membershipId && <small className="text-muted">Auto-filled from selected membership</small>}
                                        </div>
                                    </div>
                                    {/* Pan Card Number */}
                                    <div className="col-lg-3 col-md-4 col-12">
                                        <div className="form-group">
                                            <label >Pan Card Number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Pan Card Number"
                                                name="panNo"
                                                value={form.panNo}
                                                required onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    {/* Aadhar Card  number*/}
                                    <div className="col-lg-3 col-md-4 col-12">
                                        <div className="form-group">
                                            <label >Aadhar Card</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Aadhar Card Number"
                                                name="aadharNo"
                                                value={form.aadharNo}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Postal Address */}
                                    <div className="col-lg-3 col-md-4 col-12">
                                        <div className="form-group">
                                            <label >Postal Address</label>
                                            <textarea
                                                className="form-control"
                                                placeholder="Enter postal address"
                                                name="postalAddress"
                                                value={form.postalAddress}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {/* Postal Code */}
                                    <div className="col-lg-3 col-md-4 col-12">
                                        <div className="form-group">
                                            <label >Postal Code</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter postal code"
                                                name="postalCode"
                                                value={form.postalCode}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {/* City */}
                                    <div className="col-lg-3 col-md-4 col-12">
                                        <div className="form-group">
                                            <label >City</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter city"
                                                name="city"
                                                value={form.city}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                   
                                    {/* Country */}

                                    <div className="col-lg-3 col-md-6">
                                        <div className="form-group">
                                            <label>Default Country</label>
                                            <select
                                                type="text"
                                                className="form-select form-control"
                                                value={form.country}
                                                name="country"
                                                onChange={handleChange}
                                            >
                                                <option value="" disabled>
                                                    Select a Country
                                                </option>
                                                {country.map((item) => (
                                                    <option key={item.value} value={item.value}>
                                                        {item.value}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {/* Language */}

                                    <div className="col-lg-3 col-md-6">
                                        <div className="form-group">
                                            <label>Default Language</label>
                                            <select
                                                type="text"
                                                className="form-select form-control"
                                                value={form.language}
                                                name={"language"}
                                                onChange={handleChange}
                                            >
                                                <option value="" disabled>
                                                    Select a Language
                                                </option>
                                                {language.map((item) => (
                                                    <option key={item.value} value={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {/* Submit Button */}
                                    <div className="Submit-btn">
                                        <button type="Submit" className="btn btn-primary">Submit</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default AddCompany;
