import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import useLocalStorage from 'use-local-storage';
import { base } from '../../Constants/Data.constant';
import { getData, postData, postDataContent } from '../../Services/Ops';
const Step1Controller = (props) => {

  const [releaseData, setReleaseData] = useState({})
  const [releaseTitle, setReleaseTitle] = useState('');
  const [versionSubtitle, setVersionSubtitle] = useState('');
  const [primaryArtist, setPrimaryArtist] = useState([]);
  const [featuring, setFeaturing] = useState('');
  const [isVariousArtists, setIsVariousArtists] = useState(false);
  const [genre, setGenre] = useState('');
  const [subGenre, setSubGenre] = useState('');
  const [labelName, setLabelName] = useState('');
  const [format, setFormat] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [pLine, setPLine] = useState('');
  const [cLine, setCLine] = useState('');
  const [cYear, setCYear] = useState('');
  const [pYear, setPYear] = useState('');
  const [productionYear, setProductionYear] = useState('');
  const [upcEan, setUpcEan] = useState('');
  const [producerCatalogueNumber, setProducerCatalogueNumber] = useState('');
  const [newLabelName, setNewLabelName] = useState('');
  const [labelNameStatus, setLabelNameStatus] = useState('');
  const [labelNameList, setLabelNameList] = useState([]);
  const [coverImage, setCoverImage] = useState({});
  const [loader, setLoader] = useState(false);



  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchLabel()
  }, [props, labelName])

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type; // Get file type
      const validFormats = ["image/jpeg"]; // Allowed formats

      if (!validFormats.includes(fileType)) {
        Swal.fire("Validation Error", "Only JPEG format is allowed.", "error");
        return; // Exit if format is invalid
      }

      // Create an Image object to validate dimensions
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        // const isValidSize = width >= 1440 && width <= 3000 && height >= 1440 && height <= 3000;
        // Check if dimensions match allowed sizes
        if (!(width === 3000 && height === 3000)) {
          Swal.fire(
            "Validation Error",
            "Image size must be 3000x3000 pixels.",
            "error"
          );
          return; // Exit if size is invalid
        }

        // If all validations pass, set the preview and file
        setImagePreview(URL.createObjectURL(file));
        setImageFile(file);
      };

      // Error handling in case the image fails to load
      img.onerror = () => {
        Swal.fire("Validation Error", "Invalid image file.", "error");
      };
    }
  };
  function generateNumber() {
    const prefix = "361"; // Fixed prefix
    const randomPart = Math.floor(1000000000 + Math.random() * 9000000000); // Random 10-digit number
    return prefix + randomPart;
  }

  const handleSubmit = async (e) => {
    // validation set
    //   if (!releaseData.title) {
    //     return swal("Validation Error", "Title is required", "error");
    // }
    // if (!releaseData.type) {
    //     return swal("Validation Error", "Type is required", "error");
    // }
    // if (!releaseData._id) {
    //     return swal("Validation Error", "ID is required", "error");
    // }
    // if (!versionSubtitle) {
    //     return swal("Validation Error", "Subtitle is required", "error");
    // }
    // if (!primaryArtist) {
    //     return swal("Validation Error", "Primary artist is required", "error");
    // }
    // if (!genre) {
    //     return swal("Validation Error", "Genre is required", "error");
    // }
    // if (!subGenre) {
    //     return swal("Validation Error", "Sub-genre is required", "error");
    // }
    // if (!labelName) {
    //     return swal("Validation Error", "Label name is required", "error");
    // }
    // if (!format) {
    //     return swal("Validation Error", "Format is required", "error");
    // }
    // if (!releaseDate) {
    //     return swal("Validation Error", "Release date is required", "error");
    // }
    // if (!pLine) {
    //     return swal("Validation Error", "P Line is required", "error");
    // }
    // if (!cLine) {
    //     return swal("Validation Error", "C Line is required", "error");
    // }
    // if (!productionYear) {
    //     return swal("Validation Error", "Production year is required", "error");
    // }
    // if (!upcEan) {
    //     return swal("Validation Error", "UPC/EAN is required", "error");
    // }
    // validation set end
    try{
      setLoader(true)
    const formData = new FormData();
    formData.append("title", releaseTitle);
    formData.append("type", releaseData.type);
    formData.append("_id", releaseData._id);
    formData.append("step1[subTitle]", versionSubtitle);
    // Flatten arrays for `primaryArtist` 
    primaryArtist.forEach((file, index) => {
      formData.append(`step1[primaryArtist][${index}][id]`, file._id);
      formData.append(`step1[primaryArtist][${index}][name]`, file.name);
      formData.append(`step1[primaryArtist][${index}][linkId]`, file.linkId);
      formData.append(`step1[primaryArtist][${index}][itunesLinkId]`, file.itunesLinkId);
    });

    // Flatten arrays for `featuring`
    featuring.forEach((file, index) => {
      formData.append(`step1[featuring][${index}][id]`, file._id);
      formData.append(`step1[featuring][${index}][name]`, file.name);
      formData.append(`step1[featuring][${index}][linkId]`, file.linkId);
      formData.append(`step1[featuring][${index}][itunesLinkId]`, file.itunesLinkId);
    });

    formData.append("step1[isVariousArtists]", isVariousArtists);
    formData.append("step1[genre]", genre);
    formData.append("step1[subGenre]", subGenre);
    formData.append("step1[labelName]", labelName);
    formData.append("step1[format]", format);
    formData.append("step1[originalReleaseDate]", releaseDate);
    formData.append("step1[line]", pLine);
    formData.append("step1[cline]", cLine);
    formData.append("step1[pYear]", pYear);
    formData.append("step1[cYear]", cYear);
    formData.append("step1[productionYear]", productionYear);
    formData.append("step1[UPCEAN]", upcEan == "" || upcEan ?generateNumber():upcEan );
    formData.append("step1[producerCatalogueNumber]", producerCatalogueNumber);
    formData.append("coverImage", imageFile ?imageFile :coverImage);
    console.log("body===========>", imageFile)

    let result = await postDataContent(base.releaseStep1, formData);
 
    if (result.status == true) {
      setLoader(false)
      // Update coverImage with the returned URL from backend
      if (result.data && result.data.step1 && result.data.step1.coverImage) {
        setCoverImage(result.data.step1.coverImage);
        setImagePreview(null); // Clear preview after successful upload
        setImageFile(null); // Clear file after successful upload
      }
      Swal.fire("Success", result.message, "success");
    } else {
      setLoader(false)

      Swal.fire("Error", result.message, "error");
    }
  }catch(e){
    setLoader(false)

   // Swal.fire("Error", e.message, e.message);

  }

  };


  const addNewLabel = async () => {
    let body = {
      "title": newLabelName
    }
    let result = await postData(base.addLabel, body);
    console.log("label addd ", result.data.data)
    if (result.data.status === true) {
      Swal.fire("Success", result.message, result.message);
      fetchLabel()
      setNewLabelName("")
      setLabelName(result.data.data.title)
      setLabelNameStatus(false)
    } else {
      Swal.fire("Error", result.message, result.message);
    }

  }
  const fetchLabel = async () => {
    let result = await getData(base.labelList);
    setLabelNameList(result.data)
    console.log(base.labelList, "==============>", result)
  }

  return {
    releaseTitle, setReleaseTitle,
    versionSubtitle, setVersionSubtitle,
    primaryArtist, setPrimaryArtist,
    featuring, setFeaturing,
    isVariousArtists, setIsVariousArtists,
    genre, setGenre,
    subGenre, setSubGenre,
    labelName, setLabelName,
    format, setFormat,
    releaseDate, setReleaseDate,
    pLine, setPLine,
    cLine, setCLine,
    pYear, setPYear,
    cYear, setCYear,
    productionYear, setProductionYear,
    upcEan, setUpcEan,
    producerCatalogueNumber, setProducerCatalogueNumber,
    newLabelName, setNewLabelName,
    labelNameStatus, setLabelNameStatus,
    handleSubmit,
    setReleaseData,
    addNewLabel,
    labelNameList,
    imagePreview, setImagePreview, handleImageChange,
    setCoverImage, coverImage,
    loader
  }

}
export default Step1Controller;
