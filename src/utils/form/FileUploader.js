import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { Image } from "react-bootstrap";
import { getToken } from "../ManageToken";
// import Dropzone from "react-dropzone";
import BaseReactComponent from "./BaseReactComponent";
import FilePreview from "./FilePreview";
// import { DisplayUtil } from "../utils";
import plusIcon from "../../assets/images/icons/plus-icon.svg";

const DisplayUtil = null;

class FileUploader extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      files:
        props.maxFiles === 1
          ? props.valueLink.value
            ? [props.valueLink.value]
            : []
          : props.valueLink.value,
      uploadProgress: {},
    };
    // console.log('props.valueLink.value', props.valueLink.value);
  }

  onUploadProgress = (fileInfo, percentage) => {
    const { uploadProgress } = this.state;
    let stateCallback = null;
    if (percentage === 100) {
      delete uploadProgress[fileInfo.id];
      stateCallback = this.updateValueLink;
    } else {
      uploadProgress[fileInfo.id] = percentage;
    }
    //console.log('uploadProgress', uploadProgress);
    this.setState({ uploadProgress }, stateCallback);
  };

  uploadFile = (uploadURL, htmlFile, fileInfo, onProgress) => {
    return new Promise((res, rej) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      //console.log('htmlFile', htmlFile.type);
      let type;
      if (htmlFile.type.match("image.*")) {
        type = "IMAGE";
      } else if (htmlFile.type.match("video.*")) {
        type = "VIDEO";
      } else {
        type = "ALL_FORMAT";
      }

      // return;
      // let type = "IMAGE";
      // if (htmlFile.type === "application/pdf") {
      //     type = "PDF"
      // }

      formData.append("file", htmlFile);
      formData.append("module", this.props.moduleName);
      formData.append("sub_module", this.props.subModule);
      // formData.append('type', type);
      formData.append("media_type", type);
      // IF THE MODULE NAME IS ORGANISATION THEN PASS ACCOUNT ID = 0 AS ITS GLOBAL ASSET.
      /*
      if (this.props.moduleName === "organisation")
          formData.append('scope', JSON.stringify({ account_id: 0 }));
      else
          formData.append('scope', getScope());
      */

      xhr.open("POST", uploadURL + "common/attachment/upload");
      // xhr.setRequestHeader("Content-Type", "multipart/form-data");
      xhr.setRequestHeader("Authorization", getToken());

      xhr.onload = (e) => res(e.target.responseText);
      xhr.onerror = rej;
      if (xhr.upload && onProgress) xhr.upload.onprogress = onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
      // console.log('formData', formData);
      xhr.send(formData);
    });
  };

  startUpload = (htmlFile, fileInfo, uploadURL) => {
    this.uploadFile(uploadURL, htmlFile, fileInfo, (event) => {
      this.onUploadProgress(
        fileInfo,
        parseInt((event.loaded / event.total) * 100, 10)
      );
    })
      .then((response) => {
        let res = JSON.parse(response);
        //console.log('image upload response', response);
        if (!res.error) {
          // console.log('image upload response', res.data.id);
          fileInfo.imageId = res.data.id;
          fileInfo.path = res.data.url;
          // console.log('image upload res', res);
          // console.log('image upload fileInfo', fileInfo);
          this.onUploadProgress(fileInfo, 100);
        } else {
          fileInfo.error = true;
          fileInfo.errorText = "Unable to upload file";
        }
      })
      .catch((err) => {
        // console.log('Error', err);
        fileInfo.error = true;
        fileInfo.errorText = "Unable to upload file";
        // DisplayUtil.showErrorAlert("Unable to upload file");
      });
  };

  onImageChange = (e) => {
    // console.log('event files', e.target.files[0]);
    let acceptedFiles = e.target.files;
    // console.log('acceptedFiles', acceptedFiles);
    const { onSelect } = this.props;
    const { files, uploadProgress } = this.state;
    // console.log('files',files);
    Array.from(acceptedFiles).forEach((htmlFile) => {
      onSelect(htmlFile, (fileInfo, uploadURL) => {
        files.push(fileInfo);
        uploadProgress[fileInfo.id] = 1;
        this.setState(
          {
            files,
            uploadProgress,
          },
          () => this.startUpload(htmlFile, fileInfo, uploadURL)
        );
      });
    });
  };

  onDropRejected = (rejectedFiles) => {
    const fileNames = _.map(rejectedFiles, "name");
    DisplayUtil.showWarningAlert(
      fileNames.join(", ") + " rejected due to size or invalid format"
    );
  };

  onRemove = (fileInfo) => {
    const { files } = this.state;
    files.splice(files.indexOf(fileInfo), 1);
    this.setState({ files }, this.updateValueLink);
  };

  updateValueLink = () => {
    const { maxFiles, valueLink } = this.props;
    const { files } = this.state;
    valueLink.requestChange(
      maxFiles === 1 ? (files.length === 0 ? null : files[0]) : files
    );
  };

  componentDidUpdate(prevProps, prevState) {
    // console.log("prevProps", prevProps);
    // console.log('this.props', this.props);
    // Typical usage (don't forget to compare props):

    if (
      this.props.valueLink.value &&
      (prevProps.valueLink.value === "" ||
        (prevProps.valueLink.value && prevProps.valueLink.value.imageId) ||
        (prevProps.valueLink.value && prevProps.valueLink.value.length === 0))
    ) {
      if (
        this.props.valueLink.value.imageId !== prevProps.valueLink.value.imageId
      ) {
        const { maxFiles, valueLink } = this.props;
        let files = maxFiles === 1 ? [valueLink.value] : valueLink.value;
        this.setState({ files });
      } else if (this.props.valueLink.value.length) {
        const { valueLink } = this.props;
        let files = valueLink.value;
        this.setState({ files });
      }
    }
  }

  render() {
    const { extensions, maxFiles, columns } = this.props;
    const { files, uploadProgress } = this.state;
    // console.log('files',files);
    const showDropZone = files.length !== maxFiles;
    let imgUploadId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    return (
      <div className="image-wrapper">
        {showDropZone && (
          <div className="upload-image-wrapper">
            <label htmlFor={imgUploadId}>
              {/* <h2>Upload Banner</h2> */}
              {/* <span>+</span> */}
              <Image src={plusIcon} className="plus-icon" />
              <p className="inter-display-medium f-s-14">
                Browse to choose file
              </p>
            </label>
            <input
              type="file"
              id={imgUploadId}
              accept={extensions}
              multiple={maxFiles > 1}
              onChange={this.onImageChange}
              style={{ display: "none" }}
            />
            {/* <h6>Note: Banner should be of type .png/.jpeg and of recommended size 1200x500</h6> */}
          </div>
        )}
        {files.length > 0 && (
          <div className="img-preview-wrapper">
            <FilePreview
              files={files}
              uploadProgress={uploadProgress}
              columns={columns}
              onRemove={this.onRemove}
            />
          </div>
        )}
      </div>
    );
  }
}

FileUploader.propTypes = {
  classes: PropTypes.object,
  extensions: PropTypes.array,
  maxFiles: PropTypes.number,
  maxFileSize: PropTypes.number,
  columns: PropTypes.number,
  valueLink: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};

FileUploader.defaultProps = {
  extensions: ["*"],
  maxFiles: 1,
  maxFileSize: 2000000,
  columns: 1,
};

export default FileUploader;
