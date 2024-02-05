import React, { useState } from "react";
export default function HandleBrokenImages(props) {
  const [hideImage, setHideImage] = useState(false);
  const hideThisImage = () => {
    setHideImage(true);
  };

  if (hideImage) {
    if (props.imageOnError) {
      return (
        <img
          alt=""
          src={props.imageOnError}
          key={props.index}
          className={props.className}
          onError={hideThisImage}
        />
      );
    }
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
