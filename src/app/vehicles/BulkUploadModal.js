import React from 'react';
import PropTypes from 'prop-types';
import {
  BaseReactComponent, FileUploadControl, Form, FormElement, FormSubmitButton, FormValidator
} from '../../utils/form';
import { CustomModal } from "../common";

class BulkUploadModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      chassisNo: "",
    }
  }
  componentDidMount() { }

  onSubmit = () => {

  }

  render() {
    return (
      <CustomModal
        show={this.props.show}
        onHide={this.props.handleClose}
        title={"Bulk Upload"}
      >
        <Form onValidSubmit={this.onSubmit}>
          <div className='modal-wrapper'>
            <div className='file-upload-wrapper'>
              <FormElement
                valueLink={this.linkState(this, "attachment")}
                label="Upload your excel file"
                required
                validations={[
                  {
                    validate: FormValidator.isRequired,
                    message: "File is required"
                  }
                ]}
                control={{
                  type: FileUploadControl,
                  settings: {
                    moduleName: "account",
                    subModule: "project",
                    fileType: "IMAGE",
                    extensions: ["image/*"],
                    maxFiles: 1,
                    maxFileSize: 100000000,
                    onSelect: (file, callback) => {
                      // You will need to generate signedURL by calling API and then call callback
                      const fileInfo = {
                        id: file.lastModified,
                        name: file.name,
                        size: file.size,
                        mimeType: file.type,
                        path: "single.jpg"
                      };
                      callback(fileInfo, "http://35.154.155.206/api");
                    }
                  }
                }}
              />
            </div>
          </div>
          <div className="submit-wrapper" style={{ justifyContent: 'right' }}>
            <FormSubmitButton customClass={`btn black-btn ${!this.state.chassisNo && "inactive-btn"}`}>Upload</FormSubmitButton>
          </div>
        </Form>

      </CustomModal>
    )
  }
}

BulkUploadModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default BulkUploadModal;