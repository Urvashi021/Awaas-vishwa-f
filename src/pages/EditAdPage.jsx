import React from "react";
import { v4 as uuidV4 } from "uuid";
import { TextField, Button } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from "../../FirebaseConfig";
import alert from "../utility/alert";
import { Navigate, useParams } from "react-router-dom";

const descDefaultVal =
  `Property Type: House/Apartment/Condo/Villa/Other
Facing: North/East/West/South
How Many Bedrooms?: 
How Many Bathrooms?: 
Furnishing: Non/Semi/Fully Furnished 
Super Built up area (ft²): 
Carpet Area (ft²): 
Car Parking: Yes/No
Maintenance (Monthly/Yearly): 
Total Floors: 
Floor No (For Rent):
Bachelors Allowed: Yes/No 
Listed by:
Project Name: `;

const EditAdPage = () => {
  const [redirectToHome, setRedirectToHome] = React.useState(false);
  const [imagePaths, setImagePaths] = React.useState([]);
  const [files, setFiles] = React.useState(null);
  const title = React.useRef();
  const location = React.useRef();
  const price = React.useRef();
  const description = React.useRef();
  const imgList = React.useRef([]);
  // const listType = React.useRef();
  const [listType, setListType] = React.useState();

  const { itemId } = useParams();

  React.useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/items/${itemId}`, {
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          title.current.value = data.data.title;
          location.current.value = data.data.location;
          price.current.value = data.data.price;
          description.current.value = data.data.description;
          setListType(data.data.listType);
          setImagePaths(data.data.imgList);
        } else {

        }
      });
  }, [])

  const onImageChange = (event) => {
    if (event.target.files) {
      setFiles(event.target.files);
      let imagePathList = [];
      for (const file of event.target.files) {
        imagePathList.push(URL.createObjectURL(file))
      }
      setImagePaths(imagePathList);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const titleVal = title.current.value;
    const locationVal = location.current.value;
    const priceVal = price.current.value;
    const descriptionVal = description.current.value;
    const listTypeVal = listType;

    if (titleVal.length < 5 || titleVal.length > 100) {
      alert('title length should be greater than equals to 5 and less equals to 100 characters', 'error')
      return
    }
    if (locationVal.length < 3 || locationVal.length > 100) {
      alert('location length should be greater than equals to 3 and less equals to 100 characters', 'error')
      return
    }
    if (priceVal < 0 || priceVal > 1000000000) {
      alert('price should be greater than 0 and less than 100,00,00,000', 'error')
      return
    }
    if (descriptionVal.length > 1000) {
      alert('description length should be less than 1000 characters', 'error')
      return
    }
    if (!listType) {
      alert('please select the list type', 'error')
      return
    }
    if (files?.length > 10) {
      alert('maximum 10 images are allowed to be uploaded', 'error')
      return
    }

    // upload files
    if (files) {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const randomFileName = `${uuidV4()}.${fileExt}`;
        const storageRef = ref(storage, `/ad-imgs/${randomFileName}`);
        const upload = uploadBytesResumable(storageRef, file);
        imgList.current.push(`https://firebasestorage.googleapis.com/v0/b/awaas-vishwa-e2a33.appspot.com/o/ad-imgs%2F${randomFileName}?alt=media&token=46bb890a-c5b0-4107-8c3c-d3d346c66a76`)
      }
    }
    const imgListVal = imgList.current;

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: titleVal,
        location: locationVal,
        price: priceVal,
        description: descriptionVal,
        listType: listTypeVal,
        imgList: files ? imgListVal : imagePaths,
      }),
      credentials: 'include',
    })
    const data = await response.json();
    if (response.ok) {
      alert(data.success, 'success')
      setRedirectToHome(true);
    } else {
      alert(data.error, 'error')
    }
  }

  if (redirectToHome) {
    return <Navigate to='/' />
  }

  return (
    <div className="create-ad-page">
      <div className="create-ad-container">
        <div className="create-ad-form">
          <h1>Edit Property Details</h1>
          <form onSubmit={handleSubmit}>
            <FormLabel id="demo-row-radio-buttons-group-label" required>Upload Images</FormLabel>
            <CreateAdImgGallery imagePaths={imagePaths} />
            <input type="file" accept="image/*" className="create-ad-img-input" onChange={onImageChange} multiple />
            <br />
            <FormLabel id="demo-row-radio-buttons-group-label" required>Listing Type</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              onChange={event => { setListType(event.target.value) }}
            >
              <FormControlLabel value="RENT" control={<Radio checked={'RENT' == listType} />} label="Rent" />
              <FormControlLabel value="SELL" control={<Radio checked={'SELL' == listType} />} label="Sell" />
            </RadioGroup>
            <TextField
              fullWidth
              id="filled-basic"
              label="Title"
              variant="filled"
              inputRef={title}
              autoComplete="off"
              required
            />
            <TextField
              fullWidth
              id="filled-basic"
              label="location"
              variant="filled"
              inputRef={location}
              autoComplete="off"
              required
            />
            <TextField
              fullWidth
              type="number"
              id="filled-basic"
              label="Price"
              variant="filled"
              inputRef={price}
              autoComplete="off"
              required
            />
            <TextField
              fullWidth
              id="filled-multiline-static"
              label="Description"
              multiline
              rows={14}
              defaultValue={descDefaultVal}
              inputRef={description}
              autoComplete="off"
              variant="filled"
            />
            <Button
              variant="contained"
              sx={{ marginTop: "20px", width: "100%" }}
              type="submit"
            >
              Edit Ad
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

function CreateAdImgGallery({ imagePaths }) {
  if (imagePaths) {
    return (
      <div className="create-ad-img-container">
        {
          imagePaths.map((imgPath, idx) => (
            <div key={idx} className="create-ad-img">
              <img src={imgPath} alt="" />
            </div>
          ))
        }
      </div>
    )
  }
}

export default EditAdPage;