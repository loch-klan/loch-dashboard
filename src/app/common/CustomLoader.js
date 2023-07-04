import React from "react";
import ContentLoader from "react-content-loader";

const CustomLoader = (props) => (
  <ContentLoader
    speed={3}
    width={props.loaderType === "pie" ? 600 : 135}
    height={props.loaderType === "pie" ? 600 : 59}
    // height={props.loaderType === "pie" ? 600 : 40}
    viewBox="0"
    backgroundColor="#e8e8e8"
    foregroundColor="#cfcfcf"
    // {...props}
  >
    {props.loaderType === "pie" ? <circle cx="300" cy="200" r="200" /> : null}
    {props.loaderType === "text" ? (
      <>
        <rect x="0" y="0" rx="3" ry="3" width="210" height="10" />
        <rect x="0" y="15" rx="3" ry="3" width="210" height="10" />
        <rect x="0" y="30" rx="3" ry="3" width="210" height="10" />
      </>
    ) : null}
  </ContentLoader>
);

export default CustomLoader;
