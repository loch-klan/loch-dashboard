import React from "react";
import PropTypes from "prop-types";
import FileUploader from "./FileUploader";

const FileUploadControl = (props) => {
  const {
    moduleName,
    subModule,
    fileType,
    extensions,
    maxFiles,
    maxFileSize,
    columns,
    valueLink,
    onSelect,
  } = props;
  return (
    <div>
      <FileUploader
        moduleName={moduleName}
        subModule={subModule}
        fileType={fileType}
        extensions={extensions}
        maxFiles={maxFiles}
        maxFileSize={maxFileSize}
        columns={columns}
        valueLink={valueLink}
        onSelect={onSelect}
      />
    </div>
  );
};

FileUploadControl.propTypes = {
  //classes: PropTypes.object.isRequired,
  valueLink: PropTypes.object.isRequired,
  extensions: PropTypes.array,
  maxFiles: PropTypes.number,
  maxFileSize: PropTypes.number,
  columns: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
};

FileUploadControl.defaultProps = {
  extensions: ["*"],
  maxFiles: 1,
  maxFileSize: 2000000,
  columns: 1,
};

export default FileUploadControl;
