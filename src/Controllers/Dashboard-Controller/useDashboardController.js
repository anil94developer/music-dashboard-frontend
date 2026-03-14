import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getData, postData } from "../../Services/Ops";
import { base } from "../../Constants/Data.constant";
import useLocalStorage from "use-local-storage";


const useDashboardController = (props) => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState("");

    const getDashboardData = async () => {
        try {
            // Load all data in parallel instead of sequentially for faster loading
            const [releaseList, tracksList, userList, dashboardCount] = await Promise.all([
                getData(base.releaseList),
                getData(base.tracksList),
                getData(base.userList),
                getData(base.dashboardCount)
            ]);
            
            // Extract counts from dashboardCount response
            const counts = dashboardCount?.data || {};
            
            setDashboardData({
                "myReleaseCount": releaseList?.data?.length || 0,
                "myTracksCount": tracksList?.data?.length || 0,
                "masterAccount": userList?.data?.length || 0,
                "totalTracks": counts?.totalCount || 0,
                "totalPendingTracks": counts?.totalPending || 0,
                "approveContent": counts?.totalApprove || 0,
                "rejectContent": counts?.totalReject || 0,
                "totalCompany": counts?.totalCompany || 0,
                "dashboardCount": counts
            });  

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            // Set default values on error
            setDashboardData({
                "myReleaseCount": 0,
                "myTracksCount": 0,
                "masterAccount": 0,
                "totalTracks": 0,
                "totalPendingTracks": 0,
                "approveContent": 0,
                "rejectContent": 0,
                "totalCompany": 0,
                "dashboardCount": {}
            });
        }
    };

    useEffect(() => {
        getDashboardData();
    }, []);

    return {
        dashboardData
    };
};
export default useDashboardController;
