import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { base } from '../../Constants/Data.constant';
import initialCountryList from '../../Enums/store.list.json';
import { postData } from '../../Services/Ops';
// import imagePath from './../../assets/images/store/'
export default function STEP4(props) {
  const { releaseData } = props
  const countryListWithLogos = initialCountryList.map((item) => ({
    ...item,
    logo: require(`../../assets/images/store/${item.logo}`).default,
  }));
  const [countryList, setCountryList] = useState(initialCountryList);
  // const [countryList, setCountryList] = useState(releaseData?.step4?.length > 0 ? releaseData?.step4 : initialCountryList);
  const handleCheckboxChange = (item) => {
    setCountryList((prevList) =>
      prevList.map((country) =>
        country.id === item.id
          ? { ...country, status: country.status === 'active' ? 'inactive' : 'active' }
          : country
      )
    );
  };
  const handleSubmit = async () => {
    let body = {
      _id: releaseData._id,
      step4: countryList
    }
    console.log(body)
    let result = await postData(base.addStore, body);
    if (result.data.status === true) {
      Swal.fire("Success", result.message, result.message);
    } else {
      Swal.fire("Error", result.message, result.message);
    }
  }

  return (
    <div className="listColumns">
      <div className="check-btn checkUncheckAll-header">
        <button className="btn btn-primary checkAll" rel="AS" onClick={() => setCountryList((prevList) =>
          prevList.map((country) => ({ ...country, status: "active" }))
        )}>Check all</button>
        <button className="btn btn-primary uncheckAll mx-3" rel="AS" onClick={() => setCountryList((prevList) =>
          prevList.map((country) => ({ ...country, status: "inactive" }))
        )}>Uncheck all</button>
      </div>
      <div className="countryList d-flex flex-wrap">
        {countryList?.map((item, index) => (
          <div key={index} className="colElement dash-detail">
            <div className="countryItem d-flex align-items-center flex-wrap">
              <div className="store-logo">
                <img className="img-fluid" src={require(`../../assets/images/store/${item.logo}`)} alt={item.name} />
              </div>
              <div className="store-select">
                <input type="checkbox" checked={item.status === 'active'} onChange={() => handleCheckboxChange(item)} />
                {item.name}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="save-btn">
        <button type="Submit" className="btn btn-primary" onClick={() => { handleSubmit() }}>Save</button>
      </div>
    </div>
  );
}