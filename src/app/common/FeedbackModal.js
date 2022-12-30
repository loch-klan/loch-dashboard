import React from 'react'
import {BaseReactComponent} from './../../utils/form';
import { connect } from 'react-redux';
import { Modal, Image, Button } from 'react-bootstrap';
import CloseIcon from '../../assets/images/icons/dummyX.svg'

class FeedbackModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    const {feedbackType, show, onHide}=this.props;
    return (
      <Modal
        show={show}
        className="exit-overlay-form"
        onHide={onHide}
        size="lg"
        dialogClassName={"exit-overlay-modal"}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
      >
        <Modal.Header>

        </Modal.Header>
        <Modal.Body>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
});
const mapDispatchToProps = {
}
ExitOverlay.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackModal);