import React, { useState,useEffect } from 'react'
import { base } from '../../Constants/Data.constant';
import { getData } from '../../Services/Ops';
import { Nav } from '../Common/Nav'
import { SideBar } from '../Common/SideBar'
import AutomaticReports from './AutomaticReport';
import RequestedReports from './RequestedReports';
import "./styles.css";
import { useUserProfile } from '../../Context/UserProfileContext';

export default function FinancialReport() {
const { userProfile } = useUserProfile();
const [activeTab, setActiveTab] = useState("automatic");
const [report,setReport]= useState([])

useEffect(() => {
  getReoprt(); 
}, [])

const getReoprt = async () => {
  let result = await getData(base.getReport)
  console.log("getReoprt------------", result)
  setReport(result?.data)
    // setTopStores(arr)
  } 

const getMainContentClass = () => {
  if (userProfile?.role === "Admin") return "main-cotent admin-main-content";
  if (userProfile?.role === "company") return "main-cotent company-main-content";
  if (userProfile?.role === "employee") return "main-cotent employee-main-content";
  return "main-cotent";
};

return (
<div>
  <SideBar/>
  <div className={getMainContentClass()}>
    <Nav />
    <div className="content-main">
      <section className="page-heading">
        <h1>Financial Reports</h1>
      </section>
      <section className="content">
        <div className="steps-main reports-outer">
          {/* 
          <h2>AVAILABLE REPORTS</h2>
          */}
          {/* <div className="step-tab report-tab">
            <button
            className={`tab ${activeTab === "automatic" ? "active" : ""}`}
            onClick={() => setActiveTab("automatic")}
            >
            Automatic reports
            </button>
            <button
            className={`tab ${activeTab === "requested" ? "active" : ""}`}
            onClick={() => setActiveTab("requested")}
            >
            Requested reports
            </button>
          </div>
          {activeTab === "automatic" ?
          <AutomaticReports report={report}/>
          :
          <RequestedReports />
          } */}
           <RequestedReports />
        </div>
      </section>
    </div>
  </div>
</div>
)
}