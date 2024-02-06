import React, { useState } from "react";
export default function HandleBrokenImages(props) {
  const [hideImage, setHideImage] = useState(false);
  const hideThisImage = () => {
    setHideImage(true);
  };
  if (hideImage) {
    return null;
  }
  return (
    <img
      alt=""
      src={props.src}
      key={props.index}
      className={props.className}
      onError={hideThisImage}
    />
  );
}
