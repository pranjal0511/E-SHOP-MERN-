
// import axios from "axios"
// import  { useEffect } from 'react';

// const UploadImages = ({image,setImage}) => {
  
//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     console.log("file",file)
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     const file = event.dataTransfer.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//   };

//   async function uploadImageToCloudinary() {
//     const data = new FormData();
//     data.append("my_file", image);
//     const response = await axios.post(
//       "http://localhost:5000/api/admin/products/upload-image",
//       data
//     );
//     console.log(response, "response");

//     if (response?.data?.success) {
//      console.log(response?.data?.success)
//     }
//   }

//   useEffect(() => {
//     if (image !== null) uploadImageToCloudinary();
//   }, [image]);

//   return (
//     <div
//     className="border-2 border-dashed border-gray-300 p-6 text-center cursor-pointer"
//     onDrop={handleDrop}
//     onDragOver={handleDragOver}
//     onClick={() => document.getElementById('fileInput').click()}
//   >
//     <input
//       id="fileInput"
//       type="file"
//       accept="image/*"
//       className="hidden"
//       onChange={handleImageChange}
//     />
//     {image ? (
//       <img src={image} alt="Uploaded" className="max-w-full h-auto" />
//     ) : (
//       <p>Drag & drop or click to upload image</p>
//     )}
//   </div>
//   );
// };

// export default UploadImages;


import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useEffect, useRef } from "react";
import axios from "axios";


function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  console.log(isEditMode, "isEditMode");

  function handleImageFileChange(event) {
    console.log(event.target.files, "event.target.files");
    const selectedFile = event.target.files?.[0];
    console.log(selectedFile);

    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    const data = new FormData();
    data.append("my_file", imageFile);
    const response = await axios.post(
      "http://localhost:5000/api/admin/products/upload-image",
      data
    );
    console.log(response , "response check");

    if (response?.data?.success) {
      setUploadedImageUrl(response.data.result.url);
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div
      className={`w-full  mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
    >
      <h1 className="text-lg font-semibold mb-2 block">Upload Image</h1>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 text-primary mr-2 h-8" />
            </div>
            <p className="text-sm font-medium">{imageFile.name}</p>
              <XIcon className="w-4 h-4" onClick={handleRemoveImage} />
              
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
