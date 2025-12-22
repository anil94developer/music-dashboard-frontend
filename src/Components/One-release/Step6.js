import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Step6Controller from "../../Controllers/One-release-controller/Step6Controller";
import STEP1 from "./STEP1";
import STEP2 from "./STEP2";
import STEP3 from "./STEP3";
import STEP4 from "./STEP4";
import STEP5 from "./STEP5";

export default function STEP6(props) {
    const navigate = useNavigate();
    const { releaseData, fetchReleaseDetails } = props;
    const { handleSubmit } = Step6Controller();
    const [errors, setErrors] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    const validateFields = () => {
        setErrors([]);
        const requiredFields = [
            "step1.genre",
            "step1.primaryArtist",
            "step1.labelName",
            "step1.pline",
            "step1.cline",
            "step1.productionYear",
            "step1.format",
            "step1.subGenre",
            "step1.originalReleaseDate",
            "step1.cYear",
            "step1.pYear",
            "step1.coverImage",
            "step2",
            "step3",
            
        ];

        const newErrors = {};

        for (const field of requiredFields) {
            const keys = field.split(".");
            let value = releaseData;

            for (const key of keys) {
                if (!value || value[key] === undefined || (Array.isArray(value[key]) && value[key].length === 0)) {
                    value = null;
                    break;
                }
                value = value[key];
            }

            if (value === null || !value) {
                newErrors[field] = "Required";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        setIsFetching(true);
        console.log("Fetching latest release data...");
        await fetchReleaseDetails(releaseData._id); // Ensure data is refreshed
        
        // Wait a bit for state to update
        setTimeout(() => {
        setIsFetching(false);
            // Validate after fetching
            const isValid = validateFields();
            if (isValid) {
                navigate("/final-Submit", { state: { releaseId: releaseData._id } });
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }, 100);
    };

    useEffect(() => {
        // Only run validation and navigation when user explicitly clicks submit button
        // Don't auto-navigate when component first renders
        if (!isFetching && releaseData && releaseData._id) {
            // This useEffect should only run after handleSubmitClick is called
            // We'll handle navigation in handleSubmitClick instead
        }
    }, [releaseData, isFetching]);

    return (
        <div>
            <div className="steps-detail step-one-main">
                <STEP1 releaseData={releaseData} errors={errors} setErrors={setErrors} />
            </div>
            <div className="steps-detail step-two-main">
                <STEP2 releaseData={releaseData} setErrors={setErrors} />
                {errors?.["step2"] && <span className="text-danger">"At least upload one Track"</span>}
            </div>
            <div className="steps-detail step-three-main">
                <STEP3 releaseData={releaseData} fetchReleaseDetails={fetchReleaseDetails} setErrors={setErrors} />
                {errors?.["step3"] && <span className="text-danger">"At least Add one Track"</span>}
            </div>
            <div className="steps-detail step-four-main">
                <STEP4 releaseData={releaseData}  setErrors={setErrors} />
            </div>
            <div className="steps-detail step-five-main">
                <STEP5 releaseData={releaseData} errors={errors} setErrors={setErrors} />
            </div>
            <div className="text-center">
                <button type="submit" className="btn btn-primary" onClick={handleSubmitClick} disabled={isFetching}>
                    {isFetching ? "Processing..." : "Submit"}
                </button>
            </div>
        </div>
    );
}
