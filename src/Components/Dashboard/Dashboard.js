import React, { useEffect, useState } from 'react'
import { base } from '../../Constants/Data.constant';
import { useUserProfile } from '../../Context/UserProfileContext';
import useDashboardController from '../../Controllers/Dashboard-Controller/useDashboardController';
import { getData } from '../../Services/Ops';
import MarketGraph from '../Common/Chart/MarketGraph';
import SimpleGraph from '../Common/Chart/SimpleGraph';
import { Nav } from '../Common/Nav'
import { SideBar } from '../Common/SideBar'
import '../Common/RoleSpecificStyles.css'
export const Dashboard = () => {
  const { dashboardData } = useDashboardController();
  const { userProfile } = useUserProfile();

  const [marketList, setMarketList] = useState([])
  const [overviewDataList, setOverviewDataList] = useState([])
  useEffect(() => {
    // getMarket();
    getOverView({});
    console.log(dashboardData, ">>>>>>");
  }, [])
  // const getMarket = async () => {
  //   let result = await getData(base.getMarket)
  //   console.log(result)
  //   if (result?.status) {
  //     let arr = []
  //     result.data?.map((item, index) => {
  //       arr.push({ x: index, label: item.Market, y: item.Quantity })
  //     })
  //     setMarketList(arr);
  //   }
  // }


  const getOverView = async (query) => {
    let result = await getData(base.getOverViewReport + `?${query}`)
    console.log("result stream-------", result)
    if (result?.status) {
        let arr = []
        result.data?.map((item, index) => {
            arr.push({ x: index, label: item.Date, y: item.Earnings_GBP, Excel: item.Excel })
        })
        setOverviewDataList(arr);
    } else {
      setOverviewDataList([]);

    }
}

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
          <section className="dash-main content">
            {(userProfile?.role == "company" || userProfile?.role === "employee") &&
              <div className="row">
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className={`dash-detail d-flex flex-wrap ${userProfile?.role === "company" ? "company-dashboard-card" : "employee-dashboard-card"}`}>
                    <div className="inner">
                      <p>All Release</p>
                      <h3>{dashboardData?.myReleaseCount || 0}</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon1.png')} alt="All Release" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className={`dash-detail d-flex flex-wrap ${userProfile?.role === "company" ? "company-dashboard-card" : "employee-dashboard-card"}`}>
                    <div className="inner">
                      <p>All Tracks</p>
                      <h3>{dashboardData?.myTracksCount || 0}</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon2.png')} alt="All Tracks" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className={`dash-detail d-flex flex-wrap ${userProfile?.role === "company" ? "company-dashboard-card" : "employee-dashboard-card"}`}>
                    <div className="inner">
                      <p>Total Tracks</p>
                      <h3>0</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon1.png')} alt="Total Tracks" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className={`dash-detail d-flex flex-wrap ${userProfile?.role === "company" ? "company-dashboard-card" : "employee-dashboard-card"}`}>
                    <div className="inner">
                      <p>Total Pending Tracks</p>
                      <h3>0</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon2.png')} alt="Pending Tracks" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className={`dash-detail d-flex flex-wrap ${userProfile?.role === "company" ? "company-dashboard-card" : "employee-dashboard-card"}`}>
                    <div className="inner">
                      <p>Approve Content</p>
                      <h3>0</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon1.png')} alt="Approve Content" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className={`dash-detail d-flex flex-wrap ${userProfile?.role === "company" ? "company-dashboard-card" : "employee-dashboard-card"}`}>
                    <div className="inner">
                      <p>Reject Content</p>
                      <h3>0</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon2.png')} alt="Reject Content" />
                    </div>
                  </div>
                </div>

              </div>
            }
            {userProfile?.role == "Admin" &&

              <div className="row">
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="dash-detail d-flex flex-wrap admin-dashboard-card">
                    <div className="inner">
                      <p>All Release</p>
                      <h3>{dashboardData?.myReleaseCount || 0}</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon1.png')} alt="All Release" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="dash-detail d-flex flex-wrap admin-dashboard-card">
                    <div className="inner">
                      <p>All Tracks</p>
                      <h3>{dashboardData?.myTracksCount || 0}</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon2.png')} alt="All Tracks" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="dash-detail d-flex flex-wrap admin-dashboard-card">
                    <div className="inner">
                      <p>Total Tracks</p>
                      <h3>0</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon1.png')} alt="Total Tracks" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="dash-detail d-flex flex-wrap admin-dashboard-card">
                    <div className="inner">
                      <p>Total Pending Tracks</p>
                      <h3>0</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon2.png')} alt="Pending Tracks" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="dash-detail d-flex flex-wrap admin-dashboard-card">
                    <div className="inner">
                      <p>Approve Content</p>
                      <h3>0</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon1.png')} alt="Approve Content" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="dash-detail d-flex flex-wrap admin-dashboard-card">
                    <div className="inner">
                      <p>Reject Content</p>
                      <h3>0</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon2.png')} alt="Reject Content" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="dash-detail d-flex flex-wrap admin-dashboard-card">
                    <div className="inner">
                      <p>Master Account</p>
                      <h3>{dashboardData?.masterAccount || 0}</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon1.png')} alt="Master Account" />
                    </div>
                  </div>
                </div>
              </div>

            }
          </section>
          {userProfile?.role === "company" &&
            <section className="sale-graph" style={{ marginTop: '30px' }}>
              {overviewDataList.length > 0 ?
                <SimpleGraph data={overviewDataList} title={"Overview"} type={'column'} />
                :
                <div className="text-center" style={{ padding: '40px' }}>
                  <h2 style={{ color: '#4a90e2', marginBottom: '20px' }}>Market Data</h2>
                  <img className="img-fluid" title="Dashboard" src={require('../../assets/images/nodatafound.png')} alt="No Data Found" />
                </div>
              }
            </section>
          }
        </div>
      </div>
    </div>
  )
}