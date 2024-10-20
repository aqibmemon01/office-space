import React from 'react';
import './imageUploader.css'; 

const ImageUploader = ({ onImageUpload }) => {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageUpload(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        id="image-upload"
        onChange={handleImageUpload}
        className="image-input"
      />
      <label htmlFor="image-upload" className="upload-label">
        Upload Image
      </label>
    </>
  );
};

export default ImageUploader;
