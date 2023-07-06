import React, { Fragment } from "react";
import { ProgressBar, Image } from "react-bootstrap";
// import PdfImage from "../../assets/img/pdf-img.png"
import { getExtensionNameWrapper } from "../ReusableFunctions";
import closeIcon from "../../assets/images/close.png";

const FilePreview = (props) => {
  const { files, uploadProgress, onRemove } = props;
  return files.map((fileInfo, index) => {
    const progress = uploadProgress[fileInfo.id];
    // const url = fileInfo.mimeType === "application/pdf" ? PdfImage : fileInfo.url;
    // console.log('fileInfo', fileInfo);
    let attachmentWrapper = getExtensionNameWrapper(
      fileInfo.name,
      fileInfo.path,
      "option-card-extension "
    );

    return (
      <Fragment key={index}>
        {!progress && (
          <div className="uploaded-img-wrapper">
            {/* <Image src={url} responsive className="image-preview" /> */}
            {attachmentWrapper}
            <Image
              src={closeIcon}
              className="remove-circle"
              onClick={() => onRemove(fileInfo)}
            />
          </div>
        )}
        {progress && <ProgressBar striped bsstyle="info" now={progress} />}
      </Fragment>
    );
  });
};

export default FilePreview;
