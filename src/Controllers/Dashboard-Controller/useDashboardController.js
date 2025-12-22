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
            
            setDashboardData({
                "myReleaseCount": releaseList?.data?.length || 0,
                "myTracksCount": tracksList?.data?.length || 0,
                "masterAccount": userList?.data?.length || 0,
                "dashboardCount": dashboardCount?.data || {}
            });  

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
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
