import React from "react";
import "./imageCPN.css";

interface IImageCPN {
  imageKeyName: string;
  imageId?: number;
  handleDestroy: Function;
}

const ImageCPN = ({ imageKeyName, imageId, handleDestroy }: IImageCPN) => {
  return (
    <div className="upload">
      {imageKeyName && (
        <div id="file_img">
          <img src={"http://127.0.0.1:5500/" + imageKeyName} alt="" />
          <span onClick={() => handleDestroy(imageKeyName, imageId)}>X</span>
        </div>
      )}
    </div>
  );
};

export default ImageCPN;
