import React, { useContext, useState,useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import useLocalStorage from 'use-local-storage';
import { base } from '../../Constants/Data.constant';
import { getData, postData, postDataContent } from '../../Services/Ops';
const Step1Controller = (props) => {

  const [releaseData, setReleaseData] = useState({})
  const [releaseTitle, setReleaseTitle] = useState('');
  const [versionSubtitle, setVersionSubtitle] = useState('');
  const [primaryArtist, setPrimaryArtist] = useState('');
  const [featuring, setFeaturing] = useState('');
  const [isVariousArtists, setIsVariousArtists] = useState(false);
  const [genre, setGenre] = useState('');
  const [subGenre, setSubGenre] = useState('');
  const [labelName, setLabelName] = useState('');
  const [format, setFormat] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [pLine, setPLine] = useState('');
  const [cLine, setCLine] = useState('');
  const [productionYear, setProductionYear] = useState('');
  const [upcEan, setUpcEan] = useState('');
  const [producerCatalogueNumber, setProducerCatalogueNumber] = useState('');
  const [newLabelName, setNewLabelName] = useState('');
  const [labelNameStatus, setLabelNameStatus] = useState('');
  const [labelNameList, setLabelNameList] = useState([]);


  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(()=>{
    fetchLabel()
  },[props,labelName])

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

            // Check if dimensions match allowed sizes
            if (!((width === 1440 && height === 1440) || (width === 3000 && height === 3000))) {
                Swal.fire(
                    "Validation Error",
                    "Image size must be 1440x1440 or 3000x3000 pixels.",
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


  const handleSubmit = async (e) => {
    // validation set
    if (!releaseData.title) {
      return swal("Validation Error", "Title is required", "error");
  }
  if (!releaseData.type) {
      return swal("Validation Error", "Type is required", "error");
  }
  if (!releaseData._id) {
      return swal("Validation Error", "ID is required", "error");
  }
  if (!versionSubtitle) {
      return swal("Validation Error", "Subtitle is required", "error");
  }
  if (!primaryArtist) {
      return swal("Validation Error", "Primary artist is required", "error");
  }
  if (!genre) {
      return swal("Validation Error", "Genre is required", "error");
  }
  if (!subGenre) {
      return swal("Validation Error", "Sub-genre is required", "error");
  }
  if (!labelName) {
      return swal("Validation Error", "Label name is required", "error");
  }
  if (!format) {
      return swal("Validation Error", "Format is required", "error");
  }
  if (!releaseDate) {
      return swal("Validation Error", "Release date is required", "error");
  }
  if (!pLine) {
      return swal("Validation Error", "P Line is required", "error");
  }
  if (!cLine) {
      return swal("Validation Error", "C Line is required", "error");
  }
  if (!productionYear) {
      return swal("Validation Error", "Production year is required", "error");
  }
  if (!upcEan) {
      return swal("Validation Error", "UPC/EAN is required", "error");
  }
    // validation set end
    const formData = new FormData();
  
  // Add all necessary fields
  formData.append("title", "sdasdasd"); //releaseData.title
  formData.append("type", "wertwetw"); //releaseData.type
  formData.append("_id", "671e08391a2071afe4269f80"); //releaseData._id
  formData.append("step1[subTitle]", versionSubtitle);
  formData.append("step1[primaryArtist]", primaryArtist);
  formData.append("step1[featuring]", featuring);
  formData.append("step1[isVariousArtists]", isVariousArtists);
  formData.append("step1[genre]", genre);
  formData.append("step1[subGenre]", subGenre);
  formData.append("step1[labelName]", labelName);
  formData.append("step1[format]", format);
  formData.append("step1[originalReleaseDate]", releaseDate);
  formData.append("step1[line]", pLine);
  formData.append("step1[cline]", cLine);
  formData.append("step1[productionYear]", productionYear);
  formData.append("step1[UPCEAN]", upcEan);
  formData.append("step1[producerCatalogueNumber]", producerCatalogueNumber);
  
    // let body = {
    //   "title": releaseData.title,
    //   "type": releaseData.type,
    //   "_id": releaseData._id,
    //   "step1": {
    //     subTitle: versionSubtitle,
    //     primaryArtist: primaryArtist,
    //     featuring: featuring,
    //     isVariousArtists: isVariousArtists,
    //     genre: genre,
    //     subGenre: subGenre,
    //     labelName: labelName,
    //     format: format,
    //     originalReleaseDate: releaseDate,
    //     line: pLine,
    //     cline: cLine,
    //     productionYear: productionYear,
    //     UPCEAN: upcEan,
    //     producerCatalogueNumber: producerCatalogueNumber
    //   }

  if (imageFile) {
    formData.append("coverImage", imageFile);
  }

    // let body = {
    //   "title": releaseData.title,
    //   "type": releaseData.type,
    //   "_id": releaseData._id,
    //   "step1": {
    //     subTitle: versionSubtitle,
    //     primaryArtist: primaryArtist,
    //     featuring: featuring,
    //     isVariousArtists: isVariousArtists,
    //     genre: genre,
    //     subGenre: subGenre,
    //     labelName: labelName,
    //     format: format,
    //     originalReleaseDate: releaseDate,
    //     line: pLine,
    //     cline: cLine,
    //     productionYear: productionYear,
    //     UPCEAN: upcEan,
    //     producerCatalogueNumber: producerCatalogueNumber
    //   }

    // }
    console.log("body===========>", formData )

    let result = await postData(base.releaseStep1, formData);
    console.log(result)
    if (result.data.status === true) {
       // Reset form state
       setReleaseTitle('');
       setVersionSubtitle('');
       setPrimaryArtist('');
       setFeaturing('');
       setIsVariousArtists(false);
       setGenre('');
       setSubGenre('');
       setLabelName('');
       setFormat('');
       setReleaseDate('');
       setPLine('');
       setCLine('');
       setProductionYear('');
       setUpcEan('');
       setProducerCatalogueNumber('');
       setNewLabelName('');
       setImagePreview(null);
       setImageFile(null);

       // Optionally navigate to a different page or reload the form
      //  navigate('/');
      Swal.fire("Success", result.message, result.message);

    } else {
      Swal.fire("Error", result.message, result.message);
    }
  };

  const swal=(title,message,icon)=>{
    Swal.fire({
      title: title,
      text:  message,  // Adjust to display the actual message you want
      icon: icon
    });
  }

  const addNewLabel = async () => {
    let body = {
      "title": newLabelName
    }
    let result = await postData(base.addLabel, body);
    console.log(result)
    if (result.data.status === true) {
      Swal.fire("Success", result.message, result.message); 
      fetchLabel()
      setNewLabelName("")
    } else {
      Swal.fire("Error", result.message, result.message);
    }
   
  }
  const fetchLabel = async () => { 
    let result = await getData(base.labelList);
    setLabelNameList(result.data)
    console.log(base.labelList,"==============>",result)
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
  }

}
export default Step1Controller;
