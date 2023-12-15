import React from "react";
import { Modal } from "react-bootstrap";

const CopiedModal = (props) => {
  return (
    <div>
      <Modal
        show={props.show}
        onHide={props.onHide}
        dialogClassName={`copied-modal`}
      >
        <Modal.Body>
          <h6 className="inter-display-medium f-s-16 lh-19">Copied!</h6>
        </Modal.Body>
      </Modal>
    </div>
  );
};
CopiedModal.propTypes = {
  // getPosts: PropTypes.func
};
export default CopiedModal;
