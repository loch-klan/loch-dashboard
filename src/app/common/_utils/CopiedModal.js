import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { mobileCheck } from "../../../utils/ReusableFunctions";

const CopiedModal = (props) => {
  const [isMobile] = useState(mobileCheck());
  return (
    <div>
      <Modal
        show={props.show}
        onHide={props.onHide}
        dialogClassName={`copied-modal`}
        className={`${isMobile ? "" : "zoomedElements"}`}
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
