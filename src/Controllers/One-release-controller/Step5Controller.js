import React, { useContext, useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import { base } from '../../Constants/Data.constant';
import { postData, postDataContent } from '../../Services/Ops';
const Step5Controller = (props) => {
    const [releaseData,setReleaseData]= useState({})
    
    const navigate = useNavigate();
 
const initialStoreList = [
    { id: '1', name: 'Digital gold', logo: 'fa fa-icon', date: '' },
    { id: '2', name: 'Amazon', logo: 'fa fa-icon', date: '' },
    { id: '3', name: 'Beatport', logo: 'fa fa-icon', date: '' },
    { id: '4', name: 'Beatsource', logo: 'fa fa-icon', date: '' },
    { id: '5', name: 'Deezer', logo: 'fa fa-icon', date: '' },
    { id: '6', name: 'Hungama', logo: 'fa fa-icon', date: '' },
    { id: '7', name: 'Instagram (by Facebook)', logo: 'fa fa-icon', date: '' },
    { id: '8', name: 'iTunes', logo: 'fa fa-icon', date: '' },
    { id: '9', name: 'JioSaavn', logo: 'fa fa-icon', date: '' },
    { id: '10', name: 'Juno Download', logo: 'fa fa-icon', date: '' },
    { id: '11', name: 'Millward Brown / OCC', logo: 'fa fa-icon', date: '' },
    { id: '12', name: 'Phononet', logo: 'fa fa-icon', date: '' },
    { id: '13', name: 'Presto', logo: 'fa fa-icon', date: '' },
    { id: '14', name: 'QQ Music / KuGou / Kuwo / WeSing / Ultimate Music', logo: 'fa fa-icon', date: '' },
    { id: '15', name: 'Spotify', logo: 'fa fa-icon', date: '' },
    { id: '16', name: 'TikTok (by Bytedance)', logo: 'fa fa-icon', date: '' },
    { id: '17', name: 'Traxsource', logo: 'fa fa-icon', date: '' },
    { id: '18', name: 'VKontakte / Odnoklassniki / Mail.ru (by UMA)', logo: 'fa fa-icon', date: '' },
    { id: '19', name: 'Yandex', logo: 'fa fa-icon', date: '' },
    { id: '20', name: 'YouTube', logo: 'fa fa-icon', date: '' }
  ];
 
  const [mainReleaseDate, setMainReleaseDate] = useState(new Date().toISOString().split('T')[0]);

  const [preOrderDate, setPreOrderDate] = useState(initialStoreList);
  const [selectPreOrderDate, setSelectPreOrderDate] = useState([]);

  const [exclusiveDates, setExclusiveDates] = useState(initialStoreList);
  const [selectexclusiveDate, setSelectexclusiveDate] = useState([]);
  
  const [allowPreview, setAllowPreview] = useState(false);
  
  const handleExclusiveDateChange = (id, newDate) => {
    setSelectexclusiveDate((prevDates) =>
      prevDates.map((item) =>
        item.id === id ? { ...item, date: newDate } : item
      )
    );
  };

  const handlePreOrderDateChange = (id, newDate) => {
    setSelectPreOrderDate((prevDates) =>
      prevDates.map((item) =>
        item.id === id ? { ...item, date: newDate } : item
      )
    );
  };
  
  const preOrderSelect = (id) => {
    const selectedItem = preOrderDate.find(item => item.id === id);
    if (selectedItem && !selectPreOrderDate.some(item => item.id === id)) {
      setSelectPreOrderDate([...selectPreOrderDate, selectedItem]);
      setPreOrderDate(preOrderDate.filter(item => item.id !== id));
    }
  };
  
  const exclusiveOrderSelect = (id) => {
    const selectedItem = exclusiveDates.find(item => item.id === id);
    if (selectedItem && !selectexclusiveDate.some(item => item.id === id)) {
      setSelectexclusiveDate([...selectexclusiveDate, selectedItem]);
      setExclusiveDates(exclusiveDates.filter(item => item.id !== id));
    }
  };
  
  const removePreOrder = (id) => {
    const removedItem = selectPreOrderDate.find(item => item.id === id);
    setSelectPreOrderDate(selectPreOrderDate.filter(item => item.id !== id));
    setPreOrderDate([...preOrderDate, removedItem]);
  };
  
  const removeExclusiveDate = (id) => {
    const removedItem = selectexclusiveDate.find(item => item.id === id);
    setSelectexclusiveDate(selectexclusiveDate.filter(item => item.id !== id));
    setExclusiveDates([...exclusiveDates, removedItem]);
  };
        // State to store the uploaded files
 

     
    const handleSubmit =async (e) => { 
        let body={
            "_id": releaseData._id,
            "step5": {
            "MainReleaseDate": mainReleaseDate,
            "PreOrder": selectPreOrderDate,
            "Preview": {
              "Allow90Sec": allowPreview
            },
            "ExclusiveReleaseDates": selectexclusiveDate
          } 
        }

        console.log(body)
        let result = await postData(base.releaseStep5, body);
    if (result.data.status === true) {
      Swal.fire("Success", result.message, result.message);
    } else {
      Swal.fire("Error", result.message, result.message);
    }
      };

    return { 
        handleSubmit,
        removeExclusiveDate,
        removePreOrder,
        exclusiveOrderSelect,
        preOrderSelect,
        handlePreOrderDateChange,
        handleExclusiveDateChange,
        preOrderDate, setPreOrderDate,
        selectPreOrderDate, setSelectPreOrderDate,
        exclusiveDates, setExclusiveDates,
        selectexclusiveDate, setSelectexclusiveDate,
        allowPreview, setAllowPreview, 
        mainReleaseDate,setMainReleaseDate,setReleaseData
    }

}
export default Step5Controller;
