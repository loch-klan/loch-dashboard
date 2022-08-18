import React from "react"
import PropTypes from "prop-types"
import {
  BaseReactComponent,
  Form,
  FormElement,
  FormSubmitButton,
  FormValidator,
  SelectControl
} from "../../../utils/form"
import { CustomModal } from "../../common"
import QRCode from "react-qr-code"
import { Button } from "react-bootstrap"

class VehicleAllocationModal extends BaseReactComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {}

  render() {
    return (
      <CustomModal
        show={this.props.show}
        onHide={() => this.props.handleClose()}
        title={"QR Code"}
        modalClass={"qr-code-modal"}
      >
        <QRCode value={JSON.stringify(this.props.value)} />
        <div className="submit-wrapper" style={{ justifyContent: "center" }}>
          <Button
            className="btn black-btn"
            onClick={() => this.props.handleClose()}
          >
            Okay
          </Button>
        </div>
      </CustomModal>
    )
  }
}

VehicleAllocationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
}

export default VehicleAllocationModal
