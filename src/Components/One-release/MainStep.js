import React, { useEffect,useState } from 'react'
import { useLocation } from 'react-router-dom';
import MainStepController from '../../Controllers/One-release-controller/MainStepController'
import { Nav } from '../Common/Nav';
import { SideBar } from '../Common/SideBar'
import STEP1 from './STEP1';
import STEP2 from './STEP2';
import STEP3 from './STEP3';
import STEP4 from './STEP4';
import STEP5 from './STEP5';
import STEP6 from './Step6';
import { useUserProfile } from '../../Context/UserProfileContext';

export const MainStep = () => {
const location = useLocation();
const { userProfile } = useUserProfile();
const releaseId = location.state?.releaseId;
const { step, setStep, myRelease, fetchReleaseDetails, isLoading, } = MainStepController();
const [isRefresh,setIsRefresh]= useState(new Date().getTime())
// const [id,setId]= useState(releaseId)
useEffect(() => { 
fetchReleaseDetails(releaseId)
console.log("releaseId--------",releaseId)
}, [releaseId])

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
      <div className="page-heading">
        <h1>Main Steps</h1>
      </div>
      <section className="steps-main">
        <div className="step-tab-container">
          <div className="step-tab">
            <button 
              type="button"
              className={`tab ${step === 'step1' ? 'active' : ''}`} 
              onClick={(e) => {
                e.preventDefault();
                setStep('step1');
              }}
            >
              <span className="tab-number">1</span>
              <span className="tab-text">Release Information</span>
            </button>
            <button 
              type="button"
              className={`tab ${step === 'step2' ? 'active' : ''}`} 
              onClick={(e) => {
                e.preventDefault();
                setStep('step2');
              }}
            >
              <span className="tab-number">2</span>
              <span className="tab-text">Upload</span>
            </button>
            <button 
              type="button"
              className={`tab ${step === 'step3' ? 'active' : ''}`} 
              onClick={(e) => {
                e.preventDefault();
                setStep('step3');
              }}
            >
              <span className="tab-number">3</span>
              <span className="tab-text">Tracks</span>
            </button>
            <button 
              type="button"
              className={`tab ${step === 'step4' ? 'active' : ''}`} 
              onClick={(e) => {
                e.preventDefault();
                setStep('step4');
              }}
            >
              <span className="tab-number">4</span>
              <span className="tab-text">Store</span>
            </button>
            <button 
              type="button"
              className={`tab ${step === 'step5' ? 'active' : ''}`} 
              onClick={(e) => {
                e.preventDefault();
                setStep('step5');
              }}
            >
              <span className="tab-number">5</span>
              <span className="tab-text">Release Date</span>
            </button>
            <button 
              type="button"
              className={`tab ${step === 'step6' ? 'active' : ''}`} 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setStep('step6');
              }}
            >
              <span className="tab-number">6</span>
              <span className="tab-text">Submission</span>
            </button>
          </div>
        </div>
        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        )}
        <section className="step-content" key={myRelease}>
          {
          step == "step1" ?
          <STEP1 setStep={setStep} releaseData={myRelease} />
          : step == "step2" ?
          <STEP2 setStep={setStep} releaseData={myRelease} />
          : step == "step3" ?
          <STEP3 setStep={setStep} releaseData={myRelease} fetchReleaseDetails={fetchReleaseDetails} />
          : step == "step4" ?
          <STEP4 setStep={setStep} releaseData={myRelease} />
          : step == "step5" ?
          <STEP5 setStep={setStep} releaseData={myRelease} />
          :
          <STEP6 releaseData={myRelease} fetchReleaseDetails={fetchReleaseDetails} />
          }  
        </section>
      </section>
    </div>
  </div>
</div>
)
}